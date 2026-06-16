---
tags:
  - lang/solidity
  - sector/bridge
  - platform/halborn
  - has/github
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Off-chain Bridge]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/RuneMine/off-chain-bridge-full-re-assessment"
genome:
  - "[[decimal-mismatch]]"
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
  - "[[token-decimal-normalization]]"
---
# Decimals Not Ignored in Amount Calculation

- id: 51761
- impact: HIGH
- protocol: Off-chain (Bridge) Full Re-Assessment
- reporter: Halborn
- source: https://www.halborn.com/audits/RuneMine/off-chain-bridge-full-re-assessment

## Summary


This bug report is about a problem with the current implementation of the Solana adapter. The adapter is not properly handling decimal places in amount calculations, which can lead to incorrect fee calculations and transfer amounts. This issue is specifically seen in the Bridge function of the adapter. The code does not take into account the decimal places of the token, resulting in incorrect calculations for tokens with different decimal places. The BVSS score for this bug is 10.0, which means it is a critical issue. The recommendation is to modify the amount calculation to account for decimal places. The RuneMine team has solved the issue by creating their own solution with matching decimals. The reference for this bug can be found in the adapter.go file on line 115. 

## Details

##### Description

The current implementation does not properly handle decimal places in amount calculations, potentially leading to incorrect fee calculations and transfer amounts.

In the **Bridge** function of the Solana adapter, the amount calculation does not account for the decimal places of the token. This can result in incorrect fee calculations and transfer amounts, especially for tokens with different decimal places.

  

```
fee := uint64(util.StringToInt(transfer.Amount)) * a.feePercent / 1_000
amountWithoutFee := uint64(util.StringToInt(transfer.Amount)) - fee
```

##### BVSS

[AO:A/AC:L/AX:L/C:L/I:N/A:N/D:H/Y:N/R:N/S:C (10.0)](/bvss?q=AO:A/AC:L/AX:L/C:L/I:N/A:N/D:H/Y:N/R:N/S:C)

##### Recommendation

Modify the amount calculation to account for these decimal places.

##### Remediation

**SOLVED:** The **RuneMine team** solved the issue by using created by them and their decimals match the runes ones.

##### References

[runemine/bridge/sol/adapter.go#L115](https://github.com/runemine/bridge/blob/58988baf85464c7e793743d9858cba8d091a82f6/sol/adapter.go#L115)
