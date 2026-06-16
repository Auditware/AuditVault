---
tags:
  - lang/solidity
  - sector/farm
  - platform/quantstamp
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Epoch Island]]"
auditors:
  - "[[Poming Lee]]"
report: "https://certificate.quantstamp.com/full/epoch-island-v-epoch-token/4d46937c-47cd-44f9-b95b-ed0f84713f0b/index.html"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# Calling `withdrawForfeit()` Multiple Times for a Single Deposit Would Cause Loss of Funds

- id: 59895
- impact: HIGH
- protocol: [[Epoch Island]] - vEPOCH Token
- reporter: Poming Lee (Quantstamp)
- source: https://certificate.quantstamp.com/full/epoch-island-v-epoch-token/4d46937c-47cd-44f9-b95b-ed0f84713f0b/index.html

## Summary


The bug report describes an issue with the `Vepoch.sol` file where the `rewardTokensClaimed` value is not being updated after a user forfeits their rewards multiple times. This means that when the user withdraws their deposit, they will end up paying back more rewards than necessary. The recommendation is to update the `rewardTokensClaimed` value and add the modified amount to the `event WithdrawnForfeit` emission. This will ensure that users do not have to pay back more rewards than necessary and will be able to unlock their entire deposit without having to buy additional `rewardToken`s.

## Details

**Update**
The client fixed this issue in commit `3f95022`. `rewardTokensClaimed` is now updated, so a user will not have to pay back more rewards if forfeited multiple times.

**File(s) affected:**`Vepoch.sol`

**Description:** When calling `withdrawForfeit()`, the rewards that need to be paid back to the contract is calculated as follows:

```
uint256 forfeitReward = ((earned[_depositId] + rewardTokensClaimed[_depositId]) * percentage) / 1e18;
```

However, the `rewardTokensClaimed` is never updated after the payback. Thus, when users don't withdraw 100 percent of their deposit, they will repay more rewards than they are obligated to with the following withdrawals. Furthermore, the user won't be able to unlock the entire deposit unless they buy `rewardToken` to pay back.

**Recommendation:** Update `rewardTokensClaimed[]` based on the repaid amount and also add the modified amount information to `event WithdrawnForfeit` emission.
