---
tags:
  - lang/solidity
  - sector/dex
  - sector/vault
  - platform/sherlock
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/sandwich
  - trigger/sandwich-attack
protocol: "[[Derby]]"
auditors:
  - "[[Bobface]]"
report: "https://github.com/sherlock-audit/2023-01-derby-judging"
genome:
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[timestamp-dependence]]"
---
# H-13: Vault executes swaps without slippage protection

- id: 12295
- impact: HIGH
- protocol: [[Derby]]
- reporter: Bobface (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue in the Vault contract, which executes swaps without slippage protection. This could cause a loss of funds due to sandwich attacks. The vulnerability is present in the `Vault.claimTokens()` and `MainVault.withdrawRewards()` functions, as the slippage calculations are done inside the Swap library, which uses already modified pool values to calculate the min out value. The code snippet provided is from the Swap library, which shows the function `swapTokensMulti()`. The manual review tool was used to find this issue. The recommendation to fix this issue is to include the slippage parameters in the tx's calldata and pass it to the Swap library. The bug is a duplicate of another bug report #157 and #48.

## Details

Source: https://github.com/sherlock-audit/2023-01-derby-judging/issues/64 

## Found by 
Bauer, Bobface, Jeiwan, Met, Nyx, Ruhum, cergyk, hyh, immeas, nobody2018, tives

## Summary
The vault executes swaps without slippage protection. That will cause a loss of funds because of sandwich attacks.

## Vulnerability Detail
Both in `Vault.claimTokens()` and `MainVault.withdrawRewards()` swaps are executed through the Swaps library. It calculates the slippage parameters itself which doesn't work. Slippage calculations (min out) have to be calculated *outside* of the swap transaction. Otherwise, it uses the already modified pool values to calculate the min out value.

## Impact
Swaps will be sandwiched causing a loss of funds for users you withdraw their rewards.

## Code Snippet
https://github.com/sherlock-audit/2023-01-derby/blob/main/derby-yield-optimiser/contracts/libraries/Swap.sol#L60-L97
```sol
  /// @notice Swap tokens on Uniswap
  /// @param _swap Number of tokens to sell, token to sell, token to receive
  /// @param _uniswap Address of uniswapRouter, uniswapQuoter and poolfee
  /// @return Amountout Number of tokens received
  function swapTokensMulti(
    SwapInOut memory _swap,
    IController.UniswapParams memory _uniswap,
    bool _rewardSwap
  ) public returns (uint256) {
    IERC20(_swap.tokenIn).safeIncreaseAllowance(_uniswap.router, _swap.amount);

    uint256 amountOutMinimum = IQuoter(_uniswap.quoter).quoteExactInput(
      abi.encodePacked(_swap.tokenIn, _uniswap.poolFee, WETH, _uniswap.poolFee, _swap.tokenOut),
      _swap.amount
    );

    uint256 balanceBefore = IERC20(_swap.tokenOut).balanceOf(address(this));
    if (_rewardSwap && balanceBefore > amountOutMinimum) return amountOutMinimum;

    ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
      path: abi.encodePacked(
        _swap.tokenIn,
        _uniswap.poolFee,
        WETH,
        _uniswap.poolFee,
        _swap.tokenOut
      ),
      recipient: address(this),
      deadline: block.timestamp,
      amountIn: _swap.amount,
      amountOutMinimum: amountOutMinimum
    });

    ISwapRouter(_uniswap.router).exactInput(params);
    uint256 balanceAfter = IERC20(_swap.tokenOut).balanceOf(address(this));

    return balanceAfter - balanceBefore;
  }
```

## Tool used

Manual Review

## Recommendation
Slippage parameters should be included in the tx's calldata and passed to the Swap library.



## Discussion

**sjoerdsommen**

duplicate with #157 and #48
