---
tags:
  - lang/solidity
  - sector/staking
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Casimir]]"
auditors:
  - "[[Hans]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-07-10-cyfrin-casimir-v2.0.md"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Accounting for `rewardStakeRatioSum` is incorrect when a delayed balance or rewards are unclaimed

- id: 35003
- impact: HIGH
- protocol: [[Casimir]]
- reporter: Hans (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-07-10-cyfrin-casimir-v2.0.md

## Summary


This bug report describes an issue with the accounting system in a software program. The program is incorrectly counting certain funds twice, which can lead to incorrect calculations and potentially give users more money than they should have. This issue has been fixed by the developers, but it is important to review the accounting logic to prevent similar issues in the future. 

## Details

**Description:** The current accounting incorrectly assumes that the delayed effective balance and delayed rewards will be claimed before any new report begins. This is inaccurate as these delayed funds require a few days before they can be claimed. If a new report starts before these funds are claimed, the `reportSweptBalance` will account for them again. This double accounting impacts the `rewardStakeRatioSum` calculation, leading to inaccuracies.

**Impact:** The accounting for `rewardStakeRatioSum` is incorrect, which leads to an inaccurate user stake. Consequently, users may receive more ETH than anticipated upon unstaking.

**Proof of Concept:** Consider the following scenario:

1. Initially, we assume that one validator (32 ETH) is staked and the beacon chain reward is 0.105 ETH. The report gets processed.
```solidity
// Before start
latestActiveBalanceAfterFee = 32 ETH
latestActiveRewards = 0

// startReport()
reportSweptBalance = 0 (rewards is in BeaconChain)

// syncValidators()
reportActiveBalance = 32.105 ETH

// finalizeReport()
rewards = 0.105 ETH
change = rewards - latestActiveRewards = 0.105 ETH
gainAfterFee = 0.1 ETH
=> rewardStakeRatioSum is increased
=> latestActiveBalanceAfterFee = 32.1

sweptRewards = 0
=> latestActiveRewards = 0.105
```

2. The beacon chain sweeps 0.105 ETH rewards. This is followed by processing another report.
```solidity
// Before start
latestActiveBalanceAfterFee = 32.1 ETH
latestActiveRewards = 0.105

// startReport()
reportSweptBalance = 0.105 (rewards is in EigenPod)

// syncValidators()
reportActiveBalance = 32 ETH

// finalizeReport()
rewards = 0.105 ETH
change = rewards - latestActiveRewards = 0
=> No update to rewardStakeRatioSum and latestActiveBalanceAfterFee

sweptRewards = 0.105
=> latestActiveBalanceAfterFee = 32 ETH (subtracted sweptReward without fee)
=> latestActiveRewards = rewards - sweptRewards = 0
```

3. Suppose no actions take place, which means the rewards is still in EigenPod and not claimed yet. The next report gets processed.
```solidity
// Before start
latestActiveBalanceAfterFee = 32 ETH
latestActiveRewards = 0

// startReport()
reportSweptBalance = 0.105 (No action happens so rewards is still in EigenPod)

// syncValidators()
reportActiveBalance = 32 ETH

// finalizeReport()
rewards = 0.105 ETH
change = rewards - latestActiveRewards = 0.105
=> rewardStakeRatioSum is increased
=> latestActiveBalanceAfterFee = 32.1

sweptRewards = 0.105
=> latestActiveBalanceAfterFee = 32 ETH (subtracted sweptReward without fee)
=> latestActiveRewards = rewards - sweptRewards = 0
```

Since no actions occur between the last report and the current one, the values of `latestActiveBalanceAfterFee` and `latestActiveReward` remain the same. However, the `rewardStakeRatioSum` value increased from nothing. If this reporting process continues, the `rewardStakeRatioSum` could infinitely increase. Consequently, the core accounting of user stakes becomes incorrect, and users could receive more ETH than expected when unstaking.

**Recommended Mitigation:** Review the accounting logic to ensure that the delayed effective balance and delayed reward are only accounted for once in the reports.

**Casimir**
Fixed in [eb31b43](https://github.com/casimirlabs/casimir-contracts/commit/eb31b4349e69eb401615e0eca253e9ab8cc0999d)

**Cyfrin**
Verified.
