---
tags:
  - lang/solidity
  - lang/vyper
  - platform/pashov
  - has/github
  - severity/high
  - trigger/low-liquidity
  - fix/use-reentrancy-guard
  - sector/dex
protocol: "[[Lucidly]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md"
genome:
  - "[[single-function]]"
  - "[[trigger/low-liquidity]]"
  - "[[use-reentrancy-guard]]"
  - "[[permanent]]"
  - "[[reentrancy-guard]]"
---
# [H-06] Impossible to add/remove liquidity if numTokens < MAX_NUM_TOKENS

- id: 36346
- impact: HIGH
- protocol: [[Lucidly]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md

## Summary


This bug report discusses an issue with the code for adding and removing liquidity in a smart contract. The severity of the bug is medium and the likelihood of it occurring is high. The code requires a specific length of 32 for a parameter, but later on, a different requirement conflicts with this length, making it impossible to provide liquidity for pools with less than 32 tokens. The recommendation is to change the code to allow for a variable length of the parameter. The same issue should also be fixed for the code for removing liquidity.

## Details

**Severity**

**Impact:** Medium

**Likelihood:** High

**Description**

```
function addLiquidity(
        uint256[MAX_NUM_TOKENS] calldata amounts_,
        uint256 minLpAmount_,
        address receiver_
        )
        external
        nonReentrant
        returns (uint256)
    {
```

Here it required \_amount to be provided with the length of 32.
On the other hand, later it requires a different thing:

```
if (amounts_.length != _numTokens) revert Pool__InvalidParams();
```

So, these two requirements conflict when we have \_numTokens below 32. Thus, it is impossible to provide liquidity for such pools.

Same thing for `removeLiquidity()`.

**Recommendations**

Consider changing to:

```diff
+ function addLiquidity(
        uint256[] calldata amounts_,
        uint256 minLpAmount_,
        address receiver_
        )
        external
        nonReentrant
        returns (uint256)
    {
```

The same thing should be fixed for `removeLiquidity()`.
