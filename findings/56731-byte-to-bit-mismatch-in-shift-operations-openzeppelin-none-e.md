---
tags:
  - blockchain/evm
  - lang/yul
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/zk
protocol: "[[zkSync]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/evm-emulator-and-semi-abstracted-nonces-update-audit"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[integer-bounds]]"
  - "[[circuit-input-range-check]]"
---
# Byte-to-Bit Mismatch in Shift Operations

- id: 56731
- impact: HIGH
- protocol: EVM Emulator and Semi-abstracted Nonces Update Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/evm-emulator-and-semi-abstracted-nonces-update-audit

## Summary


The bug report discusses an issue with two functions, modexpGasCost and mloadPotentiallyPaddedValue, in the era-contracts repository. These functions use shift operations that operate on bits, but the code calculates shift amounts in bytes. This results in incomplete or inaccurate shifts, as 1 byte equals 8 bits. This can have negative effects such as distorted parameter reads, exploitability risk, incorrect memory interpretation, and numerical instability. The bug has been resolved in a recent pull request.

## Details

In both [`modexpGasCost`](https://github.com/matter-labs/era-contracts/blob/cc1619cfb03cc19adb21a2071c89415cab1479e8/system-contracts/evm-emulator/EvmEmulatorFunctions.template.yul#L985) and [`mloadPotentiallyPaddedValue`](https://github.com/matter-labs/era-contracts/blob/cc1619cfb03cc19adb21a2071c89415cab1479e8/system-contracts/evm-emulator/EvmEmulatorFunctions.template.yul#L1052) functions, the code calculates shift amounts in bytes but uses them directly with EVM shift instructions, which operate on bits. This results in incomplete or inaccurate shifts, as 1 byte equals 8 bits. Without converting byte-based values into their bit equivalents, the shift operations behave incorrectly.

This mismatch has several negative effects:

* **Distorted Parameter Reads**: When used to trim or isolate components like the base, exponent, or modulus, incorrect shifts may leave behind unintended bits. This can lead to inflated sizes, skewed gas calculations, or corrupted numerical values.
* **Exploitability Risk**: Malicious users may supply inputs that trigger these incorrect shifts, potentially manipulating gas costs or bypassing boundary checks, leading to undefined or exploitable behavior.
* **Incorrect Memory Interpretation**: Code paths intended to mask or sanitize specific bytes may instead leave residual bits intact. This can cause logical errors when interpreting memory content.
* **Numerical Instability**: Misaligned shift results can cause values to overflow or underflow in downstream logic. For instance, malformed bit-lengths derived from exponent parsing may cause loops to run excessively or insufficiently.

Consider ensuring that every shift amount derived from a byte difference is multiplied by 8 before applying any shift operation. This guarantees alignment with EVM's bit-level shift semantics and avoids the wide range of downstream issues stemming from partial shifts.

***Update:** Resolved in [pull request #1383](https://github.com/matter-labs/era-contracts/pull/1383).*
