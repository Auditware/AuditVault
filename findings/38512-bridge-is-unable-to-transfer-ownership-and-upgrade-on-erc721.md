---
tags:
  - blockchain/starknet
  - lang/cairo
  - lang/rust
  - lang/solidity
  - sector/bridge
  - sector/nft
  - platform/codehawks
  - has/github
  - severity/high
  - vuln/dependency/upgradeable-contract
  - impact/privilege-escalation/ownership-transfer
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
protocol: "[[ArkProject NFT Bridge]]"
auditors:
  - "[[said017]]"
genome:
  - "[[upgradeable-contract]]"
  - "[[ownership-transfer]]"
  - "[[variant]]"
  - "[[upgrade-safety]]"
---
# `Bridge` is unable to transfer ownership and upgrade on `ERC721Bridgeable`

- id: 38512
- impact: HIGH
- protocol: [[ArkProject NFT Bridge]]
- reporter: said017 (Codehawks)
- source: N/A

## Summary


The report highlights a bug in the `Bridge` contract where it is unable to transfer ownership and upgrade on the `ERC721Bridgeable` contract. This means that the `Bridge` contract, which is supposed to be the owner of the `ERC721Bridgeable` contract, cannot change important settings or upgrade the contract on Layer 1. This can cause issues if the implementation of the `ERC721Bridgeable` contract needs to be changed or if the address of the `Bridge` contract on Layer 1 needs to be updated. The report recommends adding two new functions to the `Bridge` contract to address this issue.

## Details

## Summary

The admin function is missing in the contract `Bridge` to transfer ownership on `ERC721Bridgeable` or change the implementation address on `ERC721Bridgeable` proxy.

## Vulnerability Details

When an `ERC721Bridgeable` is deployed on L1, the bridge will be the owner of this contract. But, there is no way for the `bridge` to call admin functions on `ERC721Bridgeable`, like `transferOwnerShip`.

In other words, on L2, the bridge is able to change such critical states on the `erc721_bridgeable`. But, on L1, this is missing.

```rust
    #[abi(embed_v0)]
    impl BridgeCollectionAdminImpl of IStarklaneCollectionAdmin<ContractState> {
        fn collection_upgrade(ref self: ContractState, collection: ContractAddress, class_hash: ClassHash) {
            ensure_is_admin(@self);
            IUpgradeableDispatcher { contract_address: collection }
                .upgrade(class_hash);
        }

        // transfer owner of the given collection to the given address
        fn collection_transfer_ownership(ref self: ContractState, collection: ContractAddress, new_owner: ContractAddress) {
            ensure_is_admin(@self);
            IOwnableDispatcher { contract_address: collection }
                .transfer_ownership(new_owner);
        }
    }
```

<https://github.com/Cyfrin/2024-07-ark-project/blob/main/apps/blockchain/starknet/src/bridge.cairo#L367>

This can lead to some issues:

* If the implementation of `ERC721Bridgeable` proxy is going to be changed, its owner (which is the bridge) should call the function `upgradeToAndCall` on the `ERC721Bridgeable` proxy to update the implementation address. But, since the bridge does not have any function to be able to call `upgradeToAndCall` on the `ERC721Bridgeable` proxy, this will be impossible.
  <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/utils/UUPSUpgradeable.sol#L86>
* If the address of the bridge on L1 is going to be changed for any reason (it is a proxy structure, but if a new proxy is going to be deployed), there is no possibility that the old bridge changes the address of the owner of `ERC721Bridgeable` through `transferOwnerShip` to the new bridge proxy. So, all the already deployed `ERC721Bridgeable` will remain still owned by the old bridge. Or if, for any other reasons, the owner of an L1-collection is to be changed, there is not any straight forward way to do so.

Please note that `ERC721Bridgeable` is out-of-scope of this contest, but the issue is in the contract `bridge` that does not have any function to call admin functions on `ERC721Bridgeable`.

## Impact

* Bridge which is the owner of `ERC721Bridgeable` can not change ownership of `ERC721Bridgeable` or upgrade its implementation.

## Tools Used

## Recommendations

The following functions should be added to the `Bridge`.

```solidity
    function collectionTransferOwnership(address _collection, address _newOwner) external onlyOwner {
        IERC721(_collection).transferOwnership(_newOwner);
    }
    function collectionUpgrade(address _collection, address _newImplementation, bytes memory _data) external onlyOwner {
        IERC721(_collection).upgradeToAndCall(_newImplementation, _data);
    }
```
