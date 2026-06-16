---
tags:
  - lang/solidity
  - sector/governance
  - sector/token
  - platform/sigmaprime
  - has/github
  - severity/high
  - vuln/pda/duplicate-mutable-accounts
  - novelty/variant
  - fix/add-check
protocol: "[[DXdao]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf"
genome:
  - "[[duplicate-mutable-accounts]]"
  - "[[variant]]"
  - "[[role-bypass]]"
  - "[[account-ownership]]"
  - "[[pda-derivation]]"
---
# Duplicate Actions Unaccounted for During Voting Tally

- id: 19346
- impact: HIGH
- protocol: [[DXdao]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf

## Summary


This bug report is about the EnforcedBinaryGuild contract, which allows users to create proposals using static call data. The contract also enforces "No" actions, which are appended to the proposal when it is created. However, the endProposal() function does not account for votes across the two additional "No" actions, allowing a malicious user to take advantage of the situation.

The resolution was to remove the two contracts, EnforcedBinaryGuild.sol and EnforcedBinarySnapshotERC20Guild.sol, which solved the issue.

The testing team recommends avoiding repeated behaviour such as adding additional elements to totalVotes, and deciding on whether this should be implemented in the parent or in the child contract. This is to ensure secure coding practices, and to promote the use of lean parent or top level contracts that stand as baseline implementation only, making duplicate behaviour across inherited contracts less likely.

## Details

## Description

**EnforcedBinaryGuild** allows for proposal creation using static call data. An additional feature of this contract is that "No" actions are enforced. When a user creates a proposal, they input the relevant actions into the function `EnforcedBinaryGuild.createProposal`, which assumes the user is not factoring in for ‘no action’. The following logic then appends the ‘no action’ as follows:

```solidity
totalActions = totalActions.add(1);
return super.createProposal(_to, _data, _value, totalActions, title, contentHash);
```

On line [60] there is one extra `totalActions` to account for the enforced ‘no action’ and a call to `ERC20GuildUpgradeable` or `BaseERC20Guild`. The parent contract already assumes that `action=0` is a no action in the `endProposal()` function voting tally mechanism. `BaseERC20Guild` then appends another action to the `totalActions`. This can be seen on line [299] in `BaseERC20Guild.sol`:

```solidity
newProposal.totalVotes = new uint256[](totalActions.add(1));
```

At this state, `newProposal.totalVotes` has 2 additional actions that can be voted on. If some users vote for `action=0`, they may be voting for no action or `ProposalState.Rejected`. Likewise, if they vote for `action=totalActions.length`, they may again be voting for a rejected proposal.

The `endProposal` makes no reconciliation between votes across these no actions. There is no process to tally votes for no action across the `action=0` and `action=totalActions.length`. Thus, a malicious user could take advantage of proposals where users have split their votes across multiple no action positions.

## Recommendations

Secure coding practices promote the use of lean parent or top-level contracts that stand as baseline implementation only, making duplicate behavior across inherited contracts less likely. The testing team recommends avoiding repeated behavior such as adding additional elements to `totalVotes`, and deciding on whether this should be implemented in the parent or in the child contract.

## Resolution

The issue is no longer applicable with the removal of the two contracts, `EnforcedBinaryGuild.sol` and `EnforcedBinarySnapshotERC20Guild.sol` on PR#192.
