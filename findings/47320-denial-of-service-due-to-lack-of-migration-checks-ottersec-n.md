---
tags:
  - lang/rust
  - platform/ottersec
  - severity/high
  - precondition/uninitialized
  - sector/account
protocol: "[[Infinex]]"
auditors:
  - "[[Robert Chen]]"
report: "https://infinex.xyz/"
genome:
  - "[[frozen-funds]]"
  - "[[data/uninitialized]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
  - "[[initializer-auth]]"
---
# Denial Of Service Due To Lack Of Migration Checks

- id: 47320
- impact: HIGH
- protocol: [[Infinex]]
- reporter: Robert Chen (OtterSec)
- source: https://infinex.xyz/

## Summary


The bug report describes a vulnerability in the migrate_state_v1_v2 instruction, which allows an attacker to perform a migration with an incorrect security key and gain unauthorized access to the user's account. This can result in the user losing their original security key and associated privileges. The vulnerability can be fixed by adding a check to verify the correct role of the origin_key_v1 account before allowing the migration to proceed. The issue has been resolved in the b0cf568 patch.

## Details

## Vulnerability Description

In the `migrate_state_v1_v2` instruction, there is no check to verify that the `origin_key_v1` account has the correct role (`SecurityKeyRole::Sudo`). This implies that an attacker may provide a different security key, such as one with the `SecurityKeyRole::Operation` role, and still perform the migration. As a result, the user will lose their `origin_key`, and consequently, their sudo privileges too. To add a new security key, the user requires sudo privileges. Without the correct Sudo key, the user is restricted from performing this action, effectively locking them out from managing their security keys.

> _authorizer-v2/src/instructions/migrate_state_v1_v2.rs_

```rust
#[derive(Accounts)]
pub struct MigrateStateV1V2<'info> {
    [...]
    #[account(
        seeds = [SecurityKeyV2::SEED, &wallet_info.uca,
                 ,→ get_platform_address_v1_bytes(&origin_key_v1.address)],
        seeds::program = AUTHORIZER_STATE_V1_PROGRAM_ID,
        bump = origin_key_v1.bump,
        owner = AUTHORIZER_STATE_V1_PROGRAM_ID
    )]
    pub origin_key_v1: Account<'info, SecurityKeyV1>,
    [...]
}
```

The `migrate_state_v1_v2` calls the `initialize_authorizer_config` CPI, which attempts to initialize a new `authorizer_config_v2` account. This account must not exist before initialization; otherwise, the CPI call will fail due to Anchor’s constraints. However, if an attacker performs a migration via an incorrect `origin_key_v1`, the migration may succeed in creating a new `authorizer_config_v2`, but it will do so with an invalid configuration, leaving the user with an improperly initialized state and without the necessary privileges to correct it.

> _authorizer-v2/src/instructions/migrate_state_v1_v2.rs_

```rust
fn state_copy_config(accounts: &MigrateStateV1V2) -> Result<()> {
    [...]
    authorizer_state_v2::cpi::initialize_authorizer_config(CpiContext::new(
        accounts.state_program.to_account_info(),
        init_authorizer_config_accounts,
    ))?;
    [...]
}
```

© 2024 Otter Audits LLC. All Rights Reserved. 9/28

## Vulnerability Impact

Thus, the attacker effectively locks the user out of their wallet in a new `authorizer_v2` state, leaving them with the abilities of only one role.

## Remediation

Ensure that the `origin_key_v1` account’s role is checked during migration. Specifically, verify that it has the Sudo role before allowing the migration to proceed.

## Patch

Resolved in `b0cf568`

© 2024 Otter Audits LLC. All Rights Reserved. 10/28
