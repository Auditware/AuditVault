---
tags:
  - lang/move
  - sector/lending
  - sector/oracle
  - platform/ottersec
  - severity/high
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - precondition/flash-loan-available
protocol: "[[Thala]]"
auditors:
  - "[[Bartłomiej Wierzbiński]]"
report: "https://www.thala.fi/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
---
# Bypassing Funds Repayment via Double Upscaling

- id: 47005
- impact: HIGH
- protocol: [[Thala]]
- reporter: Bartłomiej Wierzbiński (OtterSec)
- source: https://www.thala.fi/

## Summary


This bug report discusses a vulnerability in the pay_flashloan function of ThalaSwap V2. The issue arises when handling meta-stable pools, where the funds are multiplied by their value from an oracle. This results in the post-repayment invariant being computed with an incorrect value. As a result, the pool may accept a repayment that is less than the borrowed amount, causing a loss of funds. The recommended solution is to eliminate the double upscaling to prevent this issue. The bug has been fixed in version 19dc5f1.

## Details

## Vulnerability Report: Double Upscaling in pay_flashloan

The vulnerability arises from double upscaling during the repayment process in `pay_flashloan` when handling meta-stable pools. Specifically, `pay_flashloan` upscales `balance_after_flashloan` twice. When handling meta-stable pools, the funds are multiplied by their value derived from an oracle. As a result, the post-repayment invariant computation utilizes an incorrectly scaled value.

## Code Snippet
> _ `thalaswap_v2/sources/pool.move` rust
```rust
public fun pay_flashloan(assets: vector<FungibleAsset>, loan: Flashloan) acquires PauseFlag,
,→ Pool, MetaStablePool, StablePool, ThalaSwap, WeightedPool {
    [...]
    if (pool_is_metastable(pool_obj)) {
        borrow_amounts = upscale_metastable_amounts(pool_obj, borrow_amounts);
        balances = upscale_metastable_amounts(pool_obj, pool_balances(pool_obj));
    };
    [...]
    while (i < len) {
        let repay_sub_fees = *vector::borrow(&repay_amounts, i) - *vector::borrow(&fee_amounts,
        ,→ i);
        let balance_after_flashloan = *vector::borrow(&balances, i) + repay_sub_fees;
        vector::push_back(&mut balances_after_flashloan, balance_after_flashloan);
        i = i + 1;
    };
    [...]
    if (pool_is_metastable(pool_obj)) {
        balances_after_flashloan = upscale_metastable_amounts(pool_obj,
        ,→ balances_after_flashloan);
    };
    [...]
}
```

## Impact
Consequently, this creates a discrepancy where the post-repayment invariant (`curr_invariant`) appears larger than the pre-repayment invariant (`prev_invariant`), even if no real repayment has occurred. This incorrect invariant validation allows the flashloan repayment to proceed without properly verifying the adequacy of the repayment. Thus, the pool may accept a repayment that is less than the borrowed amount, resulting in loss of funds.

## Remediation
Eliminate the double upscaling to prevent inflation of the `curr_invariant`.

## Patch
Fixed in commit `19dc5f1`.
