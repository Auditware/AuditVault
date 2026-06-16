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
  - "[[float-audits]]"
  - "[[rvierdiiev]]"
report: "https://github.com/sherlock-audit/2023-02-gmx-judging"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[access-roles]]"
  - "[[cross-contract-state-consistency]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# H-12: Fee receiver is given twice the amount of borrow fees it's owed

- id: 18638
- impact: HIGH
- protocol: [[GMX]]
- reporter: rvierdiiev (Sherlock)
- source: N/A

## Summary


This bug report is about an issue found in the code of the GMX Synthetics project on GitHub. The issue is that the fee receiver is given twice the amount of borrow fees it's owed, at the expense of the user's position. This is caused by the calculation of the total net cost of a position change double counting the portion of the fee related to how much the fee receiver gets of the fee of the borrowed amount. This means that the fee receiver gets twice the amount owed, and the user is charged twice what they should be for that portion of their order.

The bug was found by IllIllI, float-audits, and rvierdiiev through manual review. The code snippet that was used to identify the issue is included in the report. The code can be found in the file gmx-synthetics/contracts/pricing/PositionPricingUtils.sol at line 377-400.

The recommended fix for this issue is to update the code as seen in the code snippet. The fix was made in https://github.com/gmx-io/gmx-synthetics/commit/221d20776766123c8692882cc163809bf3ae311b.

Overall, this bug report is about an issue found in the code of the GMX Synthetics project on GitHub. The issue is that the fee receiver is given twice the amount of borrow fees it's owed, at the expense of the user's position. The bug was identified through manual review and a code snippet was included in the report. The recommended fix for this issue is to update the code as seen in the code snippet.

## Details

Source: https://github.com/sherlock-audit/2023-02-gmx-judging/issues/135 

## Found by 
IllIllI, float-audits, rvierdiiev

## Summary

The fee receiver is given twice the amount of borrow fees it's owed, at the expense of the user's position


## Vulnerability Detail

The calculation of the total net cost of a position change double counts the portion of the fee related to how much the fee receiver gets of the fee of the borrowed amount.


## Impact

The fee receiver gets twice the amount owed, and the user is charged twice what they should be for that portion of their order


## Code Snippet
`borrowingFeeAmount` contains both the amount for the pool and the amount for the fee receiver. The `totalNetCostAmount` calculation includes the full `borrowingFeeAmount` even though the `feeReceiverAmount` is also included, and already contains the `borrowingFeeAmountForFeeReceiver`
```solidity
// File: gmx-synthetics/contracts/pricing/PositionPricingUtils.sol : PositionPricingUtils.getPositionFees()   #1

377 @>         fees.borrowingFeeAmount = MarketUtils.getBorrowingFees(dataStore, position) / collateralTokenPrice.min;
378    
379            uint256 borrowingFeeReceiverFactor = dataStore.getUint(Keys.BORROWING_FEE_RECEIVER_FACTOR);
380            uint256 borrowingFeeAmountForFeeReceiver = Precision.applyFactor(fees.borrowingFeeAmount, borrowingFeeReceiverFactor);
381    
382 @>         fees.feeAmountForPool = fees.positionFeeAmountForPool + fees.borrowingFeeAmount - borrowingFeeAmountForFeeReceiver;
383 @>         fees.feeReceiverAmount += borrowingFeeAmountForFeeReceiver;
384    
385            int256 latestLongTokenFundingAmountPerSize = MarketUtils.getFundingAmountPerSize(dataStore, position.market(), longToken, position.isLong());
386            int256 latestShortTokenFundingAmountPerSize = MarketUtils.getFundingAmountPerSize(dataStore, position.market(), shortToken, position.isLong());
387    
388            fees.funding = getFundingFees(
389                position,
390                longToken,
391                shortToken,
392                latestLongTokenFundingAmountPerSize,
393                latestShortTokenFundingAmountPerSize
394            );
395    
396 @>         fees.totalNetCostAmount = fees.referral.affiliateRewardAmount + fees.feeReceiverAmount + fees.positionFeeAmountForPool + fees.funding.fundingFeeAmount + fees.borrowingFeeAmount;
397            fees.totalNetCostUsd = fees.totalNetCostAmount * collateralTokenPrice.max;
398    
399            return fees;
400:       }
```
https://github.com/sherlock-audit/2023-02-gmx/blob/main/gmx-synthetics/contracts/pricing/PositionPricingUtils.sol#L377-L400

## Tool used

Manual Review


## Recommendation

```diff
diff --git a/gmx-synthetics/contracts/pricing/PositionPricingUtils.sol b/gmx-synthetics/contracts/pricing/PositionPricingUtils.sol
index c274e48..30bd6a8 100644
--- a/gmx-synthetics/contracts/pricing/PositionPricingUtils.sol
+++ b/gmx-synthetics/contracts/pricing/PositionPricingUtils.sol
@@ -393,7 +393,7 @@ library PositionPricingUtils {
             latestShortTokenFundingAmountPerSize
         );
 
-        fees.totalNetCostAmount = fees.referral.affiliateRewardAmount + fees.feeReceiverAmount + fees.positionFeeAmountForPool + fees.funding.fundingFeeAmount + fees.borrowingFeeAmount;
+        fees.totalNetCostAmount = fees.referral.affiliateRewardAmount + fees.feeReceiverAmount + fees.feeAmountForPool + fees.funding.fundingFeeAmount;
         fees.totalNetCostUsd = fees.totalNetCostAmount * collateralTokenPrice.max;
 
         return fees;
```




## Discussion

**xvi10**

Fix in https://github.com/gmx-io/gmx-synthetics/commit/221d20776766123c8692882cc163809bf3ae311b
