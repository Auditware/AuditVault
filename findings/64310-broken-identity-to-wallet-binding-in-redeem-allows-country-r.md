---
tags:
  - lang/rust
  - sdk/anchor
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/bridge
  - lang/anchor
protocol: "[[Securitize]]"
auditors:
  - "[[Alex Roan]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-08-29-cyfrin-securitize-solana-redemption-v2.0.md"
genome:
  - "[[broken-logic]]"
  - "[[role-bypass]]"
  - "[[account-ownership]]"
  - "[[pda-derivation]]"
---
# Broken identity-to-wallet binding in redeem allows country restriction bypass

- id: 64310
- impact: HIGH
- protocol: [[Securitize]] Solana Redemption
- reporter: Alex Roan (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-08-29-cyfrin-securitize-solana-redemption-v2.0.md

## Summary


The `redeem` instruction in the `IdentityRegistryAccount` has a bug that allows users to bypass country restrictions. This means that a user from a restricted country can redeem by using someone else's `IdentityAccount` that reports an allowed country. This bug has been fixed by Securitize and verified by Cyfrin. To prevent this from happening, it is recommended to require the association between the provided `IdentityAccount` and the `WalletIdentity`.

## Details

**Description:** The `redeem` instruction accepts three identity objects that should all refer to the same person and wallet: `IdentityRegistryAccount`, `IdentityAccount`, and `WalletIdentity`. The account constraints only ensure:
- `IdentityRegistryAccount` matches the `asset_mint`.
- `IdentityAccount` belongs to that registry.
- `WalletIdentity` is the PDA for `(redeemer, asset_mint)`.

There is no on-chain assertion that the provided `IdentityAccount` is the one linked to the `WalletIdentity` and the `redeemer`. As a result, the caller can mix a valid `WalletIdentity` for their wallet with someone else’s `IdentityAccount` that has a permitted country, then pass country checks.

```rust
/// Identity registry for asset mint compliance
#[account(
    has_one = asset_mint,
    seeds = [asset_mint.key().as_ref()],
    seeds::program = ::identity_registry::ID,
    bump = identity_registry.bump,
)]
pub identity_registry: Box<Account<'info, IdentityRegistryAccount>>,

/// User's identity account with country information
#[account(
    has_one = identity_registry,
    seeds = [identity_registry.key().as_ref(), identity_account.owner.as_ref()],
    seeds::program = ::identity_registry::ID,
    bump
)]
pub identity_account: Box<Account<'info, IdentityAccount>>,

/// Links wallet to identity account
#[account(
    seeds = [redeemer.key().as_ref(), asset_mint.key().as_ref()],
    seeds::program = ::identity_registry::ID,
    bump,
)]
pub wallet_identity: Box<Account<'info, WalletIdentity>>,
```

**Impact:** Country restriction bypass. A wallet from a restricted country can redeem by supplying a different user’s `IdentityAccount` that reports an allowed country.

**Recommended Mitigation:** Consider requiring the association between the provided `IdentityAccount` and the `WalletIdentity` .

**Securitize:** Fixed in [78ad18d](https://github.com/securitize-io/bc-solana-redemption-sc/commit/78ad18d0dc78f7468be0092667046bea021b7875).

**Cyfrin:** Verified.


\clearpage
