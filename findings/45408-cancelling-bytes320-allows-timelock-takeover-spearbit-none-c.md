---
tags:
  - lang/solidity
  - sector/governance
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/pda/reinitialization
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/initialize-proxy
protocol: "[[Solady]]"
auditors:
  - "[[Kaden]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Solady-Coinbase-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[reinitialization]]"
  - "[[variant]]"
  - "[[admin-takeover]]"
  - "[[initializer-auth]]"
  - "[[pda-derivation]]"
  - "[[timelock-timestamp-bypass]]"
---
# Cancelling bytes32(0) allows Timelock takeover

- id: 45408
- impact: HIGH
- protocol: Coinbase [[Solady]]
- reporter: Kaden (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Solady-Coinbase-Spearbit-Security-Review-December-2024.pdf

## Summary


The report discusses a critical bug in the Timelock contract, specifically in the cancel() function. This function is supposed to allow anyone with the CANCELLER_ROLE to cancel a previously proposed operation by providing a unique id. However, the function does not validate the id provided, which means it can be used to clear any storage slot that matches a specific pattern. This can be exploited to clear the storage slot for the minimum delay, allowing someone to reinitialize the contract and take control of the Timelock with zero delay. The recommendation is to modify the cancel() function to compute the id hash itself, preventing the manipulation of unrelated storage slots. The bug has been fixed in a recent pull request and verified by a third party.

## Details

## Severity: Critical Risk

## Context
`Timelock.sol#L207-L222`

## Description
The `cancel()` function in the Timelock contract is intended to allow anyone with the `CANCELLER_ROLE` to cancel a previously proposed operation. Operations are identified by a unique `bytes32` id derived by hashing the operation data. The `cancel()` function takes this id as input and clears the associated storage slot for the operation:

```solidity
function cancel(bytes32 id) public virtual onlyRole(CANCELLER_ROLE) {
    /// @solidity memory-safe-assembly
    assembly {
        let s := xor(shl(72, id), _TIMELOCK_SLOT) // Operation slot.
        let p := sload(s)
        if or(and(1, p), iszero(p)) {
            mstore(0x00, 0xd639b0bf) // `TimelockInvalidOperation(bytes32,uint256)`.
            mstore(0x20, id)
            mstore(0x40, 6) // `(1 << OperationState.Waiting) | (1 << OperationState.Ready)`
            revert(0x1c, 0x44)
        }
        sstore(s, 0) // Clears the operation's storage slot.
        // Emits the {Cancelled} event.
        log2(0x00, 0x00, _CANCELLED_EVENT_SIGNATURE, id)
    }
}
```

Notice that the storage slot associated with the id is calculated by XORing the upper 184 bits of the id (after shifting left by 72 bits) with the 72 bits of `_TIMELOCK_SLOT`. Since this implementation takes the id directly as input, there is no validation to ensure that the id is actually derived from a hash corresponding to a previously proposed operation. As a result, the `cancel()` function can be used to clear any storage slot whose last 9 bytes match `_TIMELOCK_SLOT`, provided the value in the slot has a least significant bit of 0 (as this bit represents the status of the operation).

This issue is particularly problematic because the `_TIMELOCK_SLOT` storage slot itself stores the negation of the minimum delay for the Timelock. So, if someone with the `CANCELLER_ROLE` calls `cancel()` with `id == bytes32(0)`, the storage slot for the minimum delay will be cleared. Note that since the least significant bit of the slot's value must be 0, and since the negation of the minimum delay is stored in the slot, the original minimum delay must be an odd number for this exploit to work.

Clearing the minimum delay allows the `initialize()` function to be called again, as the contract relies on a zero check on the minimum delay to prevent multiple initializations. This means that any user with the `CANCELLER_ROLE` can call `cancel(0)` and reinitialize the contract, effectively taking over the Timelock with zero delay.

## Recommendation
Consider modifying the `cancel()` function to take the operation data as input so the function can compute the `bytes32` id hash itself. This approach would ensure cancellers cannot provide arbitrary id values to manipulate storage slots unrelated to operations.

## Solady
Fixed in PR 1231.

## Spearbit
Verified. The storage slot `s` for an operation is now calculated as follows:

```solidity
mstore(0x09, _TIMELOCK_SLOT)
mstore(0x00, id)
let s := keccak256(0x00, 0x29) // Operation slot.
```

This resolves the issue because any invalid id provided to `cancel()` will hash to a unique slot, preventing conflicts with other non-operation storage slots.
