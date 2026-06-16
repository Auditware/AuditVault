---
tags:
  - lang/solidity
  - lang/vyper
  - platform/pashov
  - has/github
  - severity/high
  - sector/staking
  - sector/staking-pool
protocol: "[[Lucidly]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[reward-accounting]]"
---
# [H-08] Wrong usage of variables for \_calculateSupply()

- id: 36348
- impact: HIGH
- protocol: [[Lucidly]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md

## Summary


This bug report is about a function called `addLiquidity()` in the `Pool.sol` file of the `lucidly-core-v1` project. The severity of this bug is medium and its likelihood of occurring is high. The function uses another function called `_calculateSupply()` twice, but there are a few mistakes in the code. 

The first mistake is that the variable `_prevSupply` is used instead of `_supply`. This causes the function to fail when there are no tokens in the pool. The second mistake is that the variables `_virtualBalanceProdFinal` and `_virtualBalanceSumFinal` are used instead of `_virtualBalanceProd` and `_virtualBalanceSum`. The third mistake is that the last argument in the function call is `true` instead of `_prevSupply == 0`. 

To fix this bug, the necessary adjustments need to be made in the first usage of `_calculateSupply()`. The second usage of the function is correct. 

## Details

**Severity**

**Impact:** Medium

**Likelihood:** High

**Description**

`addLiquidity()` uses `_calculateSupply()` twice

```
        (_supply, _virtualBalanceProd) = _calculateSupply(
            _numTokens,
            _prevSupply,
            amplification,
            _virtualBalanceProdFinal,
            _virtualBalanceSumFinal,
            true
        );
```

[link](https://github.com/lucidlyfi/lucidly-core-v1/blob/f00c45bbadc836b9eaa94717a0b3aa017e792588/src/Pool.sol#L520)

There are a few mistakes:

1. `_prevSupply` is used, while `_supply` is correct
   Otherwise, it reverts on the first liquidity provision because of zero requirement here
   [link](https://github.com/lucidlyfi/lucidly-core-v1/blob/f00c45bbadc836b9eaa94717a0b3aa017e792588/src/Pool.sol#L1303)
2. `_virtualBalanceProdFinal` is used, while `_virtualBalanceProd` is correct
3. `_virtualBalanceSumFinal` is used, while `_virtualBalanceSum` is correct
4. `true` is used as the last argument while it is true when `_prevSupply == 0`. So it should be replaced with `_prevSupply == 0`.

**Recommendations**

Apply necessary adjustments in the first usage of `_calculateSupply()`.
The second usage after that is correct.
