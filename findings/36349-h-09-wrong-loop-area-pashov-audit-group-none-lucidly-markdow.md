---
tags:
  - lang/solidity
  - lang/vyper
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
  - sector/vault
  - sector/yield-aggregator
protocol: "[[Lucidly]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md"
genome:
  - "[[precision-loss]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# [H-09] Wrong loop area

- id: 36349
- impact: HIGH
- protocol: [[Lucidly]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md

## Summary


A bug has been reported in a code that calculates a desired formula. The loop in the code does not end correctly, causing an incorrect calculation. This bug has a medium impact and a high likelihood of occurring. The code should be modified to include certain lines in the loop and adjust the brackets accordingly to fix the issue.

## Details

**Severity**

**Impact:** Medium

**Likelihood:** High

**Description**

The loop here does not end correctly according to the desired formula calculation.
[link](https://github.com/lucidlyfi/lucidly-core-v1/blob/f00c45bbadc836b9eaa94717a0b3aa017e792588/src/Pool.sol#L1306-L1308)

Compare to this calculation in yETH:
[link](https://github.com/yearn/yETH/blob/8d831fd6b4de9f004d419f035cd2806dc8d5cf7e/contracts/Pool.vy#L1363-L1366)

The loop ends before `delta = 0`.

**Recommendations**

These lines should be included in the loop only

```diff
            for (uint256 t = 0; t < MAX_NUM_TOKENS; t++) {
                if (t == numTokens_) break;
                _r = FixedPointMathLib.rawDiv(FixedPointMathLib.rawMul(_s, _sp), _s);
+               }
                uint256 _delta = 0;
                ...
```

And change the following brackets accordingly.
