---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/dex
protocol: "[[Burve]]"
auditors:
  - v1c7
report: "https://github.com/sherlock-audit/2025-04-burve-judging"
genome:
  - "[[fee-accounting]]"
  - "[[fee-calculation]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# H-6: Fee Bypass in `ValueFacet.removeValueSingle`

- id: 56955
- impact: HIGH
- protocol: Burve
- reporter: v1c7 (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the `ValueFacet.removeValueSingle` function in the Burve protocol. The bug allows users to bypass the intended fee for withdrawing a single token, resulting in potential revenue loss for the protocol. The root cause of the bug is a variable being used before it is assigned, resulting in the incorrect calculation of the fee. The impact of this bug is the loss of 100% of the intended fees for every single-token withdrawal. The protocol team has fixed the issue in their code.

## Details

Source: https://github.com/sherlock-audit/2025-04-burve-judging/issues/311 

## Found by 
0L5S6W, 0x23r0, AshishLac, CodexBugmeNot, Cybrid, Egbe, JeRRy0422, Rhaydden, SecSnat, Sparrow\_Jac, TheCarrot, Tigerfrake, VinciGearHead, aman, anirruth\_, baz1ka, benjamin\_0923, bladeee, bretzel, curly11, elolpuer, future, gh0xt, heeze, holydevoti0n, imageAfrika, kom, m3dython, prosper, rsam\_eth, smartkelvin, v1c7, vangrim

### Summary

In the `ValueFacet.removeValueSingle` function, the local variable `removedBalance` is read (as `0`) when computing the real fee (`realTax`), allowing users to withdraw single‐token removals without ever paying the protocol fee. This results in a **complete bypass of the intended swap/remove fee**, leading to potential revenue loss.


### Root Cause

The function’s return variable `removedBalance` is declared but not yet assigned when used to compute `realTax`. The intent was to prorate the nominal fee (`nominalTax`) to “real” token units by computing  


```solidity
function removeValueSingle(
    address recipient,
    uint16 _closureId,
    uint128 value,
    uint128 bgtValue,
    address token,
    uint128 minReceive
) external nonReentrant returns (uint256 removedBalance) {
    …
    (uint256 removedNominal, uint256 nominalTax) = c.removeValueSingle(
        value,
        bgtValue,
        vid
    );
    uint256 realRemoved = AdjustorLib.toReal(token, removedNominal, false);
    Store.vertex(vid).withdraw(cid, realRemoved, false);
    // BUG: removedBalance is still zero here
    uint256 realTax = FullMath.mulDiv(
        removedBalance,        // ← should be realRemoved
        nominalTax,
        removedNominal
    );
    c.addEarnings(vid, realTax);
    removedBalance = realRemoved - realTax;
    require(removedBalance >= minReceive, PastSlippageBounds());
    TransferHelper.safeTransfer(token, recipient, removedBalance);
}
```
https://github.com/sherlock-audit/2025-04-burve/blob/main/Burve/src/multi/facets/ValueFacet.sol#L214-L245


```solidity
realTax = realRemoved * nominalTax  / removedNominal;
```
but instead `removedBalance` (zero) is used as the numerator, making `realTax == 0` always.




### Internal Pre-conditions

N/A

### External Pre-conditions

N/A

### Attack Path

N/A

### Impact

The protocol loses **100% of the intended fees** on every single‐token removal.


### PoC

_No response_

### Mitigation


Replace the incorrect use of `removedBalance` with `realRemoved` when computing `realTax`. Specifically:

```diff
-    uint256 realTax = FullMath.mulDiv(
-        removedBalance,
-        nominalTax,
-        removedNominal
-    );
+    // Compute the real‐world fee based on the actual tokens removed
+    uint256 realTax = FullMath.mulDiv(
+        realRemoved,
+        nominalTax,
+        removedNominal
+    );
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/itos-finance/Burve/commit/ca58c88be97e8f3f7a4617b171377d77fca52cdc
