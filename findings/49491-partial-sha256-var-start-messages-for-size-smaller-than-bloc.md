---
tags:
  - blockchain/evm
  - lang/noir
  - platform/consensys
  - severity/high
  - sector/privacy
protocol: "[[ZK Email Noir]]"
auditors:
  - "[[Heiko Fisch]]"
report: "https://diligence.consensys.io/audits/2024/12/zk-email-noir/"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[circuit-constraint-completeness]]"
---
# partial_sha256_var_start Messages for Size Smaller Than BLOCK_SIZE Returns the Same Hash State h for All Data

- id: 49491
- impact: HIGH
- protocol: [[ZK Email Noir]]
- reporter: Heiko Fisch (ConsenSys)
- source: https://diligence.consensys.io/audits/2024/12/zk-email-noir/

## Summary


The bug report describes an issue with the `partial_sha256_var_start` function, which is used for hashing data using the SHA256 algorithm. When the data being hashed is smaller than a certain size, the function does not perform any hashing and returns the same hash for all data of that size. This can be problematic as it can falsely indicate that different data has the same hash. The report suggests two solutions for addressing this issue, either by handling small data sizes or by requiring a minimum size for the data being hashed.

## Details

#### Description

As a special case of the issue described in [issue 5.5](#partial_sha256_var_start-with-message-sizes-not-multiple-of-block_size-gives-same-h-state-for-different-data) , when an array of size `N` is smaller than `BLOCK_SIZE`, the function `partial_sha256_var_start` does not even go into the logical loop to perform any hashing due to calculating the number of loops based on `N`:

**lib/src/partial\_hash.nr:L79-L84**

```
let num_blocks = N / BLOCK_SIZE;
let mut msg_block: [u8; BLOCK_SIZE] = [0; BLOCK_SIZE];
let mut h: [u32; 8] = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]; // Intermediate hash, starting with the canonical initial value
let mut msg_byte_ptr = 0; // Pointer into msg_block
for i in 0..num_blocks {

```

Since `num_blocks=0` in this case, the loops are skipped and the hash state `h` remains unchanged after its initialization. Consequently, it is returned in its original state for all data passed to this function that is smaller than `BLOCK_SIZE`.

Practically, this can be used to prove that any sufficiently small data returns the same hash, which is false.

#### Recommendation

This can be addressed in two ways:

* Handle small data sizes by addressing this special case and complete the full hash with all the necessary SHA256 padding.
* Require `N` to be at least `BLOCK_SIZE` big.
