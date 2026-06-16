---
tags:
  - platform/ottersec
  - lang/rust
  - severity/high
  - sector/dex
protocol: "[[Ellipsis]]"
auditors:
  - "[[Robert Chen]]"
report: "https://ellipsislabs.xyz/"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# SDK Transaction Spoofing

- id: 48355
- impact: HIGH
- protocol: [[Ellipsis]]
- reporter: Robert Chen (OtterSec)
- source: https://ellipsislabs.xyz/

## Summary


The Phoenix SDK has a bug where it fails to properly handle errors when parsing events from transactions. This can lead to inaccurate log events being processed and potentially causing a denial of service for users of the SDK. The issue has been identified and a patch has been released to fix it.

## Details

## Event Parsing in Phoenix SDK

When parsing events from transactions, the Phoenix SDK iterates over all the inner instructions to try and parse out `PhoenixInstruction::Log` instructions. Unfortunately, this loop fails to return when the transaction has errored, as specified in the `is_err` field.

## Code Example

```rust
for inner_ixs in tx.inner_instructions.iter() {
    for inner_ix in inner_ixs.iter() {
        let current_program_id = inner_ix.instruction.program_id.clone();
        if current_program_id != phoenix::id().to_string() {
            continue;
        }
        if inner_ix.instruction.data.is_empty() {
            continue;
        }
    }
}
```

If a malicious user were to manually invoke the Phoenix program from a separate on-chain program, inaccurate log events could be subsequently processed in `parse_phoenix_events`. In conjunction with OS-EPS-SUG-02, this could lead to a denial of service condition for users of the SDK.

## Remediation

Check if the transaction was successfully completed, and if not, skip processing of the transaction.

## Patch

Resolved in #50.
