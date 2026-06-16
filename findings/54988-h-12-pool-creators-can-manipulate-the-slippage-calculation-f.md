---
tags:
  - lang/rust
  - sector/bridge
  - sector/dex
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
protocol: "[[MANTRA]]"
auditors:
  - DadeKuma
report: "https://code4rena.com/reports/2024-11-mantra-dex"
genome:
  - "[[oracle-manipulation-resistance]]"
  - "[[direct-drain]]"
---
# [H-12] Pool creators can manipulate the slippage calculation for liquidity providers

- id: 54988
- impact: HIGH
- protocol: MANTRA
- reporter: DadeKuma (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-dex

## Summary


Bug Summary:

The pool creation process in the codebase allows users to create a pool by specifying asset denoms. However, if the user puts the denoms in a different order, it results in a different pool. This causes the slippage mechanism to use the wrong ratio, leading to a loss of funds for users providing liquidity. The bug can be reproduced by running a specific test in the codebase. To fix this, the code should be modified to sort the asset denoms before creating the pool. The team has confirmed the bug.

## Details



Pool creation is permissionless, and users can create a pool by specifying asset denoms. The issue is that they can put a different order of the same token denoms, which should result in the same pool, but in fact, it does not.

This ultimately cause the slippage mechanism to use the inverse ratio instead of the correct one, as in other parts of the codebase these values are always ordered, which will cause a loss of funds for the users that provide liquidity as they use the inverted slippage.

### Proof of Concept

Users can create a pool by calling [`pool_manager::create_pool`](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/pool-manager/src/manager/commands.rs# L75) and specifying the `asset_denoms`.

They can call this function with the same denoms, but in a different order. In theory, this should result in the same pool, but this isn’t the case.

Suppose Bob adds liquidity on a `[uwhale, uluna]` pool instead of a `[uluna, uwhale]` pool. The slippage tolerance check is triggered:
```

    // assert slippage tolerance
    helpers::assert_slippage_tolerance(
        &slippage_tolerance,
        &deposits,
        &pool_assets,
        pool.pool_type.clone(),
        share,
        total_share,
    )?;
```

[/contracts/pool-manager/src/liquidity/commands.rs# L271](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/pool-manager/src/liquidity/commands.rs# L271)

This results in the following issue: supposing a k-product pool with `n = 2` tokens, we calculate the slippage check:
```

    PoolType::ConstantProduct => {
	    if deposits.len() != 2 || pools.len() != 2 {
	        return Err(ContractError::InvalidPoolAssetsLength {
	            expected: 2,
	            actual: deposits.len(),
	        });
	    }
      //@audit-info added these logs to check the actual ratios
      println!("------> Slippage ratios, d1: {}, p1: {}, d2: {}, p2: {}", deposits[0], pools[0], deposits[1], pools[1]);
      println!("1st ratio check: {} > {}", Decimal256::from_ratio(deposits[0], deposits[1]) * one_minus_slippage_tolerance, Decimal256::from_ratio(pools[0], pools[1]));
      println!("2nd ratio check: {} > {}", Decimal256::from_ratio(deposits[1], deposits[0]) * one_minus_slippage_tolerance, Decimal256::from_ratio(pools[1], pools[0]));
	    if Decimal256::from_ratio(deposits[0], deposits[1]) * one_minus_slippage_tolerance
->	        > Decimal256::from_ratio(pools[0], pools[1])
	        || Decimal256::from_ratio(deposits[1], deposits[0])
	            * one_minus_slippage_tolerance
->	            > Decimal256::from_ratio(pools[1], pools[0])
	    {
	        return Err(ContractError::MaxSlippageAssertion);
	    }
	}
```

[/contracts/pool-manager/src/helpers.rs# L452](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/pool-manager/src/helpers.rs# L452)

`deposits` are always [sorted](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/pool-manager/src/liquidity/commands.rs# L57) but the pool order is determined on creation. As the pool has `[uwhale, uluna]` instead of `[uluna, uwhale]` denominations, the slippage checks are inverted.

### Coded POC

Run the following test in `contracts/pool-manager/src/tests/integration_tests.rs`:
```

    #[test]
    fn audit_test_wrong_slippage_2_kproduct() {
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

        let asset_infos = vec![
            "uwhale".to_string(),
            "uluna".to_string(),
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

        // Create a 2 token pool
        suite.instantiate_default().create_pool(
            &creator,
            asset_infos,
            vec![6u8, 6u8],
            pool_fees,
            PoolType::ConstantProduct { },
            Some("whale.uluna".to_string()),
            vec![coin(1000, "uusd"), coin(8888, "uom")],
            |result| {
                result.unwrap();
            },
        );

        // first liquidity
        suite.provide_liquidity_slippage(
            &creator,
            "o.whale.uluna".to_string(),
            None,
            None,
            None,
            None,
            None,
            vec![
                Coin {
                    denom: "uwhale".to_string(),
                    amount: Uint128::from(100_000u128),
                },
                Coin {
                    denom: "uluna".to_string(),
                    amount: Uint128::from(1_000_000u128),
                },
            ],
            |result| {
                // Ensure we got 999000 in the response which is 1mil less the initial liquidity amount
                for event in result.unwrap().events {
                    println!("{:?}", event);
                }
            },
        );

        // second liquidity
        suite.provide_liquidity_slippage(
            &creator,
            "o.whale.uluna".to_string(),
            None,
            None,
            None,
            Some(Decimal::percent(60)),
            None,
            vec![
                Coin {
                    denom: "uluna".to_string(),
                    amount: Uint128::from(1_000_000u128),
                },
                Coin {
                    denom: "uwhale".to_string(),
                    amount: Uint128::from(1_200_00u128),
                },

            ],
            |result| {
                // Ensure we got 999000 in the response which is 1mil less the initial liquidity amount
                for event in result.unwrap().events {
                    println!("{:?}", event);
                }
            },
        );
    }
```

Output:
```

------> Slippage ratios, d1: 1000000, p1: 100000, d2: 120000, p2: 1000000
1st ratio check: 3.333333333333333333 > 0.1
2nd ratio check: 0.048 > 10
thread 'tests::integration_tests::provide_liquidity::audit_test_wrong_slippage_2_kproduct' panicked at contracts/pool-manager/src/tests/integration_tests.rs:5418:37:
called `Result::unwrap()` on an `Err` value: Error executing WasmMsg:
  sender: mantra15n2dapfyf7mzz70y0srycnduw5skp0s9u9g74e
  Execute { contract_addr: "mantra1zwv6feuzhy6a9wekh96cd57lsarmqlwxdypdsplw6zhfncqw6ftqlydlr9", msg: {"provide_liquidity":{"slippage_tolerance":"0.6","max_spread":null,"receiver":null,"pool_identifier":"o.whale.uluna","unlocking_duration":null,"lock_position_identifier":null}}, funds: [Coin { 1000000 "uluna" }, Coin { 120000 "uwhale" }] }
```

If we switch the `asset_infos` order while creating the pool:
```

    let asset_infos = vec![
-       "uwhale".to_string(),
        "uluna".to_string(),
+       "uwhale".to_string(),
    ];
```

Output:
```

------> Slippage ratios, d1: 1000000, p1: 1000000, d2: 120000, p2: 100000
1st ratio check: 3.333333333333333333 > 10
2nd ratio check: 0.048 > 0.1
Event { ty: "execute", attributes: [Attribute { key: "_contract_address", value: "mantra1zwv6feuzhy6a9wekh96cd57lsarmqlwxdypdsplw6zhfncqw6ftqlydlr9" }] }
Event { ty: "wasm", attributes: [Attribute { key: "_contract_address", value: "mantra1zwv6feuzhy6a9wekh96cd57lsarmqlwxdypdsplw6zhfncqw6ftqlydlr9" }, Attribute { key: "action", value: "provide_liquidity" }, Attribute { key: "sender", value: "mantra15n2dapfyf7mzz70y0srycnduw5skp0s9u9g74e" }, Attribute { key: "receiver", value: "mantra15n2dapfyf7mzz70y0srycnduw5skp0s9u9g74e" }, Attribute { key: "assets", value: "2000000uluna, 220000uwhale" }, Attribute { key: "share", value: "316227" }] }
```

### Recommended mitigation steps

In `pool_manager::create_pool`, consider sorting the asset denoms, similarly to other parts of the code, by introducing a new struct to encapsulate both `asset_denoms` and `asset_decimals` (as they are tied together) and reorder it before creating the pool.

**jvr0x (MANTRA) confirmed**

---


