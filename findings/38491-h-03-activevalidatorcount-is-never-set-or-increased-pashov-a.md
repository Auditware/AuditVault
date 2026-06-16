---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/restaking
  - sector/staking
  - platform/pashov
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - fix/add-snapshot
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Karak]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Karak-security-review-June.md"
genome:
  - "[[underflow]]"
  - "[[add-snapshot]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[integer-bounds]]"
  - "[[timestamp-dependence]]"
---
# [H-03] `activeValidatorCount` is never set or increased

- id: 38491
- impact: HIGH
- protocol: [[Karak]]-June
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Karak-security-review-June.md

## Summary


The report discusses a bug in the `NativeVault` contract where the `activeValidatorCount` value is not properly set or increased. This value is used to determine the remaining proofs in the `Snapshot` struct, but since it is always initialized to zero, the contract will always revert due to an underflow error. This also causes the `node.creditedNodeETH` to be updated twice, resulting in wrong calculations. To fix this, the report recommends adding a line of code to properly set and increase the `activeValidatorCount` value.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

In the `NativeVault` contract `Storage.ownerToNode[nodeOwner].activeValidatorCount` keeps track of the total validators with withdrawal credentials pointed to a specific node.

This value is decreased in `NativeVaultLib.validateSnapshotProof` when the balance of a validator in the Beacon Chain is zero.

```solidity
File: NativeVaultLib.sol

        if (newBalanceWei == 0) {
@>          self.ownerToNode[nodeOwner].activeValidatorCount--;
            validatorDetails.status = ValidatorStatus.WITHDRAWN;

            emit ValidatorWithdrawn(nodeOwner, nodeAddress, timestamp, validatorIndex);
        }
```

The value is used in `_startSnapshot` to set the `remainingProofs` field of the `Snapshot` struct.

```solidity
File: NativeVault.sol

        NativeVaultLib.Snapshot memory snapshot = NativeVaultLib.Snapshot({
            parentBeaconBlockRoot: _getParentBlockRoot(uint64(block.timestamp)),
            nodeBalanceWei: nodeBalanceWei,
            balanceDeltaWei: 0,
@>          remainingProofs: node.activeValidatorCount
        });
```

However, `activeValidatorCount` is never set or increased. As a result `remainingProofs` will always be initialized to zero, causing the following outcomes:

- `validateSnapshotProofs` will always revert due to underflow error.

```solidity
File: NativeVault.sol

        for (uint256 i = 0; i < balanceProofs.length; i++) {
(...)
@>          snapshot.remainingProofs--;
            snapshot.balanceDeltaWei += balanceDeltaWei;
        }
```

- `_updateSnapshot` will always evaluate to `true` the condition `snapshot.remainingProofs == 0`. As a result `node.creditedNodeETH` can be updated twice: once on `startSnapshot` and another called `validateSnapshotProofs` with an empty `balanceProofs` array.

```solidity
File: NativeVault.sol

@>      if (snapshot.remainingProofs == 0) {
            int256 totalDeltaWei = int256(snapshot.nodeBalanceWei) + snapshot.balanceDeltaWei;

@>          node.creditedNodeETH += snapshot.nodeBalanceWei;

            node.lastSnapshotTimestamp = node.currentSnapshotTimestamp;
            delete node.currentSnapshotTimestamp;
            delete node.currentSnapshot;

            _updateBalance(nodeOwner, totalDeltaWei);
            emit SnapshotFinished(nodeOwner, node.nodeAddress, node.lastSnapshotTimestamp, totalDeltaWei);
        } else {
            node.currentSnapshot = snapshot;
        }
```

## Recommendations

Add the following line in `NativeVaultLib.validateWithdrawalCredentials`:

```diff
        validatorDetails.status = NativeVaultLib.ValidatorStatus.ACTIVE;
        validatorDetails.validatorIndex = validatorFieldsProof.validatorProof.validatorIndex;
        validatorDetails.lastBalanceUpdateTimestamp = updateTimestamp;
        validatorDetails.restakedBalanceWei = restakedBalanceWei;
        self.ownerToNode[nodeOwner].validatorPubkeyHashToDetails[validatorPubkeyHash] = validatorDetails;
+       self.ownerToNode[nodeOwner].activeValidatorCount++;
```
