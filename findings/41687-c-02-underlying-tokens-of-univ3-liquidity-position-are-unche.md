---
tags:
  - lang/move
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
  - sector/stable
  - sector/staking
  - sector/token
protocol: "[[DYAD]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md"
genome:
  - "[[missing-owner-check]]"
  - "[[reward-theft]]"
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
---
# [C-02] Underlying tokens of UniV3 Liquidity Position are unchecked

- id: 41687
- impact: HIGH
- protocol: [[DYAD]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md

## Summary


There is a high severity bug in the UniswapV3Staking contract that allows a malicious actor to earn a large amount of rewards by staking an arbitrary ERC20 token. This is due to the lack of checks on the underlying tokens of the staked UniV3 Liquidity Position. To fix this, the stake() function should be updated to only allow USDC and DYAD tokens as the underlying tokens.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

Within `UniswapV3Staking.stake()`, the underlying tokens of the staked UniV3 Liquidity Position are unchecked. This lets a malicious actor create a new UniV3 pool with their own arbitrary ERC20 tokens, where they mint themselves a large number of tokens. This causes the `liquidity` of their position in this pool to be extremely high, allowing them to earn an extremely large amount of rewards from staking this position.

## Recommendations

Within `stake()`, ensure that the underlying tokens of the position are USDC and DYAD
