---
tags:
  - lang/solidity
  - sector/infra
  - sector/lending
  - sector/staking
  - sector/staking-pool
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - vuln/logic/reward-calculation
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Casimir]]"
auditors:
  - "[[Hans]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-07-10-cyfrin-casimir-v2.0.md"
genome:
  - "[[underflow]]"
  - "[[reward-calculation]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[fee-accounting]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
# Incorrect accounting of `reportRecoveredEffectiveBalance` can prevent report from being finalized when a validator is slashed

- id: 35004
- impact: HIGH
- protocol: [[Casimir]]
- reporter: Hans (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-07-10-cyfrin-casimir-v2.0.md

## Summary


Summary:

This bug report highlights an issue where a loss incurred by a validator being slashed is not properly accounted for in the `finalizeReport()` function. This can lead to incorrect calculations and an arithmetic underflow, preventing new validators from being activated and a new report period from starting. The recommended mitigation is to add the `reportRecoveredEffectiveBalance` variable to the `rewards` calculation to properly account for the recovered ETH. The bug has been fixed in the Casimir contracts and verified by Cyfrin.

## Details

**Description:** When a validator is slashed, a loss is incurred. In the `finalizeReport()` function, the `rewardStakeRatioSum` and `latestActiveBalanceAfterFee` variables are reduced to reflect this loss. The change could be positive if the rewards are larger than the slashed amount, but for simplicity, we'll focus on the negative case. This is where the loss is accounted for.

```solidity
} else if (change < 0) {
    uint256 loss = uint256(-change);
    rewardStakeRatioSum -= Math.mulDiv(rewardStakeRatioSum, loss, totalStake);
    latestActiveBalanceAfterFee -= loss;
}
```

However, any loss will be recovered by the node operators' collateral in the `CasimirRegistry`. From the users' or pool's perspective, there is no loss if it is covered, and users will receive compensation in full. The missing accounting here is that `rewardStakeRatioSum` and `latestActiveBalanceAfterFee` need to be increased using the `reportRecoveredEffectiveBalance` variable.

**Impact:** Users or pools suffer a loss that should be covered by `reportRecoveredEffectiveBalance`. Incorrect accounting results in `latestActiveBalanceAfterFee` being less than expected. This in certain scenarios could lead to arithmetic underflow & prevent report from being finalized. Without report finalization, new validators cannot be activated & a new report period cannot be started.

**Proof of Concept:** Consider following scenario - there is an underflow when last validator is withdrawn that prevents report from being finalized.

_Report Period 0_
2 validators added

```State:
latestActiveBalanceAfterFee = 64
latestActiveRewards = 0
````

_Report Period 1_
Rewards: 0.1 per validator on BC.
Withdrawal: 32
Unstake request: 15

```
=> start
Eigenpod balance = 32.1
reportSweptBalance = 32.1

=> syncValidator
reportActiveBalance = 32.1
reportWithdrawableValidators = 1

=>withdrawValidator
delayedRewards = 0.1
Slashed = 0
Report Withdrawn Effective Balance = 32
Delayed Effective Balance = 32
Report Recovered Balance = 0

=> finalize
totalStake = 49
expectedWithdrawalEffectiveBalance = 32
expectedEffectiveBalance = 32

Rewards = 0.2

rewardStakeRatioSum = 1004.08
latestActiveBalanceAfterFee (reward adj.) = 64.2
swept rewards = 0.1

latestActiveBalanceAfterFee (swept reward adj) = 64.1
latestActiveBalanceAfterFee (withdrawals adj) = 32.1
latestActiveRewards = 0.1

```

_Report Period 2_
unstake request: 20
last validator exited with slashing of 0.2

```
=> start
Eigenpod balance = 63.9 (32.1 previous + 31.8 slashed)
Delayed effective balance = 32
Delayed rewards = 0.1

reportSweptBalance = 96

=> sync validator
reportActiveBalance = 0
reportWithdrawableValidators = 1

=> withdraw validator
Delayed Effective Balance = 63.8 (32+ 31.8)
Report Recovered Balance = 0.2
Report Withdrawn Effective Balance = 31.8 + 0.2 = 32
Delayed Rewards = 0.1



=> finalizeReport
Total Stake: 29.2
expectedWithdrawalEffectiveBalance = 32
expectedEffectiveBalance = 0
rewards = 64

Change = 63.9
rewardStakeRatioSum: 3201.369
latestActiveBalanceAfterFee (reward adj) = 96
Swept rewards = 64.2

latestActiveBalanceAfterFee (swept reward adj) = 31.8
latestActiveBalanceAfterFee (adj withdrawals) = -0.2 => underflow

latestActiveRewards = -0.2
````
Arithmetic underflow here. Correct adjustment is by including `reportRecoveredBalance` in rewards. On correction, the following state is achieved:

=> finalizeReport
````
Total Stake: 29.2
expectedWithdrawalEffectiveBalance = 32
expectedEffectiveBalance = 0
rewards = 64.2 (add 0.2 recoveredEffectiveBalance)

Change = 64.1
rewardStakeRatioSum: 3208.247
latestActiveBalanceAfterFee (reward adj) = 96.2
Swept rewards = 64.2

latestActiveBalanceAfterFee (swept reward adj) = 32
latestActiveBalanceAfterFee (adj withdrawals) = 0

latestActiveRewards = 0
````

**Recommended Mitigation:** Consider adding `reportRecoveredEffectiveBalance` to `rewards` calculation so that recovered ETH is accounted for in `rewardStakeRatioSum` and `latestActiveBalanceAfterFee` calculations.

**Casimir:**
Fixed in [eb31b43](https://github.com/casimirlabs/casimir-contracts/commit/eb31b4349e69eb401615e0eca253e9ab8cc0999d).

**Cyfrin:** Verified.

\clearpage
