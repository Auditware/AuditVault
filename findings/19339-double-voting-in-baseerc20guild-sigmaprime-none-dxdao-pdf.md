---
tags:
  - lang/solidity
  - sector/governance
  - sector/token
  - platform/sigmaprime
  - has/github
  - severity/high
  - trigger/governance-vote
protocol: "[[DXdao]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf"
genome:
  - "[[proposal-manipulation]]"
  - "[[role-bypass]]"
  - "[[governance-vote]]"
  - "[[governance-voting-power-snapshot]]"
---
# Double-voting in BaseERC20Guild

- id: 19339
- impact: HIGH
- protocol: [[DXdao]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf

## Summary


This bug report is about a vulnerability in the BaseERC20Guild contract, which enables users to cast votes on proposals using their voting powers. If a user locks tokens before a proposal is proposed, and the lockTime expires before proposalTime passes, the user can withdraw their tokens and then transfer them to another account and vote again, allowing for double-voting. The testing team acknowledges that some implementation contracts have snapshot mechanisms to mitigate this issue, but other contracts such as DXDGuild, ERC20GuildWithERC1271, and EnforcedBinaryGuild do not have similar protection. The issue has been fixed on PR#187, where the locked tokens’ lockTime will be extended when the users vote.

## Details

## Description

The contract `BaseERC20Guild` enables users to cast votes on proposals using their voting powers. Voting power is acquired by locking tokens through the `lockTokens()` function, where the tokens will be locked until the `lockTime` period passes.

When a proposal is first submitted, the user can vote on this proposal by calling the `setVote()` function. Then, after casting their vote, the user can withdraw their tokens by calling `withdrawTokens()`. The token withdrawal does not revoke their proposal vote.

Having their tokens back, the user can transfer the tokens to another account and vote again under the guise of a new user. This allows for double-voting.

The scenario above is possible if the user locks tokens before a proposal is proposed, and therefore the `lockTime` expires before `proposalTime` passes. In this case, the system configuration where `lockTime >= proposalTime` does not prevent the user from withdrawing tokens before the `proposalTime` ends.

## Recommendations

Make sure this behavior is intended. The testing team acknowledges that some implementation contracts have a snapshot mechanism to mitigate this issue. However, other contracts such as `DXDGuild`, `ERC20GuildWithERC1271`, and `EnforcedBinaryGuild` do not have similar protection.

## Resolution

The issue has been fixed on PR#187. The locked tokens' `lockTime` will be extended when the users vote.
