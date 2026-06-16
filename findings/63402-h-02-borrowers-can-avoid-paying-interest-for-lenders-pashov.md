---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/algo-stable
  - sector/lending
protocol: "[[RegnumAurum]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/RegnumAurum-security-review_2025-08-12.md"
genome:
  - "[[state-update]]"
  - "[[indirect-loss]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-02] Borrowers can avoid paying interest for lenders

- id: 63402
- impact: HIGH
- protocol: RegnumAurum_2025-08-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[RegnumAurum]]-security-review_2025-08-12.md

## Summary


This report discusses an issue where the `borrow` function does not correctly update the borrower's total debt value. This is due to the `_positionScaledDebt` internal function not properly accounting for interest when calculating the raw debt balance. As a result, borrowers are able to bypass paying interest by borrowing and immediately repaying the same amount. The report recommends adding interest increase to the `rawDebtBalance` calculation to resolve this issue.

## Details


_Resolved_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

When we check the borrowers total debt value, we use `_positionScaledDebt` internal function. It uses following formula:

`rawDebtBalance * usageIndex / positionIndex`

However, it doesn't increase rawDebtBalance correctly in `borrow` function while it updates positionIndex to a new value.

```solidity
(, uint256 underlyingAmount, , ) = IDebtToken(reserve.reserveDebtTokenAddress).mint(msg.sender, msg.sender, amount, reserve.usageIndex, abi.encode(adapter, data));

        // We need to update the position index of the user
        position.positionIndex = reserve.usageIndex;

        // Transfer borrowed amount to user
        IRToken(reserve.reserveRTokenAddress).transferAsset(msg.sender, amount);

@>      position.rawDebtBalance += underlyingAmount; 
```

In here, underlying amount is equal to the borrowing amount. In `debtToken.mint()` call, it will mint borrowers interest to borrower, however, this increase is returned as 3rd parameter in mint function, and we don't use it while updating `rawDebtBalance`. Moreover, we update position index to the last updated value, therefore the following expression will be equal to 1:

`usageIndex / positionIndex`

In order to return correct amount of debt balance, `rawDebtBalance` should account for interest too. 

In this situation, borrowers can borrow X amount of crvUSD and then they can borrow 20 crvUSD and repay back 20 crvUSD immediately. With this method, they can bypass 100% of the interest.

> Note: Debt token will mint the interest correctly, therefore there will be a difference between balance of debt token and `_positionScaledDebt`.

## Recommendations

Add interest increase to `rawDebtBalance` too.
