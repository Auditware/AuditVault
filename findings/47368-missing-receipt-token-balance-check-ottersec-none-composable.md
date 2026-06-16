---
tags:
  - lang/solidity
  - sector/restaking
  - sector/staking
  - platform/ottersec
  - has/poc
  - severity/high
  - precondition/uninitialized
protocol: "[[ComposableFi]]"
auditors:
  - "[[Ajay Shankar Kunapareddy]]"
report: "https://www.picasso.network/"
genome:
  - "[[missing-modifier]]"
  - "[[data/uninitialized]]"
  - "[[direct-drain]]"
  - "[[initializer-auth]]"
---
# Missing Receipt Token Balance Check

- id: 47368
- impact: HIGH
- protocol: [[ComposableFi]]
- reporter: Ajay Shankar Kunapareddy (OtterSec)
- source: https://www.picasso.network/

## Summary


The bug report describes a problem in the code for setting a service in a program called "restaking". The code does not check if the depositor has a non-zero balance in their receipt_token_account before setting the stake. This could allow a malicious user to set an unauthorized stake for themselves using a genuine user's vault_params. The solution is to explicitly check for a non-zero balance before proceeding with the stake setting. The issue has been fixed in version 10222d.

## Details

## Implementation of `set_service` Instruction

In the implementation of `set_service` instruction, there is a section of code that sets the service for the stake which was deposited before guest chain initialization without explicitly checking if the depositor’s `receipt_token_account` has a non-zero balance. The code assumes that the depositor has a sufficient balance in their `receipt_token_account` to cover the stake, but it fails to check for it explicitly.

> _restaking/programs/restaking/src/lib.rs_

```rust
pub fn set_service<'a, 'info>(
    ctx: Context<'a, 'a, 'a, 'info, SetService<'info>>,
    service: Service,
) -> Result<()> {
    [...]
    vault_params.service = Some(service);
    let guest_chain_program_id = staking_params.guest_chain_program_id.unwrap(); // Infallible
    let amount = vault_params.stake_amount;
    [...]
}
```

## Proof of Concept

- A malicious user sets an arbitrary service for a genuine user’s `vault_params` by calling the `set_service` instruction using the genuine user’s `vault_params` and an arbitrary `Service`.
- Since the code does not check for a non-zero balance in the `receipt_token_account`, the malicious user may abuse the system by setting an unauthorized stake for themselves using the original depositor’s `vault_params`.

## Remediation

Explicitly check if the depositor’s `receipt_token_account` has a non-zero balance before proceeding with the stake setting. This check ensures the depositor has access to their respective `vault_params`.

## Patch

Fixed by checking if the depositor’s `receipt_token_account` has a non-zero balance in `e102222d`.

© 2024 Otter Audits LLC. All Rights Reserved. 8/20
