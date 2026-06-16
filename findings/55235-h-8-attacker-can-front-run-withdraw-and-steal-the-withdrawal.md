---
tags:
  - lang/rust
  - lang/solidity
  - sector/staking
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[SEDA Protocol]]"
auditors:
  - dod4ufn
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[frontrun-exposure]]"
  - "[[direct-drain]]"
  - "[[mev/frontrun]]"
---
# H-8: Attacker can front-run Withdraw and steal the withdrawal

- id: 55235
- impact: HIGH
- protocol: SEDA Protocol
- reporter: dod4ufn (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the Seda Core contract where an attacker can front-run a withdrawal and steal the withdrawn amount. The problem is caused by the fact that the withdrawn tokens are sent to the message sender without any checks being done on their identity. This means that anyone can execute the same withdrawal message and steal the funds. There are no internal or external pre-conditions for this attack, and the impact is a permanent loss of funds for the staker. The bug has been fixed by sending the withdrawn tokens to a pre-approved address instead of the message sender. This fix can be found in the PR/commit listed in the discussion section.

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/231 

## Found by 
000000, 0xeix, Boy2000, DeLaSoul, cu5t0mPe0, dod4ufn, g, leopoldflint, zxriptor

### Summary

The Withdraw message in the Seda Core contract [sends](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain-contracts/contract/src/msgs/staking/execute/withdraw.rs#L36-L39) the withdrawn tokens to the message sender. This enables anyone to front-run the withdrawal with the same message to steal the withdrawn amount.

### Root Cause

- The withdrawn tokens are [sent](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain-contracts/contract/src/msgs/staking/execute/withdraw.rs#L36-L39) to the message sender.
```rust
  let bank_msg = BankMsg::Send {
      to_address: info.sender.to_string(),
      amount:     coins(self.amount.u128(), token),
  };
```
- No [checks](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain-contracts/contract/src/msgs/staking/execute/withdraw.rs#L8-L33) are done on the message sender, so it can be anyone.


### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. Attacker observes a Withdraw message with valid proof.
2. Attacker frontruns the Withdraw copying the same message to steal the withdrawn amount.

### Impact

Permanent loss of funds for the Staker.

### PoC

_No response_

### Mitigation

Consider sending the withdrawn tokens to a pre-approved address instead of the `info.sender`.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-chain-contracts/pull/272
