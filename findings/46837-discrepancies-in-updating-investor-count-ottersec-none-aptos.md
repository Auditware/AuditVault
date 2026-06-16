---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/governance
protocol: "[[Aptos Securitize]]"
auditors:
  - "[[Bartłomiej Wierzbiński]]"
report: "https://aptoslabs.com/"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[access-roles]]"
---
# Discrepancies in Updating Investor Count

- id: 46837
- impact: HIGH
- protocol: [[Aptos Securitize]]
- reporter: Bartłomiej Wierzbiński (OtterSec)
- source: https://aptoslabs.com/

## Summary


This bug report discusses two issues in the compliance service's record_burn function and the adjust_investor_counts_after_country_change function. The first issue is that the record_burn function does not properly check if the value to be burned is greater than zero before adjusting the investor count. This can result in the total investor count being decreased incorrectly. The second issue is that the adjust_investor_counts_after_country_change function does not decrease the count for the previous country when an investor changes their country. The report recommends checking for a non-zero burn value and updating the count for the previous country in order to fix these issues. The bug has been resolved in version 9f5d9b2.

## Details

## Compliance Service Improvement Proposal

In the existing implementation of `compliance_service::record_burn` (shown below), the function checks if the investor’s balance equals the value to be burned (`balance_who == (value as u64)`). However, it does not explicitly check if `value` is greater than zero before making this comparison or before adjusting the investor count. If `value` is zero, the condition will still evaluate to true, which will decrease the total investor count incorrectly, even though the investor was already inactive (with a zero balance) and should not have been counted.

```rust
move/sources/compliance_service.move rust
fun record_burn(who: address, value: u256): bool acquires ComplianceData {
    let balance_who = balance_of_investor(who);
    if (balance_who == (value as u64)) {
        adjust_total_investors_counts(who, false);
    };
    true
}
```

Additionally, `registry_service::adjust_investor_counts_after_country_change` currently only increases the investor count for the new country but does not decrease it for the previous country. If an investor changes their country, compliance counts for the old country need to be updated to reflect that the investor no longer belongs to it.

## Remediation

- Check if the burn value is non-zero before adjusting the investor count in `record_burn`.
- Ensure that `adjust_investor_counts_after_country_change` decreases the count for the previous country.

## Patch

Resolved in `9f5d9b2`.
