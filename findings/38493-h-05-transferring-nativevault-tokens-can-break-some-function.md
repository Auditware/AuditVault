---
tags:
  - lang/solidity
  - sector/restaking
  - sector/staking
  - platform/pashov
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Karak]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Karak-security-review-June.md"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# [H-05] Transferring `NativeVault` tokens can break some functionalities

- id: 38493
- impact: HIGH
- protocol: [[Karak]]-June
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Karak-security-review-June.md

## Summary


The report discusses a bug in the NativeVault token transfer system that could cause various issues in the protocol. These include incorrect slashing of assets, inability for recipients to use the shares, and potential exploitation by node owners to prevent certain actions. The severity of the bug is high and the likelihood is medium. The report recommends overriding the transfer functions to prevent token transfers.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

`NativeVault` tokens (shares) can be transferred from the node owner to another address. This can cause different issues in the behavior of the protocol. Here there are some examples:

1. The sender of the tokens might be slashed with more assets than he should be, as his balance would have decreased, but not the `node.totalRestakedETH` value.

```
File: NativeVault.sol

    function _transferToSlashStore(address nodeOwner) internal {
        NativeVaultLib.Storage storage self = _state();
        NativeVaultLib.NativeNode storage node = self.ownerToNode[nodeOwner];

        // slashed ETH = total restaked ETH (node + beacon) - share price equivalent ETH
  @>    uint256 slashedAssets = node.totalRestakedETH - convertToAssets(balanceOf(nodeOwner));
```

2. If the recipient of the tokens is not a node owner who has enough balance in their node, he will not be able to use the shares to withdraw or do anything else, turning the shares into a useless asset.

3. If the recipient is a node owner and there has been a slashing event in the protocol, the calculation of `slashedAssets` can underflow, as his balance would have increased, but not the `node.totalRestakedETH` value. This could potentially be used by a node owner to prevent `validateExpiredSnapshot` from being executed in the case of a slashing event in one of his validators in the Beacon Chain.

## Recommendations

Override the `transfer` and `transferFrom` functions in order to disallow transfers of the token.
