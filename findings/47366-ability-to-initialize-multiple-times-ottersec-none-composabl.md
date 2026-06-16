---
tags:
  - lang/rust
  - sdk/anchor
  - platform/ottersec
  - severity/high
  - sector/restaking
  - sector/staking
protocol: "[[ComposableFi]]"
auditors:
  - "[[Ajay Shankar Kunapareddy]]"
report: "https://www.picasso.network/"
genome:
  - "[[reinitialization]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[reward-accounting]]"
---
# Ability To Initialize Multiple Times

- id: 47366
- impact: HIGH
- protocol: [[ComposableFi]]
- reporter: Ajay Shankar Kunapareddy (OtterSec)
- source: https://www.picasso.network/

## Summary


This bug report discusses an issue with the Initialize instruction in a staking program. Due to the use of init_if_needed, the staking parameters can be altered multiple times by anyone, potentially leading to security vulnerabilities. The report suggests using init instead of init_if_needed to ensure that initialization can only happen once. The issue has been fixed by using init instead of init_if_needed in the code.

## Details

## Potential Security Vulnerabilities in Initialize Instruction

In the Initialize instruction, while initializing the staking parameters, due to the use of `init_if_needed`, the staking parameters may be altered with new values multiple times by anyone. The ability to initialize the staking parameters multiple times may result in security vulnerabilities. For example, an attacker may repeatedly call the Initialize instruction with different parameters, altering the staking configuration and affecting the entire protocol.

> _restaking/programs/restaking/src/lib.rs_

## Code Example

```rust
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(init_if_needed, payer = admin, seeds = [STAKING_PARAMS_SEED, TEST_SEED], bump, space = 1024)]
    pub staking_params: Account<'info, StakingParams>,
    pub rewards_token_mint: Account<'info, Mint>,
    #[account(init_if_needed, payer = admin, seeds = [REWARDS_SEED, TEST_SEED], bump, token::mint = rewards_token_mint, token::authority = staking_params)]
    pub rewards_token_account: Account<'info, TokenAccount>,
    [...]
}
```

## Remediation

Use `init` instead of `init_if_needed` for the Initialize instruction. This ensures that the initialization can only happen once.

## Patch

Fixed by using `init` instead of `init_if_needed` for Initialize in e565006.

© 2024 Otter Audits LLC. All Rights Reserved. 6/20
