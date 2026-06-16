---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/launchpad
  - sector/perpetuals
protocol: "[[GTE]]"
auditors:
  - "[[newspacexyz]]"
report: "https://code4rena.com/reports/2025-08-gte-perps-and-launchpad"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[dos-resistance]]"
---
# [H-01] Risk of Gas DoS due to Looping

- id: 64834
- impact: HIGH
- protocol: [[GTE]]
- reporter: newspacexyz (Code4rena)
- source: https://code4rena.com/reports/2025-08-gte-perps-and-launchpad

## Summary


The bug report discusses a vulnerability in the code of `perps/GTL.sol` where an attacker can cause a Denial of Service (DoS) attack on the protocol by submitting a large number of minor withdrawal requests. This is because the `cancelWithdrawal` and `processWithdrawals` functions iterate over the entire withdrawal queue, making it inefficient and dangerous. To mitigate this issue, users should be required to provide a unique identifier for the request they wish to cancel, which can be implemented using a mapping to make it more gas-efficient. A detailed proof of concept is also provided for further understanding.

## Details



`perps/GTL.sol` [# L74](https://github.com/code-423n4/2025-08-gte-perps/blob/9fb17ba2de649106c6310aa351226c9bfab7f40a/contracts/perps/GTL.sol# L74)

Both the `cancelWithdrawal` and `processWithdrawals` functions iterate over the `_withdrawalQueue`. Therefore, if an attacker were to maliciously submit a large number of minor withdrawal requests, any subsequent call to `cancelWithdrawal` or `processWithdrawals` would hit the gas limit, leading to a Denial of Service (DoS) attack on the protocol.

### Recommended mitigation steps

Iterating through the entire queue to find a specific withdrawal request to cancel is inefficient and dangerous. Users should instead be required to provide a unique identifier for the request they wish to cancel. Using a mapping is the most gas-efficient way to implement this.

[View detailed Proof of Concept](https://code4rena.com/audits/2025-08-gte-perps-and-launchpad/submissions/F-16)

---
