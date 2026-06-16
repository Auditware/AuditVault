---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - platform/code4rena
  - sector/gaming
protocol: "[[Forte]]"
auditors:
  - patitonar
report: "https://code4rena.com/reports/2025-04-forte-float128-solidity-library"
genome:
  - "[[integer-bounds]]"
  - "[[logic/wrong-condition]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[misassumption/math-is-safe]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-04] Unwrapping while equating inside the `eq` function fails to account for the set `L_MATISSA_FLAG`

- id: 55706
- impact: HIGH
- protocol: Forte
- reporter: patitonar (Code4rena)
- source: https://code4rena.com/reports/2025-04-forte-float128-solidity-library

## Summary


The `Float128::eq` function is designed to check if two packed floats are equal. However, there is an issue with the way it compares the floats. The problem arises when one float has a 38 digit mantissa and the other has a 72 digit mantissa. This causes the function to return incorrect values. This is a significant issue as the `eq` function is an important part of the library. The recommended solution is to normalize the values before comparing them. A test case has been provided to demonstrate the issue and the proposed solution.

## Details



The [`Float128::eq`](https://github.com/code-423n4/2025-04-forte/blob/4d6694f68e80543885da78666e38c0dc7052d992/src/Float128.sol# L1070) function is designed to return a boolean if the given two packed floats are equal. However, the issue lies with the way the function equates two packed floats via unwrapping:
```

    function eq(packedFloat a, packedFloat b) internal pure returns (bool retVal) {
        retVal = packedFloat.unwrap(a) == packedFloat.unwrap(b);
    }
```

As per the docs, it is clearly mentioned that Mantissa can be of two types M: 38 Digits and L: 72 digits.
```

/****************************************************************************************************************************
 * The mantissa can be in 2 sizes: M: 38 digits, or L: 72 digits                                                             *
 *      Packed Float Bitmap:                                                                                                 *
 *      255 ... EXPONENT ... 242, L_MATISSA_FLAG (241), MANTISSA_SIGN (240), 239 ... MANTISSA L..., 127 .. MANTISSA M ... 0  *
 *      The exponent is signed using the offset zero to 8191. max values: -8192 and +8191.                                   *
 ****************************************************************************************************************************/
```

So if there are two packed floats which are equal in nature upon deduction, but one of them has 38 digit mantissa and other has the 72 digit mantissa, the `eq` function would fail as unwrapping custom float type to underlying type (uint) means that the packed float with 72 digit mantissa will have the `L_MANTISSA_FLAG` set; which would introduce an incorrect unwrapped version than intended leading to false values.

### Impact

The `eq` function is one of the crucial components of the library, this issue renders it useless for scenarios when one of the packed float has the `L_MANTISSA_FLAG` on.

### Recommended mitigation steps

After running through a few different solutions, the recommendation would be to normalise values before equating, further optimizations are made to reduce gas costs:
```

    function eq(packedFloat a, packedFloat b) internal pure returns (bool retVal) {
        // If the bit patterns are equal, the values are equal
        if (packedFloat.unwrap(a) == packedFloat.unwrap(b)) {
            return true;
        }

        // If either is zero (no mantissa bits set), special handling
        bool aIsZero = (packedFloat.unwrap(a) & MANTISSA_MASK) == 0;
        bool bIsZero = (packedFloat.unwrap(b) & MANTISSA_MASK) == 0;

        if (aIsZero && bIsZero) return true;
        if (aIsZero || bIsZero) return false;

        // Getting the mantissa and exponent for each value
        (int mantissaA, int exponentA) = decode(a);
        (int mantissaB, int exponentB) = decode(b);

        // Checking if signs are different
        if ((mantissaA < 0) != (mantissaB < 0)) return false;

        // Getting absolute values
        int absA = mantissaA < 0 ? -mantissaA : mantissaA;
        int absB = mantissaB < 0 ? -mantissaB : mantissaB;

        // Applying exponents to normalize values
        // Convert both to a standard form with normalized exponents

        // Removing trailing zeros from mantissas (binary search kind of optimisation can be made, but later realised mantissas can be 10000000001 as well, sticking with this O(num_of_digits - 1) solution)
        while (absA > 0 && absA % 10 == 0) {
            absA /= 10;
            exponentA += 1;
        }

        while (absB > 0 && absB % 10 == 0) {
            absB /= 10;
            exponentB += 1;
        }

        // Checking if the normalized values are equal
        return (absA == absB && exponentA == exponentB);
    }
```

Below is the test that proves to the issue to be fixed when the mitigation above is replaced with the existing `eq` function:
```

    function testFixedEq() public {
        // Contains 72 digits (71 zeros) and -71 exponent (L Mantissa used here)
        packedFloat packed1 = Float128.toPackedFloat(100000000000000000000000000000000000000000000000000000000000000000000000, -71);

        // This is exactly the same value which would've resulted if packed1 was human readable (a * 10^b)
        packedFloat packed2 = Float128.toPackedFloat(1, 0);

        (int256 mantissa2, int256 exponent2) = packed2.decode();
        (int256 mantissa1, int256 exponent1) = packed1.decode();

        console2.log("Mantissa1: ", mantissa1); // Mantissa1:  100000000000000000000000000000000000000000000000000000000000000000000000
        console2.log("Exponent1: ", exponent1); // Exponent1:  -71
        console2.log("Mantissa2: ", mantissa2); // Mantissa2:  10000000000000000000000000000000000000
        console2.log("Exponent2: ", exponent2); // Exponent2:  -37

        // Eq Passes now
        bool isEqual = Float128.eq(packed1, packed2);
        assertEq(isEqual, true);
    }
```

### Proof of Concept

The below test case can ran inside the `/test` folder by creating a file called `test.t.sol`:
```

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "forge-std/console2.sol";
import "src/Float128.sol";

contract TestingContract is Test {
    using Float128 for packedFloat;
    using Float128 for int256;

function testBrokenEq() public {
        // Contains 72 digits (71 zeros) and -71 exponent (L Mantissa used here)
        packedFloat packed1 = Float128.toPackedFloat(100000000000000000000000000000000000000000000000000000000000000000000000, -71);

        // This is exactly the same value which would've resulted if packed1 was human readable (a * 10^b)
        packedFloat packed2 = Float128.toPackedFloat(1, 0);

        (int256 mantissa2, int256 exponent2) = packed2.decode();
        (int256 mantissa1, int256 exponent1) = packed1.decode();

        console2.log("Mantissa1: ", mantissa1); // Mantissa1:  100000000000000000000000000000000000000000000000000000000000000000000000
        console2.log("Exponent1: ", exponent1); // Exponent1:  -71
        console2.log("Mantissa2: ", mantissa2); // Mantissa2:  10000000000000000000000000000000000000
        console2.log("Exponent2: ", exponent2); // Exponent2:  -37

        // Eq fails
        bool isEqual = Float128.eq(packed1, packed2);
        assertEq(isEqual, false);
    }

}
```

**oscarserna (Forte) confirmed**

---


