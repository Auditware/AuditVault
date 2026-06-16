---
tags:
  - lang/move
  - lang/solidity
  - sector/streaming
  - sector/token
  - platform/zokyo
  - has/github
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Global Interlink]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-03-27-Global Interlink.md"
genome:
  - "[[missing-modifier]]"
  - "[[locked-funds]]"
  - "[[cross-contract-state-consistency]]"
---
# Whitelisted table balance and contract balance can be different resulting in locked funds for users

- id: 44579
- impact: HIGH
- protocol: [[Global Interlink]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-03-27-Global Interlink.md

## Summary


This bug report describes a problem with a contract that allows users to add funds to a pool and also whitelist certain addresses. The issue is that the contract admin can add tokens to the whitelist table that do not match the actual token balance in the contract. This could cause problems for users who have vested funds as they may not be able to access them. The recommendation is to implement a check to prevent this from happening or to transfer vested funds directly when adding a user to the whitelist. The bug has been resolved.

## Details

**Severity**: High

**Status**: Resolved

**Description**

At this moment, the whitelisted address are added through the add_to_whitelist method and the funds of the pool are added through the deposit functionality, however these 2 steps pattern can become problematic for the contract integrity and the vested users, as the contract admin can add in the whitelist table tokens amount that do not reflect the true token balances in the contract, and users could be stuck with uncorrelated/hypothetical funds because there would be nothing for them to release from vesting.

**Recommendation**: 

Implement a check to never being able to add more hypothetical total funds in the table then the ones in contract balance or every time admin add a new user to the whitelist also transfer the necessary vested funds for that user directly in the same function logic.
