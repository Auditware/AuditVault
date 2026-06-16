---
tags:
  - lang/rust
  - platform/hexens
  - has/github
  - severity/high
  - sector/staking
protocol: "[[Persistence]]"
auditors:
  - "[[Hexens]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-01-12-Persistence.md"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# [PRST-1] Division by zero in share conversion leads to panic and denial-of-service

- id: 53506
- impact: HIGH
- protocol: [[Persistence]]
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-01-12-Persistence.md

## Summary


This bug report describes a problem with two functions in the code that is used to convert one type of asset to another. The issue is that the functions do not check for a specific situation where the calculation would result in a division by zero. This can cause the program to crash and prevent users from being able to stake their assets. The suggested solution is to update the functions to handle this situation in the same way that another function in the code does. The bug has been fixed.

## Details

**Severity:** High

**Path:** x/liquidstake/types/liquidstake.go:NativeTokenToStkXPRT, StkXPRTToNativeToken#L167-L175

**Description:**

Both functions `NativeTokenToStkXPRT` and `StkXPRTToNativeToken` are used to convert `xprt` to `stkxprt` and vice versa. The conversion is based on the total net amount of assets and the stkXPRT total supply.

However, neither function checks whether the denominator is zero, nor is this check done when either function is called.

This becomes a problem in the `keeper.LiquidStake` function when the user deposits `xprt` for `stkxprt`. Here `NativeTokenToStkXPRT` is called to calculate the amount of `stkxprt`.

If the protocol is in a state where there are some stkXPRT shares but no net assets, then a division by zero will happen. This will cause the message to revert with a Go run-time panic. This would make staking not possible.

```
// NativeTokenToStkXPRT returns StkxprtTotalSupply * nativeTokenAmount / netAmount
func NativeTokenToStkXPRT(nativeTokenAmount, stkXPRTTotalSupplyAmount math.Int, netAmount math.LegacyDec) (stkXPRTAmount math.Int) {
	return math.LegacyNewDecFromInt(stkXPRTTotalSupplyAmount).MulTruncate(math.LegacyNewDecFromInt(nativeTokenAmount)).QuoTruncate(netAmount.TruncateDec()).TruncateInt()
}

// StkXPRTToNativeToken returns stkXPRTAmount * netAmount / StkxprtTotalSupply with truncations
func StkXPRTToNativeToken(stkXPRTAmount, stkXPRTTotalSupplyAmount math.Int, netAmount math.LegacyDec) (nativeTokenAmount math.LegacyDec) {
	return math.LegacyNewDecFromInt(stkXPRTAmount).MulTruncate(netAmount).Quo(math.LegacyNewDecFromInt(stkXPRTTotalSupplyAmount)).TruncateDec()
}
```

**Remediation:**  Both functions should correctly handle the case where the denominator is zero in the same was that `MintRate` is calculated in `GetNetAmountState`.

**Status:**  Fixed

- - -
