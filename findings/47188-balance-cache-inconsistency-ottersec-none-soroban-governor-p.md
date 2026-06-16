---
tags:
  - lang/rust
  - platform/ottersec
  - severity/high
  - sector/governance
protocol: "[[Soroban Governor]]"
auditors:
  - "[[Robert Chen]]"
report: "https://governance.script3.io/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Balance Cache Inconsistency

- id: 47188
- impact: HIGH
- protocol: [[Soroban Governor]]
- reporter: Robert Chen (OtterSec)
- source: https://governance.script3.io/

## Summary


The report discusses a potential vulnerability in the balance::transfer_balance function related to caching balances before and after a transfer. This vulnerability arises when the sender and receiver addresses are the same, allowing the user to obtain free tokens. The suggested solution is to refrain from caching the balance for the recipient address if the sender and receiver are the same. The issue has been fixed in version 7ab57c7. 

## Details

## Potential Vulnerability in `balance::transfer_balance`

There is a potential vulnerability in `balance::transfer_balance` related to caching balances before and after the transfer, especially when the sender (from) and receiver (to) addresses are the same. 

The function retrieves the balances (`from_balance` and `to_balance`) for the sender and receiver addresses before performing the actual transfer.

> _votes/src/balance.rs_

```rust
pub fn transfer_balance(e: &Env, from: &Address, to: &Address, amount: i128) {
    let from_balance = storage::get_balance(e, from);
    if from_balance < amount {
        panic_with_error!(e, TokenVotesError::BalanceError);
    }
    let to_balance = storage::get_balance(e, to);
    [...]
    storage::set_balance(e, from, &(from_balance - amount));
    storage::set_balance(e, to, &(to_balance + amount));
}
```

However, there is no check to ensure that these cached values are utilized consistently throughout the transfer process. If `from` and `to` are the same address (self-transfer), the vulnerability arises. The function subtracts the transfer amount (`amount`) from the cached `from_balance`. Since `from` and `to` are the same, it then adds the same amount back to the same cached `to_balance`. In effect, this discrepancy allows the user to obtain free tokens.

## Remediation

Refrain from caching the balance for the recipient address (`to`) if `from` and `to` are the same.

## Patch

Fixed in `7ab57c7`.

© 2024 Otter Audits LLC. All Rights Reserved. 6/17
