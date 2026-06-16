---
tags:
  - severity/high
  - lang/rust
  - sector/zk
  - platform/cantina
protocol: "[[OpenVM]]"
auditors:
  - cergyk
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[circuit-constraint-completeness]]"
  - "[[accumulator-index-ordering]]"
  - "[[logic/wrong-condition]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[variant]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# Invalid Divrem chip row can send arbitrary bitwise range check with multiplicity -1 (equiv- alent to receive) 

- id: 53429
- impact: HIGH
- protocol: OpenVM
- reporter: cergyk (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


The report discusses a bug found in the Divrem chip that can be exploited by a prover to manipulate the results of other chips. The bug is caused by a missing constraint that allows the prover to insert a row with a multiplicity of -1, which is equivalent to "receiving" the range check. This vulnerability can be used to demonstrate that any pair of values is valid, and to forge results using out-of-range values. The report recommends adding a constraint to fix the issue, which was successfully implemented in a later version of the chip. The fix has been verified by Cantina Managed.

## Details

## Context: core.rs#L282

## Description
The Divrem chip uses a bitwise range check to ensure that two F numbers are valid 16-bit limbs, with multiplicity defined as `is_valid - special_case`. Unfortunately, there is no constraint requiring `special_case` to be true only when `is_valid` is true. This oversight means the prover can insert a row that emits the `send_range` over the bitwise bus with a multiplicity of -1 (which is equivalent to "receiving" the range check).

### Relevant Code
```rust
// divrem/core.rs#L280-L282.
self.bitwise_lookup_bus
    .send_range(cols.lt_diff - AB::Expr::ONE, AB::F::ZERO)
    .eval(builder, is_valid.clone() - special_case);
```

As a result, the prover can assert that any pair `(F, 0)` is a valid pair of 16-bit limbs, allowing it to forge results from other chips using out-of-range limb values typically checked by `send_range` over the bitwise bus. It is important to note that the second pair argument for the receive must necessarily be zero.

Additionally, a similar expression is utilized in `modular_chip`, where `is_setup` is properly constrained to be equal to 1 only when `is_valid` is.

### Relevant Code in Modular Chip
```rust
// modular_chip/is_eq.rs#L122:
builder.when(cols.is_setup).assert_one(cols.is_valid);

// modular_chip/is_eq.rs#L209-L214:
self.bus
    .send_range(
        cols.b_lt_diff - AB::Expr::ONE,
        cols.c_lt_diff - AB::Expr::ONE,
    )
    .eval(builder, cols.is_valid - cols.is_setup);
```

## Recommendation
To rectify this issue, it is recommended to apply a similar constraint on the Divrem chip (as seen in divrem/core.rs#L280-L282):
```rust
self.builder.when(special_case).assert_one(is_valid.clone());
self.bitwise_lookup_bus
    .send_range(cols.lt_diff - AB::Expr::ONE, AB::F::ZERO)
    .eval(builder, is_valid.clone() - special_case);
```

## OpenVM
The issue has been fixed in commit `889a8446`. The fix introduced the following code:
```rust
let valid_and_not_special_case = is_valid.clone() - special_case.clone();
builder.assert_bool(valid_and_not_special_case.clone());
```
This addresses the security issue where an arbitrary number of bitwise range checks with multiplicity -1 could be sent via the DivRem chip, as its count was calculated as `is_valid - special_case`. The resolution ensures that when `special_case == 1`, it is necessary to have `is_valid == 1`.

## Cantina Managed
The fix has been verified.
