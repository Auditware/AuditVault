---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/farm
  - sector/launchpad
  - sector/perpetuals
protocol: "[[GTE]]"
auditors:
  - "[[anchabadze]]"
report: "https://code4rena.com/reports/2025-08-gte-perps-and-launchpad"
genome:
  - "[[missing-check]]"
  - "[[fee-theft]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fot-slippage]]"
---
# [H-10] Protocol fails to charge fees from swap amount

- id: 64858
- impact: HIGH
- protocol: [[GTE]]
- reporter: anchabadze (Code4rena)
- source: https://code4rena.com/reports/2025-08-gte-perps-and-launchpad

## Summary


The GTE uniswap contract has a bug that allows users to execute free swaps, causing LP providers to lose rewards and fees. This is because the contract fails to charge fees for swaps and update the balance adjusted by the fees charged. This can result in a loss of fees for the GTE pool. To fix this, fees should be charged for swaps.

## Details



`launchpad/uniswap/GTELaunchpadV2Pair.sol` [# L231](https://github.com/code-423n4/2025-08-gte-perps/blob/f43e1eedb65e7e0327cfaf4d7608a37d85d2fae7/contracts/launchpad/uniswap/GTELaunchpadV2Pair.sol# L231)

The GTE uniswap contract fails to charge fee for swaps and update balAdjusted by fees charged. This would allow users execute free swaps making LP providers lose rewards/fees for providing liquidity to the protocol.
```

 function swap(uint256 amount0Out, uint256 amount1Out, address to, bytes calldata data) external lock {
        if (amount0Out == 0 && amount1Out == 0) revert("UniswapV2: INSUFFICIENT_OUTPUT_AMOUNT");
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        if (amount0Out >= _reserve0 || amount1Out >= _reserve1) revert("UniswapV2: INSUFFICIENT_LIQUIDITY");

        uint256 balance0;
        uint256 balance1;
        {
            // scope for _token{0,1}, avoids stack too deep errors
            address _token0 = token0;
            address _token1 = token1;
            if (to == _token0 || to == _token1) revert("UniswapV2: INVALID_TO");
  @>          if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out); // optimistically transfer tokens
            if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out); // optimistically transfer tokens
            if (data.length > 0) IUniswapV2Callee(to).uniswapV2Call(msg.sender, amount0Out, amount1Out, data);
            balance0 = IERC20(_token0).balanceOf(address(this));
            balance1 = IERC20(_token1).balanceOf(address(this));
        }
        uint256 amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint256 amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
        if (amount0In == 0 && amount1In == 0) revert("UniswapV2: INSUFFICIENT_INPUT_AMOUNT");

        {
            // scope for reserve{0,1}Adjusted and launchpadFee{0,1}, avoids stack too deep errors
 @>           uint256 balance0Adjusted = balance0.mul(1000).sub(amount0In.mul(3));
  @>          uint256 balance1Adjusted = balance1.mul(1000).sub(amount1In.mul(3));
```

As we can see in the pointer neither is the fee charge `from the transfer of the swap or balance adjusted`, the protocol goes ahead to include launchpad fees without backed transfer. This would break the balance of the pool as protocol assumes the fee was charged so it goes on to update pool variables with unbacked launchpad fees.

### Impact

Loss of fees for GTE pool

### Recommended mitigation steps

Charge fees for swaps.

[View detailed Proof of Concept](https://code4rena.com/audits/2025-08-gte-perps-and-launchpad/submissions/F-234)

---
