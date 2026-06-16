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
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[proposal-state-check]]"
  - "[[timestamp-dependence]]"
---
# Voting Tally Does Not Count the Zero Action

- id: 19343
- impact: HIGH
- protocol: [[DXdao]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf

## Summary


This bug report is about a function called endProposal() that allows users to tally votes and determine the winning action on a proposal after the block.timestamp exceeds the proposal endTime. The logic used for tallying the votes assumes that if enough votes are placed on proposals[proposalId].totalVotes[0] (no action) then the other votes will not meet the required votingPowerForProposalExecution. This assumption is not enforced in setConfig() and can lead to a malicious user being able to vote for a proposal that the majority rejected. This could result in alterations in sensitive guild configurations using setConfig.

The testing team recommended tallying votes from i=0 or adding a condition in the function setConfig() requiring _votingPowerForProposalExecution to be greater than or equal to 50. This issue has been fixed on PR#192, and the winningAction of zero is now recognized, which indicates a rejected proposal.

## Details

## Description

The function `endProposal()` allows users to tally votes and determine the winning action on a proposal after `block.timestamp` exceeds the proposal `endTime`. Voting is tallied using the following logic:

```solidity
uint256 winningAction = 0;
uint256 i = 1;

for (i = 1; i < proposals[proposalId].totalVotes.length; i++) {
    if (
        proposals[proposalId].totalVotes[i] >= getVotingPowerForProposalExecution() &&
        proposals[proposalId].totalVotes[i] > proposals[proposalId].totalVotes[winningAction]
    ) 
        winningAction = i;
}
```

This logic assumes that if enough votes are placed on `proposals[proposalId].totalVotes[0]` (no action), then the other votes will not meet the required `votingPowerForProposalExecution`. Therefore, the default `winningAction = 0` will result in `ProposalState.Rejected`.

This assumption by `endProposal` is not enforced in `setConfig()` and can be deemed invalid under likely conditions. As a result, if `votingPowerForProposalExecution < 50`, it is possible that the majority voted for action `0`, but some minority (say 30 percent) votes for action `1`. The tally logic may result in `action = 1` being the winning action. This could lead to a malicious user being able to vote for a proposal that the majority rejected. Results could lead to alterations in sensitive guild configurations using `setConfig`.

## Recommendations

The testing team recommends tallying votes from `i = 0`. Alternatively, if intended, consider adding the following condition in the function `setConfig()`:

```solidity
require(_votingPowerForProposalExecution >= 50, "required assumption by endProposal default voting tally");
```

## Resolution

The issue has been fixed on PR#192. The `winningAction` of zero is now recognized, which indicates a rejected proposal.
