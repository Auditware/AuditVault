---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - sector/nft-lending
  - platform/hexens
  - has/github
  - severity/high
  - vuln/logic/liquidation-logic
  - vuln/oracle/stale-price
  - impact/mev/frontrun
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/math-is-safe
  - misassumption/oracle-is-reliable
  - fix/add-check
  - fix/redesign-logic
protocol: "[[Fungify]]"
auditors:
  - "[[Hexens]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2023-11-06-Fungify.md"
genome:
  - "[[liquidation-logic]]"
  - "[[stale-price]]"
  - "[[frontrun]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[bridge-sender-auth]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reentrancy-guard]]"
---
# [FNG-15] CErc721 liquidation will always revert if interest state is up-to-date

- id: 62381
- impact: HIGH
- protocol: [[Fungify]]
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2023-11-06-Fungify.md

## Summary


This bug report is about a high severity bug found in the `_liquidateBorrow` function of the CErc721 contract. The function uses the `accrueInterest()` function to get the current exchange rate, but there is a problem with this. The `accrueInterest()` function only returns the exchange rate after updating the interest state, so if the interest state has already been updated in the same block, the function will return a value of 0. This causes the `_liquidateBorrow` function to always fail because of a freshness check. This means that liquidations will always fail if there were any interactions with the CToken, if there are multiple liquidations in one block, or if there is a front-running call to `accrueInterest()`. The bug has been fixed, but it could have been prevented if either `accrueInterest()` returned the exchange rate in the short-circuit branch or if `_liquidateBorrow` handled this case correctly.

## Details

**Severity:** High

**Path:** CErc721.sol:_liquidateBorrow#L428-L464

**Description:** The function `_liquidateBorrow` of the CErc721 contract fetches the current exchange rate using `accrueInterest()` on line 431:
```
uint assetsExchangeRate = accrueInterest();
```
Afterwards, this value is used in a check for freshness on lines 436-438:
```
if (accrualBlockNumber != getBlockNumber() || assetsExchangeRate == 0) {
    revert LiquidateFreshnessCheck();
}
```
However, the function `accrueInterest()` only returns the exchange rate at the end of the function after the interest state has been updated. The function will short-circuit if the interest state had already been updated in the same block (i.e. `accrualBlockNumber`  is equal to `block.number`), which can be seen in lines 651-653:
```
if (accrualBlockNumberPrior == currentBlockNumber) {
    return NO_ERROR;
}
```
In this case, it will return `NO_ERROR` (`0`) and consequently the `_liquidateBorrow` function will always revert due to the freshness check.

As a result, liquidations will always fail if there were any interactions with the CToken, if there are multiple liquidations in one block and liquidations could be blocked by front-running with a call to `accrueInterest()`.
```
    function _liquidateBorrow(address liquidator, address borrower, uint[] memory nftIds) override external nonReentrant returns (uint) {
        require(msg.sender == address(comptroller), "unauthorized");

        uint assetsExchangeRate = accrueInterest();

        uint repayAmount = nftIds.length * expScale;
        
        /* Verify market's block number equals current block number */
        if (accrualBlockNumber != getBlockNumber() || assetsExchangeRate == 0) {
            revert LiquidateFreshnessCheck();
        }

        /* Fail if borrower = liquidator */
        if (borrower == liquidator) {
            revert LiquidateLiquidatorIsBorrower();
        }

        /* Fail if repayAmount = 0 */
        if (repayAmount == 0) {
            revert LiquidateCloseAmountIsZero();
        }

        /* Fail if repayBorrow fails */
        uint repayInterest;
        (repayAmount, repayInterest) = repayBorrowFresh(liquidator, borrower, nftIds, 0);

        /* We emit a LiquidateBorrow event */
        //emit LiquidateBorrow(liquidator, borrower, nftIds, repayInterest, cTokenCollaterals, seizeTokensList);

        // convert interest value to NFT units
        repayInterest = repayInterest * expScale / assetsExchangeRate;

        // combine in NFT unit terms for seizure calculation
        uint actualRepayAmount = repayAmount + repayInterest;

        return actualRepayAmount;
    }
```

**Remediation:**  Either `accrueInterest()` should return the exchange rate in the short-circuit branch, or `_liquidateBorrow` should handle this case correctly.

**Status:**  Fixed


- - -
