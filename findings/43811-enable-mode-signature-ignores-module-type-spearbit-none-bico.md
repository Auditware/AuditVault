---
tags:
  - lang/solidity
  - sector/insurance
  - sector/staking
  - platform/spearbit
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Biconomy]]"
auditors:
  - "[[blockdev]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Biconomy-Spearbit-Security-Review-October-2024.pdf"
genome:
  - "[[signature-replay]]"
  - "[[variant]]"
  - "[[role-bypass]]"
  - "[[reward-accounting]]"
---
# Enable Mode Signature ignores module type

- id: 43811
- impact: HIGH
- protocol: [[Biconomy]] Nexus
- reporter: Blockdev (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Biconomy-Spearbit-Security-Review-October-2024.pdf

## Summary


This bug report discusses an issue in the ModuleManager.sol code where two validators are used during enable mode. The first validator is used to validate the final userOp, while the second validator is used to check the enable mode signature. However, these two validators are independent and may have different trust assumptions and privileges. This means that the owner of the enableModeSigValidator may only want to produce a signature for a specific module type, but the signature only covers the module and initData fields, not the module type. This allows the user op submitter to forge the module type without invalidating the enable mode signature, and install the module as any type they want. The report recommends signing the module type as part of the enable mode data hash to prevent this issue. The bug has been fixed by Biconomy and Spearbit.

## Details

## High Risk Advisory

## Severity
**High Risk**

## Context
`ModuleManager.sol#L168-L171`

## Description
During enable mode, two validators are used:

1. **validator**: This is the module to be installed as any module type that can be defined. It must be a validator either already before the user operation or after enabling it as a validator in enable mode. This validator will be used to validate the final user operation.

2. **enableModeSigValidator**: This validator is used in `_checkEnableModeSignature` to check the `_getEnableModeDataHash(validator, initData)` for enabling the first validator.

Note that these two validators are independent of each other and may have different trust assumptions and privileges. The `enableModeSigValidator` owner might only want to produce a signature for a specific module type. However, the signature is only over the module (`validator`) and `initData` fields, not over the `moduleType` that the module will be installed as. The user operation submitter can forge the module type without invalidating the enable mode signature, as the entire enable mode data is encoded in the `userOp.signature`, which is not part of `userOpHash`.

They can then create a user operation with the forged enable mode module type to install the module as any type they want. A multi-type validator can be installed as all of its types.

## Recommendation
Consider signing the module type as part of the `_getEnableModeDataHash`.

## Biconomy
- Fixed PR 112.

## Spearbit
- Fixed.
