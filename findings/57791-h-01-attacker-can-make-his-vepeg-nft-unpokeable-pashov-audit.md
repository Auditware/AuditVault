---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/governance
  - sector/nft
protocol: "[[Hyperstable]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Hyperstable-security-review_2025-02-26.md"
genome:
  - "[[arithmetic/rounding]]"
  - "[[indirect-loss]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
---
# [H-01] Attacker can make his `vePeg` NFT unpokeable

- id: 57791
- impact: HIGH
- protocol: Hyperstable_2025-02-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Hyperstable]]-security-review_2025-02-26.md

## Summary


This bug report discusses a problem with the `vePeg` NFT voting system. Due to the way balances decay over time, votes can become outdated if not regularly updated. However, a user can intentionally make their `vePeg` NFT unpokeable, preventing their voting weight from being updated. This can lead to an unfair and inaccurate voting system, potentially disadvantaging other users. The report recommends changing the `_vote()` function to continue with the loop instead of reverting on a 0 vote. 

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

Since `vePeg` NFT balances decay linearly over time, votes can become outdated if not updated, this is why we have the `poke` mechanism in the system.
It allows admins to update the `vePeg` NFTs voting weight to reflect its current balance. This ensures fairness and accuracy in the voting system.

A user can intentionally make their `vePeg` NFT unpokeable by exploiting a "dust vote" strategy. Here's how:

Suppose the current `vePeg` NFT balance is `10e18`.
The user votes for two pools: Allocates `10e18 - 1` weight to their preferred pool. Allocates 1 weight to a random pool (a "dust vote").
After 1 second, the `vePeg` NFT's balance decays to slightly less than 10e18.
At this point, any attempt to poke the `vePeg` NFT will fail because: The calculation `1 * veWeight / 10e18` for the dust vote will round down to 0 due to the reduced weight.

The `require(_poolWeight != 0)` check will revert the transaction, making the `vePeg` NFT effectively unpokeable.

```solidity
File: Voter.sol#_vote()

175:             if (isGauge[_gauge]) {
176:                 uint256 _poolWeight = _weights[i] * _weight / _totalVoteWeight;
177:                 require(votes[_tokenId][_pool] == 0);
178:                 require(_poolWeight != 0);

```

Users can intentionally make their `vePeg` NFTs unpokeable, preventing their voting weights from being updated to reflect their current balance. the `vePeg` NFTs continue to contribute votes based on outdated balances, skewing the voting system and potentially disadvantaging other users.

## Recommendations

The `_vote()` function should not revert on 0 vote, but instead continues with the loop.
