---
tags:
  - lang/solidity
  - sector/dex
  - sector/staking-pool
  - has/github
  - severity/high
protocol: "[[Gacha]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Gacha-security-review_2025-01-27.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
  - "[[variant]]"
---
# [C-01] Incorrect reserve order in `_swap()`

- id: 53301
- impact: HIGH
- protocol: Gacha_2025-01-27
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Gacha-security-review_2025-01-27.md

## Summary


This bug report highlights an issue with the `GachaTickets::_swap` function in the code. The problem is that there is no check to ensure that the reserves retrieved from the UniswapV2Pair contract are in the correct order. This can lead to incorrect calculations and potential loss of funds. To fix this, it is recommended to always validate the token pair order before using the reserves. This will prevent incorrect swaps and avoid possible security vulnerabilities.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

In the `GachaTickets::_swap` function, reserves are retrieved from the UniswapV2Pair contract as follows:

```solidity
address pair = factory.getPair($.paymentToken, token);
(uint256 wethReserve, uint256 tokenReserve, ) = IUniswapV2Pair(pair)
    .getReserves();
if (wethReserve == 0 || tokenReserve == 0) revert InvalidPair();
```

However, `there is no validation` to ensure that `wethReserve` and `tokenReserve` are correctly assigned based on the actual token pair order.

Uniswap V2 reserves `must be retrieved in a consistent order`:

```solidity
(token0, token1) = (pair.token0(), pair.token1())
```

where `getReserves()` always returns `(reserve0, reserve1)`, and `token0 is always the smaller address`.

Due to the above issue following consequences can occur :

1. Incorrect Swap Calculation:

   - If the wrong reserves are used in:

   ```solidity
   uint256 maxTokens = uni.getAmountOut(cost, wethReserve, tokenReserve);
   ```

   - The function may return a `wrong actualTokens value`, leading to incorrect token amounts received.

2. Potential Denial of Service (DoS):

   - If the `minTokens` calculation is incorrect (is very high), a swap may `always revert`, making purchases impossible.

3. Silent Loss of Funds:
   - The protocol may receive `fewer pool tokens than expected` from the swap if the `minToken` (slippage parameter) is extremely less (than the correct value), thus reducing the `lottery reward pool size`.

## Recommendations

It is recommended to retrieve and validate token pair order before using reserves for the `minTokens` calculation.

Modify `_swap` to `always fetch reserves in the correct order`:

```solidity
(address token0, ) = IUniswapV2Pair(pair).token0();
(uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(pair).getReserves();

 uint256 wethReserve = token0 == $.paymentToken ? reserve0 : reserve1;
 uint256 tokenReserve = token0 == $.paymentToken ? reserve1 : reserve0;
```

By implementing the recommendation, the contract will `prevent incorrect token swaps and avoid potential DoS vulnerabilities`.
