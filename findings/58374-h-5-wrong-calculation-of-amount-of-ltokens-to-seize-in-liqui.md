---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/oracle
  - sector/uncollat-lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[LEND]]"
auditors:
  - rudhra1749
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[liquidation-incentives]]"
  - "[[liquidation-logic]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[redesign-logic]]"
---
# H-5: wrong calculation of amount of Ltokens to seize in liquidateCrossChain function

- id: 58374
- impact: HIGH
- protocol: LEND
- reporter: rudhra1749 (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue found by multiple users where a borrower who has borrowed tokens in one chain and provided collateral in another chain can be liquidated by a liquidator in the second chain. However, there is a problem with the calculation of the amount of collateral tokens to seize in the first chain. This is because the calculation is based on the exchange rate between the two chains, which may be different. As a result, the amount of collateral tokens seized may be incorrect, potentially causing the liquidation to fail. The report suggests calculating the amount of collateral tokens to seize in the first chain or using the token of the first chain in the calculation instead of the token of the second chain.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/321 

## Found by 
ggg\_ttt\_hhh, jokr, rudhra1749

### Summary

If a borrower cross borrows tokens in chainB while giving collateral in chainA.Then if he was undercollateralized then a liquidator can call liquidateCrossChain function in chain B to liquidate that borrower.
If we see inputs of liquidateCrossChain function,
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L172-L177
```solidity
    function liquidateCrossChain(
        address borrower,
        uint256 repayAmount,
        uint32 srcEid,
        address lTokenToSeize,
        address borrowedAsset
```
let's say the collateral token that borrower provided in chain A is LtokenChainA and ltokenDestchain that is Ltoken corresponding to LtokenChainA is chain B is LtokenChainB.
here in input of liquidateCrossChain function  lTokenToSeize = LtokenChainB.
It was used in the calculation of amount of collateral tokens to seize in chain A .
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L268-L269
```solidity
        (uint256 amountSeizeError, uint256 seizeTokens) = LendtrollerInterfaceV2(lendtroller)
            .liquidateCalculateSeizeTokens(borrowedlToken, params.lTokenToSeize, params.repayAmount);
```
and here if we see implementation of Lendtroller.liquidateCalculateSeizeTokens function,
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/Lendtroller.sol#L852-L888
```solidity
    function liquidateCalculateSeizeTokens(address lTokenBorrowed, address lTokenCollateral, uint256 actualRepayAmount)
        external
        view
        override
        returns (uint256, uint256)
    {
        /* Read oracle prices for borrowed and collateral markets */
        uint256 priceBorrowedMantissa = oracle.getUnderlyingPrice(LToken(lTokenBorrowed));


        uint256 priceCollateralMantissa = oracle.getUnderlyingPrice(LToken(lTokenCollateral));


        if (priceBorrowedMantissa == 0 || priceCollateralMantissa == 0) {
            return (uint256(Error.PRICE_ERROR), 0);
        }


        /*
         * Get the exchange rate and calculate the number of collateral tokens to seize:
         *  seizeAmount = actualRepayAmount * liquidationIncentive * priceBorrowed / priceCollateral
         *  seizeTokens = seizeAmount / exchangeRate
         *   = actualRepayAmount * (liquidationIncentive * priceBorrowed) / (priceCollateral * exchangeRate)
         */
        uint256 exchangeRateMantissa = LToken(lTokenCollateral).exchangeRateStored(); // Note: reverts on error


        uint256 seizeTokens;
        Exp memory numerator;
        Exp memory denominator;
        Exp memory ratio;


        numerator = mul_(Exp({mantissa: liquidationIncentiveMantissa}), Exp({mantissa: priceBorrowedMantissa}));


        denominator = mul_(Exp({mantissa: priceCollateralMantissa}), Exp({mantissa: exchangeRateMantissa}));


        ratio = div_(numerator, denominator);


        seizeTokens = mul_ScalarTruncate(ratio, actualRepayAmount);


        return (uint256(Error.NO_ERROR), seizeTokens);
```
here in the  calculation  of seizeTokens it uses exchangeRate between LtokenChainB and tokenChainB. But this calculation will give amount of LtokenChainB we should seize but not amount of  tokens we should seize of LtokenChainA.we should calculate this amount in chain A not chain B. most probably exchangeRate in chain A and chain B will be different . so this seizeTokens value was not correctly representing amount of LtokenChainA to seize.

### Root Cause

using 
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L268-L269
```solidity
        (uint256 amountSeizeError, uint256 seizeTokens) = LendtrollerInterfaceV2(lendtroller)
            .liquidateCalculateSeizeTokens(borrowedlToken, params.lTokenToSeize, params.repayAmount);
```
this to calculate amount of LtokenChainA to seize instead of calculating that value in chainA.

### Internal Pre-conditions

for this bug to make impact, the exchangeRate of these Ltokens should be differ in 2 chains.

### External Pre-conditions

none 

### Attack Path

liquidator calls liquidateCrossChain function


### Impact

amount of collateral tokens seized from borrower will be less or more than what it should be based on Differences in ExchangeRates.
may be this could cause liquidation to fail, because of wrong no of collateral tokens to seize

### PoC

_No response_

### Mitigation

calculate the amount of collateral tokens to seize in chainA instead of chainB or use Ltoken of chainA in calculation instead of using Ltoken of chainB
