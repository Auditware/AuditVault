---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
  - sector/staking
protocol: "[[Kinetiq]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Kinetiq-security-review_2025-02-26.md"
genome:
  - "[[dos-resistance]]"
  - "[[oracle-freshness]]"
  - "[[logic/wrong-condition]]"
  - "[[dos/temporary]]"
  - "[[known-pattern]]"
  - "[[specific-state]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-04] `ReportSlashingEvent` reverts if outdated balance is below slashing amount

- id: 58612
- impact: HIGH
- protocol: Kinetiq_2025-02-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Kinetiq-security-review_2025-02-26.md

## Summary


The report discusses a bug in the code where the function `OracleManager::generatePerformance` is supposed to update the stats of every validator and their total balance. However, if there are any rewards or slashing amounts, the code will revert if the new slashing amount is greater than the validator’s previously reported balance. This can easily happen due to the intervals between updates and can lead to errors in the first few days after a validator is activated. The recommendation is to implement a mechanism for handling slashing amounts similar to how rewards are handled or compare the new slashing amount with the validator’s actual up-to-date balance.

## Details


## Severity

**Impact:** High

**Likelihood:** Medium

## Description

`OracleManager::generatePerformance` is supposed to be called once every hour (or at any other interval specified by `MIN_UPDATE_INTERVAL`). It updates the stats of every validator and also updates the `totalBalance`. If there are any rewards or slashing amounts, they are supposed to be accounted for and `ValidatorManager` should be updated accordingly.
```solidity
    function generatePerformance() external whenNotPaused onlyRole(OPERATOR_ROLE) returns (bool) {
        // ..

        // Update validators with averaged values
        for (uint256 i = 0; i < validatorCount; i++) {
            // ...

            // Handle slashing
            if (avgSlashAmount > previousSlashing) {
                uint256 newSlashAmount = avgSlashAmount - previousSlashing;
@>                validatorManager.reportSlashingEvent(validator, newSlashAmount);
            }

            // ...
        }

        // ...

        return true;
    }
```
As we can see, if the accumulated slashing amount for this particular validator has increased, `reportSlashingEvent` will be triggered with the increase passed as a parameter.
```solidity
    function reportSlashingEvent(address validator, uint256 amount)
       // ...
    {
        require(amount > 0, "Invalid slash amount");

        Validator storage val = _validators[_validatorIndexes.get(validator)];
@>        require(val.balance >= amount, "Insufficient stake for slashing");

        // Update balances
        unchecked {
            // These operations cannot overflow:
            // - val.balance >= amount (checked above)
            // - totalBalance >= val.balance (invariant maintained by the contract)
            val.balance -= amount;
            totalBalance -= amount;
        }

       // ...
    }
```
As shown in the highlighted section, the entire `reportSlashingEvent` (and therefore `generatePerformance` as well) will revert if the new slashing amount is greater than the validator’s previously reported balance. However, this is actually a very likely scenario and could easily happen due to the intervals between updates.

For example, at time `T`, the validator’s balance could be `100`. At `T + 1 hour`, the validator’s balance could grow to `500`, and the `slashingAmount` could be `110`. Due to this bug, the code will require `oldBalance > newSlashingAmount`, which would revert since `slashingAmount` is `110` and `oldBalance` is only `100`. Situations like this are especially likely to occur in the first few days after a validator is activated.

## Recommendations

Consider implementing a mechanism for handling slashing amounts similar to how rewards are handled, or compare the new slashing amount with the validator’s actual up to-date-balance.




