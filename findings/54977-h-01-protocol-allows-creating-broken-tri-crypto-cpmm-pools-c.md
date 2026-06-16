---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - lang/rust
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/options
  - platform/code4rena
protocol: "[[MANTRA]]"
auditors:
  - carrotsmuggler
report: "https://code4rena.com/reports/2024-11-mantra-dex"
genome:
  - "[[integer-bounds]]"
  - "[[dos-resistance]]"
  - "[[input-validation/boundary]]"
  - "[[dos/permanent]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-pool]]"
---
# [H-01] Protocol allows creating broken tri-crypto CPMM pools

- id: 54977
- impact: HIGH
- protocol: MANTRA
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-dex

## Summary


This bug report discusses an issue with the protocol that allows for the creation of constant product pools with more than 2 tokens, even though the protocol was designed to only handle 2-token pools. This can lead to broken pools with incorrect invariants, which can be exploited through arbitrage. The report provides a proof of concept and recommends adding a check during pool creation to prevent this issue. The issue has been confirmed by the MANTRA team.

## Details



[/contracts/pool-manager/src/manager/commands.rs# L75](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/pool-manager/src/manager/commands.rs# L75)

### Finding description and impact

The protocol allows the creation of constant product pools and stableswap pools. Stable-swap pools, as established by curve, can have any number of tokens and so the protocol allows for the creation of pools with 2 or more tokens.

Constant product market-makers (CPMM), however, can have multiple tokens as well; however, the protocol here uses the uniswap formula, which only works for 2-token pools. For pools with more than 2 tokens, this model does not work anymore, and invariants need to be established with different formulas with products of all tokens quantities, like shown in the balancer protocol.

The issue is that the protocol here does not check if the constant product pool being created has more than 2 tokens. Surprisingly, it is perfectly possible to create a constant product pool with 3 tokens, add/remove liquidity and even do swaps in them, even though the protocol was never designed to handle this.

The POC below will show how we can set up a 3-token CPMM pool, add liquidity and even do swaps in it. The issue is that these pools are completely broken and should not be allowed.

The `compute_swap` function in the `helpers.rs` contract calculates the number of output tokens given the number of input tokens.
```

// ask_amount = (ask_pool * offer_amount / (offer_pool + offer_amount)) - swap_fee - protocol_fee - burn_fee
let return_amount: Uint256 =
    Decimal256::from_ratio(ask_pool.mul(offer_amount), offer_pool + offer_amount)
        .to_uint_floor();
```

But these are only valid for 2-token uniswap-style pools. If there are more than 2 tokens involved, the invariant changes from being `x * y = k` to `x * y * z = k`, and the formula above does not work anymore. So for multi token pools, this formula should not be used, or `x-y` swaps can be arbitraged off of with `y-z` swaps and vice versa.

Furthermore, there is a check in the `assert_slippage_tolerance` function in the helpers contract:
```

if deposits.len() != 2 || pools.len() != 2 {
    return Err(ContractError::InvalidPoolAssetsLength {
        expected: 2,
        actual: deposits.len(),
    });
}
```

This explicitly shows that constant product pools are only allowed to have 2 tokens. However, if no slippage tolerance is specified, this check can be completely bypassed.
```

pub fn assert_slippage_tolerance(
    slippage_tolerance: &Option<Decimal>,
    deposits: &[Coin],
    pools: &[Coin],
    pool_type: PoolType,
    amount: Uint128,
    pool_token_supply: Uint128,
) -> Result<(), ContractError> {
    if let Some(slippage_tolerance) = *slippage_tolerance {
        //@audit check for number of tokens
    }
```

By never sending a slippage tolerance, users can create, add/remove liquidity and even do swaps in pools with more than 2 tokens following constant product algorithm. But these pools are completely broken and should not be allowed since the invariants are not functioning correctly

### Proof of Concept

The POC below creates a CPMM pool with `3 tokens - uwhale`, `uluna` and `uusd`. It is shown that liquidity can be added and swaps can be performed.

First, some helper functions are needed to check and print out the token balances.
```

fn print_diff(init_bal: [Uint128; 4], final_bal: [Uint128; 4]) -> [i128; 4] {
    let diffs = [
        final_bal[0].u128() as i128 - init_bal[0].u128() as i128,
        final_bal[1].u128() as i128 - init_bal[1].u128() as i128,
        final_bal[2].u128() as i128 - init_bal[2].u128() as i128,
        final_bal[3].u128() as i128 - init_bal[3].u128() as i128,
    ];

    println!("==Balance deltas==");
    if diffs[0] != 0 {
        println!("uwhale delta: {}", diffs[0]);
    }
    if diffs[1] != 0 {
        println!("uluna delta : {}", diffs[1]);
    }
    if diffs[2] != 0 {
        println!("uusd delta  : {}", diffs[2]);
    }
    if diffs[3] != 0 {
        println!("lp delta    : {}", diffs[3]);
    }
    println!("==Balance deltas==\n");

    diffs
}
fn calc_state(suite: &mut TestingSuite, creator: &str) -> [Uint128; 4] {
    let uwhale_balance = RefCell::new(Uint128::zero());
    let uluna_balance = RefCell::new(Uint128::zero());
    let uusd_balance = RefCell::new(Uint128::zero());
    let lp_shares = RefCell::new(Uint128::zero());

    suite.query_balance(&creator.to_string(), "uwhale".to_string(), |result| {
        *uwhale_balance.borrow_mut() = result.unwrap().amount;
    });

    suite.query_balance(&creator.to_string(), "uluna".to_string(), |result| {
        *uluna_balance.borrow_mut() = result.unwrap().amount;
    });

    suite.query_balance(&creator.to_string(), "uusd".to_string(), |result| {
        *uusd_balance.borrow_mut() = result.unwrap().amount;
    });

    suite.query_all_balances(&creator.to_string(), |balances| {
        for coin in balances.unwrap().iter() {
            if coin.denom.contains("o.whale.uluna") {
                *lp_shares.borrow_mut() = coin.amount;
            }
        }
    });

    let uwhale = *uwhale_balance.borrow();
    let uluna = *uluna_balance.borrow();
    let uusd = *uusd_balance.borrow();
    let lp = *lp_shares.borrow();
    [uwhale, uluna, uusd, lp]
}
```

And here’s the actual test:
```

fn const_prod_test() {
    let mut suite = TestingSuite::default_with_balances(
        vec![
            coin(1_000_000_000u128, "uwhale".to_string()),
            coin(1_000_000_000u128, "uluna".to_string()),
            coin(1_000_000_000u128, "uusd".to_string()),
            coin(1_000_000_000u128, "uom".to_string()),
        ],
        StargateMock::new("uom".to_string(), "8888".to_string()),
    );
    let creator = suite.creator();
    let _other = suite.senders[1].clone();
    let _unauthorized = suite.senders[2].clone();
    // Asset infos with uwhale and uluna

    let first_pool = vec![
        "uwhale".to_string(),
        "uluna".to_string(),
        "uusd".to_string(),
    ];

    let pool_fees = PoolFee {
        protocol_fee: Fee {
            share: Decimal::bps(50), // 0.5%
        },
        swap_fee: Fee {
            share: Decimal::bps(50), // 0.5%
        },
        burn_fee: Fee {
            share: Decimal::bps(50), // 0.5%
        },
        extra_fees: vec![],
    };

    // Create a pool
    suite.instantiate_default().add_one_epoch().create_pool(
        &creator,
        first_pool,
        vec![6u8, 6u8, 6u8],
        pool_fees.clone(),
        PoolType::ConstantProduct,
        Some("whale.uluna".to_string()),
        vec![coin(1000, "uusd"), coin(8888, "uom")],
        |result| {
            result.unwrap();
        },
    );

    println!("===Liq addition===");
    let initial_balances = calc_state(&mut suite, &creator.to_string());
    suite.provide_liquidity(
        &creator,
        "o.whale.uluna".to_string(),
        None,
        None,
        None,
        None,
        vec![
            Coin {
                denom: "uwhale".to_string(),
                amount: Uint128::from(1_000_000u128),
            },
            Coin {
                denom: "uluna".to_string(),
                amount: Uint128::from(1_000_000u128),
            },
            Coin {
                denom: "uusd".to_string(),
                amount: Uint128::from(1_000_000u128),
            },
        ],
        |result| {
            result.unwrap();
        },
    );
    let final_balances = calc_state(&mut suite, &creator.to_string());
    let diffs = print_diff(initial_balances, final_balances);

    let swap_operations = vec![amm::pool_manager::SwapOperation::MantraSwap {
        token_in_denom: "uwhale".to_string(),
        token_out_denom: "uusd".to_string(),
        pool_identifier: "o.whale.uluna".to_string(),
    }];

    println!("===Swap===");
    let initial_balances = calc_state(&mut suite, &creator.to_string());
    suite.execute_swap_operations(
        &creator,
        swap_operations,
        None,
        None,
        None,
        vec![coin(1000u128, "uwhale".to_string())],
        |result| {
            result.unwrap();
        },
    );
    let final_balances = calc_state(&mut suite, &creator.to_string());
    let diffs = print_diff(initial_balances, final_balances);
}
```

The test runs fine and here’s the output:
```

running 1 test
===Liq addition===
==Balance deltas==
uwhale delta: -1000000
uluna delta : -1000000
uusd delta  : -1000000
lp delta    : 999000
==Balance deltas==

===Swap===
==Balance deltas==
uwhale delta: -1000
uusd delta  : 987
==Balance deltas==
```

It shows:

1. Liquidity addition of `1e6 uwhale`, `1e6 uluna` `1e6 uusd` and minting of 999k LP tokens.
2. Swapping `1e3 uwhale` for `987 uusd`.

While the swap is correctly functioning here, it doesn’t maintain the correct pool invariant and can be arbitraged off of when the pools grow imbalanced.

### Recommended mitigation steps

Add an explicit check during pool creation to make sure constant product pools cannot have more than 2 tokens.

**jvr0x (MANTRA) confirmed**

---


