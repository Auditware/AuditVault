---
tags:
  - lang/solidity
  - sector/nft
  - sector/staking
  - platform/shieldify
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Honeypot Finance]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/HoneypotFinance-NFTStaking-Security-Review.md"
genome:
  - "[[reward-calculation]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# [H-01] Incorrect Burn Reward Multiplier Reset on `claim()` Reduces Accrual

- id: 62873
- impact: HIGH
- protocol: Honeypotfinance Nftstaking
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/HoneypotFinance-NFTStaking-Security-Review.md

## Summary


This bug report is about an issue with the burn-mode rewards in the NFTStaking contract. The bug causes the multiplier, which determines the amount of rewards, to be reset on each claim instead of being based on the total time since staking. This means that users in burn mode are receiving significantly fewer rewards than intended. The team has recommended tracking two timestamps for burn mode to fix this issue. The bug has been fixed by the team.

## Details


## Severity

High Risk

## Description

Burn-mode rewards compute the multiplier from time since the last burn claim and then reset that reference timestamp on each claim, erasing duration and keeping the multiplier near 1. Normal staking keeps the multiplier based on total elapsed since staking, so burn-mode accrual is materially underpaid relative to the intended "longer duration → higher rewards" behavior.

## Location of Affected Code

File: [src/NFTStaking.sol#L161](https://github.com/Honeypot-Finance/new_nft_staking/blob/02d5afe0b5327642f48fffe29ec2cb4607a078e7/src/NFTStaking.sol#L161)

```solidity
function _claim(uint256 tokenId) internal returns (uint256 amount) {
  // code
  if (s.burned) {
      // Handle burn bonus claim
      require(s.burnedAt != 0, "INVALID_BURN_STATE");

      uint256 sinceBurn = block.timestamp - uint256(s.burnedAt);
      if (sinceBurn == 0) return 0;

      uint256 mBurn = _multiplier(sinceBurn);
      amount =
          (rewardRatePerSecond * sinceBurn * mBurn * burnBonusBps) /
          (ONE * MAX_BPS);

      if (amount == 0) return 0;

      // Update last burn claim time (resets multiplier reference)
      s.burnedAt = uint64(block.timestamp);

      // Mint burn bonus rewards
      rewards.mint(msg.sender, amount);
      emit BurnRewardClaimed(msg.sender, tokenId, amount);

      return amount;
  }

  // Normal claim path: multiplier uses total elapsed since stakedAt and does not reset
  uint256 nowTs = block.timestamp;
  if (nowTs <= s.lastClaimAt) return 0;

  uint256 delta = nowTs - uint256(s.lastClaimAt);
  uint256 elapsed = nowTs - uint256(s.stakedAt);
  uint256 m = _multiplier(elapsed);

  amount = (rewardRatePerSecond * delta * m) / ONE;

  if (amount == 0) return 0;

  // Update last claim time
  s.lastClaimAt = uint64(nowTs);

  // Mint rewards
  rewards.mint(s.owner, amount);
  emit RewardClaimed(s.owner, tokenId, amount);
  return amount;
}
```

## Impact

Users receive significantly fewer rewards in burn mode than intended. Each claim truncates the multiplier accumulation window, preventing duration-based scaling comparable to normal staking. Burn-mode users are prevented from claiming rewards to avoid a multiplier reset, which puts them at a disadvantage compared to normal staking users.

## Recommendation

Track two timestamps for burn mode: a fixed `burnStartAt` used only for multiplier calculation and a separate `lastBurnClaimAt` used for the delta window. Compute `mBurn` from `now - burnStartAt`, compute `delta` from `now - lastBurnClaimAt`. Alternatively, consider reusing the existing `lastClaimAt` timestamp instead of introducing a new field `lastBurnClaimAt`.

## Team Response

Fixed.
