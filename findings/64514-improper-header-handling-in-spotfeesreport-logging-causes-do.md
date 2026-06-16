---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - sector/dex
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/pda/missing-seeds-check
  - impact/dos/permanent
  - novelty/variant
  - fix/add-check
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[missing-seeds-check]]"
  - "[[permanent]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[pda-derivation]]"
---
# Improper header handling in `SpotFeesReport` logging causes DoS on swap instruction

- id: 64514
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


This bug report is about a function called `match_orders` which has an issue with handling a variable called `client.header`. The function works fine when the variable is empty, but it fails when the value of `total_fees` is greater than 0. This bug can cause a permanent denial of service (DOS) when the user is trying to use the swap instruction. The recommended solution is to handle this issue gracefully instead of causing the function to fail. The bug has been fixed in a recent update and has been verified by the team.

## Details

**Description:** In `match_orders`, `ref_payment` handles `client.header` being None by defaulting to 0, but `ref_client_id` uses `ok_or` and returns an error if `header` is None. This causes the function to fail when `total_fees` > 0 and `header` is None.

```rust
            solana_program::log::sol_log_data(&[bytemuck::bytes_of::<SpotFeesReport>(
                &SpotFeesReport {
                    tag: log_type::SPOT_FEES,
                    fees: total_fees,
                    ref_payment,
                    ref_client_id: client
                        .header
                        .as_ref()
                        .ok_or(drv_err!(DeriverseErrorKind::ClientPrimaryAccountMustBeSome))?
                        .ref_client_id,
                    ..SpotFeesReport::zeroed()
                },
            )]);
```

This will always happen when the user is using the swap instruction.

**Impact:** The impact is high, as this issue results in a permanent DOS whenever the swap instruction is executed and `total_fees > 0` is true.

**Recommended Mitigation:** Consider handling this gracefully instead of reverting when the header is None.

**Deriverse:** Fixed in commit [4f7bc8](https://github.com/deriverse/protocol-v1/commit/4f7bc8ac68325aa93b339ff91c0ac794ea17ffd9).

**Cyfrin:** Verified.
