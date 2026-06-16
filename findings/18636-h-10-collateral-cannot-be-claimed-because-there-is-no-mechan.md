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
report: "https://github.com/sherlock-audit/2023-02-gmx-judging"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
---
# H-10: Collateral cannot be claimed because there is no mechanism for the config keeper to change the claimable factor

- id: 18636
- impact: HIGH
- protocol: [[GMX]]
- reporter: berndartmueller (Sherlock)
- source: N/A

## Summary


This bug report is about an issue where a user cannot claim the collateral given back to them due to capped price impacts. This is because there is no mechanism for the config keeper to set the claimable factor. This means that the user will never be able to get their collateral back, leading to a principal loss. 

The code snippet provided shows that the claimable amount is adjusted by the claimable factor, however, there is no function to change the factor from the default of zero. This is a relatively common occurrence in crypto, happening every couple of months, so needing this functionality will be required in the near future. 

The code was manually reviewed and it was recommended to add a new allowedBaseKeys to the Config.sol file. This was done in a pull request on GitHub and was successfully fixed.

## Details

Source: https://github.com/sherlock-audit/2023-02-gmx-judging/issues/137 

## Found by 
IllIllI, berndartmueller

## Summary

Collateral given back to a user due to capped price impacts cannot be claimed because there is no mechanism for the config keeper to set the claimable factor

## Vulnerability Detail

The code that claims the collateral for the user only gives back a percentage of the collateral based on a "factor", but there is no function to change the factor from the default of zero.


## Impact

The user will never be able to claim any of this collateral back, which is a principal loss.

Needing to let users claim their collateral is mainly for when large liquidations cause there to be large impact amounts. While this is not an everyday occurrence, large price gaps and liquidations are a relatively common occurrence in crypto, happening every couple of months, so needing this functionality will be required in the near future. Fixing the issue would require winding down all open positions and requiring LPs to withdraw their collateral, and re-deploying with new code.


## Code Snippet

```solidity
// File: gmx-synthetics/contracts/market/MarketUtils.sol : MarketUtils.claimCollateral()   #1

627            uint256 claimableAmount = dataStore.getUint(Keys.claimableCollateralAmountKey(market, token, timeKey, account));
628 @>         uint256 claimableFactor = dataStore.getUint(Keys.claimableCollateralFactorKey(market, token, timeKey, account));
629            uint256 claimedAmount = dataStore.getUint(Keys.claimedCollateralAmountKey(market, token, timeKey, account));
630    
631 @>         uint256 adjustedClaimableAmount = Precision.applyFactor(claimableAmount, claimableFactor);
632 @>         if (adjustedClaimableAmount >= claimedAmount) {
633                revert CollateralAlreadyClaimed(adjustedClaimableAmount, claimedAmount);
634:           }
```
https://github.com/sherlock-audit/2023-02-gmx/blob/main/gmx-synthetics/contracts/market/MarketUtils.sol#L622-L644


## Tool used

Manual Review


## Recommendation

```diff
diff --git a/gmx-synthetics/contracts/config/Config.sol b/gmx-synthetics/contracts/config/Config.sol
index 9bb382c..7696eb6 100644
--- a/gmx-synthetics/contracts/config/Config.sol
+++ b/gmx-synthetics/contracts/config/Config.sol
@@ -232,6 +232,8 @@ contract Config is ReentrancyGuard, RoleModule, BasicMulticall {
         allowedBaseKeys[Keys.MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER] = true;
         allowedBaseKeys[Keys.MIN_COLLATERAL_USD] = true;
 
+        allowedBaseKeys[Keys.CLAIMABLE_COLLATERAL_FACTOR] = true;
+
         allowedBaseKeys[Keys.VIRTUAL_TOKEN_ID] = true;
         allowedBaseKeys[Keys.VIRTUAL_MARKET_ID] = true;
         allowedBaseKeys[Keys.VIRTUAL_INVENTORY_FOR_SWAPS] = true;
```




## Discussion

**xvi10**

Fix in https://github.com/gmx-io/gmx-synthetics/pull/112
