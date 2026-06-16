---
tags:
  - blockchain/starknet
  - lang/cairo
  - sector/zk
  - platform/cantina
  - has/poc
  - severity/high
  - novelty/known-pattern
protocol: "[[OpenVM]]"
auditors:
  - "[[Leo Alt]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[integer-bounds]]"
  - "[[circuit-input-range-check]]"
---
# timestampcan overﬂow 

- id: 53416
- impact: HIGH
- protocol: [[OpenVM]]
- reporter: Leo Alt (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


This bug report discusses an issue with the timestamp in a virtual machine that can lead to incorrect and malicious program paths being executed. The problem occurs when the timestamp overflows the modulus, allowing an attacker to reorder the witness in an address space and manipulate the program results. This can be exploited by writing a program that uses a large number of units before the chip reaches a certain height. The recommendation is to range-constrain the timestamp to 30 bits, and the issue has been fixed in the latest commits. 

## Details

## Vulnerability Report

## Context
(No context files were provided by the reviewer)

## Summary
The VM's timestamp can overflow BabyBear's modulus, leading to invalid program paths being successfully executed, proved, and verified.

## Finding Description
The Offline Memory argument in OpenVM relies on LogUp receives and sends of memory (any space) accesses, where each access has a monotonically increasing timestamp. Given two consecutive accesses `(addr, time1)` and `(addr, time2)`, `time2 > time1` is required and enforced by a constraint that `time2 − time1 + 1` fits in 29 bits.

The graph above shows a memory bus example where the origin and destination of an edge are a bus send and receive, respectively. Even though the difference between two timestamps is constrained, the timestamp itself is not and can overflow the field's modulus.

## Impact Explanation
If the timestamp overflows, an attacker can reorder the witness in an address space to execute wrong and malicious program paths. The graph below shows an example of an honest path in the overflow scenario. However, an attacker could reorder the bus interactions to the following graph:

The bus interactions would be accepted by the verifier because all constraints are met, but note that the final memory values are simply wrong and the program results would be completely different from intended. A malicious prover could attempt to tweak the overflow to an advantageous program path. Note that the issue affects all address spaces.

## Likelihood Explanation
In order to overflow the timestamp, the prover would need to write a program that uses `ptimestamp` units before a chip reaches height 225 (discussed in the finding "Overflow possible in bus argument") and requires a new segment. Computing such a large proof is computationally expensive. However, it would be feasible and still accepted by the verifier.

## Proof of Concept
Each program instruction increases the timestamp by a certain amount, usually a small value like 3. More complex instructions can increase the timestamp by larger deltas, such as Keccak (46) and Bls12_381 (864). Designing such an exploit still requires considerable engineering work, so in the interest of time, we describe a general strategy of:
- Using 225 as the height for chips per segment.
- Using complex circuits such as Keccak and Bls12_381 for many iterations.
- Minimizing memory accesses between iterations.
- Perhaps a hand-written assembly program is required.

## Recommendation
The timestamp could be range-constrained to 30 bits.

## OpenVM
Fixed in commits 4062cadf and b92feee7. The LogUp linear equalities on trace heights together with a new condition that we require VM instruction executor chips to satisfy ensures that the timestamp does not overflow the field. We then range check the final timestamp in the Connector Chip.

We state the new condition in the circuit spec (`circuit.md`) together with an inspection of all existing chips to justify that they satisfy the condition. 

In commit b92feee7, we further constrain that the initial timestamp must be 0 in `PersistentBoundaryAir` (it is already constrained in `VolatileBoundaryAir`).

## Cantina Managed
Fix verified.
