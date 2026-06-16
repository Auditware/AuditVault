---
tags:
  - lang/solidity
  - sector/lending
  - platform/spearbit
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Astera]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# ATokenERC6909.totalSupply for debt tokens uses the liquidity index

- id: 62279
- impact: HIGH
- protocol: [[Astera]]
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf

## Summary


This bug report is about a high-risk issue in the code for ATokenERC6909. The `totalSupply` function is not properly checking the `id` provided and assumes it is always an aToken ID. This leads to incorrect values being returned when the function is used by other agents to query the correct amount for debt tokens. This bug affects multiple areas of the code and could have been more severe if not for a previous optimization. The recommendation is to update the `totalSupply` function to check for the type of `id` provided and use the correct index for calculation. The issue has been fixed in the latest commit and verified by Spearbit. 

## Details

## Severity: High Risk

## Context

`ATokenERC6909.sol#L615-L625`

## Description

The `totalSupply` function is defined as:

```solidity
function totalSupply(uint256 id) public view override returns (uint256) {
    uint256 currentSupplyScaled = super.totalSupply(id);
    if (currentSupplyScaled == 0) {
        return 0;
    }
    return currentSupplyScaled.rayMul(
        POOL.getReserveNormalizedIncome(_underlyingAssetAddresses[id])
    );
}
```

This implementation assumes that the `id` provided is always an aToken ID and thus uses the `POOL.getReserveNormalizedIncome(_underlyingAssetAddresses[id])` as an index.

1. This function needs to be used by other on-chain and off-chain agents to query the correct amount for debt tokens as well.
2. It is used in `MiniPoolPiReserveInterestRateStrategy.getCurrentInterestRates()` to calculate the utilization rate, leading to incorrect values being returned.
3. It is used in `_afterTokenTransfer` to supply the `oldSupply` to `INCENTIVES_CONTROLLER`. Consequently, for debt tokens with incentives, incorrect values would be provided.

Fortunately, the correct value of `totalVariableDebt` was calculated manually in `MiniPoolReserveLogic.updateInterestRates`, ensuring that the state transition for both the default and PiReserve InterestRateStrategies uses the correct calculation:

```solidity
vars.totalVariableDebt = IAERC6909(reserve.aTokenAddress).scaledTotalSupply(
    (reserve.variableDebtTokenID)
).rayMul(reserve.variableBorrowIndex);
```

If the above optimization had not been used, the issue would have been more severe.

## Recommendation

Make sure `totalSupply` checks whether the `id` is an aToken or debtToken:

```solidity
/**
 * @notice Gets the total supply for a token ID.
 * @param id The token ID.
 * @return The total supply scaled by normalized income/debt.
 */
function totalSupply(uint256 id) public view override returns (uint256) {
    uint256 currentSupplyScaled = super.totalSupply(id);
    if (currentSupplyScaled == 0) {
        return 0;
    }
    uint256 index = 0;
    if (isDebtToken(id)) {
        index = POOL.getReserveNormalizedVariableDebt(_underlyingAssetAddresses[id]);
    } else {
        index = POOL.getReserveNormalizedIncome(_underlyingAssetAddresses[id]);
    }
    return currentSupplyScaled.rayMul(index);
}
```

## Astera

Fixed in commit `f8cd1275`.

## Spearbit

Fix verified.
