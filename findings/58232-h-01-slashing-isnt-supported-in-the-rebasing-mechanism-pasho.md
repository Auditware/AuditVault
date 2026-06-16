---
tags:
  - lang/solidity
  - sector/staking
  - sector/staking-pool
  - sector/token
  - platform/pashov
  - has/github
  - severity/high
  - precondition/specific-token-type
protocol: "[[Rivus]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Rivus-security-review.md"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[specific-token-type]]"
  - "[[reward-accounting]]"
---
# [H-01] Slashing isn't supported in the rebasing mechanism

- id: 58232
- impact: HIGH
- protocol: [[Rivus]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Rivus-security-review.md

## Summary


The report mentions a problem with the function called `rebase()` which is used to increase the share price and apply staking rewards. However, the current logic does not support decreasing the share price, which can lead to risks and potential loss of tokens. The report recommends adding the ability to decrease the share price to adjust for these events. This bug is considered high severity and has a medium likelihood of occurring.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The function `rebase()` has been used to increase the share price and apply staking rewards. The issue is that staking has its own risks and stake amounts can be slashed (In Commume or Bittensor network) and current logic doesn't support decreasing the share price. Also, some tokens can be stolen or lost when bridging so it would be necessary to have the ability to decrease the share price to adjust the share price according to those events.

## Recommendations

Add the ability to decrease the share price too.
