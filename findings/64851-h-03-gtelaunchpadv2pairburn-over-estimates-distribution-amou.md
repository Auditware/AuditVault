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
# [H-03] `GTELaunchpadV2Pair::burn` over-estimates distribution amounts when there are non-zero accrued launchpad fees

- id: 64851
- impact: HIGH
- protocol: [[GTE]]
- reporter: AvantGard (Code4rena)
- source: https://code4rena.com/reports/2025-08-gte-perps-and-launchpad

## Summary


The GTELaunchpadV2Pair contract has a bug that allows an attacker to repeatedly steal funds from the contract. This is due to the fact that when burning LP tokens, the contract calculates the amounts of base/quote tokens to distribute based on the current balances, which include accrued launchpad fees. This allows the attacker to manipulate the system and profit from their LP tokens. To fix this, the recommended mitigation step is to deduct any accrued launchpad fees from the balances when calculating the amounts to distribute.

## Details



`launchpad/uniswap/GTELaunchpadV2Pair.sol` [# L217-L218](https://github.com/code-423n4/2025-08-gte-perps/blob/f43e1eedb65e7e0327cfaf4d7608a37d85d2fae7/contracts/launchpad/uniswap/GTELaunchpadV2Pair.sol# L217-L218)

When burning LP tokens, the `GTELaunchpadV2Pair` contract calculates the amounts of base/quote tokens to distribute based on the current balances (lines 217-218):
```

        amount0 = liquidity.mul(balance0) / _totalSupply; // using balances ensures pro-rata distribution
        amount1 = liquidity.mul(balance1) / _totalSupply; // using balances ensures pro-rata distribution
```

This seems ok but the problem is that the balances will also include accrued launchpad fees, which are owed to the distributor, so liquidity providers should have no claim over these fees. Furthermore, when minting, the amount of liquidity to mint is calculated based on reserves, not balances - and reserves will always have accrued launchpad fees deducted from them.

We see this on GTELaunchpadV2Pair.sol:196:
```

            liquidity = Math.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);
```

An attacker can do the following in a single transaction:

1. Perform swap(s) to ensure the accrued launchpad fees are non-zero.
2. Mint LP tokens.
3. Burn their LP tokens and capture a profit due to the fact they have a claim on a portion of the contract balances not contract reserves.
4. Repeat steps 2-3 many times to increase their profit.

Impact: theft of funds from the pair contract. Given it can be repeated at will by the attacker, this could lead to theft of almost all liquidity from the pair.

### Recommended mitigation steps

When calculating the amounts to distribute when burning LP tokens, make sure to deduct any accrued launchpad fees from the balances as shown:
```

--- a/contracts/launchpad/uniswap/GTELaunchpadV2Pair.sol
+++ b/contracts/launchpad/uniswap/GTELaunchpadV2Pair.sol
@@ -214,8 +214,8 @@ contract GTELaunchpadV2Pair is IUniswapV2Pair, IGTELaunchpadV2Pair, UniswapV2ERC

         bool feeOn = _mintFee(_reserve0, _reserve1);
         uint256 _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
-        amount0 = liquidity.mul(balance0) / _totalSupply; // using balances ensures pro-rata distribution
-        amount1 = liquidity.mul(balance1) / _totalSupply; // using balances ensures pro-rata distribution
+        amount0 = liquidity.mul(balance0 - accruedLaunchpadFee0) / _totalSupply; // using balances ensures pro-rata distribution
+        amount1 = liquidity.mul(balance1 - accruedLaunchpadFee1) / _totalSupply; // using balances ensures pro-rata distribution
```

[View detailed Proof of Concept](https://code4rena.com/audits/2025-08-gte-perps-and-launchpad/submissions/F-1)

---
