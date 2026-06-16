---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/staking
protocol: "[[Goat Tech]]"
auditors:
  - "[[cccz]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_goat_mar2024.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[reward-theft]]"
  - "[[account-ownership]]"
---
# When stake eth in earningreinvest, the reduction of maxearning may not work 

- id: 40666
- impact: HIGH
- protocol: [[Goat Tech]]
- reporter: cccz (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_goat_mar2024.pdf

## Summary


This bug report is about a function called earningReinvest, which is supposed to incentivize users to stake their earnings in a cryptocurrency called ETH. The bug occurs when the function tries to reduce the maximum amount of earnings (maxEarning) in order to maintain financial stability. However, the reduction does not work because another function called earningWithdraw is called before the reduction can take place. This is because earningWithdraw also updates maxEarning, causing the previous reduction to be overwritten.

To fix this issue, the recommendation is to move the earningWithdraw function after the reduction of maxEarning. This will ensure that the reduction takes place before the update of maxEarning, preventing the bug from occurring. The fix has already been applied.

## Details

## Context
(No context files were provided by the reviewer)

## Description
In order to incentivize users to stake the ETH earnings in `earningReinvest`, `maxEarning` is reduced to keep the financial stability.

## Function: earningReinvest
```solidity
function earningReinvest(
    bool isEth_,
    address payable poolOwner_,
    uint duration_,
    uint amount_,
    // address[] memory pulledPoolOwners_,
    uint minSPercent_,
    uint poolConfigCode_
)
external
{
    address account = msg.sender;
    if (isEth_) {
        LLocker.SLock memory oldLockData = _eLocker.getLockData(account, poolOwner_);
        uint realDuration = duration_ + LLocker.restDuration(oldLockData);
        if (realDuration > _maxDuration) {
            realDuration = _maxDuration;
        }
        uint maxEarning = _eEarning.maxEarningOf(account);
        maxEarning -= amount_ * realDuration / _maxDuration;
        _eEarning.updateMaxEarning(account, maxEarning);
    }
    earningWithdraw(isEth_, amount_, payable(address(this)), 0);
    _stake(isEth_, account, poolOwner_, duration_, minSPercent_, poolConfigCode_);
}
```

However, since `earning.withdraw` calls `shareCommission`, which updates `maxEarning`, the previous reduction of `maxEarning` will not work.

## Function: earningWithdraw
```solidity
function earningWithdraw(
    bool isEth_,
    uint amount_,
    address payable dest_,
    uint minEthA_
    // address[] memory pulledPoolOwners_
)
public
{
    address account = msg.sender;
    // earningPulls(account, pulledPoolOwners_, account);
    IEarning earning = isEth_ ? _eEarning : _dEarning;
    earning.withdraw(account, amount_, address(this));
    // ...
}
```

## Function: withdraw
```solidity
function withdraw(
    address account_,
    uint amount_,
    address dest_
)
external
onlyAdmin
{
    shareCommission(account_);
    // ...
    if (_sharedA[account_] > _maxEarningOf[account_]) {
        _updateMaxEarning(account_, _sharedA[account_]);
    }
}
```

Consider `maxEarning = 1000`, `_sharedA = 1000`, `balanceOf = 1100` (100 no `shareCommission`, `sPercent=10%`), `fs = 1`. The user `earningReinvest` 1000 with `maxDuration`, and `maxEarning` is reduced to 0. 

However, when `earning.withdraw` calls `shareCommission`, `_sharedA` is updated to `1000 + 100 * 0.9 = 1090`, and `_maxEarningOf` changes from 0 to 1090. At the end of `_stake`, `fs = ((1090 - 1000) + 1000 * 2%) / 1090 = 0.1`, this reduces the poolOwner's score to 1/10.

## Recommendation
The fix will be to reduce `maxEarning` after withdraw:

## Function: earningReinvest (Fixed Version)
```solidity
function earningReinvest(
    bool isEth_,
    address payable poolOwner_,
    uint duration_,
    uint amount_,
    // address[] memory pulledPoolOwners_,
    uint minSPercent_,
    uint poolConfigCode_
)
external
{
    address account = msg.sender;
    + earningWithdraw(isEth_, amount_, payable(address(this)), 0);
    if (isEth_) {
        LLocker.SLock memory oldLockData = _eLocker.getLockData(account, poolOwner_);
        uint realDuration = duration_ + LLocker.restDuration(oldLockData);
        if (realDuration > _maxDuration) {
            realDuration = _maxDuration;
        }
        uint maxEarning = _eEarning.maxEarningOf(account);
        maxEarning -= amount_ * realDuration / _maxDuration;
        _eEarning.updateMaxEarning(account, maxEarning);
    }
    - earningWithdraw(isEth_, amount_, payable(address(this)), 0);
    _stake(isEth_, account, poolOwner_, duration_, minSPercent_, poolConfigCode_);
}
```

## Goat
This fix has been applied.
