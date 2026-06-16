---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/infra
  - sector/staking
protocol: "[[Monad]]"
auditors:
  - "[[Haxatron]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[direct-drain]]"
  - "[[vote-delegation-loop]]"
---
# DELEGATECALL to staking precompile allows theft of all staked MON

- id: 62882
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


This bug report discusses a critical risk issue found in a commit of a protocol. The staking precompile does not properly enforce the EVMC message kind, which can lead to malicious contracts stealing staked MON. The issue has been fixed in a later commit, but the report recommends enforcing `CALL` for all state-changing staking precompile functions and `CALL` and `STATICCALL` for non-state-changing precompile functions. The issue has been fixed in two separate commits.

## Details

## Security Report

## Severity
**Critical Risk**

## Context
(No context files were provided by the reviewer)

## Description
Note: This issue was known internally by the protocol team and fixed in a later commit after the issue had been submitted. However, it is still kept in the report for completeness (issue found in commit hash `4cbb1742cd31ee30a0d2c6edb698400d9d70f9d8`).

The staking precompile does not enforce that the EVMC message kind passed to the precompile is not `DELEGATE-CALL`. This has very severe implications since the staking precompile works by getting the user to transfer native MON via `msg.value` to the precompile.

```cpp
Result<byte_string> StakingContract::precompile_delegate(
    byte_string_view const input, evmc_address const &msg_sender,
    evmc_uint256be const &msg_value)
{
```

Since `DELEGATECALL` preserves `msg.value` and `msg.sender` from the previous caller context, a user can set up a malicious contract that delegate calls `precompile_delegate`. For instance, the native MON will be transferred to the malicious contract, but the `msg.value` will be reused in `precompile_delegate` without actually transferring the funds to the staking precompile.

State updates will then occur in the staking contract, recording the user's stake without the staking precompile actually having received the funds (this is because the state variables in the precompile contract are defined for the precompile address resulting in `state_.set_storage(STAKING_CONTRACT_ADDRESS...)` being called).

The user can then withdraw their funds from the staking precompile and the malicious contract, resulting in the theft of all staked MON.

Also related to this issue is that a user can call state-changing precompile functions using `STATICCALL`, which should not be allowed as `STATICCALL` should not allow state changes.

## Recommendation
Enforce that the EVMC message kind is `CALL` for all state-changing staking precompile functions (`precompile_get_delegator`, `precompile_add_validator`, `precompile_delegate`, `precompile_undelegate`, `precompile_compound`, `precompile_withdraw`, `precompile_claim_rewards`) and `CALL` and `STATICCALL` for non-state-changing precompile functions (`precompile_get_validator`).

## Category Labs
We were planning to ban everything except `EVMC_CALL` (including on `get_validator` even though static call is fine) before anything gets dispatched. Fixed in commit `215721ad`.

Spearbit: `STATICCALL` is still allowed to state-changing precompiles as the `msg.flags` is not checked to be `EVMC_STATIC`.

## Category Labs
Fixed in `fc820c9`.
