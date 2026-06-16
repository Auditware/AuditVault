---
tags:
  - lang/solidity
  - sector/lending
  - sector/stable
  - sector/staking-pool
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Gondi]]"
auditors:
  - "[[zhaojie]]"
report: "https://code4rena.com/reports/2024-04-gondi"
genome:
  - "[[liquidation-logic]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[liquidation-underwater]]"
  - "[[timestamp-dependence]]"
---
# [H-03] Function `distribute()` lacks access control allowing anyone to spam and disrupt the pool's accounting

- id: 35205
- impact: HIGH
- protocol: [[Gondi]]
- reporter: zhaojie (Code4rena)
- source: https://code4rena.com/reports/2024-04-gondi

## Summary


The `LiquidationDistributor` contract is responsible for distributing funds to lenders after a liquidation auction. However, there is a bug that allows an attacker to manipulate the accounting process and receive incorrect funds. This is due to a lack of access control in the `distribute()` function. The recommended mitigation is to only allow loan contracts to call this function. The issue has been confirmed and mitigated by the team.

## Details


The `LiquidationDistributor` contract manages the distribution of funds after a liquidation auction is settled. It distributes the received funds to the lenders of the loan. If the lender has implemented the `LoanManager` interface, it will also call `loanLiquidation()` on the lender's address. The Pool, when `loanLiquidation()` is called, will conduct an accounting process to ensure that the received funds are fairly distributed to the depositors.

```solidity
function loanLiquidation(
    uint256 _loanId,
    uint256 _principalAmount,
    uint256 _apr,
    uint256,
    uint256 _protocolFee,
    uint256 _received,
    uint256 _startTime
) external override onlyAcceptedCallers {
    uint256 netApr = _netApr(_apr, _protocolFee);
    uint256 interestEarned = _principalAmount.getInterest(netApr, block.timestamp - _startTime);
    uint256 fees = IFeeManager(getFeeManager).processFees(_received, 0);
    getCollectedFees += fees;
    // @audit Accounting logic
    _loanTermination(msg.sender, _loanId, _principalAmount, netApr, interestEarned, _received - fees);
}
```

However, the `distribute()` function lacks access control. Consequently, an attacker could directly call it with malicious data, leading to incorrect accounting in the Pool.

### Proof of Concept

Observe how the `loanLiquidation()` function is called:

```solidity
function _handleLoanManagerCall(IMultiSourceLoan.Tranche calldata _tranche, uint256 _sent) private {
    if (getLoanManagerRegistry.isLoanManager(_tranche.lender)) {
        LoanManager(_tranche.lender).loanLiquidation(
            _tranche.loanId,
            _tranche.principalAmount,
            _tranche.aprBps,
            _tranche.accruedInterest,
            0,
            _sent,
            _tranche.startTime
        );
    }
}
```

As shown above, the `principalAddress` is not passed in, meaning it will not be validated by the Pool. Therefore, an attacker can simply call the `distribute()` function with `loan.principalAddress` set to a random ERC20 token. This token will still be transferred to the Pool. However, the Pool will mistake this token as its asset token (USDC/WETH) and perform the accounting accordingly.

### Recommended Mitigation Steps

Only allow Loan contracts to call the `distribute()` function.

### Assessed type

Access Control

**[0xend (Gondi) confirmed](https://github.com/code-423n4/2024-04-gondi-findings/issues/64#event-12543191121)**

**[Gondi mitigated](https://github.com/code-423n4/2024-05-gondi-mitigation?tab=readme-ov-file#mitigation-of-high--medium-severity-issues):**
> Added caller check to avoid anyone calling `distribute`.

**Status:** Mitigation confirmed. Full details in reports from [oakcobalt](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/43), [minhquanym](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/52) and [bin2chen](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/4).

***
