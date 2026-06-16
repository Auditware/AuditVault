---
tags:
  - lang/rust
  - sdk/anchor
  - sector/restaking
  - platform/ottersec
  - severity/high
  - novelty/variant
protocol: "[[ComposableFi]]"
auditors:
  - "[[Ajay Shankar Kunapareddy]]"
report: "https://www.picasso.network/"
genome:
  - "[[missing-modifier]]"
  - "[[variant]]"
  - "[[account-discriminator-check]]"
  - "[[role-bypass]]"
---
# Lack Of Instruction Sysvar Validation

- id: 47369
- impact: HIGH
- protocol: [[ComposableFi]]
- reporter: Ajay Shankar Kunapareddy (OtterSec)
- source: https://www.picasso.network/

## Summary


This bug report discusses an issue with the instruction sysvar account, which is used for deposit and set_service instructions. The validation for this account is not being performed in two specific functions, validate_remaining_accounts and set_stake, which could potentially allow for unauthorized instructions to be injected into CPI calls. The report suggests that the fix for this issue is to include explicit validation for the instruction sysvar account in these functions. This has been fixed by checking the instruction sysvar account in b221448.

## Details

## Instruction Sysvar Account Vulnerability

The instruction sysvar account is passed to both `deposit` and `set_service` instructions, but its validation is not performed in `validate_remaining_accounts` and `set_stake`. Thus, it may be possible to replace or manipulate the instruction sysvar account; they might be able to inject unauthorized instructions into the CPI calls.

> _restaking/programs/restaking/src/lib.rs_

## Deposit Struct

```rust
#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub depositor: Signer<'info>,
    [...]
    /// CHECK:
    pub instruction: AccountInfo<'info>,
    [...]
}
```

## SetService Struct

```rust
#[derive(Accounts)]
pub struct SetService<'info> {
    #[account(mut)]
    pub depositor: Signer<'info>,
    [...]
    /// CHECK:
    pub instruction: AccountInfo<'info>,
    [...]
}
```

## Remediation

Both the `validation::validate_remaining_accounts` and `set_stake` should include explicit validation for the instruction sysvar account. The validations should ensure that the account’s address should match the expected value.

## Patch

Fixed by checking the instruction sysvar account in b221448.

© 2024 Otter Audits LLC. All Rights Reserved. 9/20
