---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/staking
protocol: "[[Yield Basis]]"
auditors:
  - "[[Gereon Mendler]]"
report: "https://certificate.quantstamp.com/full/yield-basis/e07ecad3-524c-4609-b4f6-71ed7fdc3281/index.html"
genome:
  - "[[state-update]]"
  - "[[wrong-state]]"
  - "[[reward-accounting]]"
---
# Staker Address Update Does Not Transfer Staker's Balance

- id: 62010
- impact: HIGH
- protocol: [[Yield Basis]]
- reporter: Gereon Mendler (Quantstamp)
- source: https://certificate.quantstamp.com/full/yield-basis/e07ecad3-524c-4609-b4f6-71ed7fdc3281/index.html

## Summary


This bug report discusses an issue with the `set_staker()` function in the `LT.vy` file. If this function is called and the `staker` address is updated without transferring the previous staker's balance to the new staker, it can cause problems such as the new staker having a zero balance and incorrect calculations of staked tokens. The recommendation is to transfer the previous staker's balance to the new staker or pause the protocol to prevent further issues.

## Details

**Update**
The client fixed the issue in commit `f797e3043714ac28f58aed6bdb059f3398368f91` and provided the following explanation:

> This was already fixed on Apr 4 by not allowing setting staker when the staker was already set

**File(s) affected:**`contracts/LT.vy`

**Description:** If the `set_staker()` function is called and the `staker` address is updated without transferring the previous staker's `balanceOf` to the new staker, the following issues could arise:

1.   The previous staker's balance would remain with the old staker's address, leaving the new staker with a zero balance. This could lead to a situation where the new staker cannot perform any operations that require a balance, such as withdrawing staked tokens.
2.   Incorrect calculations of staked tokens would result in the `_calculate_values()` function producing different values than expected.

**Recommendation:** When the `set_staker()` function is executed, transfer the previous staker's balance to the new staker. Otherwise, consider implementing functionality to pause the protocol to prevent users from depositing or withdrawing while the staker is being updated and the old staker's balance is transferred to the new staker.
