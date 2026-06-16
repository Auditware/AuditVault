---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/dex
  - sector/nft
  - sector/staking
  - lang/anchor
protocol: "[[Doryoku]]"
auditors:
  - "[[Kose]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-22-cyfrin-doryoku-v2.0.md"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[realloc-rent-exemption]]"
  - "[[token2022-account-size]]"
---
# Hard-coded 165-byte vault account is too small for Raydium Token-2022 mints with extensions

- id: 61678
- impact: HIGH
- protocol: [[Doryoku]]
- reporter: Kose (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-22-cyfrin-doryoku-v2.0.md

## Summary


This bug report describes an issue with the `stake_clmm_position` function, which creates a vault token account for the Raydium position mint. The problem is that the function allocates only 165 bytes for the account, which is not enough for the Token-2022 mints used by Raydium. This causes the `initialize_account3` function to fail, preventing users from staking their Raydium positions and blocking the farming pool. The recommended solution is to dynamically compute the required space based on the mint's extensions, as shown in an example from Raydium's codebase. The bug has been fixed in the latest commit and verified by the team.

## Details

**Description:** `stake_clmm_position` creates the vault token account for the raydium position mint with a size 165 Bytes

```rust
        // Create vault token account if it doesn't exist
        let vault_account_info = ctx.accounts.vault_position_token_account.to_account_info();
        if vault_account_info.data_is_empty() {
            // Create the vault token account
            let vault_account_space = 165; // Standard token account size
            let vault_account_lamports = ctx.accounts.rent.minimum_balance(vault_account_space);

            let farm_key = ctx.accounts.farm.key();
            let position_mint_key = ctx.accounts.position_mint.key();
            let vault_seeds: &[&[u8]] = &[
                VAULT_SEED,
                farm_key.as_ref(),
                position_mint_key.as_ref(),
                &[ctx.bumps.vault_position_token_account],
            ];
            let vault_signer_seeds = &[vault_seeds];

            // Create account
            anchor_lang::system_program::create_account(
                CpiContext::new_with_signer(
                    ctx.accounts.system_program.to_account_info(),
                    anchor_lang::system_program::CreateAccount {
                        from: ctx.accounts.user.to_account_info(),
                        to: vault_account_info.clone(),
                    },
                    vault_signer_seeds,
                ),
                vault_account_lamports,
                vault_account_space as u64,
                &ctx.accounts.token_program.key(),
            )?;

            // Initialize the token account
            anchor_spl::token_interface::initialize_account3(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    InitializeAccount3 {
                        account: vault_account_info.clone(),
                        mint: ctx.accounts.position_mint.to_account_info(),
                        authority: ctx.accounts.vault_authority.to_account_info(),
                    },
                ),
            )?;
        }
```

The constant **165 bytes** is the legacy SPL-Token size.
Raydium CLMM position NFTs are **Token-2022** mints that append several on-chain extensions (e.g., `MetadataPointer`, `MintCloseAuthority`).

Allocating only 165 bytes causes `initialize_account3` to fail with [InvalidAccountData](https://github.com/solana-program/token-2022/blob/50a849ef96634e02208086605efade0b0a9f5cd4/program/src/processor.rs#L187-L191).

**Impact:** Users cannot stake their legitimate Raydium positions, the transaction aborts, blocking the farming pool.


**Recommended Mitigation:** It is recommended to dynamically compute required space based on the mint's extension, here is an [example](https://github.com/raydium-io/raydium-clmm/blob/835bc892352cd2be94365b49d024620a9b51f627/programs/amm/src/util/token.rs#L389-L445) from Raydium's codebase

**Doryoku:**
Fixed in [fad227e](https://github.com/Warlands-Nft/belo_clmm_lp_farming/commit/fad227e80c53e207a8836365ed0c8449a17f2992).

**Cyfrin:** Verified.

\clearpage
