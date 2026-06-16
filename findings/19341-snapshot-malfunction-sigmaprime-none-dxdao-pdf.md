---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/governance
  - sector/token
protocol: "[[DXdao]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[governance-voting-power-snapshot]]"
---
# Snapshot Malfunction

- id: 19341
- impact: HIGH
- protocol: [[DXdao]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf

## Summary


This bug report is about an issue with the contract SnapshotERC20Guild, which derives from the parent contract ERC20GuildUpgradeable. The issue is that the contract SnapshotERC20Guild uses snapshots to manage user's votes, but the parent contract does not have access to these snapshots. This means that when the voters withdraw their tokens after proposal creation and before voting, the parent contract will revert with an "Invalid votingPower" message.

The testing team recommended refactoring the votingPower checks across parent and child contracts to allow votingPower checks to be performed only on child contracts, or moving the voting logic to the child contract. The issue was fixed on PR#196, where the function setVote() no longer calls super.setVote() and all checks are done on the SnapshotERC20Guild contract.

## Details

## Description

In the contract `SnapshotERC20Guild`, the functions `setVote()` and `setSignedVote()` manage the user's votes by first checking the snapshot and then calling the parent contract’s `setVote()` or `setSignedVote()` function.

The contract `SnapshotERC20Guild` derives from `ERC20GuildUpgradeable` (or `BaseERC20Guild`). While snapshots are used in `SnapshotERC20Guild`, the parent contract `ERC20GuildUpgradeable` does not have access to the snapshots. For example, `SnapshotERC20Guild.setVote()` calls the function `BaseERC20Guild.setVote()`, which directly uses the current `votingPower` before processing further. The same error occurs with `SnapshotERC20Guild.setSignedVote()` relying on `BaseERC20Guild.setSignedVote()`. These checks against the parent contract’s `votingPower` do not take into account the applied snapshots in the child contract.

If the voters withdraw their tokens after proposal creation and before voting, the parent contract will revert with an `Invalid votingPower` message.

## Recommendations

The testing team recommends refactoring the `votingPower` checks across parent and child contracts to allow `votingPower` checks to be performed only on child contracts. This will preserve `votingPower` data across different implementations, for example, through snapshots. Alternatively, the voting logic could be moved to the child contract to avoid calling the parent contract’s functions.

## Resolution

The issue has been fixed on PR#196. The function `setVote()` no longer calls `super.setVote()` and all checks are done on the `SnapshotERC20Guild` contract.
