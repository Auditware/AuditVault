---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/token
  - platform/ottersec
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Stargate]]"
auditors:
  - "[[Robert Chen]]"
report: "https://stargate.finance/"
genome:
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
---
# Inflation Of Pool Balances

- id: 47356
- impact: HIGH
- protocol: [[Stargate]]
- reporter: Robert Chen (OtterSec)
- source: https://stargate.finance/

## Summary


The StargatePool and StargatePoolNative contracts have a bug where the _getPoolBalance function retrieves the pool balance by directly calling balanceOf on the associated ERC20 token contract. However, this method does not account for tokens sent directly to the contract address, bypassing the deposit mechanism. This results in an inflated pool balance, leading to inaccurate exchange rate calculations and potentially disrupting subsequent fee calculations. Additionally, in the FeeLibV1::applyFeeView function, a check exists to prevent the pool balance from exceeding the total value locked (TVL) represented by liquidity provider tokens. If this check fails due to an inflated pool balance, the function will revert and disrupt the system's operation. To fix this issue, an internal record of the pool balance should be maintained within the contracts, distinct from the token's balance retrieved using balanceOf. Any changes to the pool balance or local credits should prompt adjustments to the TVL variable to ensure accurate fee calculations. This bug has been fixed in the latest version. 

## Details

I n both **StargatePool** and **StargatePoolNative**, `_getPoolBalance` retrieves the pool balance by directly calling `balanceOf` on the associated ERC20 token contract. However, this method fails to account for tokens sent directly to the contract address, thus bypassing the deposit mechanism. As a result, if users send tokens directly to the pool contract without following the correct deposit and minting process, the pool balance will become inflated.

This inflation results in inaccurate exchange rate calculations between liquidity provider tokens and underlying tokens, potentially disrupting subsequent fee calculations, which depend on accurate measurements of the pool's balance and the supply of liquidity provider tokens.

> _stg-evm-v2/src/StargatePool.sol Solidity
```solidity
function _getPoolBalance() internal view virtual returns (uint256 balance) {
    balance = IERC20(token).balanceOf(address(this));
}
```

Moreover, in `FeeLibV1::applyFeeView`, a check exists to prevent the pool balance from exceeding the total value locked (TVL) represented by liquidity provider tokens. If this check fails due to an inflated pool balance, the function will revert, disrupting the system’s operation.

## Remediation
Maintain an internal record of the pool balance within **StargatePool** and **StargatePoolNative**, distinct from the token’s balance retrieved utilizing `balanceOf`. Moreover, any alterations to the pool balance or local credits should prompt adjustments to the TVL variable to guarantee precise fee computations.

## Patch
Fixed in 13edc95.

© 2024 Otter Audits LLC. All Rights Reserved. 6/19
