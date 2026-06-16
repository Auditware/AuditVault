---
tags:
  - lang/solidity
  - sector/dex
  - sector/launchpad
  - sector/perpetuals
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/fee-calculation
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[GTE]]"
auditors:
  - "[[AvantGard]]"
report: "https://code4rena.com/reports/2025-08-gte-perps-and-launchpad"
genome:
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
---
# [H-05] `GTELaunchpadV2Pair` permits minting LP tokens for free when there are non-zero accumulated launch pad fees

- id: 64853
- impact: HIGH
- protocol: [[GTE]]
- reporter: AvantGard (Code4rena)
- source: https://code4rena.com/reports/2025-08-gte-perps-and-launchpad

## Summary


The bug report discusses a potential issue in the `GTELaunchpadV2Pair` contract, where users can mint LP tokens for free by calling the `mint` function without pre-transferring any tokens to the pair. This is due to a miscalculation in the `amount0` and `amount1` variables, which are supposed to be calculated as the difference between current balances and reserves. However, the reserves are set in a different function and do not take into account any accumulated fees. This allows users to repeatedly call the `mint` function and steal assets from the contract. The impact of this bug could be the theft of user and protocol funds, potentially draining all of the funds in the pair contract. To mitigate this issue, the report recommends subtracting off the accumulated launchpad fees when calculating the amount transferred in by the minter. A detailed proof of concept is also provided for reference.

## Details



`launchpad/uniswap/GTELaunchpadV2Pair.sol` [# L187-L188](https://github.com/code-423n4/2025-08-gte-perps/blob/f43e1eedb65e7e0327cfaf4d7608a37d85d2fae7/contracts/launchpad/uniswap/GTELaunchpadV2Pair.sol# L187-L188)

In `GTELaunchpadV2Pair::mint`, the `amount0` and `amount1` of tokens provided to the contract are calculated as the difference between current balances and reserves on lines 185-188:
```

        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        uint256 amount0 = balance0.sub(_reserve0);
        uint256 amount1 = balance1.sub(_reserve1);
```

The issue is that reserves are set in the `_update` function as the current balances subtract away any accumulated fees (lines 154-155):
```

        reserve0 = _reserve0 = uint112(balance0) - totalLaunchpadFee0;
        reserve1 = _reserve1 = uint112(balance1) - totalLaunchpadFee1;
```

Let’s assume a scenario where both `totalLaunchpadFee0` and `totalLaunchpadFee1` are non-zero and a user directly calls `mint` (without pre-transferring any tokens to the pair). In this case, `mint` will mistakenly calculate `amount0` and `amount1` to be the launchpad fees - the difference between current balances and reserves. Thereby the user will be able to mint LP tokens for free. They can repeat the call to `mint` an unlimited number of times - provided they make the calls within the same block as when the fees were received so that the launchpad fees don’t get cleared. They can then cash out the stolen assets using `burn`.

Impact: theft of user and protocol funds - this could end up draining all of the funds in the pair contract due to a large number of calls to the `mint` function.

### Recommended mitigation steps

Subtract off the accumulated launch pad fees when calculating the amount transferred in by the minter:
```

--- a/contracts/launchpad/uniswap/GTELaunchpadV2Pair.sol
+++ b/contracts/launchpad/uniswap/GTELaunchpadV2Pair.sol
@@ -184,8 +184,8 @@ contract GTELaunchpadV2Pair is IUniswapV2Pair, IGTELaunchpadV2Pair, UniswapV2ERC
         (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
         uint256 balance0 = IERC20(token0).balanceOf(address(this));
         uint256 balance1 = IERC20(token1).balanceOf(address(this));
-        uint256 amount0 = balance0.sub(_reserve0);
-        uint256 amount1 = balance1.sub(_reserve1);
+        uint256 amount0 = balance0.sub(_reserve0).sub(accruedLaunchpadFee0);
+        uint256 amount1 = balance1.sub(_reserve1).sub(accruedLaunchpadFee1);
```

[View detailed Proof of Concept](https://code4rena.com/audits/2025-08-gte-perps-and-launchpad/submissions/F-3)

---
