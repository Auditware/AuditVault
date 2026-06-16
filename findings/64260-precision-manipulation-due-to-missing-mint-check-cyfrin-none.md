---
tags:
  - sector/lending
  - platform/cyfrin
  - has/github
  - severity/high
  - lang/rust
  - lang/anchor
protocol: "[[Securitize Solana Vault]]"
auditors:
  - Alex Roan
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-05-23-cyfrin-securitize-solana-vault-v2.0.md"
genome:
  - "[[integer-bounds]]"
  - "[[direct-drain]]"
---
# Precision Manipulation Due to Missing Mint Check

- id: 64260
- impact: HIGH
- protocol: Securitize Solana Vault
- reporter: Alex Roan (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-05-23-cyfrin-securitize-solana-vault-v2.0.md

## Summary


The bug report describes an issue with the `deposit_handler` function. The function chooses the conversion precision based on the `liquidation_token_mint` and `liquidation_token_vault` accounts. However, there is no runtime constraint that ensures these accounts are used together, allowing a privileged operator to abuse the system. This can result in the operator minting an excessive amount of shares at a discounted rate, causing a loss of user funds. A proof of concept is provided, and the recommended mitigation is to enforce account coupling or add an Anchor constraint. The bug has been fixed in a recent commit.

## Details

**Description:** `deposit_handler` chooses the conversion precision (`conv_decimals`) as:

```rust
let conv_decimals = ctx
    .accounts
    .liquidation_token_mint
    .as_ref()
    .map(|mint| mint.decimals)          // if Some ⇒ use its decimals
    .unwrap_or(ctx.accounts.asset_mint.decimals);
```

The account context *documents* that `liquidation_token_mint` and `liquidation_token_vault` must appear together, but there is **no runtime constraint** enforcing it.
An operator can therefore:

1. Pass **`liquidation_token_mint = Some`** with any mint they control (e.g., 0 decimals).
2. Pass **`liquidation_token_vault = None`**, bypassing the only check that references the vault.

Because `conv_decimals` now equals `0`, the denominator inside `convert_to_shares` becomes `10^0 = 1` instead of (say) `10^6`. All arithmetic that scales by this factor is therefore inflated by `10^decimals`, dramatically increasing the number of shares minted for the same asset deposit.

**Impact:** A privileged operator can mint an arbitrarily large supply of shares at a discount (≈ 10^D × cheaper, where **D** is the asset’s normal decimals). They can later redeem those shares for real assets, draining the vault and diluting all honest shareholders-effectively a direct loss of user funds.

**Proof of Concept:**
1. Create a fake SPL mint with `decimals = 0`.
2. Construct a `deposit` instruction where
   * `liquidation_token_mint` → the fake mint account
   * `liquidation_token_vault` → **omitted** (encode as `None`)
   * All other required accounts are valid.
3. Deposit 1 unit of the underlying asset.
4. Observe that `convert_to_shares` uses a factor of `1` instead of `10^asset_decimals`, minting roughly `10^asset_decimals` more shares than intended.

**Recommended Mitigation:** Enforce account coupling:
  ```rust
  require!(
      liquidation_token_mint.is_some() == liquidation_token_vault.is_some(),
      ScVaultError::InvalidLiquidationAccounts
  );
  ```
  or add an Anchor constraint tying the two options together as the docstring promises.


**Securitize:** Fixed in [b0cabd3](https://github.com/securitize-io/bc-solana-vault-sc/commit/b0cabd3ed8dac07ab78b245d9cbdc53102871937).

**Cyfrin:** Verified

\clearpage
