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
  - "[[hash]]"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
---
# User's can loose collateral when exiting a short

- id: 27476
- impact: HIGH
- protocol: [[DittoETH]]
- reporter: hash (Codehawks)
- source: N/A

## Summary


This bug report is about an issue where users can loose their collateral when exiting a short. This is considered a high risk vulnerability. The relevant GitHub links are <a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/ExitShortFacet.sol#L145-L224">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/ExitShortFacet.sol#L145-L224</a> and <a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/BidOrdersFacet.sol#L283-L294">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/BidOrdersFacet.sol#L283-L294</a>.

When a user calls the `exitShort` function, the ShortRecord is exited by placing a bid on the orderbook. If a partially filled ShortRecord matches with its own associated short order and fully buys back the debt, the user will loose the collateral present in the short order. This is because the user's newly added collateral from the partially filled short order is accounted in the same ShortRecord, leading to the user loosing the collateral when the ShortRecord is deleted.

An example scenario is provided to demonstrate the vulnerability. The proof-of-concept test is also provided along with code changes to test/Shorts.t.sol.

The impact of this vulnerability is that users will loose collateral. The recommendation is to check if the existing debt is equal to the previous debt before deleting the ShortRecord.

## Details

### Relevant GitHub Links
<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/ExitShortFacet.sol#L145-L224">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/ExitShortFacet.sol#L145-L224</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/BidOrdersFacet.sol#L283-L294">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/BidOrdersFacet.sol#L283-L294</a>


## Summary
In `exitShort`, the ShortRecord is exited by placing a bid on the orderbook. If a partially filled ShortRecord matches with its own associated short order and fully buys back the debt, the user will loose the collateral present in the short order.

## Vulnerability Details
If the user's own short order is matched when calling `exitShort`, the debt and collateral of the short order is added to the same ShortRecord that is being exited. If the user wanted to buyBack the entire debt and is successful in doing so, the ShortRecord will be deleted. 
```solidity
    function exitShort(
        address asset,
        uint8 id,
        uint88 buyBackAmount,
        uint80 price,
        uint16[] memory shortHintArray
    )
        external
        isNotFrozen(asset)
        nonReentrant
        onlyValidShortRecord(asset, msg.sender, id)
    {
        
       // more code

        // Create bid with current msg.sender
        (e.ethFilled, e.ercAmountLeft) = IDiamond(payable(address(this))).createForcedBid(
            msg.sender, e.asset, price, buyBackAmount, shortHintArray
        );

        e.ercFilled = buyBackAmount - e.ercAmountLeft;
        Asset.ercDebt -= e.ercFilled;
        s.assetUser[e.asset][msg.sender].ercEscrowed -= e.ercFilled;


        // @audit if the debt is fully filled, the short record is deleted
        // Refund the rest of the collateral if ercDebt is fully paid back
        if (e.ercDebt == e.ercFilled) {
            // Full Exit
            LibShortRecord.disburseCollateral(
                e.asset, msg.sender, e.collateral, short.zethYieldRate, short.updatedAt
            );
            LibShortRecord.deleteShortRecord(e.asset, msg.sender, id); // prevent re-entrancy
``` 
https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/ExitShortFacet.sol#L145-L224

Since the user's newly added collateral from the partially filled short order is accounted in this ShortRecord, it will lead to the user loosing the collateral.

```solidity
    function matchlowestSell(
        address asset,
        STypes.Order memory lowestSell,
        STypes.Order memory incomingBid,
        MTypes.Match memory matchTotal
    ) private {

            // more code

            // @audit if the short order is already associated with a shortRecord, the collateral and debt is accounted there
            if (lowestSell.shortRecordId > 0) {
                // shortRecord has been partially filled before
                LibShortRecord.fillShortRecord(
                    asset,
                    lowestSell.addr,
                    lowestSell.shortRecordId,
                    status,
                    shortFillEth,
                    fillErc,
                    matchTotal.ercDebtRate,
                    matchTotal.zethYieldRate
                );
```
https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/BidOrdersFacet.sol#L254-L294

### Example scenario:
1. User calls the `createLimitShort` function with `price = 2000` and `debt = 100`. Hence supplying `collateral = 5 * 2000 * 100`
2. Based on the current bids present in the orderbook, `50 ercTokens` is sold. 
3. This will create a ShortRecord with `debt = 50` and ` collateral = 3 * 2000 * 100` and a short order will be placed on the orderbook with `ercTokens amount = 50` and `price = 2000`.
4. After some time the user decides to completely exit the short. The user calls `exitShort()` with `buyBackAmount = 50` and `price = 2000`.
5. The lowest priced short order happens to be that of the user itself. Hence these two are matched resulting in the short order accounting for the new `collateral` and `debt` in the same ShortRecord.
`ShortRecord.debt += 50` and `ShortRecord.collateral += 3 * 2000 * 100`.
6. Since the enitre bid order is filled, `e.ercDebt == e.ercFilled` will pass, executing `LibShortRecord.deleteShortRecord(e.asset, msg.sender, id)`. This will delete the ShortRecord leading to the user not being able to claim his newly added `debt and collateral`. 

### POC Test
Add the following changes to test/Shorts.t.sol and run.
```diff
diff --git a/test/Shorts.t.sol b/test/Shorts.t.sol
index f1c3927..79c4d52 100644
--- a/test/Shorts.t.sol
+++ b/test/Shorts.t.sol
@@ -72,6 +72,51 @@ contract ShortsTest is OBFixture {
         );
     }
 
+    function test_userLoosesCollateralOnMatchingWithUsersOwnShort() public{
+        uint88 DEFAULT_AMOUNT_HALF = DEFAULT_AMOUNT/2;
+        
+        //funded inside fundLimitShortOpt
+        uint88 userVaultEthEscrowedInitial = SHORT1_PRICE.mulU80(DEFAULT_AMOUNT) * 5;
+
+        //bids fills half the short
+        fundLimitBidOpt(SHORT1_PRICE, DEFAULT_AMOUNT_HALF, receiver);
+        fundLimitShortOpt(SHORT1_PRICE, DEFAULT_AMOUNT, sender);
+
+        //after short creation funds are split for the short order and the collateral
+        assertEq(diamond.getVaultUserStruct(vault,sender).ethEscrowed,userVaultEthEscrowedInitial - SHORT1_PRICE.mulU80(DEFAULT_AMOUNT) * 5);
+        
+        STypes.Order memory userShortOrder = diamond.getShorts(asset)[0];
+
+        assertEq(userShortOrder.addr,sender);
+        assertEq(userShortOrder.ercAmount,DEFAULT_AMOUNT_HALF);
+
+        STypes.ShortRecord memory userShortRecord = diamond.getShortRecords(asset,sender)[0];
+
+        assertEq(
+            userShortRecord.ercDebt, DEFAULT_AMOUNT_HALF
+        );
+
+        assertEq(
+            userShortRecord.collateral,
+            SHORT1_PRICE.mulU80(DEFAULT_AMOUNT_HALF) * 6
+        );
+
+        //exit matching with the same short. this is supposed to move the funds from the short order to the short record. it does but since the record gets cancelled the user can no longer access these funds
+        vm.prank(sender);
+        uint16[] memory shortHintArray = new uint16[](1);
+        shortHintArray[0] = userShortOrder.id;
+
+        diamond.exitShort(asset,userShortRecord.id,userShortRecord.ercDebt,SHORT1_PRICE,shortHintArray);
+
+        //short order gets filled and short record gets cancelled
+        assertEq(diamond.getShorts(asset).length,0);
+        assertEq(diamond.getShortRecords(asset,sender).length,0);
+ 
+        // user now only has half of initial
+         assertEq(diamond.getVaultUserStruct(vault,sender).ethEscrowed,userVaultEthEscrowedInitial/2);
+        
+    }
+
     function prepareExitShort(uint8 exitType) public {
         makeShorts();
``` 

## Impact
Users will loose collateral

## Recommendation
Check if the existing debt is equal to the previous debt
```diff
diff --git a/contracts/facets/ExitShortFacet.sol b/contracts/facets/ExitShortFacet.sol
index 8c73c38..4dadd69 100644
--- a/contracts/facets/ExitShortFacet.sol
+++ b/contracts/facets/ExitShortFacet.sol
@@ -216,7 +216,7 @@ contract ExitShortFacet is Modifiers {
         s.assetUser[e.asset][msg.sender].ercEscrowed -= e.ercFilled;
 
         // Refund the rest of the collateral if ercDebt is fully paid back
-        if (e.ercDebt == e.ercFilled) {
+        if (e.ercDebt == e.ercFilled && short.ercDebt == e.ercDebt) {
             // Full Exit
             LibShortRecord.disburseCollateral(
                 e.asset, msg.sender, e.collateral, short.zethYieldRate, short.updatedAt

```
