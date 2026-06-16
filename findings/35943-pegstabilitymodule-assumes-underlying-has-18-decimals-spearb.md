---
tags:
  - lang/solidity
  - sector/lending
  - sector/stable
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Euler]]"
auditors:
  - "[[Christos Pap]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Euler-Spearbit-Security-Review-EVK-April-2024.pdf"
genome:
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[token-decimal-normalization]]"
---
# PegStabilityModule assumes underlying has 18 decimals

- id: 35943
- impact: HIGH
- protocol: [[Euler]] Labs - EVK
- reporter: Christos Pap (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Euler-Spearbit-Security-Review-EVK-April-2024.pdf

## Summary


The report discusses a bug in the PegStabilityModule code, which is used to calculate swap amounts in a decentralized finance platform. The bug is considered to be of high risk and is located in lines 77-91 of the PegStabilityModule.sol file. The issue is that the swap amounts are quoted in the same decimals as the underlying asset, which is always 18 decimals. This means that if the underlying asset has a different number of decimals, the swap may be more profitable. The recommendation is to adjust the quoted amounts based on the decimals of the involved tokens. The bug has been fixed in a commit, but it is suggested that further documentation is added to the constructor of the PegStabilityModule to explain the expected values for deployment. This documentation has been added in a separate commit.

## Details

## Security Report

## Severity
**High Risk**

## Context
**PegStabilityModule.sol#L77-L91**

## Description
The swap amounts in the `PegStabilityModule` are quoted in the same decimals as the synth, which is always 18. It is therefore only compatible with underlying tokens that have 18 decimals. If the pegged underlying has different decimals, it becomes profitable to perform the swap.

## Recommendation
Consider scaling the quoted amounts based on the involved tokens' assets.

## Commit Information
- **Euler**: Fixed in commit `f97807d8`.
- **Spearbit**: The commit mitigates the issue. Euler should consider documenting the `PegStabilityModule` constructor with Natspec docs to provide further explanation on which values are expected for contract deployment.
- **Euler**: Natspec added in commit `d976be34`.
