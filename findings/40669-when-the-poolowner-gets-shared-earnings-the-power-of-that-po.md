---
tags:
  - lang/solidity
  - sector/staking
  - platform/cantina
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Goat Tech]]"
auditors:
  - "[[cccz]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_goat_mar2024.pdf"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# When the poolowner gets shared earnings, the power of that pool becomes stale 

- id: 40669
- impact: HIGH
- protocol: [[Goat Tech]]
- reporter: cccz (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_goat_mar2024.pdf

## Summary


The bug report discusses an issue with the calculation of financial stability (fs) in a pool. This is an important factor in determining the pool's power. The problem arises when the pool owner receives shared earnings, causing the balance and max earning to change and making the pool's power stale. This results in incorrect reward distribution. The recommendation is to create a public function that allows anyone to recalculate the pool's fs as earnings increase. The issue has been fixed by wrapping the existing function with a new public function.

## Details

## Context
(No context files were provided by the reviewer)

## Description
`fs` (Financial_stability) is an important factor in calculating the pool's power. The formula is as follows:

```
fs = ETH_Earning / Max_ETH_Earning
```

Here is the implementation of the function:

```solidity
function _reCalFs(address account_) internal {
    uint maxEarning = _eEarning.maxEarningOf(account_);
    _profileC.updateFsOf(account_, LHelper.calFs(
        _eEarning.balanceOf(account_) + _voting.defenderEarningFreezedOf(account_),
        maxEarning
    ));
    _reCalEP2PDBalance(account_);
}
```

The problem here is that when `poolOwner` gets shared earnings, both `_eEarning.balanceOf(poolOwner)` and `_eEarning.maxEarningOf(poolOwner)` change, causing the pool's power to become stale.

Here is the function for sharing commissions:

```solidity
function shareCommission(address account_) public {
    uint amount = balanceOf(account_) - _sharedA[account_];
    if (amount == 0) {
        return;
    }
    address sponsor;
    uint sAmount;
    (sponsor, sAmount) = _profileC.getSponsorPart(account_, amount);
    if (sAmount > 0) {
        _transfer(account_, sponsor, sAmount);
        emit ShareCommission(account_, sponsor, sAmount);
    }
    _sharedA[account_] = balanceOf(account_);
    if (_sharedA[account_] > _maxEarningOf[account_]) {
        _updateMaxEarning(account_, _sharedA[account_]);
    }
}
```

**Example:**

Currently, if:
- `_eEarning.balanceOf(A) = 100`
- `_eEarning.maxEarningOf(A) = 200`
- Then, `fsA = 100/200 = 0.5`

After `A` gets 50 shared earnings, `fsA` should be updated to `150/200 = 0.75`. However, since `fsA` is only recalculated when staking and withdrawing in `PoolA`, `fsA` will remain at `0.5` instead of updating to `0.75`, which causes the power of the pool to become stale and the reward distribution to be incorrect.

## Recommendation
It is recommended to wrap `_reCalFs` with a public function so that anyone can recalculate any pool's `fs` as earnings increase.

## Goat
Correct. Fixed.

Here is the modified function:

```solidity
function reCalFs(address poolOwner_) external {
    _reCalFs(poolOwner_);
}
```
