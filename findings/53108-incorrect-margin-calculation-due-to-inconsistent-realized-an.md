---
tags:
  - lang/solidity
  - sector/lending
  - sector/perpetuals
  - sector/stable
  - platform/cantina
  - has/poc
  - severity/high
  - vuln/logic/liquidation-logic
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[DESK]]"
auditors:
  - "[[Tripathi]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_hmx_january2025.pdf"
genome:
  - "[[liquidation-logic]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# Incorrect Margin Calculation Due to Inconsistent Realized and Unrealized Balances 

- id: 53108
- impact: HIGH
- protocol: [[DESK]]
- reporter: Tripathi (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_hmx_january2025.pdf

## Summary


The LiquidationHandler module in the protocol has a bug that can cause incorrect liquidations. This is because the calculation of the minimum margin required for liquidation is affected by the treatment of realized and unrealized settlement token balances. Due to this bug, users may be liquidated even if they have enough collateral. This bug is caused by the separate application of collateral factors to realized and unrealized balances for settlement tokens. This can create discrepancies in margin calculations between two identical positions that only differ in their realized/unrealized ratio. A test has been provided to demonstrate this issue, and it is recommended to fix this bug by aggregating realized and unrealized balances before applying collateral factors. 

## Details

## Liquidation Vulnerability in LiquidationHandler.sol

## Context
**File:** LiquidationHandler.sol  
**Line:** 77

## Summary
The protocol supports multi-collateral and uses collateral factors to calculate the minimum margin required for liquidation. Due to inconsistent treatment of realized and unrealized settlement token balances in the margin calculation, users may be incorrectly liquidated.

## Vulnerability Details
The liquidation handler calculates `_totalMarginWithUnsettledE18` to determine if an account should be liquidated by comparing it against the Minimum Margin Requirement (MMR). The current implementation treats realized and unrealized settlement token balances differently when applying collateral factors:

```solidity
function _executeAction(bytes memory _data) internal override {
    // ...
    int256 _borrowingFeeE18 = _assetService.getSubaccountPendingBorrowingFee(_action.subaccount);
    (int256 _totalUPnLE18, int256 _totalFundingFeeE18) = 
        _perpService.getSubaccountTotalUnrealizedPNLAndFundingFee(_action.subaccount);
    int256 _unsettledE18 = _totalUPnLE18 - _totalFundingFeeE18 - _borrowingFeeE18;
    
    // Apply collateral factor if unsettled balance is positive
    if (_unsettledE18 > 0) {
        _unsettledE18 = 
            _unsettledE18 * _assetService.collateralFactors(_settlementToken).toInt256() / int256(BPS);
    }
    
    _totalMarginWithUnsettledE18 = _assetService.getSubaccountTotalMargin(_action.subaccount) + _unsettledE18;
    // ...
}
```

This code is from the liquidationHandler module, where we can see the calculation of `_totalMarginWithUnsettledE18` which is checked against MMR to decide whether the account should be liquidated or not. A user’s margin will change if they move unrealized balances to realized and vice versa, but ideally, margin should be independent of realized and unrealized balances. Margin should only depend on the total debt and supplied collateral.

The issue arises because the implementation:
1. Applies collateral factors separately to realized and unrealized balances for the settlement token.
2. Creates discrepancies in margin calculations between two identical positions that only differ in their realized/unrealized ratio.

### Example
- **User A:** -500 USDC unrealized + 600 USDC realized.
- **User B:** -400 USDC unrealized + 500 USDC realized (after realizing 100 USDC loss).

Ideally, both should provide equal collateral, but this is not true.

## Impact Explanation
The primary impact is the potential for incorrect liquidation.

## Proof of Concept
The following test demonstrates how moving balances between realized and unrealized states changes the margin:

```solidity
function test_IncorrectMarginCalculation() public {
    vm.prank(DEPLOYER);
    // Set USDC collateral factor to 0.9 (9000 basis points)
    assetService.setCollateralFactor(address(USDC), 9000);
    
    // Scenario 1: Alice with -500 USDC unrealized and +600 USDC realized
    // Set up Alice's initial state
    vm.prank(WHITELIST);
    assetService.adjustCollateral(aliceSubId, address(USDC), int256(600 * 1e6)); // Realized +600 USDC
    
    // Unrealized pnl = -500 USDC, funding fee = 0 (for simplicity)
    vm.mockCall(
        address(perpService),
        abi.encodeWithSelector(PerpService.getSubaccountTotalUnrealizedPNLAndFundingFee.selector, 
        aliceSubId),
        abi.encode(-int256(500 ether), 0)
    );
    
    (int256 totalUPNL1, ) = perpService.getSubaccountTotalUnrealizedPNLAndFundingFee(aliceSubId);
    int256 collateral1 = assetService.getSubaccountTotalMargin(aliceSubId) + totalUPNL1; // USDC
    
    // Calculate margin for Scenario 1
    // Realized: +600 USDC * 0.9 (collat factor) = +540 USDC
    // Unrealized: -500 USDC (no collat factor for negative values)
    // Total: 540 - 500 = 40 USDC
    
    // Scenario 2: Move 100 USDC unrealized loss to realized
    vm.prank(WHITELIST);
    assetService.adjustCollateral(aliceSubId, address(USDC), -int256(100 * 1e6)); // Realized now +500 USDC
    
    vm.mockCall(
        address(perpService),
        abi.encodeWithSelector(PerpService.getSubaccountTotalUnrealizedPNLAndFundingFee.selector, 
        aliceSubId),
        abi.encode(-int256(400 ether), 0)
    );
    
    (int256 totalUPNL2, ) = perpService.getSubaccountTotalUnrealizedPNLAndFundingFee(aliceSubId);
    int256 collateral2 = assetService.getSubaccountTotalMargin(aliceSubId) + totalUPNL2; // USDC
    
    // Assert that the margins are different
    console.log("collateral1", collateral1);
    console.log("collateral2", collateral2);
    assertTrue(collateral1 != collateral2);
}
```

Use this test in `assetService.setter.t.sol` to see the expected output.

## Recommendation
Based on my current understanding, aggregate realized and unrealized balances before applying collateral factors.
