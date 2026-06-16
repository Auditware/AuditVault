---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/nft
protocol: "[[Fantium]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Fantium/Fantium/README.md#4-fantiumnftv1_owners-shadows-erc721upgradeable_owners"
genome:
  - "[[upgradeable-contract]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# `FantiumNFTV1._owners` shadows `ERC721Upgradeable._owners`

- id: 28052
- impact: HIGH
- protocol: [[Fantium]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Fantium/Fantium/README.md#4-fantiumnftv1_owners-shadows-erc721upgradeable_owners

## Summary


This bug report is about the FantiumNFTV1 contract, which has a `mapping(uint256 => address) internal _owners` line that shadows the ERC721Upgradeable `mapping(uint256 => address) private _owners`. This means that the `exists()` function will not work correctly because it is using the wrong mapping.

The recommended solution is to remove the FantiumNFTV1 `mapping(uint256 => address) internal _owners` line and use the `ERC721Upgradeable.ownerOf()` method instead. This will ensure that the `exists()` function works correctly.

## Details

##### Description

FantiumNFTV1 `mapping(uint256 => address) internal _owners` shadows ERC721Upgradeable `mapping(uint256 => address) private _owners`.

Thus, the `exists()` (https://github.com/metaxu-art/fantium-smart-contracts/blob/cb2d97bc30c40321991fe5ab8fc798babba1610f/contracts/FantiumNFTV1.sol#L245-L248) function will not work correctly:
```solidity
function exists(uint256 _tokenId) public view returns (bool) {
    return _owners[_tokenId] != address(0);
}
```

##### Recommendation

1. Remove the FantiumNFTV1 `mapping(uint256 => address) internal _owners` line. 
2. Use the `ERC721Upgradeable.ownerOf()` method.
