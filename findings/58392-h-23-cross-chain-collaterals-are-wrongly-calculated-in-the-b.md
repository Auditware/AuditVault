---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/bridge
  - sector/lending
  - platform/sherlock
protocol: "[[LEND]]"
auditors:
  - Allen\_George08
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[debt-accrual-update]]"
  - "[[cross-contract-state-consistency]]"
  - "[[arithmetic/rounding]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[cross-chain-message]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# H-23: Cross-chain collaterals are wrongly calculated in the borrowWithInterest function

- id: 58392
- impact: HIGH
- protocol: LEND
- reporter: Allen\_George08 (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue with the `borrowWithInterest` function in the LendStorage smart contract. This function is responsible for calculating cross-chain collaterals, which are used in the repayment logic. However, the function is not able to correctly calculate the collaterals, which can lead to incorrect or failed repayments. This is due to a condition in the code that is always false, preventing the cross-chain collaterals from being included in the calculation. This bug can only occur when a user has a cross-chain borrow. The impact of this bug is that the borrowed amount will be incorrectly calculated, potentially leading to failed repayments. The suggested mitigation is to rewrite the condition in the code.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/946 

## Found by 
0x1422, 0xB4nkz, 0xubermensch, 0xzey, Allen\_George08, Brene, JeRRy0422, Kvar, Lamsya, TopStar, Ziusz, algiz, anchabadze, dimah7, dystopia, freeking, gkrastenov, heavyw8t, ivanalexandur, m3dython, mahdifa, oxelmiguel, t.aksoy, x0rc1ph3r, xiaoming90, zxriptor

### Summary

The `borrowWithInterest`  function can not correctly calculate the cross-chain collaterals, which affects the entire repayment logic.

### Root Cause

When a user tries to make a cross-chain borrow from source chain A to destination chain B, their `crossChainBorrows` are stored on chain B, and their `crossChainCollaterals `are stored on chain A. The cross-chain collateral is stored during the `_handleValidBorrowRequest` function:

```solidity
   lendStorage.addCrossChainCollateral(
                payload.sender, // user
                destUnderlying,  // underlying
                LendStorage.Borrow({
                   //@audit-issue srcEid != destEid
                    srcEid: srcEid,
                    destEid: currentEid,
                    principle: payload.amount,
                    borrowIndex: currentBorrowIndex,
                    borrowedlToken: payload.destlToken,
                    srcToken: payload.srcToken
                })
            );
```

When the user tries to repay their borrow, the system checks the sum of the cross-chain collaterals on either side. In the `borrowWithInterest` function, while calculating the total collateral, it checks whether:

https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/LendStorage.sol#L497

```solidity
 if (collaterals[i].destEid == currentEid && collaterals[i].srcEid == currentEid)
```

This condition is always false, because `destEid` is always different from `srcEid`. As a result, the amount stored for cross-chain collaterals is never included in the borrow amount calculation, potentially leading to incorrect or failed repayments.

### Internal Pre-conditions

N/A

### External Pre-conditions

User should have cross-chain borrow.

### Attack Path

N/A, just need to be called `repayCrossChainBorrow` function.

### Impact

An incorrect calculation of the borrowed amount will be made as the cross-chain collateral is not included. This can potentially lead to incorrect or failed repayments.

### PoC

_No response_

### Mitigation

Avoid checking if `collaterals[i].destEid == currentEid && collaterals[i].srcEid == currentEid` is true. This condition should be rewritten.
