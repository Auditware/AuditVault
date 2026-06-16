---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/governance
  - sector/options
  - sector/token
protocol: "[[DXdao]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[governance-voting-power-snapshot]]"
---
# Denial-of-Service Using Failed Proposals

- id: 19344
- impact: HIGH
- protocol: [[DXdao]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf

## Summary


This bug report is about a DoS attack which can be weaponized by a malicious user with enough voting power. This attack is possible due to a missing feature in the contracts EnforcedBinaryGuild and EnforcedBinarySnapshotERC20Guild, which does not call super.endProposal() or the derived BaseERC20Guild.endProposal() when the function endProposal() is called to end a proposal's lifecycle, if NOoption wins the vote. As a result, the activeProposalsNow counter is not decreased, which should be done on line [389] of function BaseERC20Guild.endProposal().

The testing team recommended implementing the BaseERC20Guild.endProposal() feature in the two contracts to mitigate the issue. This would also remove the redundant computation to determine the winningAction.

The issue has been resolved with the removal of the two contracts, EnforcedBinaryGuild.sol and EnforcedBinarySnapshotERC20Guild.sol on PR#192.

## Details

## Description

Contracts `EnforcedBinaryGuild` and `EnforcedBinarySnapshotERC20Guild` add a new action as a NO option on each submitted proposal, in order to indicate no action is preferred. When the function `endProposal()` is called to end a proposal’s lifecycle, if the NO option wins the vote, then the function does not call `super.endProposal()`, or the derived `BaseERC20Guild.endProposal()`.

As a result, the `activeProposalsNow` counter is not decreased, which should be done on line [389] of the function `BaseERC20Guild.endProposal()`. This behaviour can be weaponised by a malicious user with enough voting power to win a proposal and perform a DoS attack against the protocol. The malicious user can spam the system with proposals and vote on the proposals with the NO option, so the proposals will fill up the `activeProposalsNow`, preventing anyone from creating a new proposal.

## Recommendations

The testing team recommends implementing a `BaseERC20Guild.endProposal()` feature in the contracts `EnforcedBinaryGuild` and `EnforcedBinarySnapshotERC20Guild` to mitigate this issue. This would also remove the redundant computation to determine the `winningAction`, which is currently done twice if `winningAction != proposals[proposalId].totalVotes.length - 1`.

## Resolution

The issue is no longer applicable with the removal of the two contracts, `EnforcedBinaryGuild.sol` and `EnforcedBinarySnapshotERC20Guild.sol` on PR#192.
