---
tags:
  - blockchain/evm
  - lang/yul
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/zk
protocol: "[[zkSync]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/evm-emulator-and-semi-abstracted-nonces-update-audit"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[dos-resistance]]"
  - "[[circuit-input-range-check]]"
---
# Inner Variable Shadowing Causes Incorrect Return in mloadPotentiallyPaddedValue

- id: 56732
- impact: HIGH
- protocol: EVM Emulator and Semi-abstracted Nonces Update Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/evm-emulator-and-semi-abstracted-nonces-update-audit

## Summary


The helper function `mloadPotentiallyPaddedValue` is not working properly because of a mistake in the code. The function is supposed to read a specific number of bytes from memory, but due to a `let` declaration inside an `if` block, the adjusted value is not being returned. This is because the `let` declaration creates a new variable with the same name, which overrides the original variable and causes the function to return the unmodified value. This issue is not caught by the compiler, which allows for subtle bugs like this to occur. This bug has consequences for other functions that rely on `mloadPotentiallyPaddedValue`, as it can lead to incorrect parameter sizes, wrong iteration counts, and incorrect gas metering. The solution is to directly assign the adjusted value to the return variable, without using a `let` declaration. This issue has been fixed in the latest update.

## Details

The helper function [`mloadPotentiallyPaddedValue`](https://github.com/matter-labs/era-contracts/blob/cc1619cfb03cc19adb21a2071c89415cab1479e8/system-contracts/evm-emulator/EvmEmulatorFunctions.template.yul#L1052) is intended to read a 32-byte word from memory and zero out any bytes that lie beyond a specified memory boundary. However, due to improper use of a `let` declaration inside an `if` block, the adjusted value is not actually returned.

```
 function mloadPotentiallyPaddedValue(index, memoryBound) -> value {
    value := mload(index)

    if lt(memoryBound, add(index, 32)) {
        memoryBound := getMax(index, memoryBound)
        let shift := sub(add(index, 32), memoryBound)
        let value := shl(shift, shr(shift, value)) // inner `value` shadows outer
    }
}

```

In the `if` block, a new local variable named `value` is declared using `let`, which shadows the outer `value` that is the function’s return variable. As a result, any transformation applied within the block affects only the inner `value` and not the function’s output. This leads to the function returning the original unmodified result of `mload(index)`, even when part of the read spans beyond the specified memory region.

As an additional observation, while variable [shadowing is disallowed in Yul](https://github.com/ethereum/solidity/blob/297230ad32a4ba0ac2505fc1a0d391d1cd1c25a3/docs/yul.rst?plain=1#L608-L610), the current compiler does not enforce this rule and fails to emit an error. This leads to subtle logic bugs such as this one, where the code appears correct but behaves unexpectedly due to silent shadowing.

This issue has downstream implications for gas cost estimation in the `modexpGasCost` function, which relies on `mloadPotentiallyPaddedValue` to extract bounded parameters. If those values are not correctly adjusted, the computation proceeds with inaccurate inputs:

* **Incorrect parameter sizes**: When memory bounds are exceeded, out-of-bound bytes remain in the value, leading to misinterpreted sizes.
* **Wrong exponent iteration count**: An incorrect `Esize` affects the bit length estimation, skewing the iteration logic.
* **Incorrect gas metering**: The gas cost may be significantly under- or over-estimated, defeating the purpose of precise metering and potentially leading to exploitability or denial of service.

Consider assigning the adjusted value directly to the return variable, avoiding the use of a shadowing `let` declaration.

***Update:** Resolved in [pull request #1384](https://github.com/matter-labs/era-contracts/pull/1384).*
