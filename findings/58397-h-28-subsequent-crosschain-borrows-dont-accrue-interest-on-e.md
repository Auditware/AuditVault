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
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[debt-accrual-update]]"
  - "[[interest-rate-overflow]]"
  - "[[logic/missing-check]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[cross-chain-message]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# H-28: Subsequent Cross‐Chain Borrows don’t Accrue interest on existing principal when borrowing the same Asset

- id: 58397
- impact: HIGH
- protocol: LEND
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue that was found by a group of individuals on a platform called GitHub. The issue involves borrowing the same asset more than once on a specific chain, which causes the recorded debt to be less than the actual debt. This can result in incorrect calculations of account liquidity, allowing the user to borrow more than they should be allowed to. The root cause of this issue is due to a mistake in the code that updates the user's borrowed amount. This bug can be exploited by a user who initiates multiple cross-chain borrows on the same asset with enough time in between. The impact of this bug is that it can potentially lead to an illiquid market. A proof of concept can be provided upon request. To mitigate this issue, the code needs to be modified to account for the accumulated borrow index when updating the existing borrowed amount. 

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/1011 

## Found by 
0xc0ffEE, 37H3RN17Y2, Brene, Etherking, HeckerTrieuTien, Kvar, Tigerfrake, Z3R0, algiz, coin2own, dmdg321, francoHacker, future, ggg\_ttt\_hhh, gkrastenov, hgrano, jokr, kom, newspacexyz, oxelmiguel, rudhra1749, t.aksoy, theweb3mechanic, zraxx

### Summary

Borrowing the same asset more than once on Chain B, results in `crossChainBorrow[user][token]` entry's principle not updated with the latest `borrowIndex`, recording less debt on ChainA than the actual saved on Chain B.

This results in incorrect calculation of the account liquidity state via the `getHypotheticalAccountLiquidityCollateral`(..), which can allow the user to borrow more than he should be allowed to. 

### Root Cause

In [CrossChainRouter._handleValidBorrowRequest](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L708-L715), if the user previously borrowed the same asset on ChainB, we need to update the existing `userBorrows[index].principle` on ChainA with the new borrow amount.

To do that, it is correct to **first** update the `userBorrows[index].principle` according to the latest `borrowIndex`, before adding the new borrow amount. (the [way](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L631-L632) it is done on ChainB).

However, the code currently just adds the new borrow amount and updates the state:

```solidity
            userBorrows[index].principle =
                userBorrows[index].principle +
                payload.amount; //@audit - not accounting for interest?
```

The interest accumulated between the previous cross chain borrow and the new one is lost and the user will not have to pay it.

### Internal Pre-conditions

1. User on ChainA has already initiated a cross-chain borrow on ChainB.
2. User triggers a second cross-chain borrow on the same asset.

### External Pre-conditions

None

### Attack Path

1. User initiates cross-chain borrow from Chain A to Chain B.
2. User waits for enough time to pass
3. User performs a second cross-chain borrow from Chain A to Chain B **on the same asset.**
4. User's debt calculated on ChainA is less than the real one(recorded on ChainB) by a factor of the `borrowIndex` accumulated between first borrow and second borrow.
5. User can proceed to borrow more than his collateral is worth(due to the wrong total debt calculated by `getHypotheticalAccountLiquidityCollateral` on Chain A

### Impact

The user can perform subsequent cross chain borrows between the same chains(ChainA and ChainB) on the same asset with enough time between them.
This will cause his outstanding debt saved on ChainA to be less than it should be(by a factor of the `borrowIndex` accumulated between first borrow and second borrow).
This will allow the user to borrow additional funds, that he should not be able to and potentially driving the market to an illiquid state.

### PoC

Can be provided upon request.

### Mitigation

Inside the CrossChainRouter._handleValidBorrowRequest, modify the update on existing principle, so that it accounts for the `borrowIndex` accumulated:

```diff
 if (found) {
            // Update existing borrow
            LendStorage.Borrow[] memory userBorrows = lendStorage.getCrossChainBorrows(payload.sender, payload.srcToken);
-            userBorrows[index].principle = userBorrows[index].principle + payload.amount;
+           userBorrows[index].principle = (userBorrows[index].principle * currentBorrowIndex) / userBorrows[index].borrowIndex + payload.amount
            userBorrows[index].borrowIndex = payload.borrowIndex;

            // Update in storage
            lendStorage.updateCrossChainBorrow(payload.sender, payload.srcToken, index, userBorrows[index]);
        } 

```
