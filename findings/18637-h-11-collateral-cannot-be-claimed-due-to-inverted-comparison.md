---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/lending
protocol: "[[GMX]]"
auditors:
  - "[[IllIllI]]"
  - "[[berndartmueller]]"
  - "[[drdr]]"
  - "[[float-audits]]"
  - "[[joestakey]]"
  - "[[rvierdiiev]]"
  - "[[stopthecap]]"
report: "https://github.com/sherlock-audit/2023-02-gmx-judging"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
---
# H-11: Collateral cannot be claimed due to inverted comparison condition

- id: 18637
- impact: HIGH
- protocol: [[GMX]]
- reporter: IllIllI (Sherlock)
- source: N/A

## Summary


This bug report is about the issue H-11, which is related to Collateral not being able to be claimed due to an inverted comparison condition. This bug was found by IllIllI, berndartmueller, drdr, float-audits, joestakey, rvierdiiev, and stopthecap.

When a user tries to claim back the collateral given to them due to a capped price impacting them, the check that ensures that the amount claimed is less than the amount available has its condition inverted, meaning that the amount claimed needs to be more than the amount available for the user to be able to claim back the collateral. This means that the user will never be able to claim any of the collateral back, resulting in a principal loss.

This issue is not common, but still happens every couple of months due to large price gaps and liquidations. To fix the issue, all open positions need to be wound down and LPs need to withdraw their collateral, and the code needs to be re-deployed with the new code. The code snippet that is related to this issue is given in the report.

The recommendation to fix this issue is given in the report, which is to change the comparison condition in the code. The fix was implemented in a pull request in GitHub.

## Details

Source: https://github.com/sherlock-audit/2023-02-gmx-judging/issues/136 

## Found by 
IllIllI, berndartmueller, drdr, float-audits, joestakey, rvierdiiev, stopthecap

## Summary

Collateral given back to a user due to capped price impacts cannot be claimed due to inverted comparison condition


## Vulnerability Detail

The check that ensures that the amount claimed is less than the amount available has its condition inverted, i.e. requires that the amount claimed is more than the amount available.

## Impact

Since the claimed amount starts at zero, the user will never be able to claim any of this collateral back, which is a principal loss.

Needing to let users claim their collateral is mainly for when large liquidations cause there to be large impact amounts. While this is not an everyday occurrence, large price gaps and liquidations are a relatively common occurrence in crypto, happening every couple of months, so needing this functionality will be required in the near future. Fixing the issue would require winding down all open positions and requiring LPs to withdraw their collateral, and re-deploying with new code.


## Code Snippet

```solidity
// File: gmx-synthetics/contracts/market/MarketUtils.sol : MarketUtils.claimCollateral()   #1

627            uint256 claimableAmount = dataStore.getUint(Keys.claimableCollateralAmountKey(market, token, timeKey, account));
628            uint256 claimableFactor = dataStore.getUint(Keys.claimableCollateralFactorKey(market, token, timeKey, account));
629            uint256 claimedAmount = dataStore.getUint(Keys.claimedCollateralAmountKey(market, token, timeKey, account));
630    
631            uint256 adjustedClaimableAmount = Precision.applyFactor(claimableAmount, claimableFactor);
632 @>         if (adjustedClaimableAmount >= claimedAmount) {
633                revert CollateralAlreadyClaimed(adjustedClaimableAmount, claimedAmount);
634:           }
```
https://github.com/sherlock-audit/2023-02-gmx/blob/main/gmx-synthetics/contracts/market/MarketUtils.sol#L622-L644


## Tool used

Manual Review


## Recommendation

```diff
diff --git a/gmx-synthetics/contracts/market/MarketUtils.sol b/gmx-synthetics/contracts/market/MarketUtils.sol
index 7624b69..67b167c 100644
--- a/gmx-synthetics/contracts/market/MarketUtils.sol
+++ b/gmx-synthetics/contracts/market/MarketUtils.sol
@@ -629,7 +629,7 @@ library MarketUtils {
         uint256 claimedAmount = dataStore.getUint(Keys.claimedCollateralAmountKey(market, token, timeKey, account));
 
         uint256 adjustedClaimableAmount = Precision.applyFactor(claimableAmount, claimableFactor);
-        if (adjustedClaimableAmount >= claimedAmount) {
+        if (adjustedClaimableAmount <= claimedAmount) {
             revert CollateralAlreadyClaimed(adjustedClaimableAmount, claimedAmount);
         }
 
```




## Discussion

**xvi10**

Fix in https://github.com/gmx-io/gmx-synthetics/pull/70
