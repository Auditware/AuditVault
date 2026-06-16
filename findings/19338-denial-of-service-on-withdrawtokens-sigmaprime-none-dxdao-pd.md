---
tags:
  - lang/solidity
  - sector/governance
  - sector/token
  - platform/sigmaprime
  - has/github
  - severity/high
  - novelty/known-pattern
protocol: "[[DXdao]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
---
# Denial of Service on withdrawTokens()

- id: 19338
- impact: HIGH
- protocol: [[DXdao]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf

## Summary


The withdrawTokens() function in the BaseERC20Guild.sol and SnapshotERC20Guild.sol contracts is responsible for withdrawing locked user tokens from allocated guild contracts. This function was found to not check whether a user was trying to withdraw zero tokenAmount. This could lead to a malicious user launching a DoS attack against the system by repeatedly withdrawing zero tokens until totalMembers == 0, thus preventing other users from withdrawing tokens due to an Integer Overflow error. To fix this issue, an extra check was added to make sure users withdraw non-zero tokenAmount and, if totalMembers is not essential to the protocol, it can be removed to minimize complexity and avoid pitfalls. The issue has been resolved on PR#179, where a user cannot withdraw zero amount.

## Details

## Description

The `withdrawTokens()` function withdraws locked user tokens from allocated guild contracts. This function fails to check whether a user tries to withdraw a zero `tokenAmount`. If a user has no balance and withdraws zero tokens, `totalMembers` will reduce by one. This can be seen in the following excerpt from `BaseERC20Guild.solas` indicated in the following snippet:

```solidity
if (tokensLocked[msg.sender].amount == 0) totalMembers = totalMembers.sub(1);
```

A malicious user could launch a DoS attack against the system through repeatedly withdrawing zero tokens until `totalMembers == 0`. This would prevent other users from withdrawing tokens, due to the aforementioned check causing an Integer Overflow error.

## Recommendations

Add an extra check to make sure users withdraw a non-zero `tokenAmount`. Also, if `totalMembers` is not essential to the protocol, it can be removed to minimize complexity and avoid pitfalls.

## Resolution

The issue has been fixed on PR#179. A user cannot withdraw a zero amount. The same contract logic persists in the `SnapshotERC20Guild.sol` for the same function `withdrawTokens()` on line [105].
