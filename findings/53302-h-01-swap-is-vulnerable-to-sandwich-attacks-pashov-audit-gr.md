---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - platform/pashov
  - has/github
  - severity/high
  - impact/data-corruption/price-manipulation
  - impact/mev/frontrun
  - impact/mev/sandwich
  - trigger/price-manipulation
  - trigger/sandwich-attack
protocol: "[[Gacha]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Gacha-security-review_2025-01-27.md"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[frontrun]]"
  - "[[sandwich]]"
  - "[[trigger/price-manipulation]]"
  - "[[defi/sandwich-attack]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[timestamp-dependence]]"
---
# [H-01] `_swap()` is vulnerable to sandwich attacks

- id: 53302
- impact: HIGH
- protocol: Gacha_2025-01-27
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Gacha]]-security-review_2025-01-27.md

## Summary


This bug report describes a high severity issue where anyone can buy a ticket from a specified pool and use a payment token to swap for meme tokens. The swapping process includes a dynamic calculation of a minimum token amount, which can be manipulated by attackers through front-running. This allows them to profit from the price movement of the meme token. The recommendation is to calculate the minimum token amount on the frontend and pass it as an input parameter to the GachaTickets#purchase() function.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

Anyone can buy a ticket from a specified pool, a certain payment token will be used to swap for meme tokens. The swapping process is implemented as below:

```solidity
    function _swap(
        address token,
        uint256 cost
    ) private returns (uint256 actualTokens) {
        Storage storage $ = _getOwnStorage();
        IUniswapV2Router01 uni = IUniswapV2Router01($.uniswapRouter);
        IUniswapV2Factory factory = IUniswapV2Factory($.uniswapFactory);

        address pair = factory.getPair($.paymentToken, token);
        (uint256 wethReserve, uint256 tokenReserve, ) = IUniswapV2Pair(pair)
            .getReserves();
        if (wethReserve == 0 || tokenReserve == 0) revert InvalidPair();

@>      uint256 maxTokens = uni.getAmountOut(cost, wethReserve, tokenReserve); // includes 0.3%
@>      uint256 minTokens = Math.mulDiv(maxTokens, 95, 100); // 5% slippage

        address[] memory path = new address[](2);
        path[0] = $.paymentToken;
        path[1] = token;

        IERC20($.paymentToken).approve($.uniswapRouter, cost);
        uint256[] memory amounts = uni.swapExactTokensForTokens(
            cost,
@>          minTokens,
            path,
            address(this),
            block.timestamp + 1
        );
        actualTokens = amounts[amounts.length - 1];
    }
```

Before swapping for meme tokens using `uni.swapExactTokensForTokens()`, a `minTokens` amount is calculated. This value serves as a slippage protection measure. However it is calculated dynamically, attackers can manipulate the price by front-running the meme token purchase, buying the token before the ticket purchase, and then selling it immediately after, profiting from the price movement.

## Recommendations

`minTokens` should be calculated on the frontend and passed as an input parameter to `GachaTickets#purchase()`

## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
