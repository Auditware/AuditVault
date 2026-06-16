---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Surge]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Surge-Security-Review.md"
genome:
  - "[[frontrun-exposure]]"
  - "[[sandwich]]"
  - "[[trigger/sandwich-attack]]"
  - "[[add-access-control]]"
---
# [H-01] Lack of Slippage and Access Control in `PositionManager.sol` Can Result in Stolen Funds

- id: 55140
- impact: HIGH
- protocol: Surge
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Surge-Security-Review.md

## Summary


This bug report highlights an issue in the code of a smart contract called `PositionManager`. The problem is that one of the functions, called `PositionManager._swapToVolt()`, does not have proper control over the amount of slippage that can occur during a swap. This means that the value of the swap could be lower than expected, which could lead to potential losses for users. The code comments suggest that this was done intentionally, but it is still a high-risk issue. The affected code can be found in the `PositionManager.sol` file.

The impact of this bug is that anyone can take advantage of it and potentially extract the accrued fees from the contract. This can be done by making a call to the `collectFees()` function, which can be accessed by anyone, and then sandwiching the swap with a minimal amount out that is hardcoded to 0. This means that an attacker can exploit this bug and extract the value of the accrued fees.

The recommendation given by the team is to either add access control to the `collectFees()` function or remove it altogether and modify the `_swapToVolt()` function to enforce a minimal amount out specified by the caller. The team has responded that they have fixed this issue.

## Details

## Severity

High Risk

## Description

The `PositionManager._swapToVolt()` does not have slippage control and according to code comments, it looks like this is intentional.

## Location of Affected Code

File: [PositionManager.sol]()

```solidity
function _swapToVolt(address tokenIn, uint256 amountIn) internal {
    if (amountIn == 0) return;
    address tokenOut = address(voltToken);

    require(tokenIn != address(0), "Invalid token");
    require(tokenIn != tokenOut, "Invalid token");

    VoltSwapRouterConfig memory config = _voltSwapRouterConfigs[tokenIn];

    // There is no slippage control
@>  uint256 amountOutMin = 0;
    address router = config.routerAddress;

    if (config.routerType == VoltSwapRouterType.UniV2) {
        _setAllowanceMaxIfNeeded(IERC20(tokenIn), amountIn, address(router));
        return _swapUniV2(IRouterV2(router), tokenIn, tokenOut, amountIn, amountOutMin);
    } else if (config.routerType == VoltSwapRouterType.UniV3) {
        uint24 feeTier = config.feeTier;
        require(feeTier != 0, "Invalid fee tier");
        _setAllowanceMaxIfNeeded(IERC20(tokenIn), amountIn, address(router));
        return _swapUniV3(IRouterV3(router), tokenIn, tokenOut, amountIn, amountOutMin, feeTier);
    } else {
        revert("Invalid router type");
    }
}
```

## Impact

Some could argue that the swaps will be made only via private transactions by the admin in order to avoid sandwich attacks.

Still not 100% safe but the issue here is 100% exploitable since `_swapToVolt()` is called inside `collectFees()` which is callable by anybody.

So an attacker can extract the value of the accrued fees by making a call for the collection of the accrued fees himself and sandwiching the swap since `amountOutMin` is hardcoded to 0.

## Recommendation

Consider adding access control to `collectFees()` or removing it and modifying `_swapToVolt()` to enforce caller specified minimal amount out.

## Team Response

Fixed.
