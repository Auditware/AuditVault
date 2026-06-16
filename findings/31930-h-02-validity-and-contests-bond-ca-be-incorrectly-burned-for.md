---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/staking
  - sector/zk
protocol: "[[Taiko]]"
auditors:
  - "[[monrel]]"
report: "https://code4rena.com/reports/2024-03-taiko"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# [H-02] Validity and contests bond ca be incorrectly burned for the correct and ultimately verified transition

- id: 31930
- impact: HIGH
- protocol: [[Taiko]]
- reporter: monrel (Code4rena)
- source: https://code4rena.com/reports/2024-03-taiko

## Summary


This bug report is about a potential issue in the Taiko protocol's LibProving and LibVerifying contracts. It describes a scenario where both validity and contests bonds can be wrongfully slashed, even if the transition is ultimately proven to be correct. This is due to the fact that the history of the final verified transition is not taken into account. The report provides two examples of this happening and includes code snippets to demonstrate the issue. The recommended mitigation steps suggest allowing the guardian to pay back validity and contest bonds in the same way as liveness bonds, and not recovering any reward when the guardian proves a block. The severity of this bug is considered medium, but the team behind Taiko has acknowledged the issue and has plans to address it. 

## Details


<https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L1/libs/LibProving.sol#L387-L392> 

<https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L1/libs/LibProving.sol#L189-L199> 

<https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L1/libs/LibVerifying.sol#L178-L189>

Both validity and contests bonds can be wrongfully slashed even if the transition ends up being the correct and verified one.

The issue comes from the fact that the history of the final verified transition is not taken into account.

Example 1: Validity bond is wrongfully burned:

1.  Bob Proves transition T1 for parent P1
2.  Alice contests and proves T2 for parent P1 with higher tier proof.
3.  Guardians steps in to correctly prove T1 for parent P2.

At step 2 Bob loses his bond and is permanentley written out of the history of P1 <br><https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L1/libs/LibProving.sol#L387-L392>

```solidity
    _ts.validityBond = _tier.validityBond; 
    _ts.contestBond = 1; 
    _ts.contester = address(0);
    _ts.prover = msg.sender;
    _ts.tier = _proof.tier; 
```

Example 2: Contest bond wrongfully slashed:

1.  Alice proves T1 for parent P1 with SGX
2.  Bob contests T1 for parent P1
3.  Alice proves T1 with SGX_ZK parent P1
4.  Guardian steps in to correctly disprove T1 with T2 for parent P1

Bob was correct and T1 was ultimately proven false. Bob still loses his contest bond.

When the guardian overrides the proof they can not pay back Bob's validity or contesting bond. They are only able to pay back a liveness bond <br><https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L1/libs/LibProving.sol#L189-L199>

```solidity
if (isTopTier) { 
	// A special return value from the top tier prover can signal this
	// contract to return all liveness bond.
	bool returnLivenessBond = blk.livenessBond > 0 && _proof.data.length == 32
		&& bytes32(_proof.data) == RETURN_LIVENESS_BOND;

	if (returnLivenessBond) {
		tko.transfer(blk.assignedProver, blk.livenessBond);
		blk.livenessBond = 0;
	} 
}
```

These funds are now frozen since they are sent to the Guardian contract which has no ability to recover them.

<https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L1/libs/LibVerifying.sol#L178-L189>

```solidity
                uint256 bondToReturn = uint256(ts.validityBond) + blk.livenessBond;

                if (ts.prover != blk.assignedProver) {
                    bondToReturn -= blk.livenessBond >> 1;
                }

                IERC20 tko = IERC20(_resolver.resolve("taiko_token", false));
                tko.transfer(ts.prover, bondToReturn)
```

`ts.prover` will be the Guardian since they are the last to prove the block

### Proof of Concept

POC for example 1. Paste the below code into the `TaikoL1LibProvingWithTiers.t` file and run `forge test --match-test testProverLoss -vv`

<details>

```solidity

    function testProverLoss() external{
        giveEthAndTko(Alice, 1e7 ether, 1000 ether);
        giveEthAndTko(Carol, 1e7 ether, 1000 ether);
        giveEthAndTko(Bob, 1e6 ether, 100 ether);
        console2.log("Bob balance:", tko.balanceOf(Bob));
        uint256 bobBalanceBefore = tko.balanceOf(Bob);
        vm.prank(Bob, Bob);

        bytes32 parentHash = GENESIS_BLOCK_HASH;
        uint256 blockId = 1;
        
        (TaikoData.BlockMetadata memory meta,) = proposeBlock(Alice, Bob, 1_000_000, 1024);

        console2.log("Bob balance After propose:", tko.balanceOf(Bob));
        mine(1);

        bytes32 blockHash = bytes32(1e10 + blockId);
        bytes32 stateRoot = bytes32(1e9 + blockId);

        (, TaikoData.SlotB memory b) = L1.getStateVariables();
        uint64 lastVerifiedBlockBefore = b.lastVerifiedBlockId;

        // Bob proves transition T1 for parent P1
        proveBlock(Bob, Bob, meta, parentHash, blockHash, stateRoot, meta.minTier, "");
        console2.log("Bob balance After proof:", tko.balanceOf(Bob));

        uint16 minTier = meta.minTier;

        // Higher Tier contests by proving transition T2 for same parent P1
        proveHigherTierProof(meta, parentHash, bytes32(uint256(1)), bytes32(uint256(1)), minTier);

        // Guardian steps in to prove T1 is correct transition for parent P1
        proveBlock(
            David, David, meta, parentHash, blockHash, stateRoot, LibTiers.TIER_GUARDIAN, ""
        );

        vm.roll(block.number + 15 * 12);

        vm.warp(
            block.timestamp + tierProvider().getTier(LibTiers.TIER_GUARDIAN).cooldownWindow * 60
                + 1
        );

        vm.roll(block.number + 15 * 12);
        vm.warp(
            block.timestamp + tierProvider().getTier(LibTiers.TIER_GUARDIAN).cooldownWindow * 60
                + 1
        );

        // When the correct transition T1 is verified Bob does permantley loses his validitybond
        // even though it is the correct transition for the verified parent P1.
        verifyBlock(Carol, 1);
        parentHash = blockHash;

        (, b) = L1.getStateVariables();
        uint64 lastVerifiedBlockAfter = b.lastVerifiedBlockId;
        assertEq(lastVerifiedBlockAfter, lastVerifiedBlockBefore + 1 ); // Verification completed

        uint256 bobBalanceAfter = tko.balanceOf(Bob);
        assertLt(bobBalanceAfter, bobBalanceBefore);

        console2.log("Bob Loss:", bobBalanceBefore - bobBalanceAfter);
        console2.log("Bob Loss without couting livenessbond:", bobBalanceBefore - bobBalanceAfter - 1e18); // Liveness bond is 1 ETH in tests
    }

```
</details>

### Tools Used

Foundry, VScode

### Recommended Mitigation Steps

The simplest solution is to allow the guardian to pay back validity and contest bonds in the same manner as for liveness bonds. This keeps the simple design while allowing bonds to be recovered if a prover or contesters action is ultimately proven correct.

Guardian will pass in data in `_proof.data` that specifies the address, tiers and bond type that should be refunded. Given that Guardians already can verify any proof this does not increase centralization.

We also need to not to not recover any reward when we prove with Guardian and `_overrideWithHigherProof()` is called. If the `ts.validityBond` reward is sent to the Guardian it will be locked. Instead we need to keep it in TaikoL1 such that it can be recovered as described above

```diff
+if (_tier.contestBond != 0){
	unchecked {
		if (reward > _tier.validityBond) {
			_tko.transfer(msg.sender, reward - _tier.validityBond);
		} else {
			_tko.transferFrom(msg.sender, address(this), _tier.validityBond - reward);
		}
	}
+}
```

**[dantaik (Taiko) commented](https://github.com/code-423n4/2024-03-taiko-findings/issues/266#issuecomment-2033385962):**
 > This is a valid report but we knew this "flaw" and the current behavior is by design.
> 
> - The odd that a valid transition is proven, then contested and overwritten by another proof, then proven again with even a higher tier should be rare, if this happens even once, we should know the second prover is buggy and shall change the tier configuration to remove it.
> - For provers who suffer a loss due to such prover bugs, Taiko foundation may send them compensation to cover there loss. We do not want to handle cover-your-loss payment in the protocol.

**[adaki2004 (Taiko) confirmed, but disagreed with severity and commented](https://github.com/code-423n4/2024-03-taiko-findings/issues/266#issuecomment-2033985576):**
> This is an attack on the tier system, right ? But the economical disincentives doing so shall be granted by the bonds - not to challenge proofs which we do know are correct, just to make someone lose money as there is no advantage. The challenger would lose even more money - and the correct prover would be refunded by Taiko Foundation.
>
 > Severity: medium, (just as: https://github.com/code-423n4/2024-03-taiko-findings/issues/227)


**[0xean (Judge) commented](https://github.com/code-423n4/2024-03-taiko-findings/issues/266#issuecomment-2045155377):**
 > I am going to leave as H, I think there is a direct loss of funds here.  
> 
> This comment:
> 
> > The challenger would lose even more money 
> 
> Makes me second guess that slightly, but still think H is correct.

***
