---
tags:
  - lang/rust
  - platform/sherlock
  - has/github
  - severity/high
  - sector/zk
protocol: "[[Brevis]]"
auditors:
  - "[[0xpetern]]"
  - "[[1AutumnLeaf777]]"
  - "[[MissDida]]"
  - "[[cergyk]]"
report: "https://github.com/sherlock-audit/2025-08-pico-judging"
genome:
  - "[[missing-check]]"
  - "[[wrong-state]]"
  - "[[circuit-constraint-completeness]]"
---
# H-1: read_write chip does not enforce constraints on opcode selectors

- id: 63632
- impact: HIGH
- protocol: [[Brevis]] Pico ZKVM
- reporter: cergyk (Sherlock)
- source: N/A

## Summary


A bug has been found by a group of people while using an opcode for reading or writing to memory. The issue is that the lookup to the `read_write` chip only checks for the correct use of the `opcode` and `a`, `b`, `c` registers, but does not enforce the flags available in the `local_memory_chip_value_cols.instruction` such as `op_a_0`, `is_lb`, `is_lbu`, etc. This means that these flags can be freely used by the prover to change the read value or the write. The recommendation is to constrain the whole instruction with its opcode selector and `op_a_0` in the `read_write` chip. This issue has been fixed by the protocol team in a recent PR.

## Details


Source: https://github.com/sherlock-audit/2025-08-pico-judging/issues/62 

## Found by 
0xpetern, 1AutumnLeaf777, MissDida, cergyk

### Description

When calling on an opcode for reading/writing to memory, a lookup is made to the `read_write` chip. Unfortunately the lookup only enforces the correct used `opcode`, and `a`, `b`, `c` registers:

[read_write/constraints.rs#L41-L47](https://github.com/brevis-network/pico/blob/3046e89b1c7bf065b7932d859a06a24920d57531/vm/src/chips/chips/riscv_memory/read_write/constraints.rs#L41-L47):
```rust
    builder.looked_instruction(
        local_memory_chip_value_cols.instruction.opcode,
        local_memory_chip_value_cols.op_a_val(),
        local_memory_chip_value_cols.op_b_val(),
        local_memory_chip_value_cols.op_c_val(),
        is_memory_instruction.clone(),
    );
```

As we can see, the flags available in `local_memory_chip_value_cols.instruction`: `op_a_0`, `is_lb`, `is_lbu`, `is_lh`, `is_lhu`, `is_lw`, `is_sb`, `is_sh`, `is_sw` are not enforced, and can be used freely by the prover to change the read value (`op_a_val`) or the write.

[read_write/columns.rs#L97-L119](https://github.com/brevis-network/pico/blob/audit/vm/src/chips/chips/riscv_memory/read_write/columns.rs#L97-L119):
```rust
#[derive(AlignedBorrow, Clone, Copy, Debug, Default)]
#[repr(C)]
pub struct MemoryInstructionCols<T> {
    /// The opcode for this cycle.
    pub opcode: T,


    /// Flags to indicate if op_a is register 0.
    
    //@audit this flag is not constrained in the read_write chip
    pub op_a_0: T,

    /// Memory Instructions.
    //@audit these flags are not constrained in the read_write chip
    pub is_lb: T,
    pub is_lbu: T,
    pub is_lh: T,
    pub is_lhu: T,
    pub is_lw: T,
    pub is_sb: T,
    pub is_sh: T,
    pub is_sw: T,


    pub op_a_access: MemoryReadWriteCols<T>,
    pub op_b_access: MemoryReadCols<T>,
    pub op_c_access: MemoryReadCols<T>,
}
```

### Recommendation
These flags are correctly enforced in the main chip, through the program lookup, but they are not constrained in the `read_write` chip. 

```rust
// Contrain the interaction with program table.
self.looking_program(
    builder,
    local.pc,
    //@audit here the whole instruction with its opcode selectors is looked up.
    local.instruction,
    local.opcode_selector,
    local.is_real,
);
```

Please consider constraining the whole instruction w/ opcode selector and op_a_0 in `read_write` chip. 

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/brevis-network/pico/pull/61
