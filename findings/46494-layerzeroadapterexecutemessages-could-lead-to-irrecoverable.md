---
tags:
  - lang/solidity
  - sector/bridge
  - sector/nft
  - platform/cantina
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - trigger/cross-chain-message
  - novelty/variant
protocol: "[[Sweep n Flip]]"
auditors:
  - "[[slowfi]]"
report: "https://cdn.cantina.xyz/reports/cantina_sweepnflip_bridge_november2024.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[cross-chain-message]]"
  - "[[variant]]"
  - "[[bridge-message-validation]]"
  - "[[bridge-sender-auth]]"
  - "[[dos-resistance]]"
---
# LayerZeroAdapter::executeMessages could lead to irrecoverable state 

- id: 46494
- impact: HIGH
- protocol: [[Sweep n Flip]]
- reporter: slowfi (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_sweepnflip_bridge_november2024.pdf

## Summary


The LayerZeroAdapter.sol#L122 function in the bridge contract is not working properly. When a cross-chain message is received, it is supposed to be delivered to the Bridge.sol contract. However, if there is a failure, the message is stored in a variable called s_pendingMessagesToExecute and is supposed to be redelivered later. But there is a bug in the code where the wrong message is executed and the correct one is removed from the storage variable, causing irreversible damage. This could result in NFTs being permanently locked in the bridge contract and users losing their funds. A proof of concept has been provided to demonstrate this vulnerability. The recommended fix is to either allocate individual nonces to each message or execute the message from the last index in the storage variable. The bug has been fixed in two separate pull requests, but a new function introduced in the fix has created another critical vulnerability. This is considered a high-risk issue.

## Details

## LayerZeroAdapter.sol Vulnerability Report

## Context
**File:** LayerZeroAdapter.sol#L122

## Description
The `executeMessages` function executes stored payloads in `LayerZeroAdapter.sol`. Upon receiving a cross-chain message, the `LayerZeroAdapter.sol` tries to deliver it to the `Bridge.sol` contract. Any failure would result in storing the payload in the intermediary storage variable named `s_pendingMessagesToExecute`.

After storage, the `executeMessages` function tries to redeliver them to the `Bridge.sol` contract later. This function accepts a `limitToExecute_` parameter specifying the number of pending messages to execute. For example, if there are two messages stored in the `s_pendingMessagesToExecute` variable, specifying one will execute one of them.

However, the implementation has a flaw. The function executes a different message but pops a different one from the `s_pendingMessagesToExecute` storage variable, leading to an irrecoverable state. The impact of this issue will lead to permanent locking of NFTs in the bridge contract, which in turn would lead to the loss of user funds.

## Proof of Concept
The vulnerability mentioned above is demonstrated using the following proof of concept:

```solidity
function test_e2e_execute() external {
    vm.selector(forkIds[ETH]);
    deal(user, 100 ether);
    uint256[] memory tokenIds = new uint256[](2);
    tokenIds[0] = 1;
    tokenIds[1] = 2;
    vm.startPrank(user);
    testNft.setApprovalForAll(address(bridge[ETH]), true);
    vm.recordLogs();
    bridge[ETH].sendERC721UsingNative{ value: 1 ether }(137, address(testNft), tokenIds);
    vm.stopPrank();
    lzHelper.help(lzEndpoint, forkIds[POLY], vm.getRecordedLogs());
    vm.selectFork(forkIds[POLY]);
    deal(user, 400 ether);
    address wrappedNft = bridge[POLY].getWERC721FromOriginERC721Address(address(testNft)).wrappedAddress;
    vm.prank(admin);
    bridge[POLY].setWrapperRoyalty(address(wrappedNft), treasure, 1, 1);
    vm.startPrank(user);
    ERC721(wrappedNft).setApprovalForAll(address(bridge[POLY]), true);
    vm.recordLogs();
    uint256[] memory tokenIdsPoly = new uint256[](1);
    tokenIdsPoly[0] = 1;
    bridge[POLY].sendERC721UsingNative{ value: 200 ether }(1, address(wrappedNft), tokenIdsPoly);
    tokenIdsPoly[0] = 2;
    bridge[POLY].sendERC721UsingNative{ value: 200 ether }(1, address(wrappedNft), tokenIdsPoly);
    vm.stopPrank();
    lzHelper.help(lzEndpoint, forkIds[ETH], vm.getRecordedLogs());
    vm.selectFork(forkIds[ETH]);
    bytes4[] memory selector = new bytes4[](1);
    selector[0] = IBridge.receiveERC721.selector;
    vm.prank(admin);
    accessManagement[ETH].setTargetFunctionRole(address(bridge[ETH]), selector, 2);
    lzAdapter[ETH].executeMessages(1);
    lzAdapter[ETH].getPendingMessagesToExecuteCount();
    lzAdapter[ETH].executeMessages(1);
}
```

Upon investigation, it was found that the first `executeMessages` call executed the first stored message and transferred NFT ID: 1 to the user. Later, on the second call, it reverted as it again tried to transfer NFT ID: 1 to the user instead of 2. This happened because the initial `executeMessages` call popped the unused message from the pending queue.

## Recommendation
The current way of storing and executing messages is ambiguous, and a new approach of allocating individual nonces to unique pending messages and processing them later is suggested. However, another simple fix to the issue is to execute the message from the last index, as only the `pop()` operation on the array is natively supported by Solidity.

## Sweep n' Flip
Fixed on `snf-bridge-contracts-v1 PR 9` and `snf-bridge-contracts-v1 PR 13`.

## Cantina Managed
The fixes do not fully mitigate the issue. Moreover, the fixes introduced a new function (`LayerZeroAdapter.sol#L53`) leading to another critical vulnerability.
