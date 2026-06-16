---
tags:
  - lang/solidity
  - lang/vyper
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Lucidly]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[fot-slippage]]"
---
# [H-14] Incorrect parameters bricks certain functions

- id: 36354
- impact: HIGH
- protocol: [[Lucidly]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md

## Summary


This bug report discusses a problem in the code of a program written in a programming language called solidity. The problem occurs when a user tries to use certain functions, called `setWeightBands` and `setRamp`, in the program. These functions require the user to pass in arrays of a specific length, but the code also has a limit on the maximum size of these arrays. This means that the user is forced to pass in arrays that are too long, causing the program to crash. The report recommends removing this limit from the code so that users can use the functions without any issues.

## Details

**Severity**

**Impact:** Medium

**Likelihood:** High

**Description**

In solidity, if a function parameter list has an array of defined length, it forces the user to pass an array of that length. The call reverts if the passed array is of an unexpected length.

This is the case in the `setWeightBands` and `setRamp` functions.

```solidity
function setWeightBands(
        uint256[MAX_NUM_TOKENS] calldata tokens_,
        uint256[MAX_NUM_TOKENS] calldata lower_,
        uint256[MAX_NUM_TOKENS] calldata upper_
    )
```

Since `MAX_NUM_TOKENS=32`, this forces the caller to pass in an array with 32 elements. Any lower and this call reverts. This is also present in the `setRamp` function.

```solidity
function setRamp(
        uint256 amplification_,
        uint256[MAX_NUM_TOKENS] calldata weights_,
        uint256 duration_,
        uint256 start_
    )
```

However, these functions expect arrays only of the size `numTokens`. In fact, if a larger array is passed, it will revert due to another line.

```solidity
for (uint256 t = 0; t < MAX_NUM_TOKENS; t++) {
           //...
            if (t >= _numTokens) revert Pool__IndexOutOfBounds();
```

So users are forced to pass in 32-length arrays or the call reverts, and if they do so, the call will still revert since `_numTokens` will be exceeded if the pool does not actually use 32 tokens.

So all calls to both these functions will revert. Thus these functions are unusable.

**Recommendations**

Remove the size requirement from the function parameters.

```solidity
function setWeightBands(
        uint256[] calldata tokens_,
        uint256[] calldata lower_,
        uint256[] calldata upper_
    )
```

```solidity
function setRamp(
        uint256 amplification_,
        uint256[] calldata weights_,
        uint256 duration_,
        uint256 start_
    )
```
