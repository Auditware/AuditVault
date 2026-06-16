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
  - "[[proposal-manipulation]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Zero totalLocked Allows Everyone to Create Proposals

- id: 19347
- impact: HIGH
- protocol: [[DXdao]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf

## Summary


This bug report describes an issue with the getVotingPowerForProposalCreation() function in the ERC20Guild system. It relies on the getTotalLocked() function to compute the minimum voting power for creating a proposal, and if no tokens are locked, then the getVotingPowerForProposalCreation() will return zero. This allows anyone to submit a proposal through the createProposal() function, resulting in malicious users flooding the system with junk proposals.

The testing team recommends setting a lower bound on getVotingPowerForProposalCreation to prevent this from happening. The issue has been partially fixed on PR#182, and two new configuration settings, namely minimumMembersForProposalCreation and minimumTokensLockedForProposalCreation, were added to mitigate the issue.

## Details

## Description
The function `getVotingPowerForProposalCreation()` relies on `getTotalLocked()` to compute the minimum voting power for creating a proposal. In a case where no tokens are locked, then `getVotingPowerForProposalCreation()` will return zero because `getTotalLocked()` is zero. If this occurs, anyone can successfully submit a proposal through the function `createProposal()`, allowing malicious users to flood the system with junk proposals that nobody is motivated to remove from the system.

## Recommendations
The testing team recommends setting a lower bound on `getVotingPowerForProposalCreation` to prevent zero `totalLocked` from allowing anyone to create proposals.

## Resolution
The issue has been (partially) fixed on PR#182. New configuration settings, namely `minimumMembersForProposalCreation` and `minimumTokensLockedForProposalCreation`, were added to mitigate the issue.
