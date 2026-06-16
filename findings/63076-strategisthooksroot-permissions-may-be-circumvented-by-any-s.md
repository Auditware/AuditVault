---
tags:
  - lang/solidity
  - sector/token
  - sector/vault
  - platform/spearbit
  - has/github
  - severity/high
  - impact/privilege-escalation/role-bypass
protocol: "[[Superform]]"
auditors:
  - "[[MiloTruck]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[bridge-merkle-proof]]"
---
# strategistHooksRoot permissions may be circumvented by any Strategist in favor of global permis-

- id: 63076
- impact: HIGH
- protocol: [[Superform]] v2 Periphery
- reporter: MiloTruck (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf

## Summary


This bug report highlights a high-risk vulnerability in the SuperVaultAggregator smart contract. The issue lies in the `proposeStrategyHooksRoot` function, which allows vault creators/strategists to reduce the `strategyProofs` that their vault is allowed to execute hooks from. This was intended to differentiate between globally enabled hooks and those specific to a particular vault strategist. However, the project team has noted that the current implementation allows any strategist to bypass their restricted permissions by passing in empty `strategyProof` arrays when calling `SuperVaultStrategy.executeHooks`. This means that even if a strategist has restricted permissions, they can still access global hooks such as ERC20 token transfers.

The impact of this vulnerability is significant as it allows any strategist to break out of their restricted permissions and access global hooks. The likelihood of exploitation is high as the functionality is enabled by default and does not require any unique circumstances to be exploited.

The recommendation is to reconsider what hooks are globally permitted and disallow global proofs when a `strategistHooksRoot` exists. This will ensure that strategy level permissions are properly enforced and prevent any unauthorized access to global hooks. 

## Details

## High Risk Vulnerability Report

## Severity
**High Risk**

## Context
`SuperVaultAggregator.sol#L1009`

## Summary
The project team notes that vault creators/strategists who desire less permission for their vault may reduce the `strategyProofs` that their vault is allowed to execute hooks from via the `proposeStrategyHooksRoot` function in `SuperVaultAggregator`.

The intention is to differentiate between what hooks a particular vault strategist may call from the globally enabled list of hooks. Globally, the list of permitted hooks is not finalized; however, the project team noted a rough idea can be seen in the `registerHooks()` function in `BaseTest.t.sol` where the test hooks are registered for the test `SuperGovernor` instance:

```solidity
function _registerHooks(Addresses[] memory A) internal returns (Addresses[] memory) {
    if (DEBUG) console2.log("---------------- REGISTERING HOOKS ----------------");
    for (uint256 i = 0; i < chainIds.length; ++i) {
        vm.selectFork(FORKS[chainIds[i]]);
        SuperGovernor superGovernor = SuperGovernor(_getContract(chainIds[i], SUPER_GOVERNOR_KEY));
        console2.log("Registering hooks for chain", chainIds[i]);
        if (DEBUG) {
            console2.log("deposit4626VaultHook", address(A[i].deposit4626VaultHook));
            console2.log("redeem4626VaultHook", address(A[i].redeem4626VaultHook));
            console2.log("approveAndRedeem4626VaultHook", address(A[i].approveAndRedeem4626VaultHook));
            console2.log("deposit5115VaultHook", address(A[i].deposit5115VaultHook));
            console2.log("redeem5115VaultHook", address(A[i].redeem5115VaultHook));
            console2.log("requestDeposit7540VaultHook", address(A[i].requestDeposit7540VaultHook));
            console2.log("requestRedeem7540VaultHook", address(A[i].requestRedeem7540VaultHook));
            console2.log("approveAndDeposit4626VaultHook", address(A[i].approveAndDeposit4626VaultHook));
            console2.log("approveAndDeposit5115VaultHook", address(A[i].approveAndDeposit5115VaultHook));
            console2.log("approveAndRedeem5115VaultHook", address(A[i].approveAndRedeem5115VaultHook));
            console2.log("approveAndRequestDeposit7540VaultHook", address(A[i].approveAndRequestDeposit7540VaultHook));
            console2.log("approveErc20Hook", address(A[i].approveErc20Hook));
            console2.log("transferErc20Hook", address(A[i].transferErc20Hook));
            console2.log("deposit7540VaultHook", address(A[i].deposit7540VaultHook));
            console2.log("withdraw7540VaultHook", address(A[i].withdraw7540VaultHook));
            console2.log("approveAndRedeem7540VaultHook", address(A[i].approveAndRedeem7540VaultHook));
            console2.log("swap1InchHook", address(A[i].swap1InchHook));
            console2.log("swapOdosHook", address(A[i].swapOdosHook));
            console2.log("approveAndSwapOdosHook", address(A[i].approveAndSwapOdosHook));
            console2.log("acrossSendFundsAndExecuteOnDstHook", address(A[i].acrossSendFundsAndExecuteOnDstHook));
            console2.log("fluidClaimRewardHook", address(A[i].fluidClaimRewardHook));
            console2.log("fluidStakeHook", address(A[i].fluidStakeHook));
            console2.log("approveAndFluidStakeHook", address(A[i].approveAndFluidStakeHook));
            console2.log("fluidUnstakeHook", address(A[i].fluidUnstakeHook));
            console2.log("gearboxClaimRewardHook", address(A[i].gearboxClaimRewardHook));
            console2.log("gearboxStakeHook", address(A[i].gearboxStakeHook));
            console2.log("approveAndGearboxStakeHook", address(A[i].approveAndGearboxStakeHook));
            console2.log("gearboxUnstakeHook", address(A[i].gearboxUnstakeHook));
            console2.log("yearnClaimOneRewardHook", address(A[i].yearnClaimOneRewardHook));
            console2.log("ethenaCooldownSharesHook", address(A[i].ethenaCooldownSharesHook));
            console2.log("ethenaUnstakeHook", address(A[i].ethenaUnstakeHook));
            console2.log("cancelDepositRequest7540Hook", address(A[i].cancelDepositRequest7540Hook));
            console2.log("cancelRedeemRequest7540Hook", address(A[i].cancelRedeemRequest7540Hook));
            console2.log("claimCancelDepositRequest7540Hook", address(A[i].claimCancelDepositRequest7540Hook));
            console2.log("claimCancelRedeemRequest7540Hook", address(A[i].claimCancelRedeemRequest7540Hook));
            console2.log("cancelRedeemHook", address(A[i].cancelRedeemHook));
        }
    }
    // Register fulfillRequests hooks
    superGovernor.registerHook(address(A[i].deposit4626VaultHook), true);
    superGovernor.registerHook(address(A[i].redeem4626VaultHook), true);
    superGovernor.registerHook(address(A[i].approveAndRedeem4626VaultHook), true);
    superGovernor.registerHook(address(A[i].deposit5115VaultHook), true);
    superGovernor.registerHook(address(A[i].redeem5115VaultHook), true);
    superGovernor.registerHook(address(A[i].requestDeposit7540VaultHook), false);
    superGovernor.registerHook(address(A[i].requestRedeem7540VaultHook), false);
    // Register remaining hooks
    superGovernor.registerHook(address(A[i].approveAndDeposit4626VaultHook), true);
    superGovernor.registerHook(address(A[i].approveAndDeposit5115VaultHook), true);
    superGovernor.registerHook(address(A[i].approveAndRedeem5115VaultHook), true);
    superGovernor.registerHook(address(A[i].approveAndRequestDeposit7540VaultHook), true);
    superGovernor.registerHook(address(A[i].approveErc20Hook), false);
    superGovernor.registerHook(address(A[i].transferErc20Hook), false);
    superGovernor.registerHook(address(A[i].deposit7540VaultHook), true);
    superGovernor.registerHook(address(A[i].withdraw7540VaultHook), false);
    superGovernor.registerHook(address(A[i].approveAndRedeem7540VaultHook), true);
    superGovernor.registerHook(address(A[i].swap1InchHook), false);
    superGovernor.registerHook(address(A[i].swapOdosHook), false);
    superGovernor.registerHook(address(A[i].approveAndSwapOdosHook), false);
    superGovernor.registerHook(address(A[i].acrossSendFundsAndExecuteOnDstHook), false);
    superGovernor.registerHook(address(A[i].fluidClaimRewardHook), false);
    superGovernor.registerHook(address(A[i].fluidStakeHook), false);
    superGovernor.registerHook(address(A[i].approveAndFluidStakeHook), false);
    superGovernor.registerHook(address(A[i].fluidUnstakeHook), false);
    superGovernor.registerHook(address(A[i].gearboxClaimRewardHook), false);
    superGovernor.registerHook(address(A[i].gearboxStakeHook), false);
    superGovernor.registerHook(address(A[i].approveAndGearboxStakeHook), false);
    superGovernor.registerHook(address(A[i].gearboxUnstakeHook), false);
    superGovernor.registerHook(address(A[i].yearnClaimOneRewardHook), false);
    superGovernor.registerHook(address(A[i].cancelDepositRequest7540Hook), false);
    superGovernor.registerHook(address(A[i].cancelRedeemRequest7540Hook), false);
    superGovernor.registerHook(address(A[i].claimCancelDepositRequest7540Hook), false);
    superGovernor.registerHook(address(A[i].claimCancelRedeemRequest7540Hook), false);
    superGovernor.registerHook(address(A[i].cancelRedeemHook), false);
    // EXPERIMENTAL HOOKS FROM HERE ONWARDS
    superGovernor.registerHook(address(A[i].ethenaCooldownSharesHook), false);
    superGovernor.registerHook(address(A[i].ethenaUnstakeHook), true);
    superGovernor.registerHook(address(A[i].morphoBorrowHook), false);
    superGovernor.registerHook(address(A[i].morphoRepayHook), false);
    superGovernor.registerHook(address(A[i].morphoRepayAndWithdrawHook), false);
    superGovernor.registerHook(address(A[i].pendleRouterRedeemHook), false);
}
return A;
```

## Description
A strategist can opt out of verifying strategy level permissions and benefit from looser global permissions by passing in empty `strategyProof` arrays when calling `SuperVaultStrategy.executeHooks`. Hook validation occurs on `SuperVaultAggregator.validateHook` where a check occurs to see if both the global and strategy root vetoes have taken place:

```solidity
bool globalHooksVetoed = _globalHooksRootVetoed;
bool strategyHooksVetoed = _strategyData[strategy].hooksRootVetoed;

if (globalHooksVetoed && strategyHooksVetoed) {
    return false;
}
```

If a strategy veto took place or no veto took place, the validation defers to the calldata arguments to verify that one of the two proofs exists:

```solidity
if (lengthGlobalProof == 0 && lengthStrategyProof == 0) {
    return false;
}
```

In our exploit scenario, the calling strategist may pass in the global proof only and circumvent any strategy level restrictions:

```solidity
// First try to verify against the global root if provided
if (lengthGlobalProof > 0 && !globalVetoed) {
    // Only validate against global root if it exists
    if (_globalHooksRoot != bytes32(0) && MerkleProof.verify(globalProof, _globalHooksRoot, leaf)) {
        return true;
    }
}
```

Not passing a strategy proof would be most simple, but even passing a strategy proof that does NOT permit the `hookArgs` would still succeed as the global check returns before the strategy specific check.

## Impact Explanation
Permissions that the vault creator/main strategist believe they are enforcing are not enforced by the protocol. Global hooks such as ERC20 token transfers, when enabled globally, are available to every strategist for every vault.

## Likelihood Explanation
The functionality is enabled as is and requires no unique circumstances to be exploitable. Any strategist may break out of their sandboxed permissions set by the `strategyProof`.

## Recommendation
Reconsider what hooks are globally permitted. When a `strategistHooksRoot` exists, disallow global proofs and enforce strategy level permissions.
