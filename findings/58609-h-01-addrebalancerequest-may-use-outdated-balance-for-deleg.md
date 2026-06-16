---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
protocol: "[[Kinetiq]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Kinetiq-security-review_2025-02-26.md"
genome:
  - "[[oracle-freshness]]"
  - "[[debt-accrual-update]]"
  - "[[logic/wrong-condition]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[specific-state]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-01] `_AddRebalanceRequest` may use outdated balance for delegate withdrawal request

- id: 58609
- impact: HIGH
- protocol: Kinetiq_2025-02-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Kinetiq-security-review_2025-02-26.md

## Summary


The report highlights a bug in the `ValidatorManager._addRebalanceRequest()` function. This function is responsible for checking a validator's balance and recording a withdrawal request. However, due to the dynamic nature of balance changes, there are two potential problems when the `closeRebalanceRequest()` function is called. Firstly, if the validator's balance decreases after the request is made, the withdrawal may fail. Secondly, if the balance increases, some funds may remain in the validator's account. This is especially concerning during emergency withdrawals or when deactivating a validator, as the manager needs to retrieve all funds. To fix this bug, the report recommends implementing two solutions: 1) ensuring that the `closeRebalanceRequest()` function checks the validator's balance to reflect the most up-to-date amount before processing the withdrawal request, and 2) adding a mechanism to `closeRebalanceRequest()` so that the manager can withdraw all available funds at the moment in the validator's balance.

## Details


## Severity

**Impact:** High

**Likelihood:** Medium

## Description

`ValidatorManager._addRebalanceRequest()` checks validator's balance and records a withdrawal request:

```solidity
    function _addRebalanceRequest(address validator, uint256 withdrawalAmount) internal {
        require(!_validatorsWithPendingRebalance.contains(validator), "Validator has pending rebalance");
        require(withdrawalAmount > 0, "Invalid withdrawal amount");

        (bool exists, uint256 index) = _validatorIndexes.tryGet(validator);
        require(exists, "Validator does not exist");
        require(_validators[index].balance >= withdrawalAmount, "Insufficient balance");

        validatorRebalanceRequests[validator] = RebalanceRequest({validator: validator, amount: withdrawalAmount});
        _validatorsWithPendingRebalance.add(validator);

        emit RebalanceRequestAdded(validator, withdrawalAmount);
    }
```
However, a validator’s balance can change at any time due to rewards or slashing. This creates two potential problems when manager calls `closeRebalanceRequest()`:
1. Balance Decreases: If the validator’s balance decreases after the request is made, the delegation removal or withdrawal will fail.
2. Balance Increases: If the balance increases, some funds may remain in the validator’s account.

This is especially critical during emergency withdrawals or when deactivating a validator, as the manager needs to retrieve all funds.

## Recommendations

1. Ensure that the `closeRebalanceRequest()` function checks the validator’s balance to reflect the most up-to-date amount before processing the withdrawal request.
2. Add a mechanism to `closeRebalanceRequest()` so that manager can withdraw all available funds at the moment in validator balance




