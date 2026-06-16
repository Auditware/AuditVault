---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/uncollat-lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[LEND]]"
auditors:
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[frontrun-exposure]]"
  - "[[mev/frontrun]]"
---
# H-27: Incorrect Collateral Check Logic in CoreRouter.sol#borrow()

- id: 58396
- impact: HIGH
- protocol: LEND
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


The report identifies a bug in the CoreRouter.sol file of the Lend-V2 project. The bug allows users to borrow assets even if their total debt exceeds their total collateral, potentially creating undercollateralized positions and bad debt for the protocol. This is due to incorrect logic in the borrow() function, which recalculates a borrowAmount using the user's historical borrow index for a specific market. This recalculation is flawed and can bypass the collateral check, allowing for undercollateralized borrowing. The bug could lead to undercollateralized positions, protocol bad debt, and system instability. The report recommends removing the incorrect logic and directly comparing the collateral and borrowed values to fix the bug.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/1010 

## Found by 
0x15, 0xbakeng, 0xc0ffEE, Constant, Frontrunner, Hueber, Ruppin, Uddercover, algiz, aman, dreamcoder, durov, dystopia, ggg\_ttt\_hhh, gkrastenov, h2134, ivanalexandur, jo13, lazyrams352, mahdifa, newspacexyz, patitonar, pv, rudhra1749, safdie, t.aksoy, wickie

### Summary


The borrow() function in CoreRouter.sol implements an incorrect logic for checking a user's collateralization status before allowing a borrow. Instead of directly using the hypothetical account liquidity values calculated by lendStorage.getHypotheticalAccountLiquidityCollateral, it recalculates a borrowAmount using the user's historical borrow index for the specific market. This recalculation is flawed and, in certain scenarios (specifically when a user has no prior borrow balance in the target market), can lead to the collateral check being bypassed entirely. This allows users to borrow assets even if their total debt exceeds their total collateral, potentially creating undercollateralized positions and bad debt for the protocol.

### Vulnerability Details
The function correctly calls lendStorage.getHypotheticalAccountLiquidityCollateral(msg.sender, LToken(payable(_lToken)), 0, _amount) to determine the user's hypothetical total USD debt (borrowed) and total USD collateral (collateral) after the requested _amount is borrowed. The standard and correct check for solvency would be `require(collateral >= borrowed, "Insufficient collateral")`.

However, the code proceeds with the following logic:

```solidity
        (uint256 borrowed, uint256 collateral) =
            lendStorage.getHypotheticalAccountLiquidityCollateral(msg.sender, LToken(payable(_lToken)), 0, _amount);

        LendStorage.BorrowMarketState memory currentBorrow = lendStorage.getBorrowBalance(msg.sender, _lToken);

        uint256 borrowAmount = currentBorrow.borrowIndex != 0
            ? ((borrowed * LTokenInterface(_lToken).borrowIndex()) / currentBorrow.borrowIndex)
            : 0;

        require(collateral >= borrowAmount, "Insufficient collateral");
```


The borrowAmount is calculated by taking the borrowed value (which is already a USD-denominated total debt value) and attempting to scale it using the current borrowIndex of the _lToken and the user's currentBorrow.borrowIndex. Interest indices are designed to correctly scale token principal amounts to account for accrued interest, not to manipulate aggregated USD values representing total debt across potentially multiple assets. This calculation is conceptually incorrect and leads to an inaccurate assessment of the user's debt relative to their collateral.
Zero Borrow Index Bypass: The conditional logic currentBorrow.borrowIndex != 0 ? ... : 0 means that if the user has no existing borrow balance in the specific _lToken market they are attempting to borrow from, currentBorrow.borrowIndex will be 0. In this case, the borrowAmount is explicitly set to 0. The subsequent check `require(collateral >= borrowAmount, "Insufficient collateral")` becomes `require(collateral >= 0, "Insufficient collateral")`. This check will always pass as collateral is a non-negative value, effectively bypassing the crucial solvency check based on the actual hypothetical debt (borrowed) calculated earlier.





### Root Cause

https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CoreRouter.sol#L153

The function calculates the correct hypothetical liquidity state but then discards the relevant borrowed value (total hypothetical USD debt) in favor of a miscalculated borrowAmount that can be zeroed out under specific, common conditions (first borrow in a market).

### Internal Pre-conditions

N/A

### External Pre-conditions

N/A

### Attack Path

N/A

### Impact

The primary impact is the potential for users to take on undercollateralized debt. Due to the "Zero Borrow Index Bypass," a user making their first borrow in a specific market can bypass the collateral check, regardless of their actual collateral ratio as determined by the protocol's liquidity calculation (getHypotheticalAccountLiquidityCollateral). This can lead to:

Undercollateralized Positions: Users can borrow more value than their supplied collateral supports.
Protocol Bad Debt: If the price of the borrowed asset increases or the price of the collateral asset decreases, these undercollateralized positions cannot be fully liquidated, resulting in losses for the protocol and its lenders.
System Instability: Widespread undercollateralized borrowing can destabilize the entire lending pool.
The misapplication of the interest index when currentBorrow.borrowIndex != 0 also leads to an incorrect collateral check, but the zero index bypass is the most critical path allowing for significant undercollateralization.

### PoC

_No response_

### Mitigation

The collateral check should directly compare the collateral and borrowed values returned by lendStorage.getHypotheticalAccountLiquidityCollateral. The recalculation of borrowAmount using the borrow index is incorrect and should be removed from the collateral check logic.
