---
tags:
  - lang/solidity
  - sector/governance
  - sector/token
  - platform/sigmaprime
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[DXdao]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[dos-resistance]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[proposal-state-check]]"
---
# Low totalLocked May Result in Guild Takeover

- id: 19345
- impact: HIGH
- protocol: [[DXdao]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf

## Summary


This bug report is about a contract called BaseERC20Guild which enables users to cast votes on proposals using their voting powers. If the totalLocked tokens falls below a certain threshold, a malicious user could become the observed voting majority and submit a proposal before other users can respond. This could be used to call setConfig and adjust the _proposalTime and _lockTime to 1 in order to spam further proposals. It could also be leveraged to cause a proposal denial of service by setting _votingPowerForProposalCreation to unobtainable values. 

The testing team recommends setting a configurable, lowerbound threshold for totalLocked to prevent guilds that have just started from getting taken over, or cases where totalLocked suddenly drops. Additionally, they suggest setting maximum conditions for the input parameters in setConfig such as _votingPowerForProposalCreation, _votingPowerForProposalCreation, and _lockTime. 

The issue has been partially fixed on PR#182. New configuration settings, namely minimumMembersForProposalCreation and minimumTokensLockedForProposalCreation were added to mitigate the issue. The development team added a comment to explain that if someone gains complete majority even if it is a low number of tokens then they have control. Users must be aware of this.

## Details

## Description

The contract `BaseERC20Guild` enables users to cast votes on proposals using their voting powers. This contract is inherited by all alternative implementations (e.g., `SnapshotERC20Guild`, `EnforcedBinaryGuild`, etc.), and the voting powers dictate critical decisions that impact the guild. A malicious user that can control proposal voting and tallying mechanisms could steal funds, prevent the withdrawal of funds, or prevent proposals from being submitted.

`BaseERC20Guild` relies on the function `getTotalLocked()` in order to calculate `getVotingPowerForProposalCreation()` and `getVotingPowerForProposalExecution()`. Both of these functions are critical for determining whether proposals can be created and executed.

If total locked tokens fall below a certain threshold, a malicious adversary may become the observed voting majority. This may allow them to quickly submit a proposal and have it executed before other users can respond. This could be used to call `setConfig`, adjusting the `_proposalTime` and `_lockTime` to 1 in order to spam further proposals. Alternatively, this issue could also be leveraged to cause a proposal denial of service by setting `_votingPowerForProposalCreation` to unobtainable values.

## Recommendations

Make sure this behavior is understood. The testing team recommends setting a configurable lower bound threshold for `totalLocked` to prevent guilds that have just started from getting taken over, or in cases where `totalLocked` suddenly drops. 

Additionally, consider setting maximum conditions for the input parameters in `setConfig` (such as `_votingPowerForProposalCreation`, `_lockTime`). Doing this may prevent large token holders from causing a Denial of Service.

## Resolution

The issue has been (partially) fixed on PR#182. New configuration settings, namely `minimumMembersForProposalCreation` and `minimumTokensLockedForProposalCreation`, were added to mitigate the issue.

The following comment was added by the development team:

> Added configurable minimum amounts preventing this issue, and anything beyond those protections is intended and a human issue that documentation will cover explaining that if someone gains complete majority even if it is a low number of tokens, then they have control. Users must be aware of this.
