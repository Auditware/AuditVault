---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - platform/cyfrin
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Casimir]]"
auditors:
  - "[[Hans]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-07-10-cyfrin-casimir-v2.0.md"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Operator is not removed in Registry when validator has `owedAmount == 0`

- id: 35002
- impact: HIGH
- protocol: [[Casimir]]
- reporter: Hans (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-07-10-cyfrin-casimir-v2.0.md

## Summary


The `CasimirManager::withdrawValidator()` function is not working properly as it does not update the states of other operators when a validator is fully withdrawn. This means that the collateral for the withdrawn validator will remain locked in the contract and cannot be withdrawn by the operator. To fix this, the function `registry.removeOperatorValidator()` should also be called with a `recoverAmount` of 0 when the owed amount is 0. This bug has been fixed in the latest version of Casimir.

## Details

**Description:** `CasimirManager::withdrawValidator()` function is designed to remove a validator after a full withdrawal. It checks whether the final effective balance of the removed validator is sufficient to cover the initial 32 ETH deposit. If for some reason such as slashing, the final effective balance is less than 32 ETH, the operators must recover the missing portion by calling `registry.removeOperatorValidator()`.


```solidity
uint256 owedAmount = VALIDATOR_CAPACITY - finalEffectiveBalance;
if (owedAmount > 0) {
    uint256 availableCollateral = registry.collateralUnit() * 4;
    owedAmount = owedAmount > availableCollateral ? availableCollateral : owedAmount;
    uint256 recoverAmount = owedAmount / 4;
    for (uint256 i; i < validator.operatorIds.length; i++) {
        // @audit if owedAmount == 0, this function is not called
        registry.removeOperatorValidator(validator.operatorIds[i], validatorId, recoverAmount);
    }
}
```

However, the `removeOperatorValidator()` function also has the responsibility to update other operators' states, such as `operator.validatorCount`. If this function is only called when `owedAmount > 0`, the states of these operators will not be updated if the validator fully returns 32 ETH.

**Impact:** The `operator.validatorCount` will not decrease in the `CasimirRegistry` when a validator is removed. As a result, the operator cannot withdraw the collateral for this validator, and the collateral will remain locked in the `CasimirRegistry` contract.

**Recommended Mitigation:** The function `registry.removeOperatorValidator()` should also be called  with `recoverAmount = 0` when `owedAmount == 0`. This will free up collateral for operators.

**Casimir:**
Fixed in [d7b35fc](https://github.com/casimirlabs/casimir-contracts/commit/d7b35fce9925bfa2133fd4e16ae11e483ab4daa4)

**Cyfrin:** Verified.
