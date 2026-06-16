---
tags:
  - lang/solidity
  - sector/dex
  - sector/nft
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/griefing
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Ajna Protocol]]"
auditors:
  - "[[ToonVH]]"
report: "https://code4rena.com/reports/2023-05-ajna"
genome:
  - "[[griefing]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[reward-accounting]]"
---
# [H-03] Position NFT can be spammed with insignificant positions by anyone until rewards DoS

- id: 20071
- impact: HIGH
- protocol: [[Ajna Protocol]]
- reporter: ToonVH (Code4rena)
- source: https://code4rena.com/reports/2023-05-ajna

## Summary


This bug report is about a method called PositionManager.memorializePositions(params_) which can be called by anyone and allows them to attach small (any value > 0) positions to any other person's positions NFT. This can lead to the storage array for a NFT with a given token ID being spammed with positions without the owner's consent. This can cause the rewards mechanism to fail for the NFT owner due to DoS (gas limit). It also means that the NFT cannot be burned as long as these insignificant positions are attached to it. 

A proof of concept was provided to demonstrate that insignificant positions can be attached by anyone. The recommended mitigation steps are to require that PositionManager.memorializePositions(params_) can only be called by the NFT owner or anyone who has approval, or to enforce a minimum position value to make this griefing attack unattractive.

## Details


<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/PositionManager.sol#L170-L216><br>
<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/PositionManager.sol#L466-L485>

The [PositionManager.memorializePositions(params\_)](https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/PositionManager.sol#L170-L216) method can be called by **anyone** (per design, see 3rd party test cases) and allows **insignificantly** small (any value > 0) positions to be attached to **anyone** else's positions NFT, see PoC. As a result, the `positionIndexes[params_.tokenId]` storage array for an NFT with given token ID can be spammed with positions without the NFT owner's consent.

Therefore, the [PositionManager.getPositionIndexesFiltered(tokenId\_)](https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/PositionManager.sol#L466-L485) method might exceed the block gas limit when iterating the `positionIndexes[tokenId_]` storage array. However, the [RewardsManager.calculateRewards(...)](https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/RewardsManager.sol#L325-L349) and [RewardsManager.\_calculateAndClaimRewards(...)](https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/RewardsManager.sol#L384-L414) methods rely on the aforementioned method to succeed in order to calculate and pay rewards.

All in all, a griefer can spam anyone's position NFT with insignificant positions until the rewards mechanism fails for the NFT owner due to DoS (gas limit). Side note: A position NFT also cannot be burned as long as such insignificant positions are attached to it, see [PositionManager.burn(...)](https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/PositionManager.sol#L142-L154).

### Proof of Concept

The following *diff* is based on the existing test case `testMemorializePositions` in `PositionManager.t.sol` and demonstrates that insignificant positions can be attached by anyone.

```diff
diff --git a/ajna-core/tests/forge/unit/PositionManager.t.sol b/ajna-core/tests/forge/unit/PositionManager.t.sol
index bf3aa40..56c85d1 100644
--- a/ajna-core/tests/forge/unit/PositionManager.t.sol
+++ b/ajna-core/tests/forge/unit/PositionManager.t.sol
@@ -122,6 +122,7 @@ contract PositionManagerERC20PoolTest is PositionManagerERC20PoolHelperContract
      */
     function testMemorializePositions() external {
         address testAddress = makeAddr("testAddress");
+        address otherAddress = makeAddr("otherAddress");
         uint256 mintAmount  = 10000 * 1e18;

         _mintQuoteAndApproveManagerTokens(testAddress, mintAmount);
@@ -134,17 +135,17 @@ contract PositionManagerERC20PoolTest is PositionManagerERC20PoolHelperContract

         _addInitialLiquidity({
             from:   testAddress,
-            amount: 3_000 * 1e18,
+            amount: 1, //3_000 * 1e18,
             index:  indexes[0]
         });
         _addInitialLiquidity({
             from:   testAddress,
-            amount: 3_000 * 1e18,
+            amount: 1, //3_000 * 1e18,
             index:  indexes[1]
         });
         _addInitialLiquidity({
             from:   testAddress,
-            amount: 3_000 * 1e18,
+            amount: 1, // 3_000 * 1e18,
             index:  indexes[2]
         });

@@ -165,17 +166,20 @@ contract PositionManagerERC20PoolTest is PositionManagerERC20PoolHelperContract

         // allow position manager to take ownership of the position
         uint256[] memory amounts = new uint256[](3);
-        amounts[0] = 3_000 * 1e18;
-        amounts[1] = 3_000 * 1e18;
-        amounts[2] = 3_000 * 1e18;
+        amounts[0] = 1; //3_000 * 1e18;
+        amounts[1] = 1; //3_000 * 1e18;
+        amounts[2] = 1; //3_000 * 1e18;
         _pool.increaseLPAllowance(address(_positionManager), indexes, amounts);

         // memorialize quote tokens into minted NFT
+        changePrank(otherAddress); // switch other address (not owner of NFT)
         vm.expectEmit(true, true, true, true);
-        emit TransferLP(testAddress, address(_positionManager), indexes, 9_000 * 1e18);
+        emit TransferLP(testAddress, address(_positionManager), indexes, 3 /*9_000 * 1e18*/);
         vm.expectEmit(true, true, true, true);
         emit MemorializePosition(testAddress, tokenId, indexes);
-        _positionManager.memorializePositions(memorializeParams);
+        _positionManager.memorializePositions(memorializeParams);  // switch back to test address (owner of NFT)
+        changePrank(testAddress);
+

         // check memorialization success
         uint256 positionAtPriceOneLP = _positionManager.getLP(tokenId, indexes[0]);

```

### Tools Used

VS Code, Foundry

### Recommended Mitigation Steps

Requiring that The [PositionManager.memorializePositions(params\_)](https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/PositionManager.sol#L170-L216) can only be called by the NFT owner or anyone who has approval would help but break the 3rd party test cases.

Alternatively, one could enforce a minimum position value to make this griefing attack extremely unattractive.

**[ith-harvey (Ajna) confirmed](https://github.com/code-423n4/2023-05-ajna-findings/issues/488#issuecomment-1554799142)**



***
