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
  - "[[dos-resistance]]"
  - "[[fot-slippage]]"
---
# [H-05] Iterating the loop length below MAXLENGTH

- id: 36345
- impact: HIGH
- protocol: [[Lucidly]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md

## Summary


The bug report states that during the deployment of a pool, there is an issue where the transaction fails if the pool has less than 32 tokens. This is because the code only allows for a maximum length of 32 tokens, and if there are fewer than that, the transaction will fail. The report suggests that the loop in the code should be changed to either iterate up to the number of tokens or use a specific pattern to avoid this issue. This bug has a medium severity and a high likelihood of occurring.

## Details

**Severity**

**Impact:** Medium

**Likelihood:** High

**Description**

During the pool deployment, the transaction reverts for a pool with the length of tokens below `MAXLENGHT` which is `32`:

- [link](https://github.com/lucidlyfi/lucidly-core-v1/blob/f00c45bbadc836b9eaa94717a0b3aa017e792588/src/Pool.sol#L160)

It reverts with the out-of-bound error, so it is required to provide a long length of token of 32, which is not always the case.

**Recommendations**

The loop should iterate up to `_numTokens`.
Or the loop should use this pattern from other functions when the loop reaches the final iteration:

```
            if (t == _numTokens) {
                break;
            }
```
