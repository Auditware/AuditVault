---
tags:
  - lang/solidity
  - sector/lending
  - platform/hexens
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Tokemak]]"
auditors:
  - "[[Hexens]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-07-22-Tokemak.md"
genome:
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[fee-accounting]]"
  - "[[timestamp-dependence]]"
---
# [TOKE-12] Potential DoS attack of AutoPool's rebalance and debt reporting functions due to division by zero in profit locking calculation from AutoPoolFees

- id: 53525
- impact: HIGH
- protocol: [[Tokemak]]
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-07-22-Tokemak.md

## Summary


This bug report is about a problem in the code that manages fees for the AutoPool feature. The issue occurs when certain conditions are met, leading to a division by zero error and causing the transaction to fail. This can happen when the function is trying to burn shares of AutoPool, but the previous balance is greater than the target balance. This can be exploited by an attacker who transfers shares into AutoPool, causing the function to not burn those shares. To fix this, the code needs to check for a zero denominator and skip the calculation. This bug has been fixed.

## Details

**Severity:** High

**Path:** src/vault/libs/AutoPoolFees.sol#L330-L346, src/vault/libs/AutoPoolFees.sol#L402, src/vault/libs/AutoPoolFees.sol#L42-L53

**Description:**

In `AutoPoolFees::_updateProfitUnlockTimings` function, if `fullUnlockTime > block.timestamp`, `previousLockTime` will be 0. Additionally, if newLockShares is 0 at the same time, `newUnlockPeriod` will be 0, leading to a revert due to division by 0. Details of the calculation:

```
uint256 newUnlockPeriod = (previousLockTime + newLockShares * unlockPeriod) / totalLockShares;
settings.profitUnlockRate = totalLockShares * MAX_BPS_PROFIT / newUnlockPeriod;
```
This scenario can occur when these conditions are satisfied:

1. In `AutoPoolFees::calculateProfitLocking` function, `effectiveTs` (`startTotalSupply`) is greater than `targetTotalSupply`. This indicates that the function is attempting to burn shares of AutoPool.

2. `previousLockShares` (the actual balance of AutoPool after `burnUnlockedShares`) is greater than `effectiveTs` - `targetTotalSupply`
This means that `calculateProfitLocking` will not fully burn locked shares; the new locked shares totalLockShares will still be greater than 0, and `_updateProfitUnlockTimings` will be triggered.

3. `settings.fullProfitUnlockTime` is less than or equal `block.timestamp`, which means the old locked profit shares were fully burnt.

In fact, even when `AutoPoolEth::_feeAndProfitHandling` attempts to burn untracked shares of AutoPool before calling `calculateProfitLocking`, these states can be simulated because `AutoPoolFees::unlockedShares` function always skips when `profitUnlockSettings.fullProfitUnlockTime` is 0. 

Specifically, before taking profit for the first time, `profitUnlockSettings.fullProfitUnlockTime` will still be 0 since it has never been updated. An attacker can directly transfer AutoPool's shares into AutoPool, causing `_feeAndProfitHandling` to not burn that amount of shares. In the next call to `updateDebtReporting` or `flashRebalance`, the `previousLockShares` variable passed into `calculateProfitLocking` will be greater than 0, even if there was no previously locked profit. If the transferred shares from the attacker are large enough (just larger than the fee shares), the three conditions above will be satisfied, and this transaction will revert due to division by 0 in the `_updateProfitUnlockTimings` function.

```
function unlockedShares(
    IAutopool.ProfitUnlockSettings storage profitUnlockSettings,
    AutopoolToken.TokenData storage tokenData
) public view returns (uint256 shares) {
    uint256 fullTime = profitUnlockSettings.fullProfitUnlockTime;
    if (fullTime > block.timestamp) {
        shares = profitUnlockSettings.profitUnlockRate
            * (block.timestamp - profitUnlockSettings.lastProfitUnlockTime) / MAX_BPS_PROFIT;
    } else if (fullTime != 0) {
        shares = tokenData.balances[address(this)];
    }
}
```
```
function calculateProfitLocking(
  IAutopool.ProfitUnlockSettings storage settings,
  AutopoolToken.TokenData storage tokenData,
  uint256 feeShares,
  uint256 newTotalAssets,
  uint256 startTotalAssets,
  uint256 startTotalSupply,
  uint256 previousLockShares
) external returns (uint256) {
  uint256 unlockPeriod = settings.unlockPeriodInSeconds;

  // If there were existing shares and we set the unlock period to 0 they are immediately unlocked
  // so we don't have to worry about existing shares here. And if the period is 0 then we
  // won't be locking any new shares
  if (unlockPeriod == 0 || startTotalAssets == 0) {
      return startTotalSupply;
  }

  uint256 newLockShares = 0;
  uint256 previousLockToBurn = 0;
  uint256 effectiveTs = startTotalSupply;

  // The total supply we would need to not see a change in nav/share
  uint256 targetTotalSupply = newTotalAssets * (effectiveTs - feeShares) / startTotalAssets;

  if (effectiveTs > targetTotalSupply) {
      // Our actual total supply is greater than our target.
      // This means we would see a decrease in nav/share
      // See if we can burn any profit shares to offset that
      if (previousLockShares > 0) {
          uint256 diff = effectiveTs - targetTotalSupply;
          if (previousLockShares >= diff) {
              previousLockToBurn = diff;
              effectiveTs -= diff;
          } else {
              previousLockToBurn = previousLockShares;
              effectiveTs -= previousLockShares;
          }
      }
  }

  if (targetTotalSupply > effectiveTs) {
      // Our actual total supply is less than our target.
      // This means we would see an increase in nav/share (due to gains) which we can't allow
      // We need to mint shares to the vault to offset
      newLockShares = targetTotalSupply - effectiveTs;
      effectiveTs += newLockShares;
  }

  // We know how many shares should be locked at this point
  // Mint or burn what we need to match if necessary
  uint256 totalLockShares = previousLockShares - previousLockToBurn + newLockShares;
  if (totalLockShares > previousLockShares) {
      uint256 mintAmount = totalLockShares - previousLockShares;
      tokenData.mint(address(this), mintAmount);
      startTotalSupply += mintAmount;
  } else if (totalLockShares < previousLockShares) {
      uint256 burnAmount = previousLockShares - totalLockShares;
      tokenData.burn(address(this), burnAmount);
      startTotalSupply -= burnAmount;
  }

  // If we're going to end up with no profit shares, zero the rate
  // We don't need to 0 the other timing vars if we just zero the rate
  if (totalLockShares == 0) {
      settings.profitUnlockRate = 0;
  }

  // We have shares and they are going to unlocked later
  if (totalLockShares > 0 && unlockPeriod > 0) {
      _updateProfitUnlockTimings(
          settings, unlockPeriod, previousLockToBurn, previousLockShares, newLockShares, totalLockShares
      );
  }

  return startTotalSupply;
}
```
```
function _updateProfitUnlockTimings(
    IAutopool.ProfitUnlockSettings storage settings,
    uint256 unlockPeriod,
    uint256 previousLockToBurn,
    uint256 previousLockShares,
    uint256 newLockShares,
    uint256 totalLockShares
) private {
    uint256 previousLockTime;
    uint256 fullUnlockTime = settings.fullProfitUnlockTime;

    // Determine how much time is left for the remaining previous profit shares
    if (fullUnlockTime > block.timestamp) {
        previousLockTime = (previousLockShares - previousLockToBurn) * (fullUnlockTime - block.timestamp);
    }

    // Amount of time it will take to unlock all shares, weighted avg over current and new shares
    uint256 newUnlockPeriod = (previousLockTime + newLockShares * unlockPeriod) / totalLockShares;

    // Rate at which totalLockShares will unlock
    settings.profitUnlockRate = totalLockShares * MAX_BPS_PROFIT / newUnlockPeriod;

    // Time the full of amount of totalLockShares will be unlocked
    settings.fullProfitUnlockTime = uint48(block.timestamp + newUnlockPeriod);
    settings.lastProfitUnlockTime = uint48(block.timestamp);
}

```

**Remediation:**  The denominator should be checked in the `_updateProfitUnlockTimings` function to skip the calculation when it is 0.

**Status:** Fixed

- - -
