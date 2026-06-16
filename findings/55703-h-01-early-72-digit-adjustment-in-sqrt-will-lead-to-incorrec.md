---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/gaming
protocol: "[[Forte]]"
auditors:
  - 0xcrazyboy999
report: "https://code4rena.com/reports/2025-04-forte-float128-solidity-library"
genome:
  - "[[integer-bounds]]"
  - "[[variant]]"
---
# [H-01] Early 72-digit adjustment in sqrt will lead to incorrect result exponent calculation

- id: 55703
- impact: HIGH
- protocol: Forte
- reporter: 0xcrazyboy999 (Code4rena)
- source: https://code4rena.com/reports/2025-04-forte-float128-solidity-library

## Summary


The bug report discusses a vulnerability in the `sqrt` function of the `Uint512` library. This vulnerability causes the exponent part of the calculation to be incorrect, resulting in a wrong calculation result. The recommended mitigation steps involve adjusting the order of operations in the code. A proof of concept is provided to demonstrate the issue.

## Details



The vulnerability resides in `sqrt` function. For sufficiently large numbers, `sqrt` function utilizes `Uint512` library to calculate mantissa part (`rMan`) of sqrt of a given number.

[**File: 2025-04-forte/src/Float128.sol**](https://github.com/code-423n4/2025-04-forte/blob/f3a4c51baf1dc11d6efdb20b675dfe1efb54be9b/src/Float128.sol# L719-L734):
```

719: if (
720:             (aL && aExp > int(ZERO_OFFSET) - int(DIGIT_DIFF_L_M - 1)) ||
721:             (!aL && aExp > int(ZERO_OFFSET) - int(MAX_DIGITS_M / 2 - 1))
722:         ) {
723:             if (!aL) {
724:                 aMan *= BASE_TO_THE_DIGIT_DIFF;
725:                 aExp -= int(DIGIT_DIFF_L_M);
726:             }
727:
728:             aExp -= int(ZERO_OFFSET);
729:             if (aExp % 2 != 0) {
730:                 aMan *= BASE;
731:                 --aExp;
732:             }
733:@>           (uint a0, uint a1) = Uint512.mul256x256(aMan, BASE_TO_THE_MAX_DIGITS_L);
734:             uint rMan = Uint512.sqrt512(a0, a1);
```

Exponent part (`rExp`) is basically `rExp = aExp / 2`, except there are minor adjustment to set mantissa part to have exactly 38 or 72 digits:

[**File: 2025-04-forte/src/Float128.sol**](https://github.com/code-423n4/2025-04-forte/blob/f3a4c51baf1dc11d6efdb20b675dfe1efb54be9b/src/Float128.sol# L735-L749):
```

735: int rExp = aExp - int(MAX_DIGITS_L);
736:             bool Lresult = true;
737:             unchecked {
738:@>               if (rMan > MAX_L_DIGIT_NUMBER) {
739:@>                   rMan /= BASE;
740:@>                   ++rExp;
741:@>               }
742:@>               rExp = (rExp) / 2;
743:                 if (rExp <= MAXIMUM_EXPONENT - int(DIGIT_DIFF_L_M)) {
744:                     rMan /= BASE_TO_THE_DIGIT_DIFF;
745:                     rExp += int(DIGIT_DIFF_L_M);
746:                     Lresult = false;
747:                 }
748:                 rExp += int(ZERO_OFFSET);
749:             }
```

L738-L741 does the following thing:

> If `rMan` has 73 digits (L738), adjust to it to have 72 digits and increment `rExp` by 1.

L742 does the following thing:

> Divide `rExp` by 2 because exponent is halved by sqrt operation.

The problem is:

> Halving (L742) should take place before the digit adjustment (L738-L741).

To help understanding, we’ll investigate in depth in POC section with a concrete example.

*Notice that the second part of sqrt function, where sqrt is calculated without using Uint512 library, [halving takes place before adjustment](https://github.com/code-423n4/2025-04-forte/blob/f3a4c51baf1dc11d6efdb20b675dfe1efb54be9b/src/Float128.sol# L824-L829), so no such vulnerability is observed.*

### Impact

The result exponent will be wrong (off-by-one), which will lead to blatantly wrong calculation result.

### Recommended mitigation steps

The following diff will fix the issue:
```

diff --git a/src/Float128.sol b/src/Float128.sol
index 7637d83..a8dbb2e 100644
--- a/src/Float128.sol
+++ b/src/Float128.sol
@@ -735,11 +735,11 @@ library Float128 {
             int rExp = aExp - int(MAX_DIGITS_L);
             bool Lresult = true;
             unchecked {
+                rExp = (rExp) / 2;
                 if (rMan > MAX_L_DIGIT_NUMBER) {
                     rMan /= BASE;
                     ++rExp;
                 }
-                rExp = (rExp) / 2;
                 if (rExp <= MAXIMUM_EXPONENT - int(DIGIT_DIFF_L_M)) {
                     rMan /= BASE_TO_THE_DIGIT_DIFF;
                     rExp += int(DIGIT_DIFF_L_M);
```

### Proof of Concept

**Scenario:**

* We consider a `packedFloat` `float` with 72-digits, which is equivalent to `3.82e2338` in real number
* We will calculate `sqrt(float) = result` using Float128 library
* Expected result is approx. `1.95e1169`
* However, actual result is approx. `1.95e1168` due to vulnerability
* We verify actual result is wrong by calculating `float / (result * result)`

  + If the result is correct, this should be around 1
  + However, the verification returns a number `>` 99
  + This means `rExp` is calculated incorrectly (off-by-one) due to reported vulnerability

Put the following content in `test/poc.t.sol` and run `forge test --match-test testH01POC -vvv`
```

pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "src/Float128.sol";
import {Ln} from "src/Ln.sol";
import {Math} from "src/Math.sol";
import {packedFloat} from "src/Types.sol";

contract ForteTest is Test {
    using Float128 for packedFloat;

    function testH01POC() external {
        int256 mantissa = 382000000000000000000000000000000000000000000000000000000000000000000000;
        int256 exponent = 2267;
        // float = 3.82e2338
        packedFloat float = Float128.toPackedFloat(mantissa, exponent);
        // expected result = 1.95e1169
        packedFloat result = float.sqrt();
        // actual result = 1.95e1168
        _debug("result", result);
        // float / (result * result) > 99
        assertTrue(float.div(result.mul(result)).gt(Float128.toPackedFloat(99, 0)));
    }

    function _debug(string memory message, packedFloat float) internal {
        console.log(message);
        _debug(float);
    }

    function _debug(packedFloat float) internal {
        (int256 mantissa, int256 exponent) = float.decode();
        emit log_named_uint("\tunwrapped", packedFloat.unwrap(float));
        emit log_named_int("\tmantissa", mantissa);
        emit log_named_uint(
            "\tmantissa digits", Float128.findNumberOfDigits(packedFloat.unwrap(float) & Float128.MANTISSA_MASK)
        );
        emit log_named_int("\texponent", exponent);
    }
}
```

**Deep dive:**

* In L734, `rMan` is `sqrt(3.82e72 * 1e71)`, and Uint512 library returns a number with 73 digits
* In L735, `rExp` is `aExp - 72 = 2266 - 72 = 2194`
* At this point, `rMan` and `rExp / 2` are correct result of sqrt

  + `rExp / 2 = 2194 / 2 = 1097`
  + `rMan` is 73 digits number
  + So result will be something like `1.95e1098`
* However, since `rMan` has 73 digits, library tries to trim it to 72 digits in L738~L741

  + `rMan /= 10`
  + `rExp = (rExp + 1) = 2195`
* rExp is halved in L742 to get final exponent:

  + `rExp = 2195 / 2 = 1097`

After trimming, `rMan` is divided by 10 but `rExp` remains 1097, the same number before trimming. The final exponent will be off by one.

**oscarserna (Forte) confirmed**

---


