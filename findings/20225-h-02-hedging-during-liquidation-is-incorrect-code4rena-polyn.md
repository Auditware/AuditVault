---
tags:
  - lang/solidity
  - sector/lending
  - sector/perpetuals
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/liquidation-logic
  - fix/use-reentrancy-guard
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[Polynomial Protocol]]"
auditors:
  - "[[KIntern_NA]]"
report: "https://code4rena.com/reports/2023-03-polynomial"
genome:
  - "[[liquidation-logic]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
---
# [H-02] Hedging during liquidation is incorrect

- id: 20225
- impact: HIGH
- protocol: [[Polynomial Protocol]]
- reporter: KIntern\_NA (Code4rena)
- source: https://code4rena.com/reports/2023-03-polynomial

## Summary


This bug report describes an issue with the liquidation process of a contract exchange, where the LiquidityPool will lose funds without expectation. When a short position is liquidated in the contract Exchange, the function `_liquidate` will be triggered. This function will burn the power Perp tokens and reduce the short position amount accordingly. Despite this, the `pool.liquidate` function will be called, and the LiquidityPool will be hedged with the same amount of debtRepaying. This leads to LiquidityPool being hedged more than it needs, and the position of the LiquidityPool in the Perp Market being incorrect.

The recommended mitigation step is to not hedge the LiquidityPool during liquidation. This bug report has been confirmed by mubaris (Polynomial).

## Details


Hedging will not work as expected, and LiquidityPool will lose funds without expectation.

### Proof of concept

1.  When a short position is liquidated in contract Exchange, function `_liquidate` will be triggered. It will burn the power perp tokens and reduce the short position amount accordingly.

```solidity
function _liquidate(uint256 positionId, uint256 debtRepaying) internal {
    ...
    uint256 finalPosition = position.shortAmount - debtRepaying;
    uint256 finalCollateralAmount = position.collateralAmount - totalCollateralReturned;
    
    shortToken.adjustPosition(positionId, user, position.collateral, finalPosition, finalCollateralAmount);

    pool.liquidate(debtRepaying);
    powerPerp.burn(msg.sender, debtRepaying); 
    ...
```

2.  As you can see, it will decrease the size of short position by  `debtRepaying`, and burn `debtRepaying` power perp tokens. Because of the same amount, the skew of `LiquidityPool` will not change.
3.  Howerver, `pool.liquidate` will be called, and `LiquidityPool` will be hedged with `debtRepaying` amount.

```solidity
function liquidate(uint256 amount) external override onlyExchange nonReentrant {
    (uint256 markPrice, bool isInvalid) = getMarkPrice();
    require(!isInvalid);

    uint256 hedgingFees = _hedge(int256(amount), true);
    usedFunds += int256(hedgingFees);

    emit Liquidate(markPrice, amount);
}
```

4.  Therefore, LiquidityPool will be hedged more than it needs, and the position of `LiquidityPool` in the Perp Market will be incorrect (compared with what it should be for hedging).

### Recommended Mitigation Steps

Should not hedge the LiquidityPool during liquidation.

**[mubaris (Polynomial) confirmed](https://github.com/code-423n4/2023-03-polynomial-findings/issues/214#issuecomment-1494185661)**



***
