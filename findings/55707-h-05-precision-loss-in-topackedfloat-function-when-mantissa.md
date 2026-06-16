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
  - hecker\_trieu\_tien
report: "https://code4rena.com/reports/2025-04-forte-float128-solidity-library"
genome:
  - "[[integer-bounds]]"
  - "[[precision-loss]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-05] Precision loss in `toPackedFloat` function when mantissa is in range (`MAX_M_DIGIT_NUMBER`, `MIN_L_DIGIT_NUMBER`)

- id: 55707
- impact: HIGH
- protocol: Forte
- reporter: hecker\_trieu\_tien (Code4rena)
- source: https://code4rena.com/reports/2025-04-forte-float128-solidity-library

## Summary


The current implementation of the Float128 library has a bug that causes a loss of precision in certain cases. This can have a significant impact on subsequent calculations, such as multiplication. To fix this, it is recommended to incorporate the number of digits in the mantissa into the logic that determines the result mantissa's size. A proof of concept has been provided to demonstrate the issue. 

## Details



<https://github.com/code-423n4/2025-04-forte/blob/main/src/Float128.sol# L1102>

### Finding description and impact

The current implementation determines the result mantissa’s size (`M` or `L`) solely based on the `exponent`, without considering the actual number of digits in the provided mantissa (`digitsMantissa`).

In cases where the mantissa lies within the range (`MAX_M_DIGIT_NUMBER`, `MIN_L_DIGIT_NUMBER`) and the exponent satisfies the condition `exponent <= 20 - digitsMantissa` (as it doesn’t meet the condition `exponent - MAX_DIGITS_M(38) + digitsMantissa > MAXIMUM_EXPONENT(-18)`), the function downcasts the mantissa to a `Medium-sized` (`M`) format by dividing it with `BASE^(digitsMantissa - MAX_DIGITS_M)`. This results in a loss of precision equivalent to `digitsMantissa - MAX_DIGITS_M`.

This precision loss becomes especially significant when the `mantissa` is near the lower boundary of `MIN_L_DIGIT_NUMBER`. For example, a `mantissa` of `2^235` can lead to a precision loss of up to `33` digits.

Moreover, the `toPackedFloat` function serves as a foundational component for this library, as all arithmetic operations depend on its output. Therefore, any loss in precision at this stage can propagate and severely affect subsequent calculations, such as `multiplication`.

This type of downcasts exists in `mul` and `sqrt` functions as well.

### Recommended mitigation steps

To preserve precision, which this library explicitly prioritizes over gas efficiency, consider incorporating `digitsMantissa` into the logic that determines the result mantissa’s size. This ensures that the chosen format maintains maximum accuracy across all supported input ranges.

One potential mitigation could be:
```

isResultL := or(isResultL, gt(digitsMantissa, MAX_DIGITS_M))
```

Alternatively, explicitly check whether the mantissa falls within the range (`MAX_M_DIGIT_NUMBER`, `MIN_L_DIGIT_NUMBER`) and ensure the size is determined accordingly. Or, a more flexible way is to adopt a flag like `div`(`divL`) function.

### Proof of Concept

Copy/paste the below code into `Float128Fuzz.t.sol` and run `forge test --mt testToPackedFloatLossInRangeBetweenMaxMAndMinL --ffi -vvvv`.

Second test will fail as expected and it will show the significant precision loss.
```

function testToPackedFloatLossInRangeBetweenMaxMAndMinL() public pure {
        int256 man;
        int256 expo;
        // Around Lower boundary of MIN_L_DIGIT_NUMBER
        assembly {
            man := shl(235, 1)
            expo := sub(0, 51)
        }

        packedFloat float = man.toPackedFloat(expo);
        (int manDecode, int expDecode) = Float128.decode(float);
        packedFloat comp = manDecode.toPackedFloat(expDecode - expo);
        console2.log('DecodedMan', manDecode);
        console2.log('DecodedExp', expDecode);

        int256 retVal = 0;
        if (man != 0) {
            retVal = _reverseNormalize(comp);
        }
        assertLt(retVal, man);

        // Around Upper boundary of MAX_M_DIGIT_NUMBER
        assembly {
            man := shl(127, 1)
            expo := sub(0, 19)
        }

        float = man.toPackedFloat(expo);
        (manDecode, expDecode) = Float128.decode(float);
        comp = manDecode.toPackedFloat(expDecode - expo);
        console2.log('DecodedMan', manDecode);
        console2.log('DecodedExp', expDecode);

        retVal = 0;
        if (man != 0) {
            retVal = _reverseNormalize(comp);
        }
        assertLt(retVal, man);
    }

    function testToPackedFloatLossInRangeBetweenMaxMAndMinLEffect() public {
        int256 man;
        int256 expo;
        assembly {
            man := shl(235, 1)
            expo := sub(0, 51)
        }

        packedFloat float = man.toPackedFloat(expo);

        // Check effect with multiplication
        string[] memory inputs = _buildFFIMul128(man, expo, man, expo, "mul", 0);
        bytes memory res = vm.ffi(inputs);
        (int pyMan, int pyExp) = abi.decode((res), (int256, int256));

        packedFloat result = Float128.mul(float, float);
        (int rMan, int rExp) = Float128.decode(result);

        checkResults(result, rMan, rExp, pyMan, pyExp, 0);
        // //////////////////////////////////////////////35digits difference from here
        //  "rMan", 304858256866796116345859104471988897039037891665498727750484539172886869
        // "pyMan", 304858256866796116345859104471988897045761537369626088951089546838415208
        // rExp = pyExp = -32
    }
```

**oscarserna (Forte) acknowledged**

---


