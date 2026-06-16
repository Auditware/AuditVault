---
tags:
  - lang/solidity
  - sector/lending
  - platform/code4rena
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Gondi]]"
auditors:
  - "[[oakcobalt]]"
report: "https://code4rena.com/reports/2024-04-gondi"
genome:
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
  - "[[liquidation-underwater]]"
---
# [H-11] Incorrect protocol fee implementation results in `outstandingValues` to be mis-accounted in Pool.sol

- id: 35213
- impact: HIGH
- protocol: [[Gondi]]
- reporter: oakcobalt (Code4rena)
- source: https://code4rena.com/reports/2024-04-gondi

## Summary


This bug report discusses a vulnerability in the `LiquidationDistributer` contract, where a hardcoded value of `0` is used as the protocol fee when calling the `loanLiquidation()` function in the `LoanManager` contract. This leads to an incorrect calculation of the `netApr` value, which in turn affects the `sumApr` state variable used for accounting. This can cause an accounting error and affect all flows that rely on the `sumApr` value for calculating interests. The recommended mitigation is to use the `protocolFee` value instead of `0` when calling the `loanLiquidation()` function. The bug has been confirmed and mitigated by the Gondi team.

## Details


The vulnerability is that `LiquidationDistributer::_handleLoanMangerCall` [hardcodes `0` as protocol fee](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/LiquidationDistributor.sol#L117) when calling `LoanManager(_tranche.lender).loanLiquidation()`.

```solidity
//src/lib/LiquidationDistributor.sol
    function _handleLoanManagerCall(IMultiSourceLoan.Tranche calldata _tranche, uint256 _sent) private {
        if (getLoanManagerRegistry.isLoanManager(_tranche.lender)) {
            LoanManager(_tranche.lender).loanLiquidation(
                _tranche.loanId,
                _tranche.principalAmount,
                _tranche.aprBps,
                _tranche.accruedInterest,
   |>           0,  //@audit this should be the actual protocol fee fraction
                _sent,
                _tranche.startTime
            );
        }
    }
```

`_handleLoanManagerCall()` will be called as part of the flow to [distribute proceeds](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/AuctionLoanLiquidator.sol#L288) from a liquidation.

When protocol fee is hardcoded `0`, in the [`Pool::loanliquidation`](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/LiquidationDistributor.sol#L112) call, [`netApr` will not account for protocol fee fraction](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L458) which will [inflate the `_apr` used to offset `_outstandingValues.sumApr`](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L751), a state variable that accounts for the total annual apr of outstanding loans.

```solidity
//src/lib/pools/Pool.sol
        OutstandingValues memory __outstandingValues,
        uint256 _principalAmount,
        uint256 _apr,
        uint256 _interestEarned
    ) private view returns (OutstandingValues memory) {
...
         //@audit inflated _apr will offset __outstandingValues.sumApr to an incorrect lower value, causing accounting error
|>        __outstandingValues.sumApr -= uint128(_apr * _principalAmount);
...
```

<https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L751>

For comparison, when a loan is created ([`pool::validateOffer`](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/loans/MultiSourceLoan.sol#L760)), the actual protocol fee ([`protocolFee.fraction`](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/loans/MultiSourceLoan.sol#L1008)) will be passed, and `__outstandingValues.sumApr` will be added with the [post-fee apr value](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L509), instead of the before-fee apr.

State accounting `__outstandingValues` will be incorrect, all flows that consume `__outstandingValues.sumApr` when calculating interests will be affected.

### Recommended Mitigation Steps

User `_loan.protocolFee `instead of `0`.

**[0xend (Gondi) confirmed and commented](https://github.com/code-423n4/2024-04-gondi-findings/issues/33#issuecomment-2067353471):**
 > Messes up with accounting, I think this is a high one.

**[Gondi mitigated](https://github.com/code-423n4/2024-05-gondi-mitigation?tab=readme-ov-file#mitigation-of-high--medium-severity-issues):**
> Passing protocol fee.

**Status:** Mitigation confirmed. Full details in reports from [oakcobalt](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/89), [minhquanym](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/59) and [bin2chen](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/12).

***
