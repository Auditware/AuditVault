---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - platform/spearbit
  - has/github
  - severity/high
  - trigger/flash-loan
  - precondition/flash-loan-available
protocol: "[[Aragon]]"
auditors:
  - "[[Om Parikh]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Aragon-Spearbit-Security-Review-July-2025.pdf"
genome:
  - "[[flash-loan-attack]]"
  - "[[role-bypass]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[proposal-state-check]]"
---
# MinVotingPowerCondition logic can be bypassed via ﬂashloans

- id: 62255
- impact: HIGH
- protocol: [[Aragon]] DAO Gov Plugin
- reporter: Om Parikh (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Aragon-Spearbit-Security-Review-July-2025.pdf

## Summary


This report highlights a high risk vulnerability in the `MinVotingPowerCondition` contract. The issue allows users to bypass the required amount of tokens needed to create a proposal and vote on it. This can be exploited by using flashloans, which allows users to temporarily borrow a large amount of tokens. This vulnerability becomes even more problematic when combined with the `EarlyExecution` voting mode, as it allows users to create and execute a proposal in the same block. The report suggests a few ways to address this issue, such as avoiding using the token's balance and requiring the locked amount to create a proposal, or avoiding executing the transaction in the same block as the deciding vote. The issue has been fixed in a recent pull request by the Aragon team, and has been verified by Spearbit. 

## Details

## High Risk Vulnerability Report

## Severity
**High Risk**

## Context
*(No context files were provided by the reviewer)*

## Description
The `MinVotingPowerCondition` contract allows any users who hold at least `plugin.minProposer-VotingPower()` amount of tokens (locked in the `LockManager` or in their token balance) to create a proposal and execute `LockToVote.createProposal`. This logic can be easily bypassed if the token allows flashloan or flashmint. Given that `isGranted` checks the user's token balance, the user does not even need to lock the flashloaned amount into the `LockManager` to be able to create and spam proposals.

The flashloan issue is even more problematic when combined with the voting mode `EarlyExecution` and the fact that proposals can (in that mode) be created and executed in the same block/timestamp. A user could simply:
1. Flashloan the token.
2. Create the proposal.
3. Lock + vote the proposal and auto-execute it (EarlyExecution).
4. Unlock the tokens.
5. Repay the flashloan.

All in the very same transaction.

## Recommendation
These are some ideas that could help the Aragon team to brainstorm a possible solution:
- Avoid using the token's balance and require the user to only use the locked amount.
- Store the proposal's creator in the proposal struct and require that the locked amount required to create the proposal won't be unlockable until the proposal ends. Keep in mind that with voting mode `EarlyExecution`, users would be able to anyway exploit this requirement via flashloan.
- Avoid executing the transaction in the same block that the "deciding" vote has been made. This would require storing and tracking an additional flag in the proposal (at least for the `EarlyExecution` case). If the vote would have allowed an "early execution", that flag would be turned to true and any executor would be able to execute the proposal from the next block (since the vote). This new flag would need to be integrated across all the other functions that check the state of the proposal (open, succeeded, executed, can be voted, and so on).

Note that these are suggestions that could lead to side effects and need to be further properly evaluated from a security standpoint.

## Aragon
Fixed in PR 28.

## Spearbit
Fix verified.
