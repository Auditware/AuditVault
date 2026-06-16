---
tags:
  - lang/solidity
  - sector/options
  - sector/staking
  - platform/ottersec
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[ComposableFi]]"
auditors:
  - "[[Ajay Shankar Kunapareddy]]"
report: "https://www.picasso.network/"
genome:
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[cpi-program-id-validation]]"
  - "[[token-decimal-normalization]]"
---
# Discrepancies In Deposit Functionality

- id: 47367
- impact: HIGH
- protocol: [[ComposableFi]]
- reporter: Ajay Shankar Kunapareddy (OtterSec)
- source: https://www.picasso.network/

## Summary


The deposit function in the solana_ibc program is not properly validating the remaining_accounts parameter, which can cause issues with the set_stake function. Additionally, the set_stake function lacks explicit validation checks for the accounts passed in the CpiContext. It is important to include parameters that identify the specific mint of the staked amount to avoid updating the stake value with an incorrect scale. To fix this, validation checks were added to the remaining_accounts and the decimal places of the token_mint were asserted to be 9.

## Details

## Deposit and CPI Call Analysis

The following analysis discusses the deposit function in relation to `solana_ibc::cpi::set_stake`. 

## Overview

The function relies on the `remaining_accounts` for the CPI call to the guest chain program (`solana_ibc::cpi::set_stake`). However, it lacks explicit validation checks on the `remaining_accounts` in the deposit instruction. Similarly, the `solana_ibc::cpi::set_stake` function also does not implement explicit validation for the accounts passed in the `CpiContext`.

### Code Snippet

```rust
pub fn deposit<'a, 'info>(
    ctx: Context<'a, 'a, 'a, 'info, Deposit<'info>>,
    service: Option<Service>,
    amount: u64,
) -> Result<()> {
    // Call Guest chain program to update the stake if the chain is initialized
    if guest_chain_program_id.is_some() {
        let cpi_program = ctx.remaining_accounts[3].clone();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, seeds);
        solana_ibc::cpi::set_stake(cpi_ctx, amount as u128)?;
    }
    Ok(())
}
```

### Important Considerations

Additionally, when invoking `solana_ibc::cpi::set_stake`, it is crucial to include parameters that identify the specific mint of the staked amount. Tokens on Solana may have different decimal places, and each mint may have a different scale. Without passing information about the mint of the staked amount, there is a risk of updating the stake value with an incorrect scale.

## Remediation

To mitigate these concerns, validation checks should be added in both `deposit` and `solana_ibc::cpi::set_stake` to ensure that:

- The required accounts are present.
- There is correct ownership of the accounts.
- Mint information is included as a parameter when calling `set_stake`.

## Patch

This issue was fixed by adding validation checks to the `remaining_accounts` in `b7847d9` and by asserting the decimals of the `token_mint` to be 9 in `8b24f28`.

© 2024 Otter Audits LLC. All Rights Reserved. 7/20
