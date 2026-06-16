---
tags:
  - lang/solidity
  - platform/cantina
  - has/poc
  - severity/high
  - sector/restaking
  - sector/staking
protocol: "[[EigenLayer]]"
auditors:
  - "[[hash]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_eigenlayer_mar2024.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[timestamp-dependence]]"
---
# Beacon chain withdrawals that occur at lastwithdrawaltimestamp will be lost 

- id: 40684
- impact: HIGH
- protocol: [[EigenLayer]]
- reporter: hash (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_eigenlayer_mar2024.pdf

## Summary


The report describes a bug in the EigenPod smart contract where withdrawing ETH from the Beacon Chain before activating restaking causes the ETH to be lost. This is because the contract only processes withdrawals after all user transactions, so the ETH is not accounted for when the user activates restaking. This means that any withdrawals made in the same block as activating restaking will not be able to be withdrawn. The recommendation is to use >= mostRecentWithdrawalTimestamp instead of > to prevent this issue. This bug is considered a medium risk.

## Details

## Vulnerability Report

## Context
- **File:** EigenPod.sol
- **Lines:** 119-126, 381-391, 566-583, 733-737

## Description
ETH withdrawn from the Beacon Chain is retrieved from the EigenPod by calling the `withdrawBeforeRestaking` function before restaking is activated. To activate restaking, the `activateRestaking` function is called, which internally calls `_processWithdrawalBeforeRestaking` with the idea that all withdrawals until this timestamp will be processed. Hence, the `verifyAndProcessWithdrawals` function needs only to be called on timestamps greater than `mostRecentWithdrawalTimestamp`, i.e., the timestamp in which the last withdrawal via `_processWithdrawalBeforeRestaking` occurred.

### Function: _verifyAndProcessWithdrawal
```solidity
function _verifyAndProcessWithdrawal(
    bytes32 beaconStateRoot,
    BeaconChainProofs.WithdrawalProof calldata withdrawalProof,
    bytes calldata validatorFieldsProof,
    bytes32[] calldata validatorFields,
    bytes32[] calldata withdrawalFields
)
internal
proofIsForValidTimestamp(withdrawalProof.getWithdrawalTimestamp())
returns (VerifiedWithdrawal memory) {
```

### Modifier: proofIsForValidTimestamp
```solidity
modifier proofIsForValidTimestamp(uint64 timestamp) {
    require(
        timestamp > mostRecentWithdrawalTimestamp,
        "EigenPod.proofIsForValidTimestamp: beacon chain proof must be for timestamp after mostRecentWithdrawalTimestamp",
    );
    _;
}
```

### Function: activateRestaking
```solidity
function activateRestaking()
external
onlyWhenNotPaused(PAUSED_EIGENPODS_VERIFY_CREDENTIALS)
onlyEigenPodOwner
hasNeverRestaked {
    hasRestaked = true;
    _processWithdrawalBeforeRestaking(podOwner);
    emit RestakingActivated(podOwner);
}
```

### Function: _processWithdrawalBeforeRestaking
```solidity
function _processWithdrawalBeforeRestaking(address _podOwner) internal {
    mostRecentWithdrawalTimestamp = uint32(block.timestamp);
    nonBeaconChainETHBalanceWei = 0;
    _sendETH_AsDelayedWithdrawal(_podOwner, address(this).balance);
}
```

In case there is a withdrawal from the Beacon Chain that occurred on `mostRecentWithdrawalTimestamp`, this amount will be lost since the withdrawals from the Beacon Chain are executed after all user transactions according to EIP-4895. Hence, when the user executes `activateRestaking` and consequently `_processWithdrawalBeforeRestaking`, the pod will not contain the ETH withdrawn from the Beacon Chain in that block. After this block, the user will not be able to withdraw this ETH via `verifyAndProcessWithdrawals` since `verifyAndProcessWithdrawals` can only be called for timestamps greater than `mostRecentWithdrawalTimestamp`.

## Proof of Concept:
1. User has a withdrawal of 32 ETH from the Beacon Chain at time **t**.
2. User calls `activateRestaking` at timestamp **t**.
3. This is supposed to move out all ETH from the contract. But since the withdrawal execution only happens after all the user's transactions, `address(this)` will not factor this ETH.
4. These 32 ETH cannot be withdrawn using `verifyAndProcessWithdrawals` since the proof timestamp will be equal to `mostRecentWithdrawalTimestamp` (timestamp in which `activateRestaking` is called) and the condition for calling `verifyAndProcessWithdrawals` is `timestamp > mostRecentWithdrawalTimestamp`.

## Impact
Beacon chain withdrawals will be lost in case any user activates restaking in the block that contains one of their withdrawals.

## Recommendation
Use `>= mostRecentWithdrawalTimestamp` instead.
