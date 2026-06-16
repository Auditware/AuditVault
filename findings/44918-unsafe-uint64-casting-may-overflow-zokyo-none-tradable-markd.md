---
tags:
  - lang/solidity
  - sector/staking
  - platform/zokyo
  - has/github
  - severity/high
  - novelty/known-pattern
protocol: "[[Tradable]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-09-01-Tradable.md"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Unsafe uint64 casting may overflow

- id: 44918
- impact: HIGH
- protocol: [[Tradable]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-09-01-Tradable.md

## Summary


The report states that there is a high severity bug in the TradableStaking contract. This bug has been resolved, but it is important for beginners to understand what the bug was and how it was resolved. 

The bug was caused by the `_stake` internal function in the contract, which is responsible for updating and generating staking positions when funds are deposited. This function assigns values to a Stake struct, but it was found that the function was casting two specific values, amountToBase and userShares, to a data type called uint64. This data type has a maximum value of approximately 18.5 ETH. 

This means that if the computed values for amountToBase and userShares were higher than this maximum limit, a silent overflow could occur. This could lead to inaccuracies in the protocol's accounting, which is a serious issue. 

The recommendation to fix this bug is to not cast the values to uint64. This will prevent the possibility of a silent overflow and ensure accurate accounting within the protocol. The bug has been resolved, but it is important for developers to understand the importance of data types and how they can affect the functionality of a smart contract.

## Details

**Severity**: High

**Status**:  Resolved

**Description**

The `_stake` internal function in TradableStaking contract is responsible for updating and generating staking positions during the deposit of funds. It assigns the calculated values to the Stake struct. However, the function cast amountToBase and userShares value to uint64, which has a maximum possible value of approximately 18.5 ETH. In cases where these computed values surpass the maximal limits, a silent overflow can occur, potentially leading to inaccuracies within the protocol's accounting.

**Recommendation**: 

Do not cast the mentioned values to uint64.
