---
tags:
  - lang/solidity
  - sector/oracle
  - sector/staking
  - has/github
  - severity/high
protocol: "[[Kinetiq]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Kinetiq-security-review_2025-02-26.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[underflow]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-03] Deactivated validator retains old balance after reactivation

- id: 58611
- impact: HIGH
- protocol: Kinetiq_2025-02-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Kinetiq-security-review_2025-02-26.md

## Summary


The bug report discusses a problem with the balance of a validator when it is deactivated. When a validator is deactivated, its balance is not updated, resulting in an incorrect balance being reported. This can lead to issues such as an incorrect total balance being calculated and a potential underflow when the validator is reactivated. To fix this, it is recommended to zero out the validator's balance upon deactivation and subtract it from the total balance. This will prevent any accounting inconsistencies and potential underflows.

## Details


## Severity

**Impact:** High

**Likelihood:** Medium

## Description

When a validator is deactivated via `ValidatorManager::deactivateValidator`, the validator’s balance is not updated. However, since a rebalance withdrawal request is created for this validator, their **actual** balance becomes 0.

```solidity

    function deactivateValidator(address validator) external whenNotPaused nonReentrant validatorExists(validator) {

        // ...

        Validator storage validatorData = _validators[index];

        require(validatorData.active, “Validator already inactive”);

        // Create withdrawal request before state changes

        if (validatorData.balance > 0) {

            _addRebalanceRequest(validator, validatorData.balance);

        }

        // Update state after withdrawal request

        validatorData.active = false;

        emit ValidatorDeactivated(validator);

    }

```

The problem occurs from the fact that even if his actual balance is 0, it will neverben updated since `OracleManager::updatePerformance()` passes the inactive validators without update. This could result to an inactive validator with his old non-zerobalance saved and this can be a problem because when this validator gets reactivate again through `ValidatorManager::reactivateValidator()` he will maintain in his old balance for a while.

The problem occurs from the fact that even though the validator’s actual balance is 0, it is never updated because `OracleManager::updatePerformance()` skips inactive validators. As a result, an inactive validator will retain its old non-zero balance in storage. This becomes problematic because when the validator is reactivated via `ValidatorManager::reactivateValidator()`, it will temporarily retain its outdated balance.

```solidity

    function reactivateValidator(address validator)

        // ...

    {

        // ...

        Validator storage validatorData = _validators[index];

        require(!validatorData.active, “Validator already active”);

        require(!_validatorsWithPendingRebalance.contains(validator), “Validator has pending rebalance”);

        // Reactivate the validator

        validatorData.active = true;

        emit ValidatorReactivated(validator);

    }

```

What is the impact of this? 

Firstly, `totalBalance` will be incorrectly inflated until the deactivated validator is reactivated and its balance is updated. This is because the validator receiving the redelegated amount will report an increased balance, and this increase will be included in `totalBalance` during `generatePerformance`.

Consider the following scenario:

- `valA:100, valB:200, totalBalance:300`

- `valA` is deactivated, and its balance is redelegated to `valB`.

- During the next update, `valB` will report a balance of `300`, causing totalBalance to increase to `400`. `valA`, which now has a balance of 0, will not report its balance because it is deactivated. 

This is incorrect because no new funds entered the system and only a balance transfer occurred. The system incorrectly tracks more funds than actually exist.

Secondly, in the above scenario, if `valA` is later reactivated, it will still have its old balance until `OracleManager::generatePerformance` updates it. If `valA`’s old balance is larger than the current `totalBalance`, a revert due to underflow will occur when `ValidatorManager::updateValidatorPerformance()` attempts to update `totalBalance`.

For example : 

- `valA` has a balance of 100 when deactivated.

- Some time later, `totalBalance` is reduced to 80.

- When `valA` is reactivated, `updateValidatorPerformance()` will attempt to compute :

```solidity

totalBalance = totalBalance - oldBalance + balance;

```

This translates to:

```solidity

totalBalance = 80 - 100 + 0

```

 This underflow causes a revert, resulting in a DoS on the update

```solidity

    function updateValidatorPerformance(

        address validator,

        uint256 balance,

        // ...

    ) external whenNotPaused onlyRole(ORACLE_ROLE) validatorExists(validator) validatorActive(validator) {

        // ...

        // Cache old balance for total balance update

        uint256 oldBalance = val.balance;

        // ...

        // Update total balance

@>        totalBalance = totalBalance - oldBalance + balance;

        // ...

    }

```

## Recommendations

Consider zeroing out the validator’s balance upon deactivation and subtracting it from `totalBalance` when the rebalance request is created. This will ensures that accounting inconsistencies and the potential underflows upon reactivation, will be avoided.




