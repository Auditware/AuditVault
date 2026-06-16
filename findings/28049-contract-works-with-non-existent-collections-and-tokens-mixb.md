---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/nft
  - sector/nft-marketplace
protocol: "[[Fantium]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Fantium/Fantium/README.md#1-contract-works-with-non-existent-collections-and-tokens"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[royalty-edge-cases]]"
---
# Contract works with non-existent collections and tokens

- id: 28049
- impact: HIGH
- protocol: [[Fantium]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Fantium/Fantium/README.md#1-contract-works-with-non-existent-collections-and-tokens

## Summary


This bug report discusses an issue with the View methods (`getRoyalties()`, `tokenURI()`) in that they work with non-existent collections. This means that incorrect royalty is returned for a non-existent collection, and that athletes and Platform Manager can change parameters for non-existent collections. Additionally, a user can try to mint non-existent collections for free via `FantiumMinterV1.mint()` if `maxInvocations` is set.

The bug report recommends checking the existing `collectionId` and `tokenId` to prevent this issue. An example of a classical implementation is given, which involves using the `require` and `_requireMinted` functions to ensure that the token exists prior to accessing it.

## Details

##### Description
1. View methods (`getRoyalties()`, `tokenURI()`) work with non-existent collections.

In this example, incorrect royalty is returned for a non-existent collection:
```
await nftContract.getRoyalties(0);
## returns:
recipients: [
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    '0x0000000000000000000000000000000000000000'
]
bps: [
    BigNumber { value: "250" }, 
    BigNumber { value: "0" }
]
```

2. Athletes and Platform Manager can change parameters for non-existent collections. For example, function `updateCollectionAthleteAddress` (https://github.com/metaxu-art/fantium-smart-contracts/blob/cb2d97bc30c40321991fe5ab8fc798babba1610f/contracts/FantiumNFTV1.sol#L308).

3. A user can try to mint non-existent collections for free via `FantiumMinterV1.mint()` if `maxInvocations` is set. (https://github.com/metaxu-art/fantium-smart-contracts/blob/cb2d97bc30c40321991fe5ab8fc798babba1610f/contracts/FantiumMinterV1.sol#L241)

##### Recommendation
We recommend checking the existing `collectionId` and `tokenId`. An example of classical implementation:
```
require(_exists(tokenId), "Nonexistent token");
## or
function tokenURI(uint256 tokenId) public view virtual override
returns (string memory) {
    _requireMinted(tokenId);
    ...
}
```
