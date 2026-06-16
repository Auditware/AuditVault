---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/rust
  - sector/dex
  - sector/farm
  - platform/code4rena
protocol: "[[MANTRA]]"
auditors:
  - carrotsmuggler
report: "https://code4rena.com/reports/2024-11-mantra-dex"
genome:
  - "[[timestamp-dependence]]"
  - "[[logic/wrong-condition]]"
  - "[[loss-of-funds/reward-theft]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-user]]"
---
# [H-05] Farms can be created to start in past epochs

- id: 54981
- impact: HIGH
- protocol: MANTRA
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-dex

## Summary


This bug report discusses a problem with the farming mechanism where users can claim rewards from active farms based on their locked LP token share. The current implementation allows for the creation of farms with a start epoch in the past, which breaks the intended distribution of rewards. This issue arises because the function responsible for validating farm epochs does not check that the start epoch is in the future relative to the current epoch. This can lead to unfair rewards distribution. A proof of concept test case is provided to demonstrate how a farm can be created in the past, and a recommended mitigation step is suggested to ensure that the start epoch is always in the future. 

## Details



[/contracts/farm-manager/src/helpers.rs# L128-L175](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/farm-manager/src/helpers.rs# L128-L175)

### Finding description and impact

In the farming mechanism, users can claim rewards from active farms based on their locked LP token share. The rewards distribution must adhere to the following invariant:

> At any given epoch, all users with locked LP tokens claim rewards from corresponding farms proportional to their share of the total LP tokens.

However, the current implementation allows the creation of farms with a `start_epoch` in the past. This breaks the invariant, as users who have already claimed rewards for past epochs will miss out on additional rewards assigned retroactively to those epochs. This issue arises because the `validate_farm_epochs` function does not enforce that the farm’s start epoch must be in the future relative to the current epoch:
```

/// Validates the farm epochs. Returns a tuple of (start_epoch, end_epoch) for the farm.
pub(crate) fn validate_farm_epochs(
    params: &FarmParams,
    current_epoch: u64,
    max_farm_epoch_buffer: u64,
) -> Result<(u64, u64), ContractError> {
     let start_epoch = params.start_epoch.unwrap_or(current_epoch + 1u64);

    ensure!(
        start_epoch > 0u64,
        ContractError::InvalidEpoch {
            which: "start".to_string()
        }
    );

    let preliminary_end_epoch = params.preliminary_end_epoch.unwrap_or(
        start_epoch
            .checked_add(DEFAULT_FARM_DURATION)
            .ok_or(ContractError::InvalidEpoch {
                which: "end".to_string(),
            })?,
    );

    // ensure that start date is before end date
    ensure!(
        start_epoch < preliminary_end_epoch,
        ContractError::FarmStartTimeAfterEndTime
    );

    // ensure the farm is set to end in a future epoch
    ensure!(
        preliminary_end_epoch > current_epoch,
        ContractError::FarmEndsInPast
    );

    // ensure that start date is set within buffer
    ensure!(
        start_epoch
            <= current_epoch.checked_add(max_farm_epoch_buffer).ok_or(
                ContractError::OverflowError(OverflowError {
                    operation: OverflowOperation::Add
                })
            )?,
        ContractError::FarmStartTooFar
    );

    Ok((start_epoch, preliminary_end_epoch))
}
```

The function lacks a check to ensure that `start_epoch` is not earlier than `current_epoch + 1`, allowing farms to be created retroactively. This leads to unfair rewards distribution.

### Proof of Concept

The following test case demonstrates that a farm can be created in such a way that it starts in a past epoch, copy and paste the following test to `/contracts/farm-manager/tests/integration.rs`:
```

#[test]
fn poc_farm_can_be_created_in_the_past() {
    let lp_denom = format!("factory/{MOCK_CONTRACT_ADDR_1}/{LP_SYMBOL}").to_string();
    let invalid_lp_denom = format!("factory/{MOCK_CONTRACT_ADDR_2}/{LP_SYMBOL}").to_string();

    let mut suite = TestingSuite::default_with_balances(vec![
        coin(1_000_000_000u128, "uom".to_string()),
        coin(1_000_000_000u128, "uusdy".to_string()),
        coin(1_000_000_000u128, "uosmo".to_string()),
        coin(1_000_000_000u128, lp_denom.clone()),
        coin(1_000_000_000u128, invalid_lp_denom.clone()),
    ]);
    suite.instantiate_default();

    let creator = suite.creator().clone();
    let other = suite.senders[1].clone();
    let fee_collector = suite.fee_collector_addr.clone();

    for _ in 0..10 {
        suite.add_one_epoch();
    }
    // current epoch is 10

    // We can create a farm in a past epoch
    suite
        .manage_farm(
            &other,
            FarmAction::Fill {
                params: FarmParams {
                    lp_denom: lp_denom.clone(),
                    start_epoch: Some(1), // @audit Notice, start epoch in the past
                    preliminary_end_epoch: Some(28),
                    curve: None,
                    farm_asset: Coin {
                        denom: "uusdy".to_string(),
                        amount: Uint128::new(4_000u128),
                    },
                    farm_identifier: Some("farm_1".to_string()),
                },
            },
            vec![coin(4_000, "uusdy"), coin(1_000, "uom")],
            |result| {
                result.unwrap();
            },
        );
}
```

The transaction passes without reverting, creating a farm that starts in a past epoch.

### Recommended mitigation steps

Ensure the `start_epoch` is always in the future relative to the `current_epoch`:
```

/// Validates the farm epochs. Returns a tuple of (start_epoch, end_epoch) for the farm.
pub(crate) fn validate_farm_epochs(
    params: &FarmParams,
    current_epoch: u64,
    max_farm_epoch_buffer: u64,
) -> Result<(u64, u64), ContractError> {
    let start_epoch = params.start_epoch.unwrap_or(current_epoch + 1u64);
+   assert!(start_epoch >= current_epoch + 1);
    // --SNIP
}
```

**jvr0x (MANTRA) confirmed**

---


