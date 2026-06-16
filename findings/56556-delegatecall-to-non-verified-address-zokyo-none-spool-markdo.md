---
tags:
  - lang/solidity
  - sector/staking
  - platform/zokyo
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Spool]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-03-30-Spool.md"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[vote-delegation-loop]]"
---
# Delegatecall to non-verified address.

- id: 56556
- impact: HIGH
- protocol: [[Spool]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-03-30-Spool.md

## Summary


The bug report states that in line 149 of the code, there is a function called "withdraw()" that allows users to pass any address without verification. This can potentially lead to loss of funds as the code is making a delegate call to this address. The recommendation is to verify all addresses that users can pass to functions and contracts. However, the client has responded saying that the call cannot happen if the strategy is not valid and only the vault can set user strategy shares. Additionally, if the total amount withdrawn is 0, the code will revert. After further clarification, it was concluded that validating that the strategy share is greater than zero before calling the strategy is sufficient.

## Details

**Description**

line 149, function withdraw(). Addresses from array ‘strategies’ are not verified, thus user is
able to pass any address here. Spool is making a delegate call to this address
(SpoolStrategy.sol, line 305). This might potentially cause funds loss.

**Recommendation**:

Verify any address that a user can pass to functions, and contracts are making calls to.
Answer from client.
There is no way the call happens if the strategy is not valid. Only the vault can set the user
strategy shares. If user vault shares are 0, the call is skipped. This is nice to have require to
revert if calldata is wrong, but it cannot affect the system. Also, if total withdrawn is 0, the
code reverts.

**Post-audit**.

After clarification from the client’s side, auditors came to conclusion, that validating that
strategy share is greater than zero before calling strategy is enough.
