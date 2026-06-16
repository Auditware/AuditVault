---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[RipIt]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/RipIt-security-review_2025-04-25.md"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[bridge-sender-auth]]"
  - "[[chainlink-round-completeness]]"
  - "[[dos-resistance]]"
  - "[[weak-randomness]]"
---
# [H-02] Insufficient restrictions in `instantOpenPacket()` risk DOS

- id: 62539
- impact: HIGH
- protocol: RipIt_2025-04-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[RipIt]]-security-review_2025-04-25.md

## Summary


This bug report discusses an issue with the `initiateBurn` function in the `Packet.sol` contract. When a user calls this function with `BurnType` set to `INSTANT_OPEN_PACKET`, it will call the `instantOpenPacket` function on the `CardAllocationPool` contract. However, there is a problem with the `selectRandomCards` function within this contract. If there is only one bundle left for a specific `packetType`, and two users call `initiateBurn` at the same time, the first user will receive their cards as intended but the second user will encounter a revert error and not receive their cards. This is because the `selectRandomCards` function will pop the only value from `availableCardBundles` and cause the transaction to fail. The report recommends adding checks in the `instantOpenPacket` function to prevent more requests from being made than the available bundles for a specific `packetType`. 

## Details


_Resolved_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

In `Packet.sol` a user can call `initiateBurn` with `params.BurnType` set to `BurnType.INSTANT_OPEN_PACKET`.
```solidity
        if (params.burnType == BurnType.INSTANT_OPEN_PACKET) {
            randomAllocationPool.instantOpenPacket(params.packetId, _packetTypeIds[params.packetId], msg.sender);
        }
```
This will result in the function calling `instantOpenPacket` on the `CardAllocationPool` contract. 

```solidity
    function instantOpenPacket(uint256 packetId, uint256 packetType, address owner) external {
        if (msg.sender != packetNFTAddress) revert UnauthorizedCaller();

        if (packetTypeToCardBundles[packetType].length == 0) revert InsufficientCardBundles();

        // Request randomness from Chainlink VRF
        uint256 requestId = requestRandomWords(packetType);

        requestIdToPacketOpen[requestId] =
            PacketOpenRequest({packetId: packetId, packetType: packetType, owner: owner, fulfilled: false});
```
The function will first check  that the msg.sender is in fact the `packetNFTAdress` next the logic ensures there is enough cardBundles of the specific type to fulfill the request otherwise the function will revert with `insufficientCardBundles`.
Finally a call to `requestRandomWords` is made and the `requestId` assigned. 

When the chainlink VRF finally delivers the random values, it will call `selectRandomCards` using the random values. 
```solidity
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal {
        PacketOpenRequest storage request = requestIdToPacketOpen[requestId];
        if (request.fulfilled) revert("Already fulfilled");

        // fetch the available card bundles
        CardBundle[] storage cardBundles = packetTypeToCardBundles[request.packetType];

        // Select random cards using the provided randomness
        uint256[] memory selectedCards = selectRandomCards(cardBundles, randomWords[0]);
```

This is where the issue begins...

```solidity
    function selectRandomCards(CardBundle[] storage availableCardBundles, uint256 randomSeed)
        private
        returns (uint256[] memory selectedCardBundle)
    {
        if (availableCardBundles.length == 0) {
            revert NoAvailableCardBundles();
        }
```
If `availableCardBundles.length` == 0 we will revert, this a problem, let me explain below.

1. 2 users call `initiateBurn` on `Packet.sol` with `BurnType` == `INSTANT_OPEN_PACKET` in the same block, both requests are of the same `packetType`.
2. Assume there is only 1 bundle left of the specific `packetType`, the checks in `instantOpenPacket` will pass for both users even if there is only 1 bundle left for the specific `packetType`.
3. Next both users will be assigned a `requestId` and will be waiting for chainlink to `fulfillRandomWords`
4. When `fulfillRandomWords` is called there is an internal call to `selectRandomCards` this function will pop the only value from `availableCardBundles`, user 1 will receive his cards as intended.
5. when `fulfillRandomWords` is called for user 2, there will be a revert in `fulfillRandomWords` subcall to `selectRandomCards` because `availableCardsBundles.length` will == 0 and thus revert the entire tx.
6. Since `fulfillRandomWords` reverts, this will cause the request to be dosed according to chainlink docs
> If your fulfillRandomWords() implementation reverts, the VRF service will not attempt to call it a second time. Make sure your contract logic does not revert. Consider simply storing the randomness and taking more complex follow-on actions in separate contract calls made by you, your users, or an Automation Node.

## Recommendations

Consider adding checks in `instantOpenPacket` to ensure more requests cannot be made than the amount of `cardBundles` available for a specific `packetType`.
