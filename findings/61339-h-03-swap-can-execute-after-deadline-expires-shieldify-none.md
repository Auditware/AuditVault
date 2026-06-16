---
tags:
  - lang/solidity
  - sector/dex
  - platform/shieldify
  - has/github
  - severity/high
  - impact/mev/backrun
  - impact/mev/frontrun
protocol: "[[Gluex]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/GlueX-V2-Security-Review.md"
genome:
  - "[[slippage]]"
  - "[[indirect-loss]]"
  - "[[backrun]]"
  - "[[frontrun]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[timestamp-dependence]]"
---
# [H-03] Swap Can Execute After Deadline Expires

- id: 61339
- impact: HIGH
- protocol: [[Gluex]] V2
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/GlueX-V2-Security-Review.md

## Summary


This bug report discusses a high-risk issue with the `swap()` function in the GluexRouter smart contract. The function does not have a deadline check, as required by the official documentation. This means that transactions can be mined at any time in the future, potentially leading to unfair execution prices or failed economic assumptions. The affected code can be found in the GluexRouter.sol file, and the impact of this bug includes both financial and reputational risk. The recommendation is to add a deadline check at the start of the swap function to prevent this issue. The team has acknowledged the problem.

## Details


## Severity

High Risk

## Description

The `swap()` function lacks a deadline enforcement mechanism, despite the [official documentation](https://docs.gluex.xyz/gluex-apis/router-api/smart-contracts/Router#reverts) explicitly requiring that swaps revert if the current block timestamp exceeds a specified deadline.

> Reverts:
> Deadline passed: If the block timestamp exceeds the deadline.

This missing check allows transactions to be mined at any time in the future, potentially after market conditions have changed or slippage assumptions are no longer valid. Such behavior undermines user protection against stale or manipulated execution.

## Location of Affected Code

File: [router_v1/GluexRouter.sol#L167-L171](https://github.com/gluexprotocol/gluex_router_contract/blob/9c754a3985fa32b72d847c88c83575f29a86bc01/router_v1/GluexRouter.sol#L167-L171)

## Impact

Attackers or miners can intentionally delay transaction inclusion and front-run or back-run users, leading to unfair execution prices or failed economic assumptions. This introduces both financial and reputational risk.

## Recommendation

Add a deadline check at the start of the swap function to revert if the current timestamp exceeds the allowed window.

```diff
+ require(block.timestamp <= desc.deadline, "deadline passed");
```

## Team Response

Acknowledged.
