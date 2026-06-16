---
tags:
  - lang/solidity
  - sector/bridge
  - sector/nft
  - sector/nft-marketplace
  - platform/cantina
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - novelty/variant
protocol: "[[Sweep n Flip]]"
auditors:
  - "[[slowfi]]"
report: "https://cdn.cantina.xyz/reports/cantina_sweepnflip_bridge_november2024.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[bridge-sender-auth]]"
  - "[[dos-resistance]]"
  - "[[reentrancy-guard]]"
  - "[[royalty-edge-cases]]"
---
# Permanent failure to bridge wrapped ERC721 using Bridge::sendERC721UsingNative function 

- id: 46493
- impact: HIGH
- protocol: [[Sweep n Flip]]
- reporter: slowfi (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_sweepnflip_bridge_november2024.pdf

## Summary


Summary:

The Bridge.sol contract has a function called sendERC721UsingNative which is used to bridge ERC721 NFTs between different networks. However, due to an error in the implementation, the function only works for the original asset and not the wrapped asset. This means that the wrapped asset becomes permanently locked on the bridged chain. A proof of concept has been provided to demonstrate this vulnerability. The error occurs when trying to bridge from Polygon to ETH using both the original and wrapped NFT addresses. The error is caused by the function trying to access the token URI from the original asset instead of the wrapped asset. To fix this, the internal functions _getPayload and _getPayloadMessage need to be updated. The issue has been fixed in the snf-bridge-contracts-v1 PR 10, but the fixes have not been verified by the security team.

## Details

## Bridge.sol Vulnerability Overview

## Context
**File:** Bridge.sol  
**Line:** 159  

## Description
The `sendERC721UsingNative` function of `Bridge.sol` bridges ERC721 NFTs between multiple supported networks using LayerZero's message bridge. This function helps to bridge both the original asset (the unwrapped asset) and the wrapped asset. However, due to an implementation error, this function works only for the original asset and locks the wrapped asset on the bridged chain, making it unable to bridge.

This failure to bridge would permanently lock the original NFT in the source bridge contract.

## Proof of Concept
The vulnerability is demonstrated using the following foundry test code. To run it, copy it to the test file and execute:

```solidity
function test_e2e() external {
    vm.selectFork(forkIds[ETH]);
    deal(user, 100 ether);
    uint256[] memory tokenIds = new uint256[](2);
    tokenIds[0] = 1;
    tokenIds[1] = 2;
    vm.startPrank(user);
    testNft.setApprovalForAll(address(bridge[ETH]), true);
    vm.recordLogs();
    bridge[ETH].sendERC721UsingNative{value: 1 ether}(137, address(testNft), tokenIds);
    vm.stopPrank();
    lzHelper.help(lzEndpoint, forkIds[POLY], vm.getRecordedLogs());
    
    vm.selectFork(forkIds[POLY]);
    deal(user, 100 ether);
    address wrappedNft = bridge[POLY].getWERC721FromOriginERC721Address(address(testNft)).wrappedAddress;
    vm.prank(admin);
    bridge[POLY].setWrapperRoyalty(address(wrappedNft), treasure, 1, 1);
    vm.startPrank(user);
    ERC721(wrappedNft).setApprovalForAll(address(bridge[POLY]), true);
    vm.recordLogs();
    bridge[POLY].sendERC721UsingNative{value: 1 ether}(137, address(wrappedNft), tokenIds);
    vm.stopPrank();
    lzHelper.help(lzEndpoint, forkIds[ETH], vm.getRecordedLogs());
}
```

While trying to bridge from Polygon to ETH using both the `originalNft` and `wrappedNft` addresses, the following error occurred:

```
Bridge::sendERC721UsingNative{value: 1000000000000000000}(137, WERC721: [0x7731e5F9c2c4cD867510F83b54A3B93A9Ce16D5b], [1, 2]),
→ [246] ReentrancyGuard::_nonReentrantBefore()
← [980] Bridge::getEvmChainSettings(137, 0)
← <unknown>
[981] Bridge::getEvmChainSettings(137, 0)
← <unknown>
[981] Bridge::getEvmChainSettings(137, 0)
← <unknown>
[982] Bridge::getEvmChainSettings(137, 1)
← <unknown>
[603] Bridge::getWERC721FromOriginERC721Address(0xe0dBab467aaea6B2e33EbaD8fdAe07235242D566)
← <unknown>
[0] TestNft::tokenURI(1) [staticcall]
← [Stop]
← [Revert] EvmError: Revert
← [Revert] Contract 0xe0dBab467aaea6B2e33EbaD8fdAe07235242D566 does not exist on active fork with id `1`
But exists on non-active forks: `[0]`
```

Further analysis shows that the function reverts as it tries to access the token URI from the original asset on the bridged chain rather than the wrapped asset.

## Recommendation
To fix the above-mentioned error, the two internal functions `_getPayload` and `_getPayloadMessage` have to be updated as follows:

```solidity
function getPayload(
    uint256 evmChainId,
    address ERC721Address_,
    uint256[] memory tokensIds_
) internal view returns (IBaseAdapter.MessageSend memory) {
    // ...
    /// @dev if ERC721Address not wrapped, use the ERC721 address
    address currChainAddress_ = ERC721Wrapped.originAddress == address(0)
        ? ERC721Address
        : ERC721Wrapped.wrappedAddress;
    address originERC721Address = ERC721Wrapped.originAddress == address(0)
        ? ERC721Address
        : ERC721Wrapped.originAddress;
    // ...
    return getPayloadMessage(
        tokensIds_,
        currChainAddress_,
        originERC721Address_,
        originEvmChainId_,
        targetEvmChainSettings
    );
}

function getPayloadMessage(
    uint256[] memory tokensIds_,
    address currChainAddress_,
    address originERC721Address_,
    uint256 originEvmChainId_,
    IBridge.EvmChainSettings memory evmChainSettings_
) internal view returns (IBaseAdapter.MessageSend memory) {
    IERC721Metadata metadata = IERC721Metadata(currChainAddress);
    // ...
    uint256 royaltyPercentage = getRoyaltyPercentage(currChainAddress_);
    IBridge.ERC721Token memory tokenData = IBridge.ERC721Token({
        evmChainId: originEvmChainId,
        tokenAddress: originERC721Address_,
        name: metadata.name(),
        symbol: metadata.symbol(),
        royaltyPercentage: royaltyPercentage
    });
    // ...
}
```

## Additional Information
- **Sweep n' Flip:** Fixed in `snf-bridge-contracts-v1` PR 10.
- **Cantina Managed:** The security team has been unable to compile the codebase after introducing the fixes, so the fixes remain unverified.
