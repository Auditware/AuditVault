---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/rust
  - sector/bridge
  - sector/dex
  - sector/lending
  - platform/code4rena
protocol: "[[MANTRA]]"
auditors:
  - carrotsmuggler
report: "https://code4rena.com/reports/2024-11-mantra-dex"
genome:
  - "[[fot-slippage]]"
  - "[[defi/slippage]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[misassumption/math-is-safe]]"
  - "[[blast-radius/single-user]]"
---
# [H-10] Incorrect `slippage_tolerance` handling in stableswap `provide_liquidty` function

- id: 54986
- impact: HIGH
- protocol: MANTRA
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-dex

## Summary


The bug report is about a function called `provide_liquidity` that is used to add liquidity to a dex pool. This function has a check called `assert_slippage_tolerance` that is used to make sure the liquidity added is within a certain range. However, this check is not working correctly for stableswap pools, which can result in users losing value when adding liquidity. A proof of concept was used to show this issue and it is recommended to fix this by checking the difference between the price ratios instead of just one side of the inequality. 

## Details



[/contracts/pool-manager/src/helpers.rs# L437-L438](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/pool-manager/src/helpers.rs# L437-L438)

### Finding description and impact

The `provide_liquidity` function is used to add liquidity to the dex pools. This function implements a slippage tolerance check via the `assert_slippage_tolerance` function.
```

helpers::assert_slippage_tolerance(
    &slippage_tolerance,
    &deposits,
    &pool_assets,
    pool.pool_type.clone(),
    share,
    total_share,
)?;
```

This function implements slippage tolerance in two sub-functions, one for stableswap and one for constant product. This function basically compares the ratio of liquidity of the deposit to the ratio of pool liquidity.

For the constant product pool, the slippage tolerance checks both the 1/0 ratio and 0/1 ratios, where 0 and 1 represent the two tokens of the pool.
```

if Decimal256::from_ratio(deposits[0], deposits[1]) * one_minus_slippage_tolerance
    > Decimal256::from_ratio(pools[0], pools[1])
    || Decimal256::from_ratio(deposits[1], deposits[0])
        * one_minus_slippage_tolerance
        > Decimal256::from_ratio(pools[1], pools[0])
{
    return Err(ContractError::MaxSlippageAssertion);
}
```

But for stableswap, it only does a one-sided check.
```

if pool_ratio * one_minus_slippage_tolerance > deposit_ratio {
    return Err(ContractError::MaxSlippageAssertion);
}
```

The situation is best described for the scenario where `slippage_tolerance` is set to 0. This means the pool should ONLY accept liquidity in the ratio of the pool liquidity. This is enforced for constant product pools correctly. However, for stableswap pools, this is incorrect.

If `slippage_tolerance` is set to 0, then `one_minus_slippage_tolerance` is 1. Thus, the inequality check above makes sure that the `pool_ratio` is always less than or equal to the `deposit_ratio` for the transaction to go through. However, the `deposit_ratio` can be be either higher or lower than than the `pool_ratio`, depending on the components of the liquidity addition. The inequality above only checks for one case (less than equals) and misses the other check (greater than equals).

This means even with `slippage_tolerance` set to 0, the stableswap pool will accept liquidity that is not in the ratio of the pool liquidity.

Furthermore, for the case where the `deposit_ratio` is higher than the `pool_ratio`, there is no slippage restriction on the pool at all.

The entire reason `slippage_tolerance` exists, is so that the user can specify the exact amount of lp tokens they expect out of the pool. However, the protocol does not implement a `minimum_amount_out` like on curve, and instead uses this `slippage_tolerance` value. This means the `slippage_tolerance` value is crucial to ensure that the depositor is not leaking any value. However, below shown is a situation where if the depositor adds liquidity in certain compositions, they can leak any amount of value.

A POC is run to generate the numbers given here.

Lets say a pool is created and liquidity is provided with `1e6` `whale` and `2e6` `luna` tokens. It is quite common to have stableswap pools similarly imbalanced, so this is a usual scenario. Now a user deposits `1e4` `whale` and `1e5` `luna` tokens in this pool.

At the end, the pool composition becomes `1.01e6` `whale` and `2.1e6` `luna` tokens. The initial liquidity addition created `2997146` lp tokens and the second liquidity addition creates `109702` lp tokens, for a total of `3106848` lp tokens.

These numbers come from running the POC below, which has the output:
```

running 1 test
===Liq addition===
==Balance deltas==
uwhale delta: -1000000
uluna delta : -2000000
lp delta    : 2997146
==Balance deltas==

===Liq addition 2===
==Balance deltas==
uwhale delta: -10000
uluna delta : -100000
lp delta    : 109702
==Balance deltas==
```

So during the slippage check on the second deposit, `pool_sum` = `1e6+2e6 + 1e5+1e4 = 3.11e6`, and the `deposit_sum` = `1e5+1e4 = 1.1e5`.

`pool_ratio` = `3.11e6/3106848 = 1.001014533`
`deposit_ratio` = `1.1e5/109702 =1.00271645`

Now, even if slippage*tolerance is set to 0, since `pool*ratio<deposit\_ratio`, the transaction goes through. However, the issue is that in the second liquidity addition, the user could have received less than`109702` lp tokens and the transaction would have still gone through.

Say the user receives only `108000` tokens. Then, total pool `lp_tokens` = `2997146+108000 = 3105146`

`pool_ratio` = `3.11e6/3105146 = 1.001563212`
`deposit_ratio` = `1.1e5/108000 = 1.018518519`

This transaction will also pass, since `deposit_ratio` `>` `pool_ratio`. However, we can clearly see that the liquidity depositor has lost 1.55% of their deposit. So even with `slippage_tolerance` set to 0, the stableswap pool can accept liquidity that is not in the ratio of the pool liquidity, and depositors can eat large amounts of slippage.

### Proof of Concept

A POC was used to generate the results of the liquidity addition. First, a couple helper functions,
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
            if coin.denom.contains("o.whale.uluna.uusd") {
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

The actual POC to generate the numbers.
```

fn twopool_test() {
    let mut suite = TestingSuite::default_with_balances(
        vec![
            coin(1_000_000_001u128, "uwhale".to_string()),
            coin(1_000_000_000u128, "uluna".to_string()),
            coin(1_000_000_001u128, "uusd".to_string()),
            coin(1_000_000_001u128, "uom".to_string()),
        ],
        StargateMock::new("uom".to_string(), "8888".to_string()),
    );
    let creator = suite.creator();
    let _other = suite.senders[1].clone();
    let _unauthorized = suite.senders[2].clone();
    // Asset infos with uwhale and uluna

    let asset_infos = vec!["uwhale".to_string(), "uluna".to_string()];

    let pool_fees = PoolFee {
        protocol_fee: Fee {
            share: Decimal::zero(),
        },
        swap_fee: Fee {
            share: Decimal::from_ratio(1u128, 1000u128),
        },
        burn_fee: Fee {
            share: Decimal::zero(),
        },
        extra_fees: vec![],
    };

    // Create a pool
    suite.instantiate_default().create_pool(
        &creator,
        asset_infos,
        vec![6u8, 6u8],
        pool_fees,
        PoolType::StableSwap { amp: 100 },
        Some("whale.uluna.uusd".to_string()),
        vec![coin(1000, "uusd"), coin(8888, "uom")],
        |result| {
            result.unwrap();
        },
    );

    // Initial liquidity
    println!("===Liq addition===");
    let initial_balances = calc_state(&mut suite, &creator.to_string());
    suite.provide_liquidity(
        &creator,
        "o.whale.uluna.uusd".to_string(),
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
                amount: Uint128::from(2_000_000u128),
            },
        ],
        |result| {
            result.unwrap();
        },
    );
    let final_balances = calc_state(&mut suite, &creator.to_string());
    let diffs = print_diff(initial_balances, final_balances);

    let lp_shares = RefCell::new(Coin::new(0u128, "".to_string()));
    suite.query_all_balances(&creator.to_string(), |balances| {
        for coin in balances.unwrap().iter() {
            if coin.denom.contains("o.whale.uluna.uusd") {
                *lp_shares.borrow_mut() = coin.clone();
            }
        }
    });

    // liquidity 2
    println!("===Liq addition 2===");
    let initial_balances = calc_state(&mut suite, &creator.to_string());
    suite.provide_liquidity(
        &creator,
        "o.whale.uluna.uusd".to_string(),
        None,
        None,
        None,
        None,
        vec![
            Coin {
                denom: "uwhale".to_string(),
                amount: Uint128::from(1_000u128),
            },
            Coin {
                denom: "uluna".to_string(),
                amount: Uint128::from(10_000u128),
            },
        ],
        |result| {
            result.unwrap();
        },
    );
    let final_balances = calc_state(&mut suite, &creator.to_string());
    let diffs = print_diff(initial_balances, final_balances);
}
```

### Recommended mitigation steps

For stableswap, the `slippage_tolerance` should be checked against the `difference` in the price ratios, so abs(`pool_ratio` - `deposit_ratio`). This way both sides of the inequality are checked.

**jvr0x (MANTRA) confirmed**

---


