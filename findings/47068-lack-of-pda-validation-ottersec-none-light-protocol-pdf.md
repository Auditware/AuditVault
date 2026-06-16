---
tags:
  - lang/rust
  - sector/options
  - platform/ottersec
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[Light Protocol]]"
auditors:
  - "[[Ajay Shankar Kunapareddy]]"
report: "https://lightprotocol.com/"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[pda-derivation]]"
---
# Lack of PDA Validation

- id: 47068
- impact: HIGH
- protocol: [[Light Protocol]]
- reporter: Ajay Shankar Kunapareddy (OtterSec)
- source: https://lightprotocol.com/

## Summary


The bug report discusses an issue with two functions, MintToInstruction and TransferInstruction, where the token_pool_pda account is included as a mutable account but does not undergo any seed validation or authority checks. This means that there are no checks to ensure that the token_pool_pda account was generated using the expected seeds and bump values. This could allow an attacker to provide their own token account as the token_pool_pda, instead of the intended token pool Program Derived Address (PDA). This could result in the program treating the attacker's account as if it were the legitimate token pool PDA. The attacker could then use this manipulated token_pool_pda to compress tokens, which involves sending tokens to this account. Since the program does not validate the seeds, the tokens would be added to the attacker's account. When decompressing tokens, the attacker could then use the same token_pool_pda account to withdraw the tokens from the legitimate token pool account and move them to their own account, effectively stealing tokens from the legitimate token pool.

The report suggests that the token_pool_pda account should be validated against the expected seeds and bump values to confirm that it is derived correctly. This issue has been resolved in the patch f59ffa1. 

## Details

## Token Pool PDA Validation Issue

In both `MintToInstruction` and `TransferInstruction`, the `token_pool_pda` account is included as a mutable account but does not undergo any seed validation or authority checks. This implies that there are no checks to ensure that `token_pool_pda` was generated utilizing the expected seeds and bump values. An attacker may provide their own token account as `token_pool_pda` instead of the intended Token Pool Program Derived Address (PDA). Since there are no checks to validate that this account is derived from the expected seeds, the program will treat the attacker's account as if it were the legitimate Token Pool PDA.

> _compressed-token/src/process_transfer.rs_

```rust
#[derive(Accounts)]
pub struct TransferInstruction<'info> {
    ...
    #[account(mut)]
    pub token_pool_pda: Option<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub compress_or_decompress_token_account: Option<Account<'info, TokenAccount>>,
    pub token_program: Option<Program<'info, Token>>,
    pub system_program: Program<'info, System>,
}
```

The attacker may utilize this manipulated `token_pool_pda` to compress tokens, which involves sending tokens to this account. Since the program does not validate the seeds, the tokens would be added to the attacker's account. Consequently, when decompressing tokens, the attacker will utilize the same `token_pool_pda` account to withdraw the tokens that were originally in the legitimate token pool. This would allow the attacker to steal tokens from the genuine token pool account and move them to their own account.

## Remediation

Ensure that the `token_pool_pda` account is validated against the expected seeds and bump values to confirm that it is derived correctly.

## Patch

Resolved in commit `f59ff1`.

© 2024 Otter Audits LLC. All Rights Reserved. 10/53
