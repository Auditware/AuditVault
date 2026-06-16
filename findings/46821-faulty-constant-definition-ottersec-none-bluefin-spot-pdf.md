---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/dex
protocol: "[[Bluefin Spot]]"
auditors:
  - "[[Michał Bochnak]]"
report: "https://bluefin.io/"
genome:
  - "[[wrong-condition]]"
  - "[[integer-bounds]]"
  - "[[direct-drain]]"
---
# Faulty Constant Definition

- id: 46821
- impact: HIGH
- protocol: [[Bluefin Spot]]
- reporter: Michał Bochnak (OtterSec)
- source: https://bluefin.io/

## Summary


The report states that there is a bug in the code where the constant MAX_u64 is missing a character, resulting in it being one character shorter than it should be. This causes problems when performing bitwise operations and can lead to incorrect calculations. To fix this, the constant needs to be corrected to include the missing character. This bug has been resolved in a recent patch. 

## Details

## MAX_u64 Constant Issue

The constant `MAX_u64` is supposed to represent the maximum value of a 64-bit unsigned integer, which is \(2^{64} - 1\). In hexadecimal, this value should be represented as `0xFFFFFFFFFFFFFFFF`, which consists of 16 hexadecimal characters. However, in the current declaration, there is an `f` missing, resulting in the length of the constant being 15 characters instead of the required 16.

> _sources/maths/bit_math.move_

```move
public fun least_significant_bit(mask: u256) : u8 {
    assert!(mask > 0, 0);
    let bit = 255;
    [...]
    if (mask & (constants::max_u64() as u256) > 0) {
        bit = bit - 64;
    } else {
        mask = mask >> 64;
    };
    [...]
    bit
}
```

Since `MAX_u64` is incorrectly defined, it results in improper bitwise operations when determining the least significant bit (LSB) of the input mask in `least_significant_bit`. Specifically, the function checks if `mask & max_u64` is greater than 0 to determine if any bits in the least significant 64 bits are set. If this constant is one character short, it effectively ignores the highest bit (the most significant bit in the 64-bit range) when performing this check. This is particularly critical because this function is utilized to search for the next initialized tick, and thus, it may result in the calculation of an incorrect tick position.

## Remediation

Correct the definition of `MAX_u64` constant to include the missing character `f`, ensuring it has the correct value and length of 16 characters.

## Patch

Resolved in `f9025e9`.
