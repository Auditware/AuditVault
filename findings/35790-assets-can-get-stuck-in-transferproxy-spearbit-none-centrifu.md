---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/rwa
  - sector/token
protocol: "[[Centrifuge]]"
auditors:
  - "[[Devtooligan]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Centrifuge-Spearbit-Security-Review-July-2024.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[bridge-stuck-asset]]"
---
# Assets can get stuck in TransferProxy

- id: 35790
- impact: HIGH
- protocol: [[Centrifuge]]
- reporter: Devtooligan (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Centrifuge-Spearbit-Security-Review-July-2024.pdf

## Summary


The bug report describes a high-risk issue in the TransferProxyFactory.sol code. The function transferAssets() is unable to retrieve tokens from the TransferProxy due to a missing allowance. The recommendation is to set an allowance for the poolManager in the TransferProxy. The bug has been fixed in the Centrifuge and Spearbit commits.

## Details

## Security Report

## Severity
**High Risk**

## Context
`TransferProxyFactory.sol#L18`

## Description
The function `transferAssets()` uses the following code to get the tokens from the TransferProxy:  

However, there is no allowance set in the TransferProxy, so this will always fail.

## Recommendation
Set an allowance for the `poolManager` in TransferProxy.

## Centrifuge
Fixed in commit `5e11282a`.

## Spearbit
Fixed.
