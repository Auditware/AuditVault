---
tags:
  - lang/solidity
  - platform/immunefi
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/oracle
  - sector/stable
protocol: "[[Folks Finance]]"
auditors:
  - "[[Nyksx]]"
report: "https://github.com/immunefi-team/Past-Audit-Competitions/blob/main/Folks%20Finance/Boost%20_%20Folks%20Finance%2034122%20-%20%5BSmart%20Contract%20-%20High%5D%20Wrong%20borrow%20balance%20calculation%20in%20the%20getLoanLiquidity%20function.md"
genome:
  - "[[liquidation-logic]]"
  - "[[liquidation-manipulation]]"
  - "[[liquidation-underwater]]"
  - "[[timestamp-dependence]]"
---
# Wrong borrow balance calculation in the getLoanLiquidity function

- id: 61079
- impact: HIGH
- protocol: [[Folks Finance]]
- reporter: Nyksx (Immunefi)
- source: https://github.com/immunefi-team/Past-Audit-Competitions/blob/main/Folks%20Finance/Boost%20_%20Folks%20Finance%2034122%20-%20%5BSmart%20Contract%20-%20High%5D%20Wrong%20borrow%20balance%20calculation%20in%20the%20getLoanLiquidity%20function.md

## Summary


This report is about a bug found in a smart contract on the testnet platform Snowtrace. The bug affects the protocol's solvency, which means that it can cause financial problems. The bug is related to the calculation of the borrow balance in the getLoanLiquidity function. When the executeLiquidation function is called, the prepareLiquidation function checks whether the violator is liquidatable by using the getLoanLiquidity function. However, the function calculates the borrow balance incorrectly for stable borrow loans. This can result in a lower borrow balance for the violator, causing the liquidate function to revert even if the violator is in a liquidatable state. The bug can be fixed by correctly calling the calcBorrowBalance function in the getLoanLiquidity function. A proof of concept has been provided to demonstrate the bug.

## Details




Report type: Smart Contract


Target: https://testnet.snowtrace.io/address/0xf8E94c5Da5f5F23b39399F6679b2eAb29FE3071e

Impacts:
- Protocol insolvency

## Description
## Brief/Intro
The borrow balance is not calculated correctly in the getLoanLiquidity function.

## Vulnerability Details
When the executeLiquidation function is called, the prepareLiquidation function calculates violators' effective collateral and borrow balance with the getLoanLiquidity function. Then, the function checks whether the violator is liquidatable. 

```solidity
violatorLiquidity = violatorLoan.getLoanLiquidity(pools, loanType.pools, oracleManager);
        if (violatorLiquidity.effectiveCollateralValue >= violatorLiquidity.effectiveBorrowValue)
            revert OverCollateralizedLoan(loansParams.violatorLoanId);

```
When we look at the getLoanLiquidity function, if the loan is a stable borrow, the function calculates the borrow balance with the calcStableBorrowBalance function.

```solidity
for (uint8 i = 0; i < poolsLength; i++) {
            poolId = loan.borPools[i];

            LoanManagerState.UserLoanBorrow memory loanBorrow = loan.borrows[poolId];
            balance = loanBorrow.lastStableUpdateTimestamp > 0
                ? calcStableBorrowBalance(
                    loanBorrow.balance,
                    loanBorrow.lastInterestIndex,
                    loanBorrow.stableInterestRate,
                    block.timestamp - loanBorrow.lastStableUpdateTimestamp
                )
                : calcVariableBorrowBalance(
                    loanBorrow.balance,
                    loanBorrow.lastInterestIndex,
                    pools[poolId].getUpdatedVariableBorrowInterestIndex()
                );
            //.......
        }
```

The calcStableBorrowBalance function first calculates the stableBorrowInterestIndex and then calculates the borrow balance.

```solidity
function calcStableBorrowBalance(
        uint256 balance,
        uint256 loanInterestIndex,
        uint256 loanInterestRate,
        uint256 stableBorrowChangeDelta
    ) private pure returns (uint256) {
        uint256 stableBorrowInterestIndex = MathUtils.calcBorrowInterestIndex(
            loanInterestRate,
            loanInterestIndex,
            stableBorrowChangeDelta
        );
        return balance.calcBorrowBalance(loanInterestIndex, stableBorrowInterestIndex);  
    }
```

However, the problem is that the function calls the calcBorrowBalance function wrongly. The updated borrow index needs to be the first function parameter, and the old borrow index needs to be the second function parameter. Like in the updateLoanBorrowInterests function. 

```
function updateLoanBorrowInterests(
        LoanManagerState.UserLoanBorrow storage loanBorrow,
        DataTypes.UpdateUserLoanBorrowParams memory params
    ) internal {
        if (loanBorrow.lastStableUpdateTimestamp > 0) {
            uint256 oldInterestIndex = loanBorrow.lastInterestIndex;
            uint256 oldStableInterestRate = loanBorrow.stableInterestRate;
            loanBorrow.lastInterestIndex = MathUtils.calcBorrowInterestIndex(
                oldStableInterestRate,
                oldInterestIndex,
                block.timestamp - loanBorrow.lastStableUpdateTimestamp
            );
            loanBorrow.lastStableUpdateTimestamp = block.timestamp;

            // update balance with interest
            loanBorrow.balance = MathUtils.calcBorrowBalance(
                loanBorrow.balance,
                loanBorrow.lastInterestIndex,
                oldInterestIndex
            );

           //........
    }
```

As we can see in the updateLoanBorrowInterests function, it first updates the lastInterestIndex and then correctly calls the calcBorrowBalance.
## Impact Details

Wrongly Calculating the borrow balance in the getLoanLiquidity can result in a lower borrow balance for the violator, which may also cause the liquidate function to revert even if the violator is in the liquidatable state.

## References


        
## Proof of concept
## Proof of Concept

LoanManager.test.ts

```solidity
it("Test borrow balance", async () => {
      const {
        hub,
        loanManager,
        loanManagerAddress,
        pools,
        loanId,
        accountId,
        loanTypeId,
        borrowAmount,
        usdcStableInterestRate,
      } = await loadFixture(depositEtherAndStableBorrowUSDCFixture);

      const { pool, poolId } = pools.USDC;
      const userLoanBefore = await loanManager.getUserLoan(loanId);
      const oldBorrow = userLoanBefore[5][0];

      // calculate interest
      const timestamp = (await getLatestBlockTimestamp()) + getRandomInt(SECONDS_IN_HOUR);
      await time.setNextBlockTimestamp(timestamp);

      // Updated interest index
      const newInterestIndex = calcBorrowInterestIndex(
        oldBorrow.stableInterestRate,
        oldBorrow.lastInterestIndex,
        BigInt(timestamp) - oldBorrow.lastStableUpdateTimestamp,
        true
      );

      // Correctly calculated borrow balance like in the updateLoanBorrowInterests function
      const borrowBalance = calcBorrowBalance(oldBorrow.balance, newInterestIndex, oldBorrow.lastInterestIndex);
      console.log("Correct borrow balance", borrowBalance);

      // Wrongly calculated borrow balance like in the calcStableBorrowBalance function
      const wrongBorrowBalance = calcBorrowBalance(oldBorrow.balance, oldBorrow.lastInterestIndex, newInterestIndex);
      console.log("Wrong borrow balance", wrongBorrowBalance);
    });
```
