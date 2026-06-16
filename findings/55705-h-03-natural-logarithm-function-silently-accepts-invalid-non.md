---
tags:
  - lang/solidity
  - sector/options
  - platform/code4rena
  - has/github
  - severity/high
protocol: "[[Forte]]"
auditors:
  - dreamcoder
report: "https://code4rena.com/reports/2025-04-forte-float128-solidity-library"
genome:
  - "[[circuit-input-range-check]]"
  - "[[variant]]"
---
# [H-03] Natural logarithm function silently accepts invalid non-positive inputs

- id: 55705
- impact: HIGH
- protocol: Forte
- reporter: dreamcoder (Code4rena)
- source: https://code4rena.com/reports/2025-04-forte-float128-solidity-library

## Summary


The natural logarithm function in the Ln.sol contract has a vulnerability where it accepts negative numbers and zero as inputs without checking if they are valid. This goes against mathematical principles and can lead to incorrect results and potential financial risks. The vulnerability can be fixed by adding proper input validation to the function.

## Details



<https://github.com/code-423n4/2025-04-forte/blob/4d6694f68e80543885da78666e38c0dc7052d992/src/Ln.sol# L63-L77>

### Summary

The natural logarithm function (`ln()`) in the Ln.sol contract accepts negative numbers and zero as inputs without any validation, despite these inputs being mathematically invalid for logarithmic operations. In mathematics, the natural logarithm is strictly defined only for positive real numbers. When a negative number or zero is passed to the `ln()` function, it silently produces mathematically impossible results instead of reverting.

This vulnerability directly contradicts fundamental mathematical principles that the Float128 library should uphold. The Float128 library documentation emphasizes precision and mathematical accuracy, stating that “Natural Logarithm (ln)” is among its available operations. Yet the implementation fails to enforce the basic domain constraints of the logarithm function.

The lack of input validation means any system relying on this library for financial calculations, scientific modeling, or any mathematical operations involving logarithms will silently receive nonsensical results when given invalid inputs. This undermines the entire trustworthiness of the library’s mathematical foundations.

### Vulnerability details

The `ln()` function in Ln.sol extracts the components of the input number (mantissa, exponent, and flags) but never checks if the input is positive before proceeding with calculations:
```

    function ln(packedFloat input) public pure returns (packedFloat result) {
        uint mantissa;
        int exponent;
        bool inputL;
        assembly {
            inputL := gt(and(input, MANTISSA_L_FLAG_MASK), 0)
            mantissa := and(input, MANTISSA_MASK)
            exponent := sub(shr(EXPONENT_BIT, and(input, EXPONENT_MASK)), ZERO_OFFSET)
        }
        if (
            exponent == 0 - int(inputL ? Float128.MAX_DIGITS_L_MINUS_1 : Float128.MAX_DIGITS_M_MINUS_1) &&
            mantissa == (inputL ? Float128.MIN_L_DIGIT_NUMBER : Float128.MIN_M_DIGIT_NUMBER)
        ) return packedFloat.wrap(0);
        result = ln_helper(mantissa, exponent, inputL);
    }
```

The function extracts the mantissa but ignores the `MANTISSA_SIGN_MASK` (bit 240), which indicates whether the number is negative. The subsequent calculations use this unsigned mantissa value, essentially computing `ln(|input|)` rather than `ln(input)`. When the input is negative, this produces mathematically meaningless results.

To demonstrate this vulnerability, I created two test cases:
```

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "forge-std/console2.sol";
import "src/Float128.sol";
import "src/Ln.sol";
import "src/Types.sol";

contract LnVulnerabilityTest is Test {
    using Float128 for int256;
    using Float128 for packedFloat;

    function testLnWithNegativeInput() public {
        // Create a negative number (e.g., -2.0)
        int mantissa = -2 * 10**37; // Scale to match normalization requirements
        int exponent = -37;  // Adjust for normalization

        // Convert to packedFloat
        packedFloat negativeInput = Float128.toPackedFloat(mantissa, exponent);

        // Verify it's negative
        (int extractedMantissa, int extractedExponent) = Float128.decode(negativeInput);
        console.log("Input mantissa:", extractedMantissa);
        console.log("Input exponent:", extractedExponent);
        console.log("Input is negative:", extractedMantissa < 0);

        // Call ln() with negative input - this should be mathematically invalid
        // but the function doesn't validate and will return a result
        packedFloat result = Ln.ln(negativeInput);

        // Output the result
        (int resultMantissa, int resultExponent) = Float128.decode(result);
        console.log("Result mantissa:", resultMantissa);
        console.log("Result exponent:", resultExponent);

        // The fact that we got here without reversion proves the vulnerability
        console.log("Vulnerability confirmed: ln() accepted negative input");
    }

    function testLnWithZeroInput() public {
        // Create a zero
        packedFloat zeroInput = Float128.toPackedFloat(0, 0);

        // Call ln() with zero input - this should be mathematically invalid
        // but the function doesn't validate and will return a result
        packedFloat result = Ln.ln(zeroInput);

        // Output the result
        (int resultMantissa, int resultExponent) = Float128.decode(result);
        console.log("Result mantissa:", resultMantissa);
        console.log("Result exponent:", resultExponent);

        // The fact that we got here without reversion proves the vulnerability
        console.log("Vulnerability confirmed: ln() accepted zero input");
    }
}
```

Running these tests with Foundry produced the following results:
```

[PASS] testLnWithNegativeInput() (gas: 37435)
Logs:
  Input mantissa: -20000000000000000000000000000000000000
  Input exponent: -37
  Input is negative: true
  Result mantissa: 69314718055994530941723212145817656807
  Result exponent: -38
  Vulnerability confirmed: ln() accepted negative input
[PASS] testLnWithZeroInput() (gas: 65407)
Logs:
  Result mantissa: -18781450104493291890957123580748043517
  Result exponent: -33
  Vulnerability confirmed: ln() accepted zero input
Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 12.55ms (9.01ms CPU time)
Ran 1 test suite in 84.39ms (12.55ms CPU time): 2 tests passed, 0 failed, 0 skipped (2 total tests)
```

These results clearly demonstrate that:

1. For a negative input of -2.0, the function returns a value approximately equal to `ln(2) ≈ 0.693`.
2. For an input of 0, the function returns a large negative finite number.

Both results are mathematically invalid. The natural logarithm of a negative number is a complex number with a real and imaginary part, not a real number. The natural logarithm of zero is negative infinity, not a finite value.

What’s particularly concerning is how the function appears to work by using the absolute value of the input for negative numbers. This gives no indication to callers that they’ve passed invalid input, making the error especially difficult to detect.

### Impact

The silent acceptance of invalid inputs by the `ln()` function has far-reaching consequences:

1. **Mathematical Integrity Violation**: The fundamental integrity of mathematical operations is compromised. Users expect a mathematical library to either produce correct results or fail explicitly when given invalid inputs.
2. **Silent Failure Mode**: The function gives no indication that it received invalid input, making debugging nearly impossible. Users may be completely unaware that their calculations are based on mathematically impossible values.
3. **Financial Calculation Risks**: If this library is used in financial applications, incorrect logarithmic calculations could lead to severe financial miscalculations. For example, in compounding interest calculations, option pricing models, or risk assessments that rely on logarithmic functions.
4. **Cascading Errors**: The invalid results will propagate through any system using these calculations, potentially causing widespread computational integrity issues that become increasingly difficult to trace back to their source.

### Tools Used

Foundry

### Recommendation

To fix this vulnerability, proper input validation should be added to the `ln()` function:
```

function ln(packedFloat input) public pure returns (packedFloat result) {
    // Check if input is zero
    if (packedFloat.unwrap(input) == 0) {
        revert("ln: input must be positive, zero is invalid");
    }

    // Check if input is negative (MANTISSA_SIGN_MASK is bit 240)
    if (packedFloat.unwrap(input) & MANTISSA_SIGN_MASK > 0) {
        revert("ln: input must be positive, negative is invalid");
    }

    // Continue with existing code...
    uint mantissa;
    int exponent;
    bool inputL;
    assembly {
        inputL := gt(and(input, MANTISSA_L_FLAG_MASK), 0)
        mantissa := and(input, MANTISSA_MASK)
        exponent := sub(shr(EXPONENT_BIT, and(input, EXPONENT_MASK)), ZERO_OFFSET)
    }

    if (
        exponent == 0 - int(inputL ? Float128.MAX_DIGITS_L_MINUS_1 : Float128.MAX_DIGITS_M_MINUS_1) &&
        mantissa == (inputL ? Float128.MIN_L_DIGIT_NUMBER : Float128.MIN_M_DIGIT_NUMBER)
    ) return packedFloat.wrap(0);

    result = ln_helper(mantissa, exponent, inputL);
}
```

This ensures the function explicitly fails when given mathematically invalid inputs, maintaining the integrity of the mathematical operations and preventing silent failures that could lead to system-wide computational errors.

**Gordon (Forte) confirmed**

---


