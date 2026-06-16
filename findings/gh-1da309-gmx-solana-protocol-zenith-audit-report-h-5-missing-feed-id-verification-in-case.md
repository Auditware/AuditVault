---
tags:
  - blockchain/solana
  - lang/rust
  - platform/zenith
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/oracle
protocol: "[[GMX Solana]]"
auditors:
  - "[[Zenith]]"
genome:
  - "[[wrong-feed]]"
  - "[[indirect-loss]]"
  - "[[oracle-freshness]]"
---
# Missing Feed ID Verification in Case of Switchboard Provider

- id: gh-1da309
- impact: HIGH
- protocol: [[GMX Solana]]
- reporter: Zenith
- source: https://github.com/zenith-audit/gmx-solana

## Summary

Missing feed ID verification when using the Switchboard oracle provider. The protocol does not verify that the price feed account matches the expected feed ID, allowing an attacker to substitute a manipulated or incorrect feed account to obtain wrong prices.

## Status

Resolved
