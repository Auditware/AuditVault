---
tags:
  - lang/solidity
  - platform/ottersec
  - severity/high
  - sector/dex
  - sector/lending
protocol: "[[Aptos Securitize]]"
auditors:
  - "[[Bartłomiej Wierzbiński]]"
report: "https://aptoslabs.com/"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Incorrect Lock Removal Logic

- id: 46833
- impact: HIGH
- protocol: [[Aptos Securitize]]
- reporter: Bartłomiej Wierzbiński (OtterSec)
- source: https://aptoslabs.com/

## Summary


The remove_lock_record_for_investor function in the lock_manager is supposed to remove a specific lock record for an investor. However, the current implementation is incorrect and removes the last lock instead of the intended one. This is because the function overwrites the lock at the specified index with itself. To fix this bug, the code needs to be changed to check if the total number of locks is less than the investor's lock count and remove the last lock instead. This issue has been resolved in the 06538b8 patch.

## Details

## Remove Lock Record for Investor in Lock Manager

The function `remove_lock_record_for_investor` in `lock_manager` is intended to swap the lock record at `lock_index` with the last lock in the investor’s lock list, then reduce the count of locks by one. However, the implementation incorrectly overwrites the lock at `lock_index` with itself, which implies that the last lock is removed instead of the one at `lock_index`.

## Code Snippet

```rust
public entry fun remove_lock_record_for_investor(
    authorizer: &signer, 
    investor: String, 
    lock_index: u64
) acquires LockInfo {
    let lock_info = lock_info_mut();
    let investor_locks = &lock_info.investor_locks;
    assert!(smart_table::contains(investor_locks, investor), EINVESTOR_NOT_LOCKED);
    
    let investor_locks_inner = smart_table::borrow(investor_locks, investor);
    assert!(
        smart_table::contains(investor_locks_inner, lock_index), 
        EINVESTOR_NOT_LOCKED
    );
    
    let lock = smart_table::borrow(investor_locks_inner, lock_index);
    [...]
    smart_table::upsert(investor_locks_count, investor, last_lock_number);
    set_lock_info_impl(
        investor,
        lock_index,
        lock.value,
        lock.reason_code,
        lock.reason_string,
        lock.release_time,
        investor_locks_mut
    );
}
```

## Remediation

Check if `total_investor_count` is less than the investor’s lock count, and remove the last lock.

## Patch

Resolved in commit `06538b8`.
