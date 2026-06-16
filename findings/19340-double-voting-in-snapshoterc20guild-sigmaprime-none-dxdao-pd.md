---
tags:
  - lang/solidity
  - sector/governance
  - sector/token
  - platform/sigmaprime
  - has/github
  - severity/high
  - fix/add-snapshot
protocol: "[[DXdao]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[add-snapshot]]"
  - "[[locked-funds]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[timestamp-dependence]]"
---
# Double-voting in SnapshotERC20Guild

- id: 19340
- impact: HIGH
- protocol: [[DXdao]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/dxdao/erc20-guild/review.pdf

## Summary


This bug report is about an issue with the contract SnapshotERC20Guild which enables users to cast votes on proposals using their voting powers. The snapshot mechanism is meant to prevent people from flooding the voting power, but it has unexpected behaviour. When the function lockTokens() is called, it does not increase the proposal votingPower unless it is called again or withdrawTokens() is called. When withdrawTokens() is called it unexpectedly increases the votingPower. This allows a malicious user to double vote repeatedly on any future proposal.

The testing team recommends that all tokens are appropriately locked during proposal voting and to ensure that votingPower at snapshot intervals indicate the correct amount actually held by that account. This could be achieved by placing the _updateAccountSnapshot(msg.sender) after tokensLocked[msg.sender].amount has been updated. The development team has indicated that the issue has been fixed on PR#198.

## Details

## Description

The contract `SnapshotERC20Guild` enables users to cast votes on proposals using their voting powers. Unlike `BaseERC20Guild`, voting power is managed by a snapshot mechanism. One of the purposes behind most snapshot mechanisms is to prevent people from flooding the voting power after a proposal is created. 

In `SnapshotERC20Guild`, the snapshot process has unexpected behaviour:

1. **lockTokens()**: Calling this function does not increase proposal `votingPower` unless the user then calls `lockTokens()` again, or `withdrawTokens()`. This is due to calling `_updateAccountSnapshot(msg.sender)` on line [83], before updating the `tokensLocked[msg.sender].amount` on line [86].

2. **withdrawTokens**: Calling this function unexpectedly increases the `votingPower`. This is due to the function calling `_updateAccountSnapshot(msg.sender)` on line [100] before updating the `tokensLocked[msg.sender].amount` on line [102].

As a result, a malicious user is able to lock tokens, wait for the allocated `block.timestamp`, and create a new proposal to increment the `snapshotId`. After this setup, they are able to call `withdrawTokens()`, which will withdraw the tokens from the guild contract; however, the snapshot will maintain voting power as the pre-withdrawal `tokensLocked[msg.sender]`.

After withdrawal, the malicious adversary is able to transfer the tokens to another account and repeat the process, gaining `votingPower` across multiple accounts that do not hold any tokens. This effectively allows a single user to double vote repeatedly on any future proposal.

## Recommendations

The testing team recommends that all tokens are appropriately locked during proposal voting and to ensure that `votingPower` at snapshot intervals indicates the correct amount actually held by that account. This could be achieved by placing `_updateAccountSnapshot(msg.sender)` after `tokensLocked[msg.sender].amount` has been updated.

## Resolution

The development team indicated that the issue has been fixed on PR#198.
