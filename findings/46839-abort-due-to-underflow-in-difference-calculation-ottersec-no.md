---
tags:
  - lang/solidity
  - sector/lending
  - platform/ottersec
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Aptos Securitize]]"
auditors:
  - "[[Bartłomiej Wierzbiński]]"
report: "https://aptoslabs.com/"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[integer-bounds]]"
---
# Abort Due to Underflow in Difference Calculation

- id: 46839
- impact: HIGH
- protocol: [[Aptos Securitize]]
- reporter: Bartłomiej Wierzbiński (OtterSec)
- source: https://aptoslabs.com/

## Summary


The bug report discusses an issue in the compliance_service code, specifically in the functions get_compliance_transferable_tokens_deposit and get_compliance_transferable_tokens. The problem is that the code does not check if the value of time is greater than or equal to lock_time before performing a subtraction operation. This can cause an underflow, leading to the program crashing. The suggested solution is to add a check for time >= lock_time before performing the subtraction. This issue has been resolved in a recent patch.

## Details

## Compliance Token Transfer Issue

In `get_compliance_transferable_tokens_deposit` and `get_compliance_transferable_tokens` within `compliance_service`, the difference is calculated as `time - lock_time` without first checking if `time` is greater than or equal to `lock_time`. If `lock_time` exceeds `time`, the subtraction operation (`time - lock_time`) will result in an underflow, causing the program to abort.

## Affected Code Snippet

```rust
fun get_compliance_transferable_tokens_deposit(
    who: address,
    time: u64,
    lock_time: u64,
    from_balance: u64
): u64 acquires ComplianceData {
    assert!(time > 0, EINVALID_TIME);
    [...]
    let total_tokens_locked = 0;
    for (i in 0..investor_issuances_count) {
        let issuances_timestamps = &compliance_data.issuances_timestamps;
        let issuances_timestamps_inner =
            smart_table::borrow(issuances_timestamps, investor);
        let issuance_time =
            *smart_table::borrow_with_default(issuances_timestamps_inner, i, &0);
        let difference = time - lock_time;
        if (lock_time > time || issuance_time > (difference as u256)) {
            let issuances_values = &mut compliance_data.issuances_values;
            let issuances_values_inner =
                smart_table::borrow_mut(issuances_values, investor);
            total_tokens_locked = total_tokens_locked
                + *smart_table::borrow_mut_with_default(issuances_values_inner, i, 0);
        }
    };
    [...]
}
```

## Remediation

Check if `time >= lock_time` before performing the subtraction.

## Patch

Resolved in commit `9f5d9b2`.
