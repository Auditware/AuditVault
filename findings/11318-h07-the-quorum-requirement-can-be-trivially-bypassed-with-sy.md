---
tags:
  - lang/solidity
  - sector/governance
  - platform/openzeppelin
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Audius]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/audius-contracts-audit/"
genome:
  - "[[proposal-manipulation]]"
  - "[[role-bypass]]"
  - "[[antisybil]]"
  - "[[quorum-supply-drift]]"
---
# [H07] The quorum requirement can be trivially bypassed with sybil accounts

- id: 11318
- impact: HIGH
- protocol: [[Audius]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/audius-contracts-audit/

## Summary


A bug was reported in the Audius Protocol which allowed users to bypass the quorum check in the `evaluateProposalOutcome` function. This was done by splitting one’s tokens over multiple accounts and voting with each of the accounts. This would increase the `proposals[_proposalId].numVotes` variable and make the quorum check pass. To address this, the bug report suggested that quorum size should be measured by the percentage of existing tokens that have voted, rather than the number of unique accounts that have voted. The bug has been fixed in pull request #574, however, the `setVotingQuorumPercent` function is not validating that the value set is between 0 and 100.

## Details

While the final vote on a proposal is determined via a token-weighted vote, [the quorum check](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/Governance.sol#L366) in the `evaluateProposalOutcome` function can be trivially bypassed by splitting one’s tokens over multiple accounts and voting with each of the accounts. Each of these sybil votes [increases the `proposals[_proposalId].numVotes` variable](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/Governance.sol#L281). This means anyone can make the quorum check pass.


Consider measuring quorum size by the percentage of existing tokens that have voted, rather than the number of unique accounts that have voted.


***Update:** Fixed in [pull request #574](https://github.com/AudiusProject/audius-protocol/pull/574). However, note that the [`setVotingQuorumPercent` function](https://github.com/AudiusProject/audius-protocol/pull/574/files#diff-cdd717eae25ddcfc7ccd2b9bd6be68c1R466) is not validating that the value set is between 0 and 100.*
