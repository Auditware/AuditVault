---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/lending
  - sector/staking
  - sector/cdp
protocol: "[[Roots]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Roots-security-review_2025-02-09.md"
genome:
  - "[[liquidation-incentives]]"
  - "[[logic/liquidation-logic]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# [H-04] Borrowers fail to claim their surplus collateral

- id: 55114
- impact: HIGH
- protocol: Roots_2025-02-09
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Roots-security-review_2025-02-09.md

## Summary



This bug report discusses an issue in the Roots protocol where liquidated borrowers are unable to claim their leftover collateral. This occurs because the protocol is different from Prisma, and the collateral tokens are staked in the Staker contract to earn rewards. However, when trying to withdraw the collateral directly from the Trove Manager, the transaction is reverted. The recommendation is to withdraw the surplus collateral from the Staker contract when a borrow position is liquidated.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

In roots, if the TCR is less than CCR, the system will enter the recovery mode. In the recovery mode, some borrow positions will be liquidated even if their borrow positions' ICR is larger than MCR.

In this kind of liquidation, we will not seize all collateral token from the borrower. We will calculate the collateral token according to the MCR. It means that there are some left collateral token for the borrowers, named `collSurplus`. We will record the liquidated borrower's `surplusBalances` via function `addCollateralSurplus`.

Liquidated borrowers can claim the left collateral via function `claimCollateral`. The problem is that roots protocol is a little bit different with Prisma. All of our collateral tokens will be staked in the Staker contract to earn some rewards. But in function `claimCollateral`, we try to transfer collateral token from the TroveManager directly. This transaction will be reverted. If we want to withdraw some collateral from the Trove Manager, we should use `staker.onWithdrawal` to withdraw these collateral from the Staker contract.

```solidity
    function _tryLiquidateWithCap(
        ITroveManager troveManager,
        address _borrower,
        uint256 _debtInStabPool,
        uint256 _MCR,
        uint256 _price
    ) internal returns (LiquidationValues memory singleLiquidation) {
        uint256 collToOffset = (entireTroveDebt * _MCR) / _price;

        singleLiquidation.collGasCompensation = _getCollGasCompensation(collToOffset);
        singleLiquidation.debtGasCompensation = DEBT_GAS_COMPENSATION;

        singleLiquidation.debtToOffset = entireTroveDebt;
        singleLiquidation.collToSendToSP = collToOffset - singleLiquidation.collGasCompensation;

        troveManager.closeTroveByLiquidation(_borrower);

        uint256 collSurplus = entireTroveColl - collToOffset;
        if (collSurplus > 0) {
            singleLiquidation.collSurplus = collSurplus;
            troveManager.addCollateralSurplus(_borrower, collSurplus);
        }
```

```solidity
    function addCollateralSurplus(address borrower, uint256 collSurplus) external {
        _requireCallerIsLM();
        surplusBalances[borrower] += collSurplus;
    }
```

```solidity
    function claimCollateral(address _receiver) external {
        uint256 claimableColl = surplusBalances[msg.sender];
        require(claimableColl > 0, "No collateral available to claim");

        surplusBalances[msg.sender] = 0;

        collateralToken.safeTransfer(_receiver, claimableColl);
    }
```

## Recommendations

Withdraw the surplus collateral from the Staker contract when one borrow position is liquidated.
