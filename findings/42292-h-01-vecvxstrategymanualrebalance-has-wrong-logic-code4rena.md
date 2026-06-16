---
tags:
  - platform/code4rena
  - lang/solidity
  - has/github
  - severity/high
  - sector/vault
protocol: "[[BadgerDAO]]"
auditors:
  - "[[cmichel]]"
report: "https://code4rena.com/reports/2021-09-bvecvx"
genome:
  - "[[wrong-condition]]"
  - "[[integer-bounds]]"
  - "[[direct-drain]]"
---
# [H-01] `veCVXStrategy.manualRebalance` has wrong logic

- id: 42292
- impact: HIGH
- protocol: [[BadgerDAO]]
- reporter: cmichel (Code4rena)
- source: https://code4rena.com/reports/2021-09-bvecvx

## Summary


Two ratios `currentLockRatio` and `newLockRatio` are being compared in the `veCVXStrategy.manualRebalance` function. However, the two ratios are not comparable as they compute different things. `currentLockRatio` is a percentage value with 18 decimals while `newLockRatio` is an unbounded CVX token amount. This causes the rebalancing to be broken and can lead to locking nearly everything if `totalCVXBalance` is high. To fix this, the variables should be renamed and `currentLockRatio` should be changed to `balanceInLock`. `GalloDaSballo` from `BadgerDAO` has acknowledged and confirmed the issue and has patched it by rewriting the code for `manualRebalance`.

## Details

_Submitted by cmichel, also found by tabish_

The `veCVXStrategy.manualRebalance` function computes two ratios `currentLockRatio` and `newLockRatio` and compares them.

However, these ratios compute different things and are not comparable:

*   `currentLockRatio = balanceInLock.mul(10**18).div(totalCVXBalance)` is a **percentage value** with 18 decimals (i.e. `1e18 = 100%`). Its max value can at most be `1e18`.
*   `newLockRatio = totalCVXBalance.mul(toLock).div(MAX_BPS)` is a **CVX token amount**. It's unbounded and just depends on the `totalCVXBalance` amount.

The comparison that follows does not make sense:

```solidity
if (newLockRatio <= currentLockRatio) {
  // ...
}
```

#### Impact
The rebalancing is broken and does not correctly rebalance. It usually leads to locking nearly everything if `totalCVXBalance` is high.

#### Recommended Mitigation Steps
Judging from the `cvxToLock = newLockRatio.sub(currentLockRatio)` it seems the desired computation is that the "ratios" should actually be in CVX amounts and not in percentages. Therefore, `currentLockRatio` should just be `balanceInLock`. (The variables should be renamed as they aren't really ratios but absolute CVX balance amounts.)

**[GalloDaSballo (BadgerDAO) acknowledged](https://github.com/code-423n4/2021-09-bvecvx-findings/issues/47#issuecomment-916083078):**
 > Agree with the finding, the math is wrong

**[GalloDaSballo (BadgerDAO) confirmed](https://github.com/code-423n4/2021-09-bvecvx-findings/issues/47#issuecomment-916083718):**
 > We will mitigate by deleting the function and using `manualRebalance` and `manualSendbCVXToVault` as way to manually rebalance

**[GalloDaSballo (BadgerDAO) patched](https://github.com/code-423n4/2021-09-bvecvx-findings/issues/47#issuecomment-918534739):**
 > We mitigated by rewriting the code for `manualRebalance`
