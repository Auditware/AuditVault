---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/staking
protocol: "[[Zero Staking]]"
auditors:
  - "[[Jennifer Wu]]"
report: "https://certificate.quantstamp.com/full/zero-staking/40ffa176-7b8d-43ec-a7e2-29732c12f21e/index.html"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Loss of Pending Reward when Unstaking

- id: 59358
- impact: HIGH
- protocol: [[Zero Staking]]
- reporter: Jennifer Wu (Quantstamp)
- source: https://certificate.quantstamp.com/full/zero-staking/40ffa176-7b8d-43ec-a7e2-29732c12f21e/index.html

## Summary


The client has marked a bug as "Fixed" and provided an explanation for the issue. The bug affects two files, `StakingERC20.sol` and `StakingERC721.sol`. When a user unstakes their full balance with a specific flag, they can lose all their potential rewards. This is because the code deletes the accounting of the rewards owed to the user, even if there are still rewards owed. The same issue exists in both files. To fix this, the recommendation is to make sure pending rewards are properly handled, either by transferring them immediately or keeping a separate record of owed rewards. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `2557a3905791ef0390513453c72077e2d7b0ed25`, `f4b922d5ddddb0b13753ad32bbcc5edb58aa27e7`. The client provided the following explanation:

> second commit for test fix

**File(s) affected:**`StakingERC20.sol`, `StakingERC721.sol`

**Description:** A user who unstakes his full staked balance with the flag `exit = true` can lose all his potential rewards because of the following lines:

```
// In StakingERC20.sol
if (staker.amountStaked - amount == 0) {
    delete stakers[msg.sender];
}
```

This effectively deletes the accounting of the rewards owed to the staker, causing the user to lose all his rewards even when `staker.owedRewards` is non-zero.

A similar vulnerability exists in `StakingERC721.sol`.

**Recommendation:** Ensure that pending rewards are properly handled even when the user's staker data is deleted. This can be achieved by either transferring the rewards immediately to the user, assuming `unlockTime` has passed, or maintaining a separate record of owed rewards that is not affected by the deletion of the Staker struct.
