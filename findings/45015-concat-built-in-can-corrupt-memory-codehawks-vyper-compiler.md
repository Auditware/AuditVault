---
tags:
  - lang/solidity
  - lang/vyper
  - sector/dex
  - platform/codehawks
  - has/github
  - has/poc
  - severity/high
  - novelty/known-pattern
protocol: "[[Vyper]]"
auditors:
  - "[[cyberthirst]]"
genome:
  - "[[wrong-condition]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[integer-bounds]]"
---
# concat built-in can corrupt memory

- id: 45015
- impact: HIGH
- protocol: [[Vyper]] - Compiler
- reporter: cyberthirst (Codehawks)
- source: N/A

## Summary


The `concat` built-in function in the Vyper programming language has a bug that can cause it to overwrite valid data in the memory buffer, leading to incorrect results or unexpected behavior in the contract. This bug was introduced in version 0.3.2 and affects contracts deployed with Vyper after this version. The bug can be triggered when `concat` is used in an `internal` function, and the function is close to the `return` statement. This bug can have a high impact as it can change the behavior of the contract and can go unnoticed during testing. The bug was found using manual review and testing with the `boa` and `forge` tools. To fix this bug, it is recommended to overallocate the buffer used for concatenation to prevent buffer overflow.

## Details

### Relevant GitHub Links
<a data-meta="codehawks-github-link" href="https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/builtins/functions.py#L534-L550">https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/builtins/functions.py#L534-L550</a>

<a data-meta="codehawks-github-link" href="https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/builtins/functions.py#L569-L572">https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/builtins/functions.py#L569-L572</a>

<a data-meta="codehawks-github-link" href="https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/codegen/core.py#L270-L273">https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/codegen/core.py#L270-L273</a>

<a data-meta="codehawks-github-link" href="https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/codegen/core.py#L245-L247">https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/codegen/core.py#L245-L247</a>

<a data-meta="codehawks-github-link" href="https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/codegen/core.py#L301-L320">https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/codegen/core.py#L301-L320</a>


## Summary
`concat` built-in can write over the bounds of the memory buffer that was allocated for it and thus overwrite existing valid data. The root cause, at least for `v0.3.10rc3*`, is that the `build_IR` for `concat` doesn't properly adhere to the API of `copy_bytes`.

## Vulnerability Details
The `build_IR` allocates a new internal variable for the concatenation: https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/builtins/functions.py#L534-L550

Notice that the buffer is allocated for the `maxlen` + 1 word to actually hold the length of the array.

Later the `copy_bytes` function is used to copy the actual source arguments to the destination: https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/builtins/functions.py#L569-L572

The `dst_data` is defined as:
- data ptr - to skip the 1 word that holds the length
- offset  - to skip the source arguments that were already written to the buffer
  - the offset is increased via: `["set", ofst, ["add", ofst, arglen]]`, ie it is increased by the length of the source argument

Now, the `copy_bytes` function has multiple control flow paths, the following ones are the interesting ones:
1st: https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/codegen/core.py#L270-L273
2nd: https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/codegen/core.py#L301-L320

It can be seen that in both paths a word from source can be copied to the destination.

Note that the function itself contains the following note: 
https://github.com/vyperlang/vyper/blob/3b310d5292c4d1448e673d7b3adb223f9353260e/vyper/codegen/core.py#L245-L247

That is we can ask for a copy of `1B` yet a whole word is copied.

Now, if the `dst_data`'s distance to the end of the concat data buffer is `< 32B`, the `copy_op = STORE(dst, LOAD(src))` from `copy_bytes` will result in buffer overflow as it essentially will `mstore` to `dst_data` the `mload` of the source (mload will load whole word and the distance of the `dst_data` to the word boundary is `<32B`). The argumentation for the 2nd path in `copy_bytes` is analogical.

### PoC
The main attack vector that was found was when the `concat` is inside an `internal` function or in `__init__()`.  Suppose we have an `external` function that calls `internal` one. In such case the address space is divided such that the memory for the internal function is in _lower_  portion of the adr space. As such the buffer overflow can overwrite _valid_ data of the caller.

Here is a simple example:
```python
#@version ^0.3.9

@internal
def bar() -> uint256:
    sss: String[2] = concat("a", "b") 
    return 1


@external
def foo() -> int256:
    a: int256 = -1
    b: uint256 = self.bar()
    return a 
```

`foo` should clearly return `-1`, but it returns `452312848583266388373324160190187140051835877600158453279131187530910662655`

`-1` was used intentionally due to its bit structure but the value here is fairly irelevant. In this example during the second iteration of the for loop in the `build_IR` `mload` to `dst+1` will be executed (because len('a') == 1), thus the function will write `1B` over the bounds of the buffer. The string 'b' is stored such that the right-most byte of the word is a zero byte. So,a zero byte will be written over the bounds. So when `-1` is considered, it's left-most byte will be overwritten to all 0. Therefore it can be seen that: `452312848583266388373324160190187140051835877600158453279131187530910662655 == (2**248-1)` will output `True`.

#### Analysis of IR
If we look at the contract's IR (vyper --no-optimize -f it) we see:
```
## Line 30
                          /* a: int256 = -1 */ [mstore, 320, -1 <-1>],
```
And for the second iteration of the loop in concat:
```
 len,
                        [mload, arg],
                        [seq,
                          [with,
                            src,
                            [add, arg, 32],
                            [with,
                              dst,
                              [add, [add, 256 <concat destination>, 32], concat_ofst],
                              [mstore, dst, [mload, src]]]],
                          [set, concat_ofst, [add, concat_ofst, len]]]]],
                    [mstore, 256 <concat destination>, concat_ofst],
                    256 <concat destination>]],
```
So the address of the `int` is 320. 

The `dst` is defined as: `[add, [add, 256 <concat destination>, 32], concat_ofst],`.
In the second iteration the `concat_ofst` will be 1 because `len('a)==1` so `256+32+1 = 289`. Now this address will be `mstored` to - so the last mstored B will have the address `289+32=321` which clearly overlaps with the address of the `int a`.

#### 2nd path and `__init__()`

To demonstrate the vulnerability in the second mentioned path (longer `length_bound` - the general case):
```python
#@version ^0.3.9

s: String[1]
s2: String[33]
s3: String[34]


@external
def __init__():
    self.s = "a"
    self.s2 = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" # 33*'a'
    

@internal
def bar() -> uint256:
    self.s3 = concat(self.s, self.s2)
    return 1


@external
def foo() -> int256:
    i: int256 = -1
    b: uint256 = self.bar()
    return i
```
Output of calling `foo() is `452312848583266388373324160190187140051835877600158453279131187530910662655`.

And lastly, a PoC for the `__init__()` function, in such case the `immutables` can be overwritten:
```python
#@version ^0.3.9

i: immutable(int256)

@external
def __init__():
    i = -1
    s: String[2] = concat("a", "b")

@external
def foo() -> int256:
    return i
```

Output of calling `foo()` is `452312848583266388373324160190187140051835877600158453279131187530910662655`.

## Impact
The buffer overflow can result in a _complete_ change of *semantics* of the contract, which is even worse if an attacker controls the inputs to the function. Because the overflow doesn't have to happen each time it might go unnoticed during contract testing and vulnerable code can be deployed on chain.

However, not all usages of `concat` will result in overwriting valid data as we require it to be in an `internal` function and close to the `return` statement where other memory allocations don't occur. As such the likelihood is considered medium.

It seems that the bug was introduced in: `548d35d720fb6fd8efbdc0ce525bed259a73f0b9`. `git bisect` was used between `v0.3.1` (which seems to be good) and `v0.3.2` (which was already bad) and `forge test` was run and the test asserted that the function indeed returns -1. So contracts deployed with `vyper` after this commit might be affected.

## Tools Used
Manual review to find the bug. boa + forge + git bisect for testing.

## Recommendations
One possible solution would be overallocate the buffer used for the concatenation. It must be ensured that even if the source arguments are copied to the destination when the destination is close to the buffer end (ie distance is <32B), it will not result in a buffer overflow.
