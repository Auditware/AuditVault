---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/nft
protocol: "[[Vibe]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Vibe/README.md#2-nftmintsalemultiple-wont-work-if-other-minter-mints-tokens-with-an-id-intersected-with-the-id-range-on-sale"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# `NFTMintSaleMultiple` won't work if other minter mints tokens with an id intersected with the id range on sale

- id: 27820
- impact: HIGH
- protocol: [[Vibe]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Vibe/README.md#2-nftmintsalemultiple-wont-work-if-other-minter-mints-tokens-with-an-id-intersected-with-the-id-range-on-sale

## Summary


This bug report is about a disruption in the functionality of the `NFTMintSaleMultiple` contract. When an external minter of `nft` mints a token with an id that falls within the range of ids specified for sale, the `buyNFT` function will fail to execute. The `nft.mintWithId(recipient, id)` call will revert due to the conflicting id. The recommendation is to allow the use of only `mint` or `mintWithId` in a specific instance of the VibeERC721 contract.

## Details

##### Description
If an external minter of `nft` mints a token with an id that falls within the range of ids specified for sale, the functionality of `NFTMintSaleMultiple` can be disrupted. When such an intersecting mint occurs, the `buyNFT` function will fail to execute as the `nft.mintWithId(recipient, id)` https://github.com/vibexyz/vibe-contract/blob/d08057edbaf83b00d94dcaca2a05e3c44a45e4d9/contracts/mint/NFTMintSaleMultiple.sol#L77 call will revert due to the conflicting id.

##### Recommendation
We recommend allowing to use only `mint` or `mintWithId` in a specific instance of the VibeERC721 contract.
