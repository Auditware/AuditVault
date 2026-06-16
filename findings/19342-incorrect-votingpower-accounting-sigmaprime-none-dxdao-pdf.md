---
tags:
  - lang/solidity
  - sector/governance
  - sector/token
  - platform/sigmaprime
  - has/github
  - severity/high
  - trigger/governance-vote
  - fix/add-snapshot
protocol: "[[DXdao]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf"
genome:
  - "[[upgradeable-contract]]"
  - "[[governance-vote]]"
  - "[[add-snapshot]]"
  - "[[role-bypass]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[proposal-state-check]]"
---
# Incorrect votingPower Accounting

- id: 19342
- impact: HIGH
- protocol: [[DXdao]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf

## Summary


A bug was found in the Contract SnapshotRepERC20Guild, which replaces token locking with a snapshot mechanism implemented in the ERC20SnapshotRep token. The guild contract derived from ERC20GuildUpgradeable orBaseERC20Guild and overrides some important functions to set votes and create proposals, but did not override the votingPower accounting algorithm. As a result, anyone with an insufficient amount of tokens could propose and pass a proposal, because getVotingPowerForProposalCreation() and getVotingPowerForProposalExecution() would always produce zero.

The testing team recommended refactoring the votingPower accounting and making sure that createProposal() and endProposal() satisfy the required conditions for snapshot data. To resolve the issue, the function getTotalLocked() and getSnapshotVotingPowerForProposalExecution() were implemented in SnapshotRepERC20Guild.sol in PR#197.

## Details

## Description

**Contract Snapshot**

`SnapshotRepERC20Guild` replaces token locking with a snapshot mechanism implemented in the `ERC20SnapshotRep` token. The guild contract derives from `ERC20GuildUpgradeable` or `BaseERC20Guild` and overrides some important functions to set votes and create proposals.

The contract, however, does not override the voting power accounting algorithm, for example, the `getTotalLocked()` function. This function is used to query the total amount of tokens locked by the contract. `totalLocked` is then used to determine the minimum amount of tokens required to submit a proposal and to pass a proposal as defined in `votingPowerForProposalCreation` and `votingPowerForProposalExecution` respectively.

As a result, anyone with an insufficient amount of tokens can propose and pass a proposal because `getVotingPowerForProposalCreation()` and `getVotingPowerForProposalExecution()` will always produce zero.

## Recommendations

The testing team recommends refactoring the voting power accounting and making sure that `createProposal()` and `endProposal()` satisfy the required conditions for snapshot data.

## Resolution

The issue has been fixed on PR#197. Functions `getTotalLocked()` and `getSnapshotVotingPowerForProposalExecution()` are implemented in `SnapshotRepERC20Guild.sol`.
