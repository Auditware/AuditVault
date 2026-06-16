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
  - 0xpetern
report: "https://code4rena.com/reports/2025-04-forte-float128-solidity-library"
genome:
  - "[[integer-bounds]]"
  - "[[logic/wrong-condition]]"
  - "[[impact/dos/selective]]"
  - "[[known-pattern]]"
  - "[[specific-state]]"
  - "[[add-check]]"
  - "[[misassumption/math-is-safe]]"
  - "[[blast-radius/single-user]]"
---
# [H-02] Sqrt function silently reverts the entire control flow when a packed float of 0 value is passed

- id: 55704
- impact: HIGH
- protocol: Forte
- reporter: 0xpetern (Code4rena)
- source: https://code4rena.com/reports/2025-04-forte-float128-solidity-library

## Summary


This bug report is about a function in a code library that is used to find the square root of a given number. The function is supposed to return 0 when the input is 0, but instead it stops the execution of the code entirely. This can have serious consequences, especially in financial protocols that use this library. The recommended solution is to return 0 instead of stopping the execution. A proof of concept is provided in the report to demonstrate the issue.

## Details



<https://github.com/code-423n4/2025-04-forte/blob/4d6694f68e80543885da78666e38c0dc7052d992/src/Float128.sol# L712>

### Finding description

The [`Float128::sqrt`](https://github.com/code-423n4/2025-04-forte/blob/4d6694f68e80543885da78666e38c0dc7052d992/src/Float128.sol# L695) function is used to find the square root of the given packed float.

Mathematically, intuitively and as per most other libraries in different programming languages, it is ideal to say that square root of 0 should return 0.

However, the implementation of `sqrt` function stops the executing when the give packed float is 0 via `stop()`.
```

    function sqrt(packedFloat a) internal pure returns (packedFloat r) {
        uint s;
        int aExp;
        uint x;
        uint aMan;
        uint256 roundedDownResult;
        bool aL;
        assembly {
            if and(a, MANTISSA_SIGN_MASK) {
                let ptr := mload(0x40) // Get free memory pointer
                mstore(ptr, 0x08c379a000000000000000000000000000000000000000000000000000000000) // Selector for method Error(string)
                mstore(add(ptr, 0x04), 0x20) // String offset
                mstore(add(ptr, 0x24), 32) // Revert reason length
                mstore(add(ptr, 0x44), "float128: squareroot of negative")
                revert(ptr, 0x64) // Revert data length is 4 bytes for selector and 3 slots of 0x20 bytes
            }
            if iszero(a) {
                stop()          <<@ -- // Stops the execution flow entirely
            }
```

This can lead to serious issues where the code execution just stops mid-way silently reverting the control flow.

### Impact

Serious financial consequences can happen in protocols using this library as the entire code execution reverts due to the `stop()`.

### Recommended mitigation steps

It is recommended to return `0` instead of using the `stop()`:
```

    function sqrt(packedFloat a) internal pure returns (packedFloat r) {
        uint s;
        int aExp;
        uint x;
        uint aMan;
        uint256 roundedDownResult;
        bool aL;
        assembly {
            if and(a, MANTISSA_SIGN_MASK) {
                let ptr := mload(0x40) // Get free memory pointer
                mstore(ptr, 0x08c379a000000000000000000000000000000000000000000000000000000000) // Selector for method Error(string)
                mstore(add(ptr, 0x04), 0x20) // String offset
                mstore(add(ptr, 0x24), 32) // Revert reason length
                mstore(add(ptr, 0x44), "float128: squareroot of negative")
                revert(ptr, 0x64) // Revert data length is 4 bytes for selector and 3 slots of 0x20 bytes
            }
            if iszero(a) {
-                stop()
+                r := 0
+                leave
            }
```

### Proof of Concept

Add a file named `test.t.sol` inside the `/test` folder:
```

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "forge-std/console2.sol";
import "src/Float128.sol";

contract TestingContract is Test {
    using Float128 for packedFloat;
    using Float128 for int256;

function testSqrtSilentRevert() public {
        console2.log("Test started");

        // First test with a non-zero value to show normal behavior
        packedFloat nonZero = Float128.toPackedFloat(1, 0);
        packedFloat nonZeroResult = Float128.sqrt(nonZero);
        console2.log("Non-zero sqrt completed");

        packedFloat zero = Float128.toPackedFloat(0, 0);

        // Should silently revert as per the solidity's yul docs.
        packedFloat zeroResult = Float128.sqrt(zero);

        console.log("Zero sqrt completed" ); // Never printed
        assertEq(false, true, "This will never terminate as the control never reaches here due to silent termination"); // Test would pass successfully which it shouldn't have had.
    }

}
```

**oscarserna (Forte) confirmed**

---


