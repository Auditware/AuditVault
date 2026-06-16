---
tags:
  - lang/rust
  - platform/ottersec
  - severity/high
  - novelty/variant
  - sector/vault
protocol: "[[Composable Vaults]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://www.composable.finance/"
genome:
  - "[[missing-modifier]]"
  - "[[variant]]"
  - "[[role-bypass]]"
  - "[[cpi-program-id-validation]]"
---
# Lack Of Sysvar Account Validation

- id: 47547
- impact: HIGH
- protocol: [[Composable Vaults]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://www.composable.finance/

## Summary


The program is not properly validating the instructions sysvar account in both the deposit and set_service instructions. This allows for unauthorized instructions to be injected into cross-program invocation calls. To fix this, explicit validation for the instructions sysvar account should be included in both the validation::validate_remaining_accounts and solana_ibc::cpi::set_stake functions. This issue was addressed in patch b221448. 

## Details

## Vulnerability Report

The program passes the instructions sys_var account to both deposit and set_service instructions, but does not perform validation in the `validate_remaining_accounts` and even in the `solana_ibc::cpi::set_stake` function. Thus, replacing the instructions sys_var account is possible. They might be able to inject unauthorized instructions into the cross-program invocation calls.

## Remediation

Ensure both `validation::validate_remaining_accounts` and `solana_ibc::cpi::set_stake` include explicit validation for the instructions sys_var account.

## Patch

Fixed by checking the instructions sys_var account in b221448.

© 2024 Otter Audits LLC. All Rights Reserved. 10/18
