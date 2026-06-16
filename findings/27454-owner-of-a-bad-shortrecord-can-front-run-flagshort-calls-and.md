---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - sector/token
  - platform/codehawks
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
protocol: "[[DittoETH]]"
auditors:
  - "[[hash]]"
genome:
  - "[[liquidation-logic]]"
  - "[[frontrun]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
---
# Owner of a bad ShortRecord can front-run flagShort calls AND liquidateSecondary and prevent liquidation

- id: 27454
- impact: HIGH
- protocol: [[DittoETH]]
- reporter: hash (Codehawks)
- source: N/A

## Summary


This bug report outlines a vulnerability in the Short Record (SR) system. The owner of a SR can mint an NFT to represent it and make it transferable, which allows them to front-run flagShort calls and liquidateSecondary attempts. This means that the owner of a bad ShortRecord can prevent liquidation and keep the dangerous position open, putting the protocol at risk.

To prove the concept, two tests were added to the ERC721Facet.t.sol file. The first test shows how Alice can front-run Bob's attempt to flag her short, and the second test shows how Alice can front-run Bob's attempt to liquidate her short. 

The recommended mitigation step is to add a check in LibShortRecord::transferShortRecord to ensure the Collateral Ratio (CR) is greater than the primaryLiquidationCR. This would ensure that users must make their position healthy before being allowed to transfer it.

## Details

### Relevant GitHub Links
<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/main/contracts/facets/MarginCallPrimaryFacet.sol#L47">https://github.com/Cyfrin/2023-09-ditto/blob/main/contracts/facets/MarginCallPrimaryFacet.sol#L47</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/AppStorage.sol#L101">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/AppStorage.sol#L101</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/ERC721Facet.sol#L162C17-L162C17">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/ERC721Facet.sol#L162C17-L162C17</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L132">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L132</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L224C10-L224C10">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L224C10-L224C10</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L47C9-L47C9">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L47C9-L47C9</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallSecondaryFacet.sol#L64C25-L64C25">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallSecondaryFacet.sol#L64C25-L64C25</a>


## Summary

A shorter can keep a unhealthy short position open by minting an NFT of it and front-running attempts to liquidate it with a transfer of this NFT (which transfers the short position to the new owner)

## Vulnerability Details

A Short Record (SR) is a struct representing a short position that has been opened by a user.
It holds different informations, such as how much collateral is backing the short, and how much debt it owe (this ratio is called Collateral Ratio or CR)
At any time, any user can flag someone's else SR as "dangerous", if its debt grows too much compared to its collateral.
This operation is accessible through `MarginCallPrimaryFacet::flagShort`, [which check through the `onlyValidShortRecord` modifier](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L47C9-L47C9)  that the [SR isn't `Cancelled`]((https://github.com/Cyfrin/2023-09-ditto/blob/main/contracts/facets/MarginCallPrimaryFacet.sol#L47))
If the SR is valid, then its debt/collateral ratio is verified, and if its below a specific threshold, flagged.
But that also means that if a SR is considered invalid, it cannot be flagged.
And it seems there is a way for the owner of a SR to cancel its SR while still holding the position.

The owner of a SR can mint an NFT to represent it and make it transferable.
This is done in 5 steps:
1) `TransferFrom` verify usual stuff regarding the NFT (ownership, allowance, valid receiver...)
2) `LibShortRecord::transferShortRecord` [is called](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/ERC721Facet.sol#L162C17-L162C17)
3) [`transferShortRecord` verify](https://github.com/Cyfrin/2023-09-ditto/blob/main/contracts/facets/MarginCallPrimaryFacet.sol#L47) that SR [is not `flagged` nor `Cancelled`](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/AppStorage.sol#L101)
4) SR is [deleted](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L132) ([setting its status](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L224C10-L224C10) to `Cancelled`)
5) a new SR is created with same parameters, but owned by the receiver.

Now, let's see what would happen if Alice has a SR_1 with a bad CR, and Bob tries to flag it.

1. Bob calls `flagShort`on SR_1, the tx is sent to the mempool

Alice is watching the mempool, and don't want her SR to be flagged:

2. She front-run Bob's tx with a transfer of her SR_1 to another of the addresses she controls

Now Bob's tx will be executed after Alice's tx:

3) The SR_1 is "deleted" and its status set to `Cancelled`
4) Bob's tx is executed, and `flagShort` reverts because of the [`onlyValidShortRecord`](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L47C9-L47C9)
5) Alice can do this trick again to keep here undercol SR until it can become dangerous

But this is not over:

6) Even when her CR drops dangerously (CR<1.5), `liquidateSecondary` is also DoS'd as it has [the same check](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallSecondaryFacet.sol#L64C25-L64C25) for `SR.Cancelled` 

## Impact

Because of this, a shorter could maintain the dangerous position (or multiple dangerous positions), while putting the protocol at risk.

## Proof of Concept

Add these tests to `ERC721Facet.t.sol` :

#### Front-running flag
```solidity
	function test_audit_frontrunFlagShort() public {
		address alice = makeAddr("Alice"); //Alice will front-run Bob's attempt to flag her short
		address aliceSecondAddr = makeAddr("AliceSecondAddr");
		address bob = makeAddr("Bob"); //Bob will try to flag Alice's short 
		address randomUser = makeAddr("randomUser"); //regular user who created a bid order
		
		//A random user create a bid, Alice create a short, which will match with the user's bid
		fundLimitBidOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, randomUser);
		fundLimitShortOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, alice);
		//Alice then mint the NFT associated to the SR so that it can be transfered
		vm.prank(alice);
		diamond.mintNFT(asset, Constants.SHORT_STARTING_ID);

		//ETH price drops from 4000 to 2666, making Alice's short flaggable because its < LibAsset.primaryLiquidationCR(asset)
		setETH(2666 ether);
		
		// Alice saw Bob attempt to flag her short, so she front-run him and transfer the SR
		vm.prank(alice);
		diamond.transferFrom(alice, aliceSecondAddr, 1);
		
		//Bob's attempt revert because the transfer of the short by Alice change the short status to SR.Cancelled
		vm.prank(bob);
		vm.expectRevert(Errors.InvalidShortId.selector);
		diamond.flagShort(asset, alice, Constants.SHORT_STARTING_ID, Constants.HEAD);
	}	
```

#### Front-running liquidateSecondary
```solidity
    function test_audit_frontrunPreventFlagAndSecondaryLiquidation() public {
		address alice = makeAddr("Alice"); //Alice will front-run Bob's attempt to flag her short
		address aliceSecondAddr = makeAddr("AliceSecondAddr");
		address aliceThirdAddr = makeAddr("AliceThirdAddr");
		address bob = makeAddr("Bob"); //Bob will try to flag Alice's short 
		address randomUser = makeAddr("randomUser"); //regular user who created a bid order
		
		//A random user create a bid, Alice create a short, which will match with the user's bid
        fundLimitBidOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, randomUser);
		fundLimitShortOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, alice);
		//Alice then mint the NFT associated to the SR so that it can be transfered
		vm.prank(alice);
        diamond.mintNFT(asset, Constants.SHORT_STARTING_ID);

        //set cRatio below 1.1
        setETH(700 ether);
		
		//Alice is still blocking all attempts to flag her short by transfering it to her secondary address by front-running Bob
        vm.prank(alice);
        diamond.transferFrom(alice, aliceSecondAddr, 1);
		vm.prank(bob);
		vm.expectRevert(Errors.InvalidShortId.selector);
		diamond.flagShort(asset, alice, Constants.SHORT_STARTING_ID, Constants.HEAD);

		//Alice  front-run (again...) Bob and transfers the NFT to a third address she owns
		vm.prank(aliceSecondAddr);
        diamond.transferFrom(aliceSecondAddr, aliceThirdAddr, 1);

		//Bob's try again on the new address, but its attempt revert because the transfer of the short by Alice change the short status to SR.Cancelled
		STypes.ShortRecord memory shortRecord = getShortRecord(aliceSecondAddr, Constants.SHORT_STARTING_ID);
		depositUsd(bob, shortRecord.ercDebt);
        vm.expectRevert(Errors.MarginCallSecondaryNoValidShorts.selector);
		liquidateErcEscrowed(aliceSecondAddr, Constants.SHORT_STARTING_ID, DEFAULT_AMOUNT, bob);
    }
```

## Tools Used

Manual review

## Recommended Mitigation Steps

SR with a bad CR shouldn't be transferable, the user should first make its position healthy before being allowed to transfer it.
I suggest to add a check in `LibShortRecord::transferShortRecord` to ensure `CR > primaryLiquidationCR

```shell
diff --git a/contracts/libraries/LibShortRecord.sol b/contracts/libraries/LibShortRecord.sol
index 7c5ecc3..8fad274 100644
--- a/contracts/libraries/LibShortRecord.sol
+++ b/contracts/libraries/LibShortRecord.sol
@@ -15,6 +15,7 @@ import {LibOracle} from "contracts/libraries/LibOracle.sol";
 // import {console} from "contracts/libraries/console.sol";

 library LibShortRecord {
+    using LibShortRecord for STypes.ShortRecord;
     using U256 for uint256;
     using U88 for uint88;
     using U80 for uint80;

@@ -124,10 +125,16 @@ library LibShortRecord {
         uint40 tokenId,
         STypes.NFT memory nft
     ) internal {

+        AppStorage storage s = appStorage();
         STypes.ShortRecord storage short = s.shortRecords[asset][from][nft.shortRecordId];
         if (short.status == SR.Cancelled) revert Errors.OriginalShortRecordCancelled();
         if (short.flaggerId != 0) revert Errors.CannotTransferFlaggedShort();
+               if (
+                       short.getCollateralRatioSpotPrice(LibOracle.getSavedOrSpotOraclePrice(asset))
+                               < LibAsset.primaryLiquidationCR(asset)
+        ) {
+            revert Errors.InsufficientCollateral();
+        }

         deleteShortRecord(asset, from, nft.shortRecordId);

```
