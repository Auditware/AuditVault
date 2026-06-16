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
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Flaw in Full Transfer Checks

- id: 46836
- impact: HIGH
- protocol: [[Aptos Securitize]]
- reporter: Bartłomiej Wierzbiński (OtterSec)
- source: https://aptoslabs.com/

## Summary


The bug report is about a function called compliance_service::pre_deposit_check_regulated that checks if full transfers are enforced when a transfer originates from the US. If the condition is true, the transfer is immediately aborted with an error code. However, there is a problem where valid transactions may be blocked because of this condition, even if they meet the required full transfer conditions. The bug has been identified and resolved in a patch. To fix it, developers need to check if the full transfer is forced and if the transfer is made in full.

## Details

## Compliance Service Pre-Deposit Check Regulated

In `compliance_service::pre_deposit_check_regulated`, the `get_force_full_transfer` condition checks if full transfers are enforced when the transfer originates from the US. If this condition is true, the function immediately aborts the transfer with the error code `EONLY_FULL_TRANSFER`. 

If `get_force_full_transfer` is enabled and the transfer originates from the US, any transfer to the platform wallet is rejected, regardless of whether the transfer satisfies the required full transfer conditions. As a result, valid transactions may be blocked.

```rust
move/sources/compliance_service.move
fun pre_deposit_check_regulated(
    withdraw_from: &mut WithdrawFrom,
    to: address,
    value: u256,
    paused: bool,
): (u256, u64) acquires ComplianceData, ComplianceConfig, TransferRestrictions, TokenLimits, TimeConstraints {
    [...]
    if (is_platform_wallet) {
        if ((get_force_full_transfer() && from_region == US) || 
            (get_world_wide_force_full_transfer() && (from_investor_balance as u256) > value)) {
            abort EONLY_FULL_TRANSFER;
        }
        return (0, VALID);
    };
    [...]
}
```

## Remediation

Check whether the full transfer is forced by confirming if `get_force_full_transfer` and `from_region == US` are true, or if `get_world_wide_force_full_transfer` is set. If so, verify that the transfer is made in full (`from_investor_balance as u256 > value`).

## Patch 

Resolved in #61.
