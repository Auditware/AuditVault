---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/nft
protocol: "[[Cyan]]"
auditors:
  - "[[Jennifer Wu]]"
report: "https://certificate.quantstamp.com/full/cyan/5ef87add-ca0f-43eb-b6bb-758ec81a7e85/index.html"
genome:
  - "[[missing-owner-check]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Users Can Sell CryptoPunks They Do Not Own

- id: 59444
- impact: HIGH
- protocol: [[Cyan]]
- reporter: Jennifer Wu (Quantstamp)
- source: https://certificate.quantstamp.com/full/cyan/5ef87add-ca0f-43eb-b6bb-758ec81a7e85/index.html

## Summary


The client reported a bug where a seller could potentially lose their CryptoPunk when using the Cyan Marketplace. This was caused by a missing check in the code that verifies if the seller actually owns the CryptoPunk they are trying to sell. This allowed for an exploit where someone else could create and sign their own data for a private sale at a lower price, and steal the CryptoPunk from the original seller. The bug has now been fixed by adding a check to verify the seller's ownership of the CryptoPunk before the sale is completed.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `7013b81820420d8e555d8edc6948ab55570170e0`.

The client provided the following explanation: "Renamed Item->SaleItem for better code readability as well"

This issue is now fixed as it is enforced that the seller owns the punk.

**File(s) affected:**`CyanPrivateSales.sol`

**Description:** Prior to a seller listing a CryptoPunk on the Cyan Marketplace, the Punk must be offered for sale in one of two ways supported by the CryptoPunk smart contract; either allowing anyone to purchase the punk, or by allowing a specific address to purchase the punk.

`CyanPrivateSales.transferItem()` makes two seperate calls to the CryptoPunk contract during a buy, when the token is transferred from the seller to the buyer. First, `cryptoPunkContract.buyPunk{ value: 0 }(item.tokenId);` is invoked, which transfers the token from the seller to the `CyanPrivateSales` contract, then `cryptoPunkContract.transferPunk(to, item.tokenId);` is called to transfer the token to the buyer. This makes clear, that prior to selling the Punk on Cyan, the seller must invoke `offerPunkForSaleToAddress()` with a price of zero, and specifying the `CyanPrivateSales` contract as the sole purchaser.

`CyanPrivateSales.transferItem()` lacks a crucial check to enforce that the Punk being purchased, is actually held by the seller address. Since anyone can create and sign the data necessary for listing an item on Cyan, the following exploit can occur.

**Exploit Scenario:**

1.   Alice is planning to sell her CryptoPunk to Bob. Alice signs data for a private sale to Bob for an 100 ETH price.
2.   In preparation for the sale through Cyan, Alice invokes `offerPunkForSaleToAddress()`, specifying `minSalePriceInWei` to be zero, and `toAddress` to be `CyanPrivateSales`, on the CryptoPunk smart contrac.
3.   Eve observes this transaction, and creates and signs her own data for private sale to another address she owns, for the CryptoPunk that is not hers. Except, her price is substationally lower at `0.000001 ETH`. 
4.   As there is no verification that the seller actually holds the CryptoPunk, Eve has successfully stolen this Punk from Alice.

**Recommendation:** In `CyanPrivateSales.transferItem()`, check that `cryptoPunkContract.punkIndexToAddress(tokenId) == item.sellerAddress`.
