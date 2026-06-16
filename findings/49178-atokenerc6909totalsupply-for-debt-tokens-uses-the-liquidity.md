---
tags:
  - lang/solidity
  - sector/lending
  - platform/spearbit
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Cod3x]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# ATokenERC6909.totalSupply for debt tokens uses the liquidity index

- id: 49178
- impact: HIGH
- protocol: [[Cod3x]] lend
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf

## Summary


Severity: High Risk
Context: ATokenERC6909.sol#L615-L625
Description: The totalSupply function in ATokenERC6909.sol assumes that the provided id is always for an aToken and uses it as an index, which can cause incorrect values to be returned. This can affect other functions such as calculating interest rates and providing incentives. However, the issue has been fixed in a recent commit.
Recommendation: The totalSupply function should be updated to check if the provided id is for an aToken or debtToken before using it as an index. This will prevent incorrect values from being returned.
Fix: The issue has been fixed in commit f8cd1275 and has been verified by Spearbit.

## Details

## Severity: High Risk

## Context
ATokenERC6909.sol#L615-L625

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

This function assumes the id provided is always an aToken id and thus uses the `POOL.getReserveNormalizedIncome(_underlyingAssetAddresses[id])` as an index.

1. This function needs to be used by other on-chain and off-chain agents to query the correct amount for debt tokens as well.
2. It is used in `MiniPoolPiReserveInterestRateStrategy.getCurrentInterestRates()` to calculate the utilization rate, and so wrong values are returned.
3. It is used in `_afterTokenTransfer` to supply the oldSupply to `INCENTIVES_CONTROLLER`. As a result, for debt tokens with incentives, incorrect values would be provided.

Fortunately, the correct value of `totalVariableDebt` was calculated manually in `MiniPoolReserveLogic.updateInterestRates`. Thus, the state transition for both the default and PiReserve InterestRateStratgys use the correct calculation:

```solidity
vars.totalVariableDebt = IAERC6909(reserve.aTokenAddress).scaledTotalSupply(
    (reserve.variableDebtTokenID)
).rayMul(reserve.variableBorrowIndex);
```

If the above optimization had not been used, the issue would have been more severe.

## Recommendation
Make sure `totalSupply` checks whether the id is an aToken or debtToken:

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

## Cod3x
Fixed in commit `f8cd1275`.

## Spearbit
Fix verified.
