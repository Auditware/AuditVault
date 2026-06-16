---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - sector/nft-lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
  - fix/use-reentrancy-guard
protocol: "[[Gondi]]"
auditors:
  - "[[zhaojie]]"
report: "https://code4rena.com/reports/2024-04-gondi"
genome:
  - "[[liquidation-logic]]"
  - "[[frontrun]]"
  - "[[use-reentrancy-guard]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# [H-10] The attackers front-running `repayloans` so that the debt cannot be repaid

- id: 35212
- impact: HIGH
- protocol: [[Gondi]]
- reporter: zhaojie (Code4rena)
- source: https://code4rena.com/reports/2024-04-gondi

## Summary


The bug report discusses a potential attack on the code that handles loan repayments in a decentralized lending platform. The attack involves manipulating the loan ID in a way that makes it impossible for borrowers to repay their debts, leading to the liquidation of their collateral. This can be achieved by using a technique called "front-running" where the attacker executes a function before the borrower, causing the loan ID to be inconsistent. This attack can also be carried out by manipulating other related functions, such as merging loan tranches or refinancing the loan. The severity of this bug was initially debated, with some experts considering it to be a low risk due to certain limitations on the attacker's resources and motivation. However, it was ultimately classified as a high risk due to the potential impact on borrowers and the possibility of lenders intentionally using this attack to harm borrowers. The recommended mitigation step is to not allow functions that change the loan ID to be executed close to the loan's expiry time. This issue has been addressed by limiting certain functions and checking for specific conditions before allowing them to be executed. 

## Details


The attackers make it impossible for borrowers to repay their debts, and the collateral is liquidated when the debts mature.

### Proof of Concept

`repayLoan` needs to check the `loanId`; if the id is inconsistent it will revert.

```solidity
    function repayLoan(LoanRepaymentData calldata _repaymentData) external override nonReentrant {
        uint256 loanId = _repaymentData.data.loanId;
        Loan calldata loan = _repaymentData.loan;
        .....
@>      _baseLoanChecks(loanId, loan);
        .....
    }
    
    function _baseLoanChecks(uint256 _loanId, Loan memory _loan) private view {
        if (_loan.hash() != _loans[_loanId]) {
            revert InvalidLoanError(_loanId);
        }
        if (_loan.startTime + _loan.duration < block.timestamp) {
            revert LoanExpiredError();
        }
    }
```

The problem is that `_loans[_loanId]` can change; for example, when `mergeTranches` deletes the old `loanId` and writes the new one:

```solidity
    _loans[loanId] = loanMergedTranches.hash();
    delete _loans[_loanId];
```

An attacker can use the `front-running` attack method. When `repayLoan` is called, execute the `mergeTranches` function in advance, and make the id in `_loans` updated. In this case, the `repayLoan` execution will fail due to inconsistent `_loanId`.

If the attacker keeps using this attack, the borrower's debt will not be repaid; eventually causing the collateral to be liquidated.

In addition to the `mergeTranches` function, the attacker can also call `addNewTranche`, and the borrower can also call the refinance-related function, again causing `_loanId` to be updated.

An attacker can also use the same method to attack `refinance` related functions, making refinance unable to execute. An attacker can also use the same method to attack the `liquidateLoan` function, making it impossible for debts to be cleared.

### Tools Used

VScode

### Recommended Mitigation Steps

Do not delete `_loanId`.

### Assessed type

DoS

**[0xA5DF (judge) commented](https://github.com/code-423n4/2024-04-gondi-findings/issues/35#issuecomment-2061734850):**
 > I have some doubts about severity, since this requires too many resources from the attacker (see [here](https://github.com/code-423n4/org/issues/143)), and the `addNewTranche()` requires the lender's signature (and when using `mergeTranches()` alone the attacker would eventually run out of tranches to merge).

**[0xend (Gondi) confirmed and commented](https://github.com/code-423n4/2024-04-gondi-findings/issues/35#issuecomment-2067349645):**
 > I think this is low (agree with judge for those reasons).

**[0xA5DF (judge) decreased severity to Low and commented](https://github.com/code-423n4/2024-04-gondi-findings/issues/35#issuecomment-2067728846):**
 > I think there are too many limitations on this one, and the motivation for the attacker isn't very high - they're not going to get the entire principal from this.

**[0xend (Gondi) commented](https://github.com/code-423n4/2024-04-gondi-findings/issues/35#issuecomment-2067773961):**
 > Given the limit on tranches the attacker can only run this a handful of times.

**[zhaojie (warden) commented](https://github.com/code-423n4/2024-04-gondi-findings/issues/35#issuecomment-2069358048):**
 > I think it's a `high risk`, because anyone can be an attacker, so Lender can be an attacker.
>
> If the lender does not want the borrower to repay the debt, the lender can use `addNewTranche/mergeTranches` and to attack `repayLoans` and make the borrower's loan impossible to repay, especially when the loan is about to expire.
> This causes the borrower's NFT to be loss, so it would have a high impact.
> 
> When `_liquidateLoan`, if `_canClaim == true`, the borrower can get the NFT directly:
>
> ```solidity
>     function _liquidateLoan....{
>        ....
>         if (_canClaim) {
>             ERC721(_loan.nftCollateralAddress).transferFrom(
>                 address(this), _loan.tranche[0].lender, _loan.nftCollateralTokenId
>             );
>             emit LoanForeclosed(_loanId);
> 
>             liquidated = true;
>         } 
>     ....
>     }
> 
>      function liquidateLoan(uint256 _loanId, Loan calldata _loan)...  {
>        .....
>         (bool liquidated, bytes memory liquidation) = _liquidateLoan(
>             _loanId, _loan, _loan.tranche.length == 1 && !getLoanManagerRegistry.isLoanManager(_loan.tranche[0].lender)
>         );
>        ......
>      }
> ```
> 
> An attacker/lender can use `mergeTranches` to make `_loan.tranche.length == 1`. The key issue is that `loanId` will be reset.

**[0xA5DF (judge) increased severity to High and commented](https://github.com/code-423n4/2024-04-gondi-findings/issues/35#issuecomment-2069536102):**
 > You're right that the lender has a high motivation to execute this attack. You're also right that when the borrower attempts to repay close to the expiry time this attack becomes feasible.
 >
> While some conditions are required in order for this to work, it still seems pretty likely to happen. Due to those reasons I'm reinstating high severity.
> 
> Side note: I think that a better mitigation would be to not allow functions that change the `loanID` to run near the expiry time.

**[0xend (Gondi) commented](https://github.com/code-423n4/2024-04-gondi-findings/issues/35#issuecomment-2098898343):**
 > No specific PR here since it's addressed when limiting `addNewTranche` to only be able to be called by the borrower and checking in `refinancePartial` that there's at least one tranche being refinanced. This ends up limiting the number of times a loan can be locked by the lender (tranches are locked for some time after a refinance for future ones).

***
