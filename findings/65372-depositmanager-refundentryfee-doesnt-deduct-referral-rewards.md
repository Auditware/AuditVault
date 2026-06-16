---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/gaming
protocol: "[[Majority Protocol]]"
auditors:
  - "[[Dacian]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-27-cyfrin-majority-protocol-v2.0.md"
genome:
  - "[[state-update]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# `DepositManager::_refundEntryFee` doesn't deduct referral rewards allowing users to join then leave games to drain tokens via inflated referral rewards they aren't entitled to

- id: 65372
- impact: HIGH
- protocol: [[Majority Protocol]]
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-27-cyfrin-majority-protocol-v2.0.md

## Summary


The DepositManager contract has a bug where it doesn't deduct referral rewards when a user leaves a game and their fee is refunded. This can be exploited by malicious users to drain tokens from the contract. It can also happen naturally and result in inflated rewards for referrers, causing a shortage of tokens for winners and fees. To fix this, the contract should deduct from referral rewards when refunding fees, instead of adding to them. The bug has been fixed in the Majority Games commit 50a1e6b and verified by Cyfrin.

## Details

**Description:** `DepositManager::_payEntryFee` increments the referral rewards for the user's referrer:
```solidity
referralRewards[gameId][Registry(registry).referrers(player)] += pool.ticketPrice * REFERRER_FEE;
```

But `DepositManager::_refundEntryFee` doesn't deduct referral rewards when a user leaves the game and their fee is refunded.

**Impact:** Malicious users can intentionally join then leave rescheduled games to drain tokens from the contract via inflated referral rewards they aren't entitled to.

This bug can also occur naturally without malicious users simply by users joining then leaving, giving referrers more reward allocation than they are entitled to. Once the game ends and referrers claim their inflated rewards, there will not be enough tokens to distribute to winners or for creator / protocol fees.

**Recommended Mitigation:** `DepositManager::_refundEntryFee` should deduct from the referral rewards when refunding the game fee, opposite to how `_payEntryFee` adds to the referral rewards when receiving the game fee.

**Majority Games:**
Fixed in commit [50a1e6b](https://github.com/Engage-Protocol/engage-protocol/commit/50a1e6bb3a48a6056cbf0678030be0e9424ba052).

**Cyfrin:** Verified.
