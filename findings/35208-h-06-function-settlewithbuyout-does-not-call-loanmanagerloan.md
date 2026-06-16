---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/token
  - sector/vault
protocol: "[[Gondi]]"
auditors:
  - "[[minhquanym]]"
report: "https://code4rena.com/reports/2024-04-gondi"
genome:
  - "[[liquidation-logic]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[liquidation-underwater]]"
  - "[[timestamp-dependence]]"
---
# [H-06] Function `settleWithBuyout()` does not call `LoanManager.loanLiquidation()` during a buyout

- id: 35208
- impact: HIGH
- protocol: [[Gondi]]
- reporter: minhquanym (Code4rena)
- source: https://code4rena.com/reports/2024-04-gondi

## Summary


The bug report discusses an issue in the Gondi protocol where the `loanLiquidation()` function is not being called, leading to incorrect accounting in the Gondi Pool. This function is important for updating the queue accounting and outstanding values of the Pool. The bug occurs in the `settleWithBuyout()` function, where the main lender repays all other lenders directly. The recommended mitigation is to check and call `loanLiquidation()` in `settleWithBuyout()` to ensure accurate accounting in the Pool. The bug has been confirmed and mitigated by the Gondi team.

## Details


Lenders in the Gondi protocol could be EOA and Gondi Pool. Gondi Pool, an ERC4626, allows anyone to deposit funds and earn yield from lending on Gondi. Gondi Pool implemented the `LoanManager` interfaces, which include the `validateOffer()`, `loanRepayment()`, and `loanLiquidation()` functions. The functions `loanRepayment()` and `loanLiquidation()` are called when a borrower repays the loan or the loan is liquidated, i.e., when the Pool receives funds back from `MultiSourceLoan`. Both functions is used to update the queue accounting and the outstanding values of the Pool.

```solidity
ERC20 asset = ERC20(_auction.asset); 
uint256 totalOwed;
// @audit Repay lender but not call LoanManager.loanLiquidation()
for (uint256 i; i < _loan.tranche.length;) {
    if (i != largestTrancheIdx) { 
        IMultiSourceLoan.Tranche calldata thisTranche = _loan.tranche[i];
        uint256 owed = thisTranche.principalAmount + thisTranche.accruedInterest
            + thisTranche.principalAmount.getInterest(thisTranche.aprBps, block.timestamp - thisTranche.startTime);
        totalOwed += owed; 
        asset.safeTransferFrom(msg.sender, thisTranche.lender, owed);
    }
    unchecked {
        ++i;
    }
}
IMultiSourceLoan(_auction.loanAddress).loanLiquidated(_auction.loanId, _loan);
```

In the `settleWithBuyout()` function, the main lender buys out the loan by repaying all other lenders directly. However, `loanLiquidation()` is not called, leading to incorrect accounting in the Pool.

### Proof of Concept

The `loanLiquidation()` function handles accounting in the pool.

<https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L449-L463>

```solidity
function loanLiquidation(
    ...
) external override onlyAcceptedCallers {
    uint256 netApr = _netApr(_apr, _protocolFee);
    uint256 interestEarned = _principalAmount.getInterest(netApr, block.timestamp - _startTime);
    uint256 fees = IFeeManager(getFeeManager).processFees(_received, 0);
    getCollectedFees += fees;
    _loanTermination(msg.sender, _loanId, _principalAmount, netApr, interestEarned, _received - fees);
}
```

### Recommended Mitigation Steps

Consider checking and calling `loanLiquidation()` in `settleWithBuyout()` to ensure accurate accounting in the pool.

**[0xend (Gondi) confirmed and commented](https://github.com/code-423n4/2024-04-gondi-findings/issues/49#issuecomment-2067756607):**
 > Changing interest paid to use the end of the loan (this appears in another issue since this delta in time otherwise breaks the `maxSeniorRepayment` concept).

**[Gondi mitigated](https://github.com/code-423n4/2024-05-gondi-mitigation?tab=readme-ov-file#mitigation-of-high--medium-severity-issues):**
> Added `loanLiquidation` call.

**Status:** Mitigation confirmed. Full details in reports from [oakcobalt](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/46), [minhquanym](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/55) and [bin2chen](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/7).

***
