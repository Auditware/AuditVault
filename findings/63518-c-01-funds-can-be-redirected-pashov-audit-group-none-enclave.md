---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - sector/lending
  - platform/pashov
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - lang/anchor
protocol: "[[Enclave]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Enclave-security-review_2025-10-25.md"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[account-ownership]]"
---
# [C-01] Funds can be redirected

- id: 63518
- impact: HIGH
- protocol: Enclave_2025-10-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Enclave]]-security-review_2025-10-25.md

## Summary


This bug report describes a problem with a Rust program that can allow an attacker to steal funds from a pool. The program does not properly check the ownership of a user's token account, which means that an attacker can use a legitimate signature to siphon funds directly to themselves. The report recommends adding code to validate the token account and restrict it to the user's associated token account. 

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** High

## Description

```rust
 #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>
```

In `programs/solver-fund-pool-anchor/src/instructions/borrow.rs:142-143`, the `user_token_account` is only required to be writable; the program never checks whether `owner == user.key()`. The signed message also omits the `user_token_account`, and the contract does not validate that `user_token_account.owner` equals `user`, nor that it is the user’s associated token account (ATA).

As a result, an attacker can obtain a legitimate signature (which only binds `user/mint/amount/time window/nonce/...`) but replace `user_token_account` with their own token account, siphoning pool funds directly to themselves.

## Recommendations

```rust
#[account(
    mut,
    constraint = user_token_account.mint == token_mint.key() @ ErrorCode::InvalidTokenAccountMint,
    constraint = user_token_account.owner == user.key() @ ErrorCode::InvalidTokenAccountOwner,
)]
pub user_token_account: Account<'info, TokenAccount>,
```

Or restrict to the user’s ATA:

```rust
use anchor_spl::associated_token::get_associated_token_address;
require_keys_eq!(
    user_token_account.key(),
    get_associated_token_address(&Pubkey::try_from(user.key())?, &token_mint.key()),
    ErrorCode::NotUserATA
);
```
