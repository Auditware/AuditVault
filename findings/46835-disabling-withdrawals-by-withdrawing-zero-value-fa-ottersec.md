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
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Disabling Withdrawals by Withdrawing Zero-Value FA

- id: 46835
- impact: HIGH
- protocol: [[Aptos Securitize]]
- reporter: Bartłomiej Wierzbiński (OtterSec)
- source: https://aptoslabs.com/

## Summary


The ds_token module has a bug where a user can withdraw a zero-value fungible asset, which does not represent any meaningful asset transfer. This causes the WithdrawCount to be incremented, leading to future withdrawal attempts to fail. The bug has been fixed in the latest patch. To avoid this issue, investors should make sure they are not withdrawing a zero amount.

## Details

## ds_token Module Overview

The `ds_token` module relies on an invariant that withdrawals must be coupled with deposits. The system tracks the number of active withdrawals utilizing the `WithdrawCount` resource, ensuring that multiple withdrawals will not coincide (as enforced by `assert_withdraw_count`). 

However, via `dispatchable_fungible_asset::withdraw`, a user may withdraw a zero-value fungible asset (FA). Since this FA has a value of zero, it does not represent any meaningful asset transfer. Still, the `WithdrawCount` is incremented to reflect that a withdrawal has occurred.

## Code Example

```rust
// move/sources/ds_token.move
public fun withdraw<T: key>(
    store: Object<T>, 
    amount: u64, 
    transfer_ref: &TransferRef
): FungibleAsset acquires State, WithdrawCount {
    assert_not_paused();
    assert_is_primary_store(store);
    assert_withdraw_count();
    
    let from_address = object::owner(store);
    compliance_service::validate_withdraw(from_address, (amount as u256), metadata());
    
    increment_withdraw_count_and_amount(from_address, amount);
    fungible_asset::withdraw_with_ref(transfer_ref, store, amount)
}
```

Thus, the system will now believe that a withdrawal is still in progress, even though the zero-value FA was destroyed. As a result, future withdrawal attempts will fail because of the `assert_withdraw_count` check.

## Remediation

Ensure that the investor is not withdrawing a zero amount.

## Patch

Resolved in commit `06538b8`.
