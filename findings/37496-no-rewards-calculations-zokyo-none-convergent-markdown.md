---
tags:
  - lang/solidity
  - sector/nft
  - sector/staking
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Convergent]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-03-18-Convergent.md"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# No rewards calculations

- id: 37496
- impact: HIGH
- protocol: [[Convergent]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-03-18-Convergent.md

## Summary


This bug report states that there is an issue with a smart contract that allows users to stake NFTs (non-fungible tokens) but does not calculate any rewards. The documentation for the contract includes a method for calculating points, but this is not actually implemented in the code. The recommendation is to fix this and add in the rewards calculation. However, the client has commented that this is handled off-chain and is not within the scope of the smart contract.

## Details

**Severity**: High

**Status**: Acknowledged

**Description**

The smart contract allows to stake NFTs but doesn't calculate any rewards. The given documentation shows the points calculation, which is not implemented in the given codebase.

**Recommendation**: Implement rewards calculation	

**Client comment**: It is handled off-chain and therefore is not in the scope of the smart contract.
