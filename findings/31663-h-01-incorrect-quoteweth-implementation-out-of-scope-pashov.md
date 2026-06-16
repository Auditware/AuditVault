---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Radiant]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Radiant-security-review.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fot-slippage]]"
---
# [H-01] Incorrect `quoteWETH()` implementation (out-of-scope)

- id: 31663
- impact: HIGH
- protocol: [[Radiant]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Radiant-security-review.md

## Summary


This bug report is about an issue with a function called `UniswapPoolHelper.quoteWETH()`, which is used to calculate the amount of WBNB (also known as WETH) needed for adding liquidity to the WBNB-RDNT pool on BSC. There are two problems with how this function is currently implemented.

Firstly, the variable `neededWeth` is being calculated using the wrong reserve. The code is using the `rdnt` reserve instead of the `weth` reserve, which is incorrect. This means that the calculated amount of WETH needed for adding liquidity is incorrect.

Secondly, the function is using the pool reserves before a swap is made, instead of the altered reserves after the swap. This means that the calculated amounts needed for adding liquidity are incorrect, as they do not take into account the changes in reserves caused by the swap.

To fix these issues, the recommended implementation is to use the altered reserves after the swap to calculate the amounts needed. This involves using a formula that takes into account the amount of RDNT being added to the pool and the current reserves of WETH and RDNT. The suggested code is provided in the report.

Overall, this bug has a high severity and medium likelihood of occurring. To fix it, the suggested implementation should be used instead of the current code.

## Details

**Severity**

**Impact:** High

**Likelihood:** Medium

**Description**

`UniswapPoolHelper.quoteWETH()` is used to calculate the WBNB (denoted as WETH) required for LP-ing into the WBNB-RDNT pool on BSC. There are 2 issues with its implementation:

`neededWeth` is derived from the wrong reserve

```solidity
uint256 weth = lpToken.token0() != address(rdntAddr) ? reserve0 : reserve1;
uint256 rdnt = lpToken.token0() == address(rdntAddr) ? reserve0 : reserve1;
uint256 lpTokenSupply = lpToken.totalSupply();

uint256 neededWeth = (rdnt * lpAmount) / lpTokenSupply;
```

The `neededWeth` should be using `weth` instead of `rdnt`.

Required amounts are derived from pool amounts before swap, not after

Doing 1-sided liquidity is akin to swapping half of the amount for the other token, then adding liquidity with the remaining half and swapped amounts.

The implementation uses the pool reserves before the swap to calculate the amounts needed, but it should use the altered reserves from the swap where `weth` increases and `rdnt` decreases.

**Recommendations**

The suggested implementation is below.

```solidity
uint256 neededRdnt = (lpAmount * rdnt) / (lpAmount + lpTokenSupply);
uint256 neededRdntInWeth = router.getAmountIn(neededRdnt, weth, rdnt);
uint256 neededWeth = (weth - neededRdntInWeth) * lpAmount / lpTokenSupply;
return neededWeth + neededRdntInWeth;
```
