---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/perpetuals
protocol: "[[Ostium]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Ostium-security-review_2025-09-14.md"
genome:
  - "[[missing-check]]"
  - "[[indirect-loss]]"
  - "[[cross-contract-state-consistency]]"
---
# [H-02] Code misses sending rollover fee to liquidity buffer

- id: 65200
- impact: HIGH
- protocol: Ostium_2025-09-14
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Ostium]]-security-review_2025-09-14.md

## Summary


This bug report discusses an issue with the rollover fee not being properly used as a liquidity buffer to settle traders' profit and loss. The current code keeps the rollover fee as a development fee in the storage contract, instead of sending it to the vault where it can be used as a buffer. The recommended solution is to send the rollover fee to the vault using the `receiveAssets()` function. This will allow the fees to be used as intended and properly settle traders' profit and loss.

## Details


_Acknowledged_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

According to the doc, the rollover fee should be accumulated in the liquidity buffer, and it should be used to settle traders profit and loss. But in the current code, code keeps the rollover fee as dev fee in the storage contract. In function `getTradeValue()` code calculates the rollover fee and in function `getTradeValuePure()` code reduces the rollover fee from trade value and later code sends the `tradeValue` to the user in the `unregisterTrade()` function and rollover fee stays in the storage contract. 
As a result code calculates the rollover fee correctly, but doesn't send those tokens to the liquidity buffer. Those fees stays in the storage contract, and won't be used as a buffer to settle the traders profit.

As a liquidity buffer is implemented in the vault with `accPnlPerToken` variable, code should send the rollover fee to the vault with function `receiveAssets()` so that those fees would be used as a liquidity buffer to settle the traders profit and loss. 

## Recommendations
Send the rollover to the vault with function `receiveAssets()`.
