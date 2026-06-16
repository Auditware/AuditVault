---
tags:
  - lang/solidity
  - sector/staking
  - platform/zokyo
  - has/github
  - severity/high
  - novelty/known-pattern
protocol: "[[Glodefy]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-01-26-GlodeFy.md"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[reward-theft]]"
  - "[[integer-bounds]]"
---
# Risk of overflow.

- id: 56355
- impact: HIGH
- protocol: [[Glodefy]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-01-26-GlodeFy.md

## Summary


This bug report discusses an issue with the calculation of accTokenPerShare, which can cause an overflow when the pool rate is high and the rateDenominator is low. The suggested solution is to handle or prevent the overflow exception.

## Details

**Description**


accTokenPerShare calculation utilizes 1e12*1e18*1e32 that is equal to 1e62. Max size of
unsigned integer (256) is 2**256-1 that is ~1e77. With high pool rate and low
rateDenominator such amount can cause an overflow.

**Recommendation**:

Handle or prevent an overflow exception.
