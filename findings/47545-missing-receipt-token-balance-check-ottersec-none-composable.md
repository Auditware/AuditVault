---
tags:
  - lang/solidity
  - sector/staking
  - platform/ottersec
  - has/poc
  - severity/high
  - precondition/uninitialized
protocol: "[[Composable Vaults]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://www.composable.finance/"
genome:
  - "[[missing-modifier]]"
  - "[[data/uninitialized]]"
  - "[[direct-drain]]"
  - "[[initializer-auth]]"
---
# Missing Receipt Token Balance Check

- id: 47545
- impact: HIGH
- protocol: [[Composable Vaults]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://www.composable.finance/

## Summary


The bug report is about a section of code in the implementation of the set_service instruction that sets the service for a stake without explicitly checking if the depositor's receipt_token_account has a non-zero balance. This assumption can be exploited by malicious users to set an unauthorized stake using a genuine user's vault_params. The report suggests explicitly checking the depositor's receipt_token_account balance before proceeding with the stake setting to ensure the depositor has access to the vault_params. The bug has been fixed by checking the balance in a recent patch.

## Details

## Implementation Details

In the implementation of `set_service` instruction, there is a section of code that sets the service for the stake which was deposited before guest chain initialization without explicitly checking if the depositor’s `receipt_token_account` has a non-zero balance. The code assumes that the depositor has a sufficient balance in their `receipt_token_account` to cover the stake, but it fails to check for it explicitly.

## Code Snippet
```rust
pub fn set_service<'a, 'info>(
    ctx: Context<'a, 'a, 'a, 'info, SetService<'info>>,
    service: Service,
) -> Result<()> {
    [...]
    vault_params.service = Some(service);
    let guest_chain_program_id =
        staking_params.guest_chain_program_id.unwrap(); // Infallible
    let amount = vault_params.stake_amount;
    [...]
}
```

## Proof of Concept
- A malicious user sets an arbitrary service for a genuine user’s `vault_params` by calling the `set_service` instruction using the genuine user’s `vault_params` and an arbitrary `Service`.
- Since the code does not check for a non-zero balance in the `receipt_token_account`, the malicious user may abuse the system by setting an unauthorized stake using the original depositor’s `vault_params`.

## Remediation
Explicitly check if the depositor’s `receipt_token_account` has a non-zero balance before proceeding with the stake setting. This check ensures the depositor has access to the respective `vault_params`.

## Patch
Fixed by checking if the depositor’s `receipt_token_account` has a non-zero balance in `e102222d`.

© 2024 Otter Audits LLC. All Rights Reserved. 8/18
