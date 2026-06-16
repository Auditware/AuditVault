---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/governance
  - sector/staking
protocol: "[[Monad]]"
auditors:
  - "[[Haxatron]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[proposal-state-check]]"
  - "[[vote-delegation-loop]]"
---
# CREATE/CREATE2 is not disabled during a delegated EOA call allowing delegated EOA transactions

- id: 62894
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


This bug report discusses a high-risk issue found in a specific commit of a code base related to EIP-7702 specifications. The issue involves the possibility of an EOA's nonce being incremented more than once per transaction, which can lead to invalid transactions and enable block stuffing attacks. The report also mentions a flaw in the handling of the issue, where a check for delegated code is not properly implemented in the code base. The recommendation is to shift the check to the VM layer. The issue has been fixed in a PR and verified by Spearbit.

## Details

## To Be Invalidated Mid-Block

## Severity
**High Risk**

## Context
(No context files were provided by the reviewer)

## Description
(Issue found in commit hash `fc820c9ee9ab310c4fdd5e1888f72164c0b871c8`).

The EIP-7702 spec notes the following:

A related issue is that an EOA's nonce may be incremented more than once per transaction. Because clients already need to be robust in a worse scenario (described above), it isn't a major concern. However, clients should be aware this behavior is possible and design their transaction propagation accordingly.

For Monad, this is a more serious concern because of delayed execution. A preceding transaction can invalidate other transactions in a proposal by bumping the delegated EOA's nonce via `CREATE` / `CREATE2`. This invalid transaction will thus not be charged any gas as a result but will take up space in the proposal, enabling virtually free block stuffing attacks.

Monad attempts to solve this by disabling `CREATE` and `CREATE2` opcode when executing delegated code in `evmc_host.cpp`.

### evmc_host.hpp (Lines 129-132)
```cpp
if (msg.kind == EVMC_CREATE || msg.kind == EVMC_CREATE2) {
    if (!create_inside_delegated_ && (msg.flags & EVMC_DELEGATED)) {
        return evmc::Result{EVMC_UNDEFINED_INSTRUCTION, msg.gas};
    }
}
```

But there is a flaw with how it is handled here. Importantly, in the VM, the preceding `CREATE` / `CREATE2` opcode implementation will pass in `msg.flags = 0` when calling the EVMC Host.

### create.hpp (Lines 78-94)
```cpp
auto message = evmc_message{
    .kind = kind,
    .flags = 0,
    .depth = ctx->env.depth + 1,
    .gas = gas,
    .recipient = evmc::address{},
    .sender = ctx->env.recipient,
    .input_data = (*size > 0) ? ctx->memory.data + *offset : nullptr,
    .input_size = *size,
    .value = bytes32_from_uint256(value),
    .create2_salt = bytes32_from_uint256(salt_word),
    .code_address = evmc::address{},
    .code = nullptr,
    .code_size = 0,
};
auto result = ctx->host->call(ctx->context, &message);
```

Thus, `msg.flags & EVMC_DELEGATED` will always be `0`, and the check will never work.

## Recommendation
The check needs to be shifted into the VM layer.

## Category Labs
Fixed in PR 1601.

## Spearbit
Fix verified.
