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
  - "[[wrong-condition]]"
  - "[[specific-token-type]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# [H-01] Slashing isn't supported in the rebasing mechanism

- id: 34139
- impact: HIGH
- protocol: [[Rivus]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Rivus-security-review.md

## Summary


This bug report discusses an issue with the function `rebase()` which is used to increase share prices and apply staking rewards. The problem is that staking carries its own risks and can result in a decrease in stake amounts. The current logic does not support decreasing the share price, which can lead to tokens being stolen or lost when bridging. The recommendation is to add the ability to decrease the share price in order to adjust for these events. This bug is considered high severity and has a medium likelihood of occurring. 

## Details

**Severity**

**Impact:** High

**Likelihood:** Medium

**Description**

The function `rebase()` has been used to increase the share price and apply staking rewards. The issue is that staking has its own risks and stake amounts can be slashed (In Commume or Bittensor network) and current logic doesn't support decreasing the share price. Also, some tokens can be stolen or lost when bridging so it would be necessary to have the ability to decrease the share price to adjust the share price according to those events.

**Recommendations**

Add the ability to decrease the share price too.
