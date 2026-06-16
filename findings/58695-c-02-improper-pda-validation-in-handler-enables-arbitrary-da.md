---
tags:
  - lang/anchor
  - sector/multisig
  - has/github
  - severity/high
  - lang/rust
protocol: "[[Gatekeeper]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Gatekeeper-security-review_2025-06-28.md"
genome:
  - "[[pda-derivation]]"
  - "[[sandwich]]"
  - "[[trigger/sandwich-attack]]"
  - "[[variant]]"
---
# [C-02] Improper PDA validation in `handler` enables arbitrary data clearing

- id: 58695
- impact: HIGH
- protocol: Gatekeeper_2025-06-28
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Gatekeeper-security-review_2025-06-28.md

## Summary


This report describes a bug in the `clear_data_sandwich_validators_bitmap` instruction that can lead to unauthorized modification of account data. The handler does not properly validate the PDA account, which allows a malicious signer to supply a different PDA account and still pass the check. This can result in the incorrect clearing of bitmap data belonging to a different PDA, potentially wiping valid data belonging to another authority. To fix this, it is recommended to derive the PDA account in the `ClearDataSandwichValidatorsBitmap` struct itself.

## Details


## Severity

**Impact:** High

**Likelihood:** High

## Description

The `clear_data_sandwich_validators_bitmap` instruction's handler does **not properly validate** the `sandwich_validators` PDA account. This oversight allows a malicious signer to **supply a different PDA account** (belonging to another signer or authority) and still pass the check.

As a result, the handler may **incorrectly clear bitmap data** belonging to a different PDA by potentially **wiping valid data**  corresponding to another authority.

This poses a **critical risk**, as it enables unauthorized modification of account data that should be protected by strict PDA derivation and validation.

## Recommendations

Derive the PDA account in the `ClearDataSandwichValidatorsBitmap` struct it self like below :
```rust
pub struct ClearDataSandwichValidatorsBitmap<'info> {
    
@>  #[account(
        mut,
        seeds = [SandwichValidators::SEED_PREFIX, multisig_authority.key().as_ref(), &epoch_arg.to_le_bytes()],
        bump
    )]
    pub sandwich_validators: AccountLoader<'info, SandwichValidators>,
    #[account(mut)]
    pub multisig_authority: Signer<'info>,
}
```




