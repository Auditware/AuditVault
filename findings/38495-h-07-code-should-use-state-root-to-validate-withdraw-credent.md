---
tags:
  - lang/solidity
  - sector/staking
  - platform/pashov
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Karak]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Karak-security-review-June.md"
genome:
  - "[[frozen-funds]]"
  - "[[variant]]"
  - "[[locked-funds]]"
  - "[[reward-accounting]]"
---
# [H-07] Code should use state root to validate withdraw credentials

- id: 38495
- impact: HIGH
- protocol: [[Karak]]-June
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Karak-security-review-June.md

## Summary


This bug report discusses an issue with a function called `validateWithdrawalCredentials()`. The code uses the wrong information to verify a validator's data, which prevents any validators from being added to the system. The severity of this bug is medium, and the likelihood of it happening is high. To fix this issue, the code should use `beaconStateRoot` instead of the block's root when calling `validateWithdrawalCredentials()`.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

In the function `validateWithdrawalCredentials()` code validates the state root's proof but then it uses the block's root to verify the validator's information:

```solidity
            totalRestakedWei += self.validateWithdrawalCredentials(
                nodeOwner,
                beaconStateRootProof.timestamp,
                _getParentBlockRoot(beaconStateRootProof.timestamp),
                validatorFieldsProofs[i]
            );
```

Because of this issue, no validator can be added to the system.

## Recommendations

Validator information is stored inside the state root and the code should use `beaconStateRoot` when calling `validateWithdrawalCredentials()`.
