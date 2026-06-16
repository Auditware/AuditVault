---
tags:
  - lang/solidity
  - sector/restaking
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
protocol: "[[Karak]]"
auditors:
  - "[[20centclub]]"
report: "https://code4rena.com/reports/2024-07-karak"
genome:
  - "[[wrong-condition]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# [H-04] Violation of Invariant Allowing DSSs to Slash Unregistered Operators

- id: 41068
- impact: HIGH
- protocol: [[Karak]]
- reporter: 20centclub (Code4rena)
- source: https://code4rena.com/reports/2024-07-karak

## Summary


The bug report discusses an issue with the current implementation of a system where operators can allocate funds to different DSSs and choose which vaults to stake. The problem is that the system allows a DSS to slash an operator even after the operator has unregistered from the DSS, breaking one of the main rules. This can potentially lead to losses for new users who deposit into the DSS without knowing about the pending slash. The report suggests a fix to prevent operators from unregistering while there are pending slash requests. The issue has been fixed by the developers and confirmed by the mitigation reports.

## Details


Operators select DSSs to allocate their funds to, and for each DSS, they can choose a list of vaults to stake. The selected vaults are fully staked to the chosen DSS.

To unstake, the operator must adhere to a `MIN_STAKE_UPDATE_DELAY` of 9 days, which prevents front-running a slashing event. An operator can fully unregister from a DSS once all the vaults are unstaked. The DSS has the ability to slash any malicious behaviour that occurred before the withdrawal initiation for up to 7 days.

The problem is, the current implementation breaks one of the main invariants (confirmed by sponsors).

* [**Only DSSs an operator is registered with can slash said operator**](https://code4rena.com/audits/2024-07-karak-restaking#top:\~:text=Only%20DSSs%20an%20operator%20is%20registered%20with%20can%20slash%20said%20operator)

Consider the following scenario:

* Operator calls the [requestUpdateVaultStakeInDSS](https://github.com/code-423n4/2024-07-karak/blob/f5e52fdcb4c20c4318d532a9f08f7876e9afb321/src/Core.sol#L130) function to unstake Vault 1 from DSS, initiating the 9-day `MIN_STAKE_UPDATE_DELAY`.
* After 8 days, the DSS calls the [requestSlashing](https://github.com/code-423n4/2024-07-karak/blob/f5e52fdcb4c20c4318d532a9f08f7876e9afb321/src/Core.sol#L220) function on Operator’s Vault 1, starting the 2-day `SLASHING_VETO_WINDOW`.
* After 1 day, the operator calls the [finalizeUnstaking](https://github.com/code-423n4/2024-07-karak/blob/f5e52fdcb4c20c4318d532a9f08f7876e9afb321/src/Core.sol#L248C14-L248C30) function to finalize unstaking Vault 1 from DSS and the [unregisterOperatorFromDSS](https://github.com/code-423n4/2024-07-karak/blob/f5e52fdcb4c20c4318d532a9f08f7876e9afb321/src/Core.sol#L113C14-L113C39) function to unregister from DSS.
* After another day, the DSS (or anyone) calls the [finalizeSlashing](https://github.com/code-423n4/2024-07-karak/blob/f5e52fdcb4c20c4318d532a9f08f7876e9afb321/src/Core.sol#L248C14-L248C30) function to finalize the slash on the operator, who is no longer registered with the DSS.

### Proof Of Concept

```solidity
    function test_slash_unregistered_operator() public {
        // register operator to dss, deploy vaults, stake vaults to dss
        stake_vaults_to_dss();
        // check if operator is registered to dss
        assertEq(true, core.isOperatorRegisteredToDSS(operator, dss));
        // unstake vaults from dss
        address[] memory operatorVaults = core.fetchVaultsStakedInDSS(operator, dss);
        Operator.StakeUpdateRequest memory stakeUpdate =
            Operator.StakeUpdateRequest({vault: operatorVaults[0], dss: dss, toStake: false});
        Operator.StakeUpdateRequest memory stakeUpdate2 =
            Operator.StakeUpdateRequest({vault: operatorVaults[1], dss: dss, toStake: false});
        vm.startPrank(operator);
        Operator.QueuedStakeUpdate memory queuedStakeUpdate = core.requestUpdateVaultStakeInDSS(stakeUpdate);
        Operator.QueuedStakeUpdate memory queuedStakeUpdate2 = core.requestUpdateVaultStakeInDSS(stakeUpdate2);
        vm.stopPrank();
        skip(8 days);
        // dss request slashing
        uint96[] memory slashPercentagesWad = new uint96[](2);
        slashPercentagesWad[0] = uint96(10e18);
        slashPercentagesWad[1] = uint96(10e18);
        SlasherLib.SlashRequest memory slashingReq = SlasherLib.SlashRequest({
            operator: operator,
            slashPercentagesWad: slashPercentagesWad,
            vaults: operatorVaults
        });
        vm.startPrank(address(dss));
        SlasherLib.QueuedSlashing memory queuedSlashing = core.requestSlashing(slashingReq);
        vm.stopPrank();
        skip(1 days);
        vm.startPrank(operator);
        // finalize unstake and unregister operator from dss
        core.finalizeUpdateVaultStakeInDSS(queuedStakeUpdate);
        core.finalizeUpdateVaultStakeInDSS(queuedStakeUpdate2);
        core.unregisterOperatorFromDSS(dss, "");
        vm.stopPrank();
        skip(1 days);
        // check if operator is unregistered from dss
        assertEq(false, core.isOperatorRegisteredToDSS(operator, dss));
        // finalize slashing on unregistered operator
        core.finalizeSlashing(queuedSlashing);
    }
```

### Impact

The current implementation allows a DSS to finalize a slash on an operator even after the operator has unregistered from the DSS. This breaks the intended invariant that only DSSs an operator is registered with can slash that operator.

Additionally, new users depositing into the DSS may be unaware of the pending slash because the operator is no longer registered with the DSS, leading to a potential loss on deposits.

### Tools Used

*   Manual analysis
*   Foundry

### Recommendation

Consider implementing a check to prevent operators from unregistering from a DSS that has pending slashing requests on them. This will ensure that all slashing actions are finalized before an operator can fully unregister, thereby maintaining the intended invariant/design.

**[MiloTruck (judge) commented](https://github.com/code-423n4/2024-07-karak-findings/issues/4#issuecomment-2282771207):**
 > This issue demonstrates how if `requestSlashing()` was called in the last 2 days of a vault unstake request (ie. during `SLASHING_VETO_WINDOW`), `finalizeSlashing()` can be called on a vault even after its operator has unregistered the DSS with `unregisterOperatorFromDSS()`.
> 
> Given that this breaks one of the main invariants stated in the README, I believe high severity is appropriate.

**[devdks25 (Karak) commented](https://github.com/code-423n4/2024-07-karak-findings/issues/4#issuecomment-2284442197):**
 > Fixed.

**[MiloTruck (judge) commented](https://github.com/code-423n4/2024-07-karak-findings/issues/4#issuecomment-2295195355):**
 > There have been comments that this should be downgraded as the veto committee has the ability to stop it, but I disagree. Following this reasoning, all issues related to slashing can be downgraded to QA since the veto committee can simply stop all slashings-related bugs.
> 
> It's not clear when the veto committee will overturn a slashing and for what reasons, as such, we cannot assume this will be stopped by the committee. I think a fair assumption to make is the committee will overturn any slashings that are outright malicious, which isn't the case here.
> 
> This remains as high.

**[Karak mitigated](https://github.com/code-423n4/2024-09-karak-mitigation?tab=readme-ov-file#scope):**
> This mitigation validates the operator, vaults status in the finalizing slashing.

**Status:** Mitigation confirmed. Full details in reports from [sl1](https://github.com/code-423n4/2024-09-karak-mitigation-findings/issues/14) and [0xCiphky](https://github.com/code-423n4/2024-09-karak-mitigation-findings/issues/6).

***
