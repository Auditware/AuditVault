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
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# [H-12] Incorrect supply usage

- id: 36352
- impact: HIGH
- protocol: [[Lucidly]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md

## Summary


This bug report discusses an issue with the code for a contract. There are two values, `supply` and `totalSupply`, that are supposed to be the same but are not. This can cause problems with calculations and can lead to incorrect exchange rates. The report recommends replacing all instances of `totalSupply` with `supply` and making sure the two values are synced before using `totalSupply`. 

## Details

**Severity**

**Impact:** Medium

**Likelihood:** High

**Description**

The contract uses the global variable `supply` in some places, and the function value `totalSupply` in other places. The issue is that these two values are not the same.

`totalSupply` is the total minted out LP tokens in circulation.

`supply` is a value calculated using Newton-Raphson iterations based on the weights, sums and products of the tokens composing the pool.

These two values are only in sync after calling the `_calculateSupply` followed by `_updateSupply`, since the latter function burns or mints the LP token supply in order to match the two quantities.

However this is not respected in the codebase, and `totalSupply` is used in places where `supply` should be used.

One example is in the `removeLiquidity` function. Let's assume the two values `supply` and `totalSupply` are in sync before this function call. In this function, first, the LP tokens are burnt.

```solidity
 uint256 _prevSupply = totalSupply();
_burn(msg.sender, lpAmount_);
```

This will immediately make the two values different, since `totalSupply` just went down, but `supply` isn't updated. Then when the product is being calculated, the `totalSupply` is used, which is now different from the `supply` value.

```solidity
_virtualBalanceProd = FixedPointMathLib.rawDiv(
                FixedPointMathLib.rawMul(
                    _virtualBalanceProd,
                    _powDown(
                        FixedPointMathLib.rawDiv(FixedPointMathLib.rawMul(totalSupply(), __weight), vb),  //@audit totalSupply is used
                        FixedPointMathLib.rawMul(__weight, _numTokens)
                    )
                ),
                PRECISION
            );
```

This is different from the calculations in the whitepaper. It should instead use `supply`. This is also shown in the yETH code base here:
[link](https://github.com/yearn/yETH/blob/8d831fd6b4de9f004d419f035cd2806dc8d5cf7e/contracts/Pool.vy#L561)

Due to this issue, there will be a discrepancy in the product calculated. This can lead to bad exchange rates down the line.

**Recommendations**

Replace every instance of `totalSupply` usage with `supply` or its equivalent as in the yETH contract. `totalSupply` can only be used if the two values have been synced first.
