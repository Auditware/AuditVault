---
tags:
  - lang/rust
  - sector/options
  - sector/restaking
  - sector/staking
  - platform/ottersec
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Composable Vaults]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://www.composable.finance/"
genome:
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[cpi-program-id-validation]]"
  - "[[token-decimal-normalization]]"
---
# Stake Mint Differentiation

- id: 47546
- impact: HIGH
- protocol: [[Composable Vaults]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://www.composable.finance/

## Summary


The vulnerability in the deposit function of the program "restaking" on Solana is caused by not considering the different decimal places of tokens in the solana_ibc::cpi::set_stake function. This can lead to incorrect stake values being updated. To fix this, the set_stake function should explicitly include parameters identifying the mint of the staked amount. This issue has been fixed by adding a check in the deposit function to ensure that the token mint has only 9 decimals. 

## Details

## Vulnerability Overview

The vulnerability is rooted in deposit, and pertains to the lack of consideration for different token decimals in `solana_ibc::cpi::set_stake`, specifically related to the mint of the staked amount. `set_stake` is invoked without explicitly providing information about the mint of the staked amount.

> _restaking/programs/restaking/src/lib.rs Rust

```rust
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

On invoking `solana_ibc::cpi::set_stake`, it’s crucial to include parameters that identify the specific mint of the staked amount. Tokens on Solana may have different decimal places, and each mint may have a different scale. Without passing information about the mint of the staked amount, there’s a risk of updating the stake value with an incorrect scale. For instance, staking 10 tokens with 2 decimals and staking 10 tokens with 6 decimals may result in updating the same value, thus causing the staked amount to be incorrectly represented.

## Remediation

Modify `set_stake` to accept parameters explicitly indicating the mint of the staked amount. This adjustment ensures the program accurately manages and updates stakes for various token types.

## Patch

Fixed by adding a check in `deposit` instruction to check if the `token_mint` has only 9 decimals in `d7819a`.

© 2024 Otter Audits LLC. All Rights Reserved. 9/18
