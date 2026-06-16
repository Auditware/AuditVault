---
tags:
  - lang/solidity
  - sector/staking
  - platform/zokyo
  - has/github
  - severity/high
  - novelty/known-pattern
protocol: "[[Graviton Zero]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-01-26-Graviton Zero.md"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[reward-theft]]"
  - "[[integer-bounds]]"
---
# Risk of overflow.

- id: 56366
- impact: HIGH
- protocol: [[Graviton Zero]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-01-26-Graviton Zero.md

## Summary


The bug report explains that there is a problem with the calculation of accTokenPerShare, which is a number used in a computer program. This calculation involves multiplying three numbers together, which results in a very large number (1e62). However, the maximum size for an unsigned integer (a type of number used in computer programs) is 2**256-1, which is around 1e77. This means that if the pool rate is high and the rateDenominator is low, the calculation can cause an overflow, which is when a number is too large for the computer to handle. The recommendation is to fix this problem by either handling or preventing an overflow exception, which means finding a way to deal with or avoid the problem.

## Details

**Description**


accTokenPerShare calculation utilizes 1e12*1e18*1e32 that is equal to 1e62. Max size of
unsigned integer (256) is 2**256-1 that is ~1e77. With high pool rate and low
rateDenominator such amount can cause an overflow.

**Recommendation**:

Handle or prevent an overflow exception.
