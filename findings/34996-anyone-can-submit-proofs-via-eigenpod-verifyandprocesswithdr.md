---
tags:
  - lang/move
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/restaking
  - sector/staking
  - lang/solidity
protocol: "[[Casimir]]"
auditors:
  - "[[Hans]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-07-10-cyfrin-casimir-v2.0.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
  - "[[reward-accounting]]"
---
# Anyone can submit proofs via  EigenPod `verifyAndProcessWithdrawals` to break the accounting of `withdrawRewards`

- id: 34996
- impact: HIGH
- protocol: [[Casimir]]
- reporter: Hans (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-07-10-cyfrin-casimir-v2.0.md

## Summary


The bug report discusses an issue with the `CasimirManager::withdrawRewards` operation, which is used to withdraw rewards for partial withdrawals of a validator. The operation is supposed to update the `delayedRewards` based on the last element in the array of `userDelayedWithdrawalByIndex`. However, anyone can submit proofs directly to `EigenPod::verifyAndProcessWithdrawals` instead of going through the proper process, which bypasses the necessary steps for updating the `delayedRewards`. This can result in broken accounting and prevent withdrawals from being processed. The bug has been fixed and verified by the team. To prevent this issue, it is recommended to track the `eigenWithdrawals.delayedWithdrawals` and `eigenWithdrawals.delayedWithdrawalsCompleted` on EigenLayer to calculate delayedRewards.

## Details

**Description:** `CasimirManager::withdrawRewards` is an `onlyReporter` operation that performs the key tasks below:

1. Submits proofs related to the partial withdrawal of a validator at a given index.
2. Updates the `delayedRewards` based on the last element in the array of `userDelayedWithdrawalByIndex`.

Note that anyone, not just the pod owner, can submit proofs directly to `EigenPod::verifyAndProcessWithdrawals`. In such a case, the `delayedRewards` will not be updated, and the subsequent accounting during report finalization will be broken.

Any attempt to withdraw rewards by calling `CasimirManager::withdrawRewards` will revert because the withdrawal has already been processed. Consequently, `delayedRewards` will never be updated.

This same issue is applicable when submitting proofs for processing a full withdrawal. Critical accounting parameters that are updated in `CasimirManager::withdrawValidator` are effectively bypassed when proofs are directly submitted to EigenLayer.

**Impact:** If `delayedRewards` is not updated, the `rewardStakeRatioSum` and `latestActiveBalanceAfterFee` accounting will be broken.

**Recommended Mitigation:** EigenLayer does not restrict access to process withdrawals only to the pod owner. To that extent, access control to `CasimirManager::withdrawRewards` can always be bypassed. Assuming that all withdrawals will happen only through a reporter, consider adding logic that directly tracks the `eigenWithdrawals.delayedWithdrawals` and `eigenWithdrawals.delayedWithdrawalsCompleted` on EigenLayer to calculate delayedRewards.

**Casimir:**
Fixed in [eb31b43](https://github.com/casimirlabs/casimir-contracts/commit/eb31b4349e69eb401615e0eca253e9ab8cc0999d)

**Cyfrin:** Verified.
