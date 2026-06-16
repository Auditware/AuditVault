---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/governance
  - sector/infra
  - sector/staking
protocol: "[[Monad]]"
auditors:
  - "[[Haxatron]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf"
genome:
  - "[[overflow]]"
  - "[[indirect-loss]]"
  - "[[integer-bounds]]"
  - "[[proposal-state-check]]"
  - "[[vote-delegation-loop]]"
---
# DELEGATECALL and CALLCODE loses the EVMC_DELEGATED ﬂag

- id: 62895
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


The report is about a high-risk bug found in a code called EIP-7702. The bug allows for a transaction to be invalidated mid-block, which can lead to attacks that stuff blocks with invalid transactions. The bug is caused by the EVMC_DELEGATED flag being lost when entering the DELEGATECALL and CALLCODE call frames, which allows for the nonce to be bumped and the transaction to be invalidated. The recommendation is to always retain the EVMC_DELEGATED flag in these call frames. The bug has been fixed in PR 1601.

## Details

## Severity: High Risk

## Context 
(No context files were provided by the reviewer)

## Description 
(Issue found in commit hash `fc820c9ee9ab310c4fdd5e1888f72164c0b871c8`)

The EIP-7702 spec notes the following:

A related issue is that an EOA's nonce may be incremented more than once per transaction. Because clients already need to be robust in a worse scenario (described above), it isn't a major concern. However, clients should be aware this behavior is possible and design their transaction propagation accordingly. 

For Monad, this is a more serious concern because of delayed execution. A preceding transaction can invalidate other transactions in a proposal by bumping the delegated EOA's nonce via `CREATE` / `CREATE2`. This invalid transaction will thus not be charged any gas as a result but will take up space in the proposal enabling virtually free block stuffing attacks.

Monad attempts to solve this by disabling `CREATE` and `CREATE2` opcodes when executing delegated code in `evmc_host.cpp`.

```cpp
// evmc_host.hpp#L129-L132
if (msg.kind == EVMC_CREATE || msg.kind == EVMC_CREATE2) {
    if (!create_inside_delegated_ && (msg.flags & EVMC_DELEGATED)) {
        return evmc::Result{EVMC_UNDEFINED_INSTRUCTION, msg.gas};
    }
}
```

There is already a bug with the implementation in "CREATE/CREATE2 is not disabled during a delegated EOA call allowing delegated EOA transactions to be invalidated mid-block," but this report will showcase another way to bypass the check.

The `EVMC_DELEGATED` flag is used to track whether the current call frame is currently within the context of a delegated EOA account. The problem is that for `DELEGATECALL` and `CALLCODE` opcodes, the `EVMC_DELEGATED` flag will be lost when entering the `DELEGATECALL` and `CALLCODE` call frames.

When a `DELEGATECALL` and `CALLCODE` occurs, `dest_address == code_address` as `DELEGATECALL` or `CALLCODE` affects the `msg.recipient`; as such, the `EVMC_DELEGATED` flag will be removed from the `DELEGATECALL` or `CALLCODE` call frame.

```cpp
// call.hpp#L92-L167
auto recipient = (call_kind == EVMC_CALL || static_call)
    ? dest_address
    : ctx->env.recipient;
// ...
auto message = evmc_message{
// ...
.flags = message_flags(
    ctx->env.evmc_flags, static_call, dest_address != code_address),
// ...
};
```

```cpp
// call.hpp#L26-L41
inline std::uint32_t message_flags(
    std::uint32_t env_flags, bool static_call, bool delegation_indicator)
{
    if (static_call) {
        env_flags = static_cast<std::uint32_t>(EVMC_STATIC);
    }
    if (delegation_indicator) {
        env_flags |= static_cast<std::uint32_t>(EVMC_DELEGATED);
    } else {
        env_flags &= ~static_cast<std::uint32_t>(EVMC_DELEGATED);
    }
    return env_flags;
}
```

Since the call frame no longer contains the `EVMC_DELEGATED` flag, the call frame can execute a `CREATE` / `CREATE2` opcode to bump its nonce. The `msg.sender` of the `CREATE` / `CREATE2` call frame will have its nonce bumped. Working backwards, the `msg.sender` of the `CREATE` / `CREATE2` call frame is the `msg.recipient` of the `DELEGATECALL` and `CALLCODE` call frame, which equals the EOA delegated code that executed the `DELEGATECALL` / `CALLCODE`, and thus the delegated EOA will have its nonce bumped.

```cpp
// create.hpp#L62-L78
auto message = evmc_message{
// ...
.sender = ctx->env.recipient,
// ...
};
auto result = ctx->host->call(ctx->context, &message);
```

```cpp
// evm.cpp#L202-L209
auto const nonce = state.get_nonce(msg.sender);
if (nonce == std::numeric_limits<decltype(nonce)>::max()) {
    // overflow
    evmc::Result result{EVMC_ARGUMENT_OUT_OF_RANGE, msg.gas};
    call_tracer.on_exit(result);
    return result;
}
state.set_nonce(msg.sender, nonce + 1);
```

## Recommendation 
`DELEGATECALL` and `CALLCODE` should always retain the `EVMC_DELEGATED` flag if it does contain it.

## Addendum 
In the following discussion with evmone maintainers, it was confirmed that this flag was only meant for the no-op precompile logic when an EOA is delegated to the precompile. Hence, we recommend resolving the delegation instead of relying on the `EVMC_DELEGATED` flag.

## Category 
Labs: Fixed in PR 1601.

## Spearbit 
Fix verified.
