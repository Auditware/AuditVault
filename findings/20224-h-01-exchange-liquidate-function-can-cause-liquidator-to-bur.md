---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/token
protocol: "[[Polynomial Protocol]]"
auditors:
  - "[[rbserver]]"
report: "https://code4rena.com/reports/2023-03-polynomial"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
---
# [H-01] `Exchange._liquidate` function can cause liquidator to burn too much `powerPerp` tokens

- id: 20224
- impact: HIGH
- protocol: [[Polynomial Protocol]]
- reporter: rbserver (Code4rena)
- source: https://code4rena.com/reports/2023-03-polynomial

## Summary


A bug report has been identified in the `Exchange._liquidate` function of Solidity code. When the `ShortCollateral.liquidate` function is called, `totalCollateralReturned > userCollateral.amount` can be true when `collateralPrice` has become much lower comparing to `markPrice`, such as due to a market sell-off. In this case, `totalCollateralReturned = userCollateral.amount` is executed, and only `userCollateral.amount` is transferred to the liquidator. This means that the liquidator will burn `debtRepaying` `powerPerp` tokens, but only receive `userCollateral.amount` collateral tokens, resulting in the liquidator losing the extra `powerPerp` tokens, which are burnt, that are equivalent to the difference between `debtRepaying` `powerPerp` tokens' equivalent collateral token amount and `userCollateral.amount` collateral tokens. This bug can be mitigated by updating the `Exchange._liquidate` function to burn the number of `powerPerp` tokens that are equivalent to the actual collateral token amount received by the liquidator.

## Details


When calling the following `Exchange._liquidate` function, `uint256 totalCollateralReturned = shortCollateral.liquidate(positionId, debtRepaying, msg.sender)` is executed.

```solidity
    function _liquidate(uint256 positionId, uint256 debtRepaying) internal {
        uint256 maxDebtRepayment = shortCollateral.maxLiquidatableDebt(positionId);
        require(maxDebtRepayment > 0);
        if (debtRepaying > maxDebtRepayment) debtRepaying = maxDebtRepayment;

        IShortToken.ShortPosition memory position = shortToken.shortPositions(positionId);

        uint256 totalCollateralReturned = shortCollateral.liquidate(positionId, debtRepaying, msg.sender);

        address user = shortToken.ownerOf(positionId);

        uint256 finalPosition = position.shortAmount - debtRepaying;
        uint256 finalCollateralAmount = position.collateralAmount - totalCollateralReturned;

        shortToken.adjustPosition(positionId, user, position.collateral, finalPosition, finalCollateralAmount);

        pool.liquidate(debtRepaying);
        powerPerp.burn(msg.sender, debtRepaying);
        ...
    }
```

In the following `ShortCollateral.liquidate` function, when executing `uint256 collateralClaim = debt.mulDivDown(markPrice, collateralPrice)`, where `debt` is `debtRepaying`, `collateralClaim` can be high if `collateralPrice` has become much lower comparing to `markPrice`, such as due to a market sell-off that causes the collateral to be worth much less than before. In this case, `totalCollateralReturned` can be high as well, which can cause `totalCollateralReturned > userCollateral.amount` to be true. When such condition is true, `totalCollateralReturned = userCollateral.amount` is executed, and only `userCollateral.amount` is transferred to the liquidator after executing `ERC20(userCollateral.collateral).safeTransfer(user, totalCollateralReturned)`.

```solidity
    function liquidate(uint256 positionId, uint256 debt, address user)
        external
        override
        onlyExchange
        nonReentrant
        returns (uint256 totalCollateralReturned)
    {
        UserCollateral storage userCollateral = userCollaterals[positionId];

        bytes32 currencyKey = synthetixAdapter.getCurrencyKey(userCollateral.collateral);
        Collateral memory coll = collaterals[currencyKey];

        (uint256 markPrice,) = exchange.getMarkPrice();
        (uint256 collateralPrice,) = synthetixAdapter.getAssetPrice(currencyKey);
        uint256 collateralClaim = debt.mulDivDown(markPrice, collateralPrice);
        uint256 liqBonus = collateralClaim.mulWadDown(coll.liqBonus);
        totalCollateralReturned = liqBonus + collateralClaim;
        if (totalCollateralReturned > userCollateral.amount) totalCollateralReturned = userCollateral.amount;
        userCollateral.amount -= totalCollateralReturned;

        ERC20(userCollateral.collateral).safeTransfer(user, totalCollateralReturned);
        ...
    }
```

Back in the `Exchange._liquidate` function, the liquidator burns `debtRepaying` `powerPerp` tokens after `powerPerp.burn(msg.sender, debtRepaying)` is executed. However, in this situation, the liquidator only receives `userCollateral.amount` collateral tokens that are less than the collateral token amount that should be equivalent to `debtRepaying` `powerPerp` tokens but this liquidator still burns `debtRepaying` `powerPerp` tokens. As a result, this liquidator loses the extra `powerPerp` tokens, which are burnt, that are equivalent to the difference between `debtRepaying` `powerPerp` tokens' equivalent collateral token amount and `userCollateral.amount` collateral tokens.

### Proof of Concept

The following steps can occur for the described scenario.

1.  Alice calls the `Exchange._liquidate` function with `debtRepaying` being 1000e18.
2.  When the `ShortCollateral.liquidate` function is called, `totalCollateralReturned > userCollateral.amount` is true, and `userCollateral.amount` collateral tokens that are equivalent to 500e18 `powerPerp` tokens are transferred to Alice.
3.  When `powerPerp.burn(msg.sender, debtRepaying)` is executed in the `Exchange._liquidate` function, Alice burns 1000e18 `powerPerp` tokens.
4.  Because Alice only receives `userCollateral.amount` collateral tokens that are equivalent to 500e18 `powerPerp` tokens, she loses 500e18 `powerPerp` tokens.

### Tools Used

VSCode

### Recommended Mitigation Steps

The `Exchange._liquidate` function can be updated to burn the number of `powerPerp` tokens that are equivalent to the actual collateral token amount received by the liquidator instead of burning `debtRepaying` `powerPerp` tokens.

**[mubaris (Polynomial) confirmed](https://github.com/code-423n4/2023-03-polynomial-findings/issues/226#issuecomment-1510105074)**

***
