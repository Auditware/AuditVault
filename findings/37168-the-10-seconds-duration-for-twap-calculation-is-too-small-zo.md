---
tags:
  - lang/solidity
  - sector/oracle
  - platform/zokyo
  - has/github
  - severity/high
  - fix/use-twap
protocol: "[[Aarna]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-04-aarna.md"
genome:
  - "[[single-source]]"
  - "[[use-twap]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[twap-collateral-valuation]]"
---
# The 10 seconds duration for TWAP calculation is too small

- id: 37168
- impact: HIGH
- protocol: [[Aarna]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-04-aarna.md

## Summary


This bug report is about a function called `estimateAmountOutMin` in a contract called AFiOracle. This function uses a measure called Time-Weighted Average Price (TWAP) to estimate the output amounts for token swaps. However, the TWAP is only based on a 10-second observation window, which is too short and can be easily affected by trades within a single block. The recommendation is to increase the observation window to 900 seconds, and the fix has been implemented. 

## Details

**Severity**: High

**Status**:  Resolved

**Description**

The `estimateAmountOutMin` function from AFiOracle contract uses a Time-Weighted Average Price (TWAP) derived from a 10-second observation window to estimate output amounts for token swaps. Given that the average block time on the Ethereum network is approximately 12 seconds, TWAP with that short duration can be easily influenced by the trades within a single block. 

**Recommendation**: 

Increase a TWAP observation window to at least 900 seconds.

**Fix**: The TWAP observation has been updated to 900 seconds.
