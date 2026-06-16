---
tags:
  - lang/solidity
  - sector/stable
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Devve]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-30-Devve.md"
genome:
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[token-decimal-normalization]]"
---
# Missing Decimals Conversion in `settleProjectOwnerFunds`

- id: 37616
- impact: HIGH
- protocol: [[Devve]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-30-Devve.md

## Summary


This bug report discusses a high severity issue in the `settleProjectOwnerFunds()` function in Treasury.sol. The issue has been resolved, but it is important for beginners to understand the cause and the recommended solution. The function does not correctly account for the decimal conversion of the `users.amount` when calculating `_amountToWithdraw`. This can result in incorrect fund settlements. The recommended solution is to ensure that the amount is properly converted to account for the decimals of the token, which typically involves multiplying by 10**6 for USDT. 

## Details

**Severity**: High

**Status**: Resolved

**Description**

The `settleProjectOwnerFunds()` function in Treasury.sol does not account for the decimal conversion of the `users.amount` when calculating `_amountToWithdraw`. This can lead to incorrect fund settlements

```solidity
File: treasury.sol
1178:     function settleProjectOwnerFunds(Whitelist memory users) external  {
..
1183:             uint _amountToWithdraw = users.amount ; 
```

**Recommendation**: 

Ensure that the amount is properly converted to account for the decimals of the token. For USDT, this typically means multiplying by 10**6 to adjust the decimal places correctly.
