---
tags:
  - lang/solidity
  - sector/dex
  - sector/token
  - platform/pashov
  - has/github
  - severity/high
  - vuln/dependency/upgradeable-contract
  - fix/use-reentrancy-guard
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
protocol: "[[Funnel]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Funnel-security-review_2025-08-27.md"
genome:
  - "[[upgradeable-contract]]"
  - "[[indirect-loss]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
  - "[[upgrade-safety]]"
---
# [H-02] swapTokens does not account for SwapX router fees when the out token is native

- id: 62621
- impact: HIGH
- protocol: Funnel_2025-08-27
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Funnel]]-security-review_2025-08-27.md

## Summary


This bug report discusses an issue with the `SwapX` router charging fees on the out amount of a swap, even when the out token is native. This results in the `FunnelVault` accounting for more tokens than actually received from the swap. The severity of this bug is considered medium, with a high likelihood of occurrence. The report includes code snippets from the `SwapX` and `FunnelVaultUpgradeable` contracts, as well as recommendations for resolving the issue. These recommendations include adding the `FunnelVault` to the `feeExcludeList` or setting the `feeRate` to 0 on controlled `SwapX` routers, and not relying on the returned out amount when handling both controlled and non-controlled `SwapX` routers.

## Details


_Resolved_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description
When the out token is native, the `SwapX` router charges fees on the out amount of the swap in both `swapV2ExactIn` and `swapV3ExactIn`, sending the remainder to the recipient but still returning the original out amount to the caller.

[SwapX@takeFee](https://github.com/acc8-labs/swapx-router-contracts/blob/main/src/SwapX.sol#L149-L165)
```solidity
    function takeFee(address tokenIn, uint256 amountIn) internal returns (uint256){
        if (feeExcludeList[msg.sender])
            return 0;

        uint256 fee = amountIn.mul(feeRate).div(feeDenominator);

        if ( tokenIn == address(0) || tokenIn == WETH ) {
            require(address(this).balance > fee, "insufficient funds");
            (bool success, ) = address(feeCollector).call{ value: fee }("");
            require(success, "SwapX: take fee error");
        } else
            IERC20Upgradeable(tokenIn).safeTransferFrom(msg.sender, feeCollector, fee);

        emit FeeCollected(tokenIn, msg.sender, fee, amountIn, block.timestamp);

        return fee; 
    }
```

[SwapX@swapV2ExactIn](https://github.com/acc8-labs/swapx-router-contracts/blob/main/src/SwapX.sol#L168-L236)
```solidity
    function swapV2ExactIn(
        address tokenIn, 
        address tokenOut, 
        uint256 amountIn, 
        uint256 amountOutMin, 
        address poolAddress
    ) payable public nonReentrant whenNotPaused returns (uint amountOut){
        // ...

        bool nativeOut = false;
        if (tokenOut == address(0))
            nativeOut = true; <@

        // ...

        if (nativeOut) {
            amountOut = IERC20Upgradeable(WETH).balanceOf(address(this)).sub(balanceBefore); <@
            IWETH(WETH).withdraw(amountOut);
            uint256 fee = takeFee(address(0), amountOut); <@
            (bool success, ) = address(msg.sender).call{value: amountOut-fee}(""); <@
            require(success, "SwapX: send ETH out error");
        } else {
            amountOut = IERC20Upgradeable(tokenOut).balanceOf(msg.sender).sub(balanceBefore);
        }
        require(
            amountOut >= amountOutMin,
            'SwapX: insufficient output amount'
        );
    }
```

[SwapX@swapV3ExactIn](https://github.com/acc8-labs/swapx-router-contracts/blob/main/src/SwapX.sol#L499-L540)
```solidity
    function swapV3ExactIn (
            ExactInputSingleParams memory params
    ) external payable nonReentrant whenNotPaused checkDeadline(params.deadline) returns (uint256 amountOut) {
        // ...

        bool nativeOut = false;
        if (params.tokenOut == WETH) 
            nativeOut = true;

        // ...

        amountOut = exactInputInternal( <@
            params.amountIn,
            nativeOut ? address(0) : params.recipient,
            params.sqrtPriceLimitX96,
            SwapCallbackData({path: abi.encodePacked(params.tokenIn, params.fee, params.tokenOut), payer: msg.sender, payerOrigin: msg.sender})
        );

        require(amountOut >= params.amountOutMinimum, "SwapX: insufficient out amount");

        if (nativeOut) {
            IWETH(WETH).withdraw(amountOut);
            uint256 fee = takeFee(address(0), amountOut); <@
            (bool success, ) = address(params.recipient).call{value: amountOut-fee}(""); <@
            require(success, "SwapX: send ETH out error");
        }
    }
```

This leads to the `FunnelVault` accounting for more tokens than actually received from the swap.

[FunnelVaultUpgradeable@swapTokens](https://github.com/acc8-labs/funnel-vault/blob/main/src/FunnelVaultUpgradeable.sol#L317C14-L398)
```solidity
    function swapTokens(SwapParams calldata swapParams, address swapRouter, bool isBurn) external onlyRole(EXECUTER_ROLE) nonReentrant returns (uint256 amountOut) {
        // ...

        if (swapParams.useV3) {
            ISwapX.ExactInputSingleParams memory params = ISwapX.ExactInputSingleParams({
                tokenIn: swapParams.tokenIn,
                tokenOut: swapParams.tokenOut,
                fee: swapParams.fee,
                recipient: address(this),
                deadline: swapParams.deadline,
                amountIn: swapParams.amountIn,
                amountOutMinimum: swapParams.amountOutMin,
                sqrtPriceLimitX96: 0
            });

            if (params.tokenIn == address(0)) {
                amountOut = ISwapX(swapRouter).swapV3ExactIn{value: params.amountIn}(params);
            } else {
                amountOut = ISwapX(swapRouter).swapV3ExactIn(params); <@
            }
        } else {
            if (swapParams.poolAddress == address(0)) {
                revert ZeroAddress();
            }

            if (swapParams.tokenIn == address(0)) {
                amountOut = ISwapX(swapRouter).swapV2ExactIn{value: swapParams.amountIn}(
                    swapParams.tokenIn,
                    swapParams.tokenOut,
                    swapParams.amountIn,
                    swapParams.amountOutMin,
                    swapParams.poolAddress
                );
            } else {
                amountOut = ISwapX(swapRouter).swapV2ExactIn( <@
                    swapParams.tokenIn,
                    swapParams.tokenOut,
                    swapParams.amountIn,
                    swapParams.amountOutMin,
                    swapParams.poolAddress
                );
            }
        }

        if (amountOut == 0) {
            revert SwapFailed();
        }

        if (swapParams.tokenOut == WETH && swapParams.useV3) {
            if(isBurn){
                addToPoolBurn(address(0), swapParams.payingPool, amountOut); <@
            } else {
                addToPoolHIP(address(0), swapParams.payingPool, amountOut); <@
            }
        } else {
            if(isBurn){
                addToPoolBurn(swapParams.tokenOut, swapParams.payingPool, amountOut); <@
            } else {
                addToPoolHIP(swapParams.tokenOut, swapParams.payingPool, amountOut); <@
            }
        }

        emit TokenSwapped(swapParams.tokenIn, swapParams.tokenOut, swapParams.amountIn, amountOut, swapRouter);
    }
```

## Recommendations
* On Funnel controlled `SwapX` routers, add the `FunnelVault` to the `feeExcludeList` or set the `feeRate` to 0.
* To handle both controlled and non controlled `SwapX` routers, do not rely on the returned out amount and instead compare balance before and after the swap (similar to Fee on Transfer tokens).
