---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/vault
protocol: "[[Aptos Securitize]]"
auditors:
  - "[[Bartłomiej Wierzbiński]]"
report: "https://aptoslabs.com/"
genome:
  - "[[wrong-condition]]"
  - "[[cross-contract-state-consistency]]"
  - "[[data-corruption/price-manipulation]]"
---
# Artificial Reduction of Investor Counts

- id: 46834
- impact: HIGH
- protocol: [[Aptos Securitize]]
- reporter: Bartłomiej Wierzbiński (OtterSec)
- source: https://aptoslabs.com/

## Summary


The report states that there is a problem with the system that allows users to create and deposit zero-value fungible assets. This can be done through the functions fungible_asset::zero and dispatchable_fungible_asset::deposit. The issue arises when a user with a zero balance withdraws and then deposits a zero-value asset, which causes a decrease in the total number of investors in the system. This is because the system assumes that a zero balance means the investor is no longer active and can be removed. However, this can artificially decrease the investor count and prevent proper removal. The issue has been identified and resolved in a recent update. 

## Details

## Inconsistency in Zero-Value Fungible Asset Creation

There is an inconsistency in the way the system allows users to create zero-value fungible assets (FA) through `fungible_asset::zero` and deposit them via `dispatchable_fungible_asset::deposit`. A user with a zero FA balance may withdraw a zero-value FA and then deposit it, setting `WithdrawCount.amount` to zero.

## Code Reference

> **aptos-move/framework/aptos-framework/sources/fungible_asset.move**
> ```rust
> /// Create a fungible asset with zero amount.
> /// This can be useful when starting a series of computations where the initial value is 0.
> public fun zero<T: key>(metadata: Object<T>): FungibleAsset {
>     FungibleAsset {
>         metadata: object::convert(metadata),
>         amount: 0,
>     }
> }
> ```

Consequently, the user may repeatedly create zero-value FAs (via `fungible_asset::zero`) and deposit them (via `dispatchable_fungible_asset::deposit`), which calls `record_transfer`. Within `record_transfer`, if an investor has a balance of zero after a transfer, it reduces the investor count by calling `adjust_total_investors_counts(from, false)`, which decreases the total number of investors in the system.

## Code Reference

> **move/sources/compliance_service.move**
> ```rust
> /// Records the transfer between two investors.
> /// Adjusts the total investors count based on balances.
> fun record_transfer(
>     from: address,
>     to: address,
>     value: u256,
> ): bool acquires ComplianceData {
>     if (compare_investor_balance(to, value, 0)) {
>         adjust_total_investors_counts(to, true);
>     };
>     if (balance_of_investor(from) == 0) {
>         adjust_total_investors_counts(from, false);
>     };
>     true
> }
> ```

This logic assumes that a zero balance indicates that the investor no longer holds any assets in the system; thus, they should no longer be considered active investors. Consequently, it is possible to artificially reduce the investor count, which may prevent the proper removal of investors.

## Remediation

Ensure that the investor is not depositing a zero amount.

### Patch

Resolved in 9f5d9b2.
