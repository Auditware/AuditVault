---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - sector/nft-lending
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/fee-theft
  - fix/use-reentrancy-guard
protocol: "[[Gondi]]"
auditors:
  - "[[minhquanym]]"
report: "https://code4rena.com/reports/2024-04-gondi"
genome:
  - "[[single-function]]"
  - "[[fee-theft]]"
  - "[[use-reentrancy-guard]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
---
# [H-05] `triggerFee` is stolen from other auctions during `settleWithBuyout()`

- id: 35207
- impact: HIGH
- protocol: [[Gondi]]
- reporter: minhquanym (Code4rena)
- source: https://code4rena.com/reports/2024-04-gondi

## Summary


The `settleWithBuyout()` function in the code is used to settle an auction by paying off other lenders and transferring the NFT collateral to the main lender. However, there is a bug in the code where the `triggerFee` is paid from the contract balance instead of the main lender's funds. This can result in the main lender being unable to buy out the auction if there are insufficient funds in the contract balance. This can also affect other auctions running at the same time, causing them to be unable to settle due to insufficient balance. To fix this, the code should be updated to use `safeTransferFrom()` to pay the `triggerFee` from the main lender's address. The severity of this bug is considered high and has been mitigated by changing the code in the `safeTransferFrom` function. 

## Details


The function `settleWithBuyout()` is used to settle an auction with a buyout from the main lender. This lender needs to repay all other lenders and will receive the NFT collateral. Near the end of the function, the `triggerFee` is also paid to the auction originator. However, the funds used to pay this fee are taken directly from the contract balance, even though the main lender doesn't transfer these funds into the contract.

```solidity
function settleWithBuyout(
    ...
) external nonReentrant {
    ...
    // @note Repay other lenders
    ERC20 asset = ERC20(_auction.asset); 
    uint256 totalOwed;
    for (uint256 i; i < _loan.tranche.length;) {
        ...
    }
    IMultiSourceLoan(_auction.loanAddress).loanLiquidated(_auction.loanId, _loan);
    
    // @audit There is no fund in this contract to pay triggerFee
    asset.safeTransfer(_auction.originator, totalOwed.mulDivDown(_auction.triggerFee, _BPS)); 
    ...
}
```

As a result, if the auction contract balance is insufficient to cover the fee, the function will simply revert and prevent the main lender from buying out. In other cases where multiple auctions are running in parallel, the `triggerFee` will be deducted from the other auctions. This could lead to the last auctions being unable to settle due to insufficient balance.

### Proof of Concept

The function `settleWithBuyout()` is called before any `placeBid()` so the funds is only from main lender. In the `settleWithBuyout()`, there are 2 transfers asset. One is to pay other lenders and one is to pay the `triggerFee`. As you can see in the code snippet, there is no `triggerFee` transfer from sender to originator.

### Recommended Mitigation Steps

Consider using `safeTransferFrom()` to pay the `triggerFee` from the sender's address, rather than using `safeTransfer()` to pay the `triggerFee` from the contract balance.

**[0xend (Gondi) confirmed](https://github.com/code-423n4/2024-04-gondi-findings/issues/50#event-12543486840)**

**[0xA5DF (judge) commented](https://github.com/code-423n4/2024-04-gondi-findings/issues/50#issuecomment-2067722171):**
 > Sustaining high severity because this is going to cause a loss of principal to other auctions.

**[Gondi mitigated](https://github.com/code-423n4/2024-05-gondi-mitigation?tab=readme-ov-file#mitigation-of-high--medium-severity-issues):**
> Change to `safeTransferFrom` buyer.

**Status:** Mitigation confirmed. Full details in reports from [oakcobalt](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/45), [minhquanym](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/54) and [bin2chen](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/6).

***
