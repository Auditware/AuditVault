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
  - "[[circuit-input-range-check]]"
---
# H-2: Word range check uses unconstrained `upper_all_one` local variable when field prime is `Mersenne31`

- id: 63633
- impact: HIGH
- protocol: [[Brevis]] Pico ZKVM
- reporter: cergyk (Sherlock)
- source: N/A

## Summary


This bug report discusses a problem found by a group of people while reviewing a code on GitHub. The issue is related to a gadget used to check the range of a word in a specific field type. The comments in the code correctly describe the method for checking the word, but a line that enforces the constraint is commented out, leaving the gadget unconstrained. This means that the gadget can return a true value for a word that is not valid, which can cause problems. The recommendation is to simply uncomment the constraint line to fix the issue. The discussion section mentions that the protocol team has already fixed the issue in a recent pull request.

## Details


Source: https://github.com/sherlock-audit/2025-08-pico-judging/issues/69 

## Found by 
0xpetern, 1AutumnLeaf777, MissDida, cergyk

### Description

The comments under the gadget used to enforce field prime range check for a word when field type is Mersenne31 are correct; They describe the correct methodology for checking that the word is indeed lower than Mersenne31 prime modulus. Unfortunately, the line which enforces the constraint on the column `cols.upper_all_one` is commented, leaving the whole gadget unconstrained:

[field_range_check/word_range.rs#L121-L138](https://github.com/sherlock-audit/2025-08-pico/blob/main/pico/vm/src/chips/gadgets/field_range_check/word_range.rs#L121-L138):
```rust
    FieldType::TypeMersenne31 => {
        // Mersenne31 Modulus in big endian format
        // 01111111 11111111 11111111 11111111
        // 2^31 - 1


        // All the four bytes are all within a certain range:
        // 00000000 <= bytes[3] <= 01111111
        // 00000000 <= bytes[2] <= 11111111
        // 00000000 <= bytes[1] <= 11111111
        // 00000000 <= bytes[0] <= 11111111
        // which means 00000000 <= sum(bytes) <= 127 + 255 * 3,
        // which means word == 2^31 - 1 <=> sum(bytes) == 127 + 255 * 3.
        // Therefore, we use the IsZeroGadget to guarantee that sum(bytes) != 127 + 255 * 3.
        let mut byte_sum = value[0] + value[1] + value[2] + value[3];
        byte_sum -= AB::F::from_canonical_u32(127u32 + 255 * 3).into();
        //@audit-ok commented line constrains `upper_all_one`
        // IsZeroGadget::<F>::eval(builder, byte_sum, cols.upper_all_one, is_real.clone());
        builder.when(is_real).assert_zero(cols.upper_all_one.result)
    }
```

As a result the gadget can return true for the word `01111111 11111111 11111111 11111111` which is not valid (equal to the prime modulus). 

### Recommendation

Consider simply uncommenting the constraint line:

```diff
    FieldType::TypeMersenne31 => {
        // Mersenne31 Modulus in big endian format
        // 01111111 11111111 11111111 11111111
        // 2^31 - 1


        // All the four bytes are all within a certain range:
        // 00000000 <= bytes[3] <= 01111111
        // 00000000 <= bytes[2] <= 11111111
        // 00000000 <= bytes[1] <= 11111111
        // 00000000 <= bytes[0] <= 11111111
        // which means 00000000 <= sum(bytes) <= 127 + 255 * 3,
        // which means word == 2^31 - 1 <=> sum(bytes) == 127 + 255 * 3.
        // Therefore, we use the IsZeroGadget to guarantee that sum(bytes) != 127 + 255 * 3.
        let mut byte_sum = value[0] + value[1] + value[2] + value[3];
        byte_sum -= AB::F::from_canonical_u32(127u32 + 255 * 3).into();
-       // IsZeroGadget::<F>::eval(builder, byte_sum, cols.upper_all_one, is_real.clone());
+       IsZeroGadget::<F>::eval(builder, byte_sum, cols.upper_all_one, is_real.clone());
        builder.when(is_real).assert_zero(cols.upper_all_one.result)
    }
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/brevis-network/pico/pull/61
