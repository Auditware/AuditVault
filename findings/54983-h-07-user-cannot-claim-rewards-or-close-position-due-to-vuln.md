---
tags:
  - lang/rust
  - lang/solidity
  - sector/dex
  - sector/farm
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
protocol: "[[MANTRA]]"
auditors:
  - Daniel526
report: "https://code4rena.com/reports/2024-11-mantra-dex"
genome:
  - "[[dos-resistance]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-07] User cannot claim rewards or `close_position`, due to vulnerable division by zero handling

- id: 54983
- impact: HIGH
- protocol: MANTRA
- reporter: Daniel526 (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-dex

## Summary


Summary:

A user is unable to claim rewards or close a position due to a bug in the code. The bug is caused by the division by zero handling in the `claim -> calculate_rewards` flow. This means that if `contract_weights` is zero, it can cause a division by zero error. The code also attempts to handle this at the source by clearing the user's `LAST_CLAIMED_EPOCH` when they close a position, but this is also vulnerable because it does not clear the epoch if the user has open positions in other lp_denoms. This can result in the user's rewards being locked and unclaimable. A proof of concept was provided to demonstrate the impact of this bug. The recommended mitigation steps include handling division by zero directly in `calculate_rewards` by skipping the epoch iteration when `contract_weights` is zero.

## Details



A user cannot claim rewards or `close_position`, due to vulnerable division by zero handling in the `claim -> calculate_rewards` flow.

In `calculate_rewards`, a user’s reward per farm per epoch is based on the `user_share` (`user_weight`/`contract_weights`); `contract_weights` can be zero.

The main vulnerability is division by zero handling is not done at the site of division; i.e., no check on `contract_weights` is non-zero before using it as a denominator in `checked_mul_floor`. (Flows: `claim -> calculate_rewards`).
```

//contracts/farm-manager/src/farm/commands.rs
pub(crate) fn calculate_rewards(
...
) -> Result<RewardsResponse, ContractError> {
...
        for epoch_id in start_from_epoch..=until_epoch {
...
            let user_weight = user_weights[&epoch_id];
            let total_lp_weight = contract_weights
                .get(&epoch_id)
                .unwrap_or(&Uint128::zero())
                .to_owned();
            //@audit contract_weights or total_lp_weight can be zero, when used as a fraction with checked_mul_floor, this causes division by zero error.
|>          let user_share = (user_weight, total_lp_weight);

            let reward = farm_emissions
                .get(&epoch_id)
                .unwrap_or(&Uint128::zero())
                .to_owned()
|>              .checked_mul_floor(user_share)?;
...
```

[/contracts/farm-manager/src/farm/commands.rs# L205](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/farm-manager/src/farm/commands.rs# L205)

Current contract attempts to handle this at the source; clear the users `LAST_CLAIMED_EPOCH` when a user closes a position. This is also vulnerable because when the user has active positions in other lp-denoms, `LAST_CLAIMED_EPOCH` cannot be cleared for the user. Back in `calcualte_rewards`, this means the epoch iteration will still start at ([`LAST_CLAIMED_EPOCH + 1`](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/farm-manager/src/farm/commands.rs# L259)) which includes the epoch where `contract_weights` is zero. (Flows: `close_position -> reconcile_user_state`).
```

//contracts/farm-manager/src/position/helpers.rs
pub fn reconcile_user_state(
    deps: DepsMut,
    receiver: &Addr,
    position: &Position,
) -> Result<(), ContractError> {
    let receiver_open_positions = get_positions_by_receiver(
        deps.storage,
        receiver.as_ref(),
        Some(true),
        None,
        Some(MAX_ITEMS_LIMIT),
    )?;

    // if the user has no more open positions, clear the last claimed epoch
    //@audit-info note: LAST_CLAIMED_EPOCH will not be cleared for the user when the user has open positions in other lp_denom
    if receiver_open_positions.is_empty() {
|>      LAST_CLAIMED_EPOCH.remove(deps.storage, receiver);
    }
...
```

[/contracts/farm-manager/src/position/helpers.rs# L215](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/farm-manager/src/position/helpers.rs# L215)

### Impact

Users’ rewards will be locked and unclaimable. Since [pending rewards have to be claimed](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/farm-manager/src/position/commands.rs# L183) before `close_position`, users cannot close any positions without penalty.

### Proof of Concept

Suppose a user has two positions: position1 (`lp_denom1`) and position2(`lp_denom2`).

1. User calls `close_position` to close position1.
2. In `close_position→` `update_weights`, contract weight for `lp_denom1` becomes 0 in the following epoch.
3. In `close_position→` `reconcile_user_state`, `LAST_CLAIMED_EPOCH.remove` is skipped due to user has other positions.
4. After a few epochs, user create position3 (`lp_denom1`).
5. After a few epochs, user calls claims. `claim tx` reverts due to division by zero.
6. Now, all of the rewards of the user are locked.

**Coded PoC:**

In contracts/farm-manager/tests/integration.rs, add `test_query_rewards_divide_by_zero_cause_rewards_locked` and run `cargo test test_query_rewards_divide_by_zero_cause_rewards_locked`.
```

//contracts/farm-manager/tests/integration.rs

#[test]
fn test_query_rewards_divide_by_zero_cause_rewards_locked() {
    let lp_denom_1 = format!("factory/{MOCK_CONTRACT_ADDR_1}/1.{LP_SYMBOL}").to_string();
    let lp_denom_2 = format!("factory/{MOCK_CONTRACT_ADDR_1}/2.{LP_SYMBOL}").to_string();

    let mut suite = TestingSuite::default_with_balances(vec![
        coin(1_000_000_000u128, "uom".to_string()),
        coin(1_000_000_000u128, "uusdy".to_string()),
        coin(1_000_000_000u128, "uosmo".to_string()),
        coin(1_000_000_000_000, lp_denom_1.clone()),
        coin(1_000_000_000_000, lp_denom_2.clone()),
    ]);

    let alice = suite.creator();
    let bob = suite.senders[1].clone();
    let carol = suite.senders[2].clone();

    suite.instantiate_default();

    // create overlapping farms
    suite
        .manage_farm(
            &alice,
            FarmAction::Fill {
                params: FarmParams {
                    lp_denom: lp_denom_1.clone(),
                    start_epoch: None,
                    preliminary_end_epoch: None,
                    curve: None,
                    farm_asset: Coin {
                        denom: "uusdy".to_string(),
                        amount: Uint128::new(8_888u128),
                    },
                    farm_identifier: None,
                },
            },
            vec![coin(8_888u128, "uusdy"), coin(1_000, "uom")],
            |result| {
                result.unwrap();
            },
        )
        .manage_farm(
            &alice,
            FarmAction::Fill {
                params: FarmParams {
                    lp_denom: lp_denom_2.clone(),
                    start_epoch: None,
                    preliminary_end_epoch: Some(20),
                    curve: None,
                    farm_asset: Coin {
                        denom: "uusdy".to_string(),
                        amount: Uint128::new(666_666u128),
                    },
                    farm_identifier: None,
                },
            },
            vec![coin(666_666u128, "uusdy"), coin(1_000, "uom")],
            |result| {
                result.unwrap();
            },
        );

    // creator and other fill two positions - one in a different lp_denom farm.
    suite.manage_position(
        &bob,
        PositionAction::Create {
            identifier: Some("creator_position".to_string()),
            unlocking_duration: 86_400,
            receiver: None,
        },
        vec![coin(1_000, lp_denom_1.clone())],
        |result| {
            result.unwrap();
        },
    );

    suite.manage_position(
        &bob,
        PositionAction::Create {
            identifier: Some("creator_another_position".to_string()),
            unlocking_duration: 86_400,
            receiver: None,
        },
        vec![coin(1_000, lp_denom_2.clone())],
        |result| {
            result.unwrap();
        },
    );

    suite
        .add_one_epoch()
        .add_one_epoch()
        .add_one_epoch()
        .add_one_epoch()
        .add_one_epoch()
        .query_current_epoch(|result| {
            let epoch_response = result.unwrap();
            assert_eq!(epoch_response.epoch.id, 5);
        });

    suite.query_rewards(&bob, |result| {
        result.unwrap();
    });
    let farm_manager = suite.farm_manager_addr.clone();
    suite
        .claim(&bob, vec![], |result| {
            result.unwrap();
        })
        .manage_position(
            &bob,
            PositionAction::Close {
                identifier: "u-creator_position".to_string(),
                lp_asset: None,
            },
            vec![],
            |result| {
                result.unwrap();
            },
        )
        .query_lp_weight(&farm_manager, &lp_denom_1, 6, |result| {
            result.unwrap(); //? is this querying the contract weight at epoch 6? which should be 0.
        })
        .query_rewards(&bob, |result| {
            let rewards_response = result.unwrap();
            match rewards_response {
                RewardsResponse::RewardsResponse { total_rewards, .. } => {
                    assert!(total_rewards.is_empty());
                }
                _ => {
                    panic!("Wrong response type, should return RewardsResponse::RewardsResponse")
                }
            } //@audit Medium: Incorrect test logic for divide_by_zero edge case, causing invalid test results. Vulnerable divide_by_zero impact still exists.
        }) // because user lp_weight cleared + last_claim epoch is cleared due to all of creator positions closed.
        .query_lp_weight(&bob, &lp_denom_1, 4, |result| {
            result.unwrap_err();
        })
        .query_lp_weight(&bob, &lp_denom_1, 5, |result| {
            result.unwrap_err();
        })
        .query_lp_weight(&bob, &lp_denom_1, 6, |result| {
            result.unwrap_err();
        })
        .query_lp_weight(&bob, &lp_denom_1, 7, |result| {
            result.unwrap_err();
        });

    suite
        .add_one_epoch() //6
        .add_one_epoch(); //7

    // open a new position
    suite.manage_position(
        &bob,
        PositionAction::Create {
            identifier: Some("creator_a_third_position".to_string()),
            unlocking_duration: 86_400,
            receiver: None,
        },
        vec![coin(2_000, lp_denom_1.clone())],
        |result| {
            result.unwrap();
        },
    );
    suite.add_one_epoch().query_current_epoch(|result| {
        let epoch_response = result.unwrap();
        assert_eq!(epoch_response.epoch.id, 8);
    });

    suite.query_rewards(&bob, |result| {
        let err = result.unwrap_err().to_string();
        // println!("err: {:?}", err);
        assert_eq!(
            err,
            "Generic error: Querier contract error: Cannot divide by zero"
        );
    });
}
```


```

running 1 test
test test_query_rewards_divide_by_zero_cause_rewards_locked ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 40 filtered out; finished in 0.01s
```

### Recommended mitigation steps

Consider handling division by zero in `calculate_rewards` directly by skip the epoch iteration when `contract_weights` is 0.

**jvr0x (MANTRA) confirmed**

---


