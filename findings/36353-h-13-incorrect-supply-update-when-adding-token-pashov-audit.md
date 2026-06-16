---
tags:
  - lang/solidity
  - lang/vyper
  - platform/pashov
  - has/github
  - severity/high
  - sector/vault
  - sector/yield-aggregator

protocol: "[[Lucidly]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[integer-bounds]]"
---
# [H-13] Incorrect supply update when adding token

- id: 36353
- impact: HIGH
- protocol: [[Lucidly]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md

## Summary


The `add_token` function is not calculating the correct supply when a new amplification factor is passed in. This is because the function is using the old amplification value instead of the new one. To fix this, the `amplification` variable should be changed to `amplification_` in the function. This will ensure that the correct supply is calculated using the new amplification value.

## Details

**Severity**

**Impact:** High

**Likelihood:** Medium

**Description**

The function `add_token` calculates the supply, and then mints to the caller the appropriate number of LP tokens. The function also takes in `amplification_`, the new pool state's amplification factor.

To calculate the new supply, the pool must use this new amplification value, since it is the new pool state.

```solidity
function addToken(
        uint256 amplification_,
        // ...
    ) external onlyOwner {
        (__supply, _virtualBalanceProd) = _calculateSupply(
            _numTokens,
            _virtualBalanceSum,
            amplification,
            _virtualBalanceProd,
            _virtualBalanceSum,
            true
        );
```

However, as seen above, the function stores the new amplification in `aplification_`, but uses the old `amplification` to calculate the supply. This is incorrect and leads to bad values being calculated since the change in amplification has not been accounted for.

The correct usage can be found in the yETH contract:
[link](https://github.com/yearn/yETH/blob/8d831fd6b4de9f004d419f035cd2806dc8d5cf7e/contracts/Pool.vy#L868)

The new amplification value should be used to calculate the supply.

**Recommendations**

Change `amplification` to `amplification_`
