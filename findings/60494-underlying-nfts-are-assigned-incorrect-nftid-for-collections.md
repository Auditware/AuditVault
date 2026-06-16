---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/nft
  - sector/nft-lending
  - sector/staking
protocol: "[[NiftyApes]]"
auditors:
  - "[[Michael Boyle]]"
report: "https://certificate.quantstamp.com/full/nifty-apes-seller-financing/edbc671f-08c9-44ab-b24c-c3807c9ef43d/index.html"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[vote-delegation-loop]]"
---
# Underlying NFTs are Assigned Incorrect `nftId` for Collections

- id: 60494
- impact: HIGH
- protocol: [[NiftyApes]] - Seller Financing
- reporter: Michael Boyle (Quantstamp)
- source: https://certificate.quantstamp.com/full/nifty-apes-seller-financing/edbc671f-08c9-44ab-b24c-c3807c9ef43d/index.html

## Summary


The client has marked a bug in the code as "Fixed". The bug is in the `SellerFinancing.sol` file and specifically in the `_createLoan()` function. When financing collection offers, the `nftId` is incorrectly assigned for both the buyer and seller's underlying NFT. This is because the `offer.nftId` value, which is used to indicate the entire collection, is assigned instead of the individual NFT that is being purchased. This could cause issues with delegate.cash functionality if the buyer transfers their ticket. The recommendation is to make sure that the correct `nftId` is assigned to the underlying NFT.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `cf0c09a0c59961622a93ea527023538e91df8358`. The client provided the following explanation: Specify nftId for underlying nft in `_createLoan()`.

**File(s) affected:**`SellerFinancing.sol`

**Description:**`_createLoan()` incorrectly assigns the `nftId` of both the `buyerUnderlyingNFT` and `sellerUnderlyingNFT` when financing collection offers. Collection offers have the `offer.nftId` value assigned as `~uint256(0)`, which is used to denote that the offer exists for the entire collection instead of an individual NFT. When buying from a collection offer, the buyer specifies the individual NFT they are purchasing in `nftId` field in `buyWithFinancing()`. However, the individual `nftId` is not assigned to the buyer and seller's underlying NFT, rather the `offer.nftId` is, which would be the maximum value for a `uint256`.

This incorrect assignment would break the delegate.cash functionality if a buyer transfers their ticket, as delegate.cash would be attempting to delegate an NFT that does not exist.

**Recommendation:** Ensure that the underlying NFT is assigned the `nftId` of the NFT that is being purchased.
