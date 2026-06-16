---
tags:
  - lang/rust
  - sector/options
  - sector/restaking
  - platform/ottersec
  - severity/high
  - novelty/variant
protocol: "[[Composable Vaults]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://www.composable.finance/"
genome:
  - "[[missing-owner-check]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[account-ownership]]"
  - "[[cpi-program-id-validation]]"
---
# Discrepancy In Deposit Functionality

- id: 47544
- impact: HIGH
- protocol: [[Composable Vaults]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://www.composable.finance/

## Summary


The bug report discusses an issue with the "deposit" function in the "restaking" program. The function is used to update a stake on a guest chain, but it does not have proper validation checks for the remaining accounts. This can potentially lead to errors or security vulnerabilities. The report suggests adding validation checks to both the "deposit" function and the "solana_ibc::cpi::set_stake" function to ensure that the required accounts are present and have the correct ownership. The issue has been fixed by adding validation checks to the remaining accounts in a specific commit.

## Details

## Deposit Function Overview

The `deposit` function utilizes `remaining_accounts` for the cross-program invocation call to the guest chain program (`solana_ibc::cpi::set_stake`). However, the function lacks explicit validation checks on `remaining_accounts`. 

`solana_ibc::cpi::set_stake` is the invoked cross-program invocation call. Similarly, this function also lacks explicit validation checks for the accounts passed in `CpiContext`.

## Code Snippet

```rust
// File: restaking/programs/restaking/src/lib.rs
pub fn deposit<'a, 'info>(
    ctx: Context<'a, 'a, 'a, 'info, Deposit<'info>>,
    service: Option<Service>,
    amount: u64,
) -> Result<()> {
    [...]
    // Call Guest chain program to update the stake if the chain is initialized
    if guest_chain_program_id.is_some() {
        [...]
        let cpi_program = ctx.remaining_accounts[3].clone();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, seeds);
        solana_ibc::cpi::set_stake(cpi_ctx, amount as u128)?;
    }
    Ok(())
}
```

## Remediation

Add validation checks in both `deposit` and `solana_ibc::cpi::set_stake` to ensure that the required accounts are present and have the correct ownership.

## Patch

Fixed by adding validation checks to the `remaining_accounts` in version `b7847d9`.

© 2024 Otter Audits LLC. All Rights Reserved. 7/18
