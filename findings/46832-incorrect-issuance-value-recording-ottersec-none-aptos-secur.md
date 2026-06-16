---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/rwa
protocol: "[[Aptos Securitize]]"
auditors:
  - "[[Bartłomiej Wierzbiński]]"
report: "https://aptoslabs.com/"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[debt-accrual-update]]"
---
# Incorrect Issuance Value Recording

- id: 46832
- impact: HIGH
- protocol: [[Aptos Securitize]]
- reporter: Bartłomiej Wierzbiński (OtterSec)
- source: https://aptoslabs.com/

## Summary


A bug has been found in the compliance_service::create_issuance_information function. This function sets the value of issuances to zero instead of using the _value parameter, which means that all recorded issuances will have a value of zero instead of the intended amount. This can lead to inaccurate information being stored in the issuances_values and may cause issues in the future. To fix this bug, the _value parameter should be utilized so that each issuance record accurately captures the intended amount. This bug has been resolved in the 9f5d9b2 patch.

## Details

## Compliance Service Issuance Information Issue

The `compliance_service::create_issuance_information` function explicitly sets the value to zero instead of utilizing the `_value` parameter. This means that all recorded issuances will have a value of zero rather than the actual issuance amount. As a result, the issuance information stored in `issuances_values` will not accurately represent the actual amounts.

## Code Snippet

```rust
> _move/sources/compliance_service.move
fun create_issuance_information(
    investor: String, _value: u256, issuance_time: u256
): bool acquires ComplianceData {
    [...]
    // Update the issuances value with respect to the investor and current issuances count.
    let issuances_values = &mut compliance_data_mut.issuances_values;
    let value = 0;
    [...]
}
```

## Remediation

Utilize the `_value` parameter so that each issuance record accurately captures the intended amount passed to the function.

## Patch

Resolved in commit `9f5d9b2`.
