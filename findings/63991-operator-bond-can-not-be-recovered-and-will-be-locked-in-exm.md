---
tags:
  - lang/solidity
  - sector/gaming
  - sector/liquid-staking
  - sector/staking
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Kinetiq]]"
auditors:
  - "[[0xRajeev]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Kinetiq-Spearbit-Security-Review-November-2025.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# Operator bond can not be recovered and will be locked in ExManager

- id: 63991
- impact: HIGH
- protocol: [[Kinetiq]] LST Protocol
- reporter: 0xRajeev (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Kinetiq-Spearbit-Security-Review-November-2025.pdf

## Summary


This bug report discusses a high-risk issue in a contract called ExManager. The contract requires operators to deposit a certain amount of HYPE tokens, but currently there is no way for the operator to retrieve these tokens once the contract is unwound. This means that the bonded assets are permanently locked and cannot be accessed by the operator. The recommendation is to allow the operator to burn a corresponding amount of exLST tokens and claim back the HYPE bond. This issue has been fixed in a pull request and verified by the team.

## Details

## Severity: High Risk

## Context
`EXManager.sol#L257`

## Description
ExManager requires operators to deposit HYPE tokens equal to `opBond` as a "skin-in-the-game" mechanism. When an operator calls `ExManager.bond()`, the contract deposits the HYPE bond and mints the corresponding amount of `exLST` tokens. These `exLST` tokens are minted to the ExManager contract itself, not to the operator, ensuring that the operator cannot withdraw or use the bonded funds until the contract is unwound.

In the current implementation, however, once the contract is unwound, the operator has no mechanism to redeem or claim back their HYPE bond. The `exLST` tokens minted to ExManager remain locked inside `HIP3StakingManager`, making the operator bond permanently inaccessible. This results in the bonded assets being irrecoverably locked, which contradicts the intended lifecycle of the operator bond and creates a significant economic burden for operators.

While the impact is limited for the upcoming permissioned deployment-where `opBond` is relatively small-it becomes severe in the permissionless version, where `opBond` may be as high as 10% of 500,000 HYPE, potentially resulting in substantial permanent losses per operator.

## Recommendation
Consider allowing the operator to burn the corresponding amount of `exLST` tokens and claim back the HYPE bond after unwinding.

## Kinetiq
Fixed in PR 50.

## Spearbit
Fix verified.
