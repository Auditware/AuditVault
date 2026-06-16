---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/dex
  - platform/shieldify
protocol: "[[Daoslive]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/DaosLive-Security-Review.md"
genome:
  - "[[frontrun-exposure]]"
  - "[[timestamp-dependence]]"
  - "[[logic/wrong-condition]]"
  - "[[mev/frontrun]]"
  - "[[known-pattern]]"
  - "[[frontrun]]"
  - "[[add-check]]"
  - "[[precondition/mev-capable]]"
  - "[[blast-radius/single-user]]"
---
# [C-02] The `deadline` Parameter in UniswapV3 Swap Causes Sniping Functionality Failure in `finalize()` Function

- id: 57867
- impact: HIGH
- protocol: Daoslive
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/DaosLive-Security-Review.md

## Summary


This report is about a critical risk bug found in the code of a token swapping function. The bug is caused by the missing `deadline` parameter in the initialization of `ExactInputSingleParams`. This results in the default value of `0` being used for `deadline`, which causes the transaction to fail due to an expired deadline. This bug affects the functionality of the token snipe feature and the `finalize()` function. The recommendation is to set the `deadline` parameter explicitly using a valid timestamp. The team has fixed the bug.

## Details

## Severity

Critical Risk

## Description

In the following code snippet, using `IUniRouter.exactInputSingle()` for token swapping:

```solidity
IUniRouter uniRouter = IUniRouter(_factory.uniRouter());
uniRouter.exactInputSingle{value: snipeAmount}(
    IUniRouter.ExactInputSingleParams({
        tokenIn: wethAddr,
        tokenOut: token,
        fee: UNISWAP_V3_FEE,
        recipient: address(this),
        amountIn: snipeAmount,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
    })
);
```

The `deadline` parameter is missing during the initialization of `ExactInputSingleParams`. As a result, the default value of `0` is used for `deadline`, which is always in the past. This causes the Uniswap `exactInputSingle()` function to **revert** the transaction due to deadline expiry in the below Uniswapv3 code.

[SwapRouter.sol](https://github.com/Uniswap/v3-periphery/blob/464a8a49611272f7349c970e0fadb7ec1d3c1086/contracts/SwapRouter.sol#L115C5-L129C6)

```solidity
function exactInputSingle(ExactInputSingleParams calldata params)
    external
    payable
    override
@>  checkDeadline(params.deadline)
    returns (uint256 amountOut)
{
    amountOut = exactInputInternal(
        params.amountIn,
        params.recipient,
        params.sqrtPriceLimitX96,
        SwapCallbackData({path: abi.encodePacked(params.tokenIn, params.fee, params.tokenOut), payer: msg.sender})
    );
    require(amountOut >= params.amountOutMinimum, 'Too little received');
}
```

[PeripheryValidation.sol](https://github.com/Uniswap/v3-periphery/blob/v1.0.0/contracts/base/PeripheryValidation.sol)

```solidity
abstract contract PeripheryValidation is BlockTimestamp {
    modifier checkDeadline(uint256 deadline) {
        require(_blockTimestamp() <= deadline, 'Transaction too old');
        _;
    }
}
```

## Location of Affected Code

File: [contracts/DaosLive.sol#L314](https://github.com/ED3N-Ventures/daoslive-sc/blob/9a1856db2060b609a17b24aa72ab35f2cdf09031/contracts/DaosLive.sol#L314)

## Impact

- All token snipe attempts will fail and revert unless `deadline` is correctly set.
- Results in denial of service for token snipe functionality, along with failure of `finalize()` function.

## Recommendation

Set the `deadline` parameter explicitly using a valid timestamp (e.g., `block.timestamp` at least the current timestamp).

```diff
exactInputSingleParams({
    tokenIn: wethAddr,
    tokenOut: token,
    fee: UNISWAP_V3_FEE,
    recipient: address(this),
    amountIn: snipeAmount,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
+   deadline: block.timestamp
})
```

## Team Response

Fixed.
