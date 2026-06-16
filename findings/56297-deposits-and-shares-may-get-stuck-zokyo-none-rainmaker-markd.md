---
tags:
  - lang/solidity
  - sector/governance
  - platform/zokyo
  - has/github
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Rainmaker]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-12-29-Rainmaker.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[timelock-timestamp-bypass]]"
---
# Deposits and shares may get stuck.

- id: 56297
- impact: HIGH
- protocol: [[Rainmaker]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-12-29-Rainmaker.md

## Summary


The bug report describes a situation where funds can become stuck in a TimeLockPool if a user transfers their shares to another user or smart-contract that does not have an interface for transferring shares. This can happen if both users wait for a maturity period before attempting to withdraw their deposits. The first user will not have enough shares to withdraw their deposits, and the second user will not be able to withdraw using the shares they received from the first user. This can result in both the deposits and shares being stuck until they are transferred back to the original user. The recommendation is to rewrite the values of deposits during transfer to prevent this issue. The client has verified that only non-transferable pools will be used.

## Details

**Description**

Funds may be stuck in case a user transfers his share to another user or smart-contract, which
doesn’t not interface for transferring shares.
Consider the next scenarioc
j User1 deposits tokens to TimeLockPool and receives sharesj
^j User1 transfers his shares to User2j
j Both users wait for a maturity periodj
\j User1 tries to withdraw his deposits, but the transaction fails since he doesn’t have enough
shares. This way, his deposits are stuckj
Zj User2 tries to withdraw, using shares which he received from User1, but the transaction
fails because his array of deposits is empty. This way, shares are stuck until User2 transfers
them back to User1. In case, User2 is a smart-contract, which does not support an
interface for transferring shares, funds may get stuck.

**Recommendation**:

Consider rewriting values of deposits of both users during transfer.
PostAudit. Client verified that only non-transferable pools will be used.
