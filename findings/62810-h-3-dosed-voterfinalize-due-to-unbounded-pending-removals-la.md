---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/unbounded-loop
  - novelty/known-pattern
protocol: "[[BMX]]"
auditors:
  - "[[0x73696d616f]]"
  - "[[Bobai23]]"
  - "[[ezsia]]"
  - "[[maigadoh]]"
report: "https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging"
genome:
  - "[[unbounded-loop]]"
  - "[[temporary]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
---
# H-3: DoSed `Voter::finalize()` due to unbounded pending removals lacking a batch argument variable

- id: 62810
- impact: HIGH
- protocol: [[BMX]] Deli Swap
- reporter: 0x73696d616f (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the code for a project called BMX Deli Swap Judging. The issue was discovered by a group of users and could potentially be exploited by an attacker to cause a denial of service (DoS) attack. The root cause of the issue is a missing batch variable in a function called `Voter::_processPendingRemovals()`. This could allow an attacker to register as an auto voter with a balance greater than zero and then transfer their votes out, causing the epoch finalization process to run out of gas. This would result in all rewards being stuck and the inability to finalize any epochs. The report suggests adding a batch argument to the function as a mitigation for this issue.

## Details


Source: https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging/issues/68 

## Found by 
0x73696d616f, Bobai23, ezsia, maigadoh

### Summary

`Voter::finalize()` processes in batches to allow finalizing epochs and distributing rewards without running out of gas. However, `Voter::_processPendingRemovals()` doesn't take a batch variable into account, making it possible for an attacker to register as auto voter with a balance > 0, and then transfer their votes out, being sent to the pending removals array as soon as the epoch is finalized. By spamming this in a huge number of accounts, an attacker is able to DoS epoch finalization for all epochs, effectively making all rewards stuck.

### Root Cause


In `Voter.sol:386`, [Voter::_processPendingRemovals()](https://github.com/sherlock-audit/2025-09-bmx-deli-swap/blob/main/deli-swap-contracts/src/Voter.sol#L386) is missing a batch variable argument.

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. Attacker calls `Voter::vote()` with a wei balance, enabling auto voting, and then transferring the balance out. Attacker does this for multipler addresses such that `Voter::finalize()` runs out of gas.
2. Admin calls `Voter::finalize()`, and in `Voter::_tallyAutoVotes()`, all the accounts are pushed to the pendingRemovals array. Due to the lack of a batch argument in the `Voter::_processPendingRemovals()` function, it will run out of gas trying to remove all the addresses of the attacker.

### Impact

Epoch finalization is impossible and rewards are forever stuck.

### PoC

Note `Voter.sol::_processPendingRemovals()`:

```solidity
function _processPendingRemovals(uint256 ep) internal {
    address[] memory toRemove = pendingRemovals[ep];
    for (uint256 i = 0; i < toRemove.length; i++) {
        address addr = toRemove[i];
        uint256 idx = autoIndex[addr];
        if (idx > 0) {
            _removeAutoVoter(addr, idx - 1);
        }
    }
    delete pendingRemovals[ep];
}
```

### Mitigation

Send a batch argument, to avoid OOG revert.
