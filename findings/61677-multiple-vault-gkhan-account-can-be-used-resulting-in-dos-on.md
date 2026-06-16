---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - sector/nft
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/pda/missing-seeds-check
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - fix/add-check
  - lang/anchor
protocol: "[[Doryoku]]"
auditors:
  - "[[Kose]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-22-cyfrin-doryoku-v2.0.md"
genome:
  - "[[missing-seeds-check]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[account-ownership]]"
  - "[[dos-resistance]]"
  - "[[pda-derivation]]"
---
# Multiple `vault_gkhan_account` Can be Used Resulting in DoS on `complete_vest`

- id: 61677
- impact: HIGH
- protocol: [[Doryoku]]
- reporter: Kose (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-22-cyfrin-doryoku-v2.0.md

## Summary


The program, called `vault_gkhan_account`, has a bug where it does not check if the account is the correct one created by the Associated Token Account (ATA) program. This means that any SPL token account with the owner field set to a specific PDA will pass the checks, even if it was created by an attacker. This can lead to attackers draining the legitimate balance of the vault, leaving honest users unable to claim their vested tokens. The recommended fix is to either bind the vault address deterministically or strictly enforce ATA-derivation. The bug has been fixed and verified.

## Details

**Description:** The program validates `vault_gkhan_account` only by checking that

* `vault_gkhan_account.owner == state.key()` and
* `vault_gkhan_account.mint  == state.belo_mint`

It **does not** verify that the account is the canonical vault ATA created via the Associated Token Account (ATA) program or a PDA derived with hard-coded seeds.
Consequently, *any* SPL token account whose owner field is set to the `state` PDA passes the constraints-even if it was created by an attacker and is fully under their close-authority control.

1. **Alice** makes a normal deposit
   * Deposits `100 BELO` into the official vault ATA (the one originally initialized).
   * Receives `100 xBELO`.

2. **Bob** crafts a phantom vault
   * Creates a new token account `phantom_vault` with
     `owner = state_pda`, `mint = belo_mint`, and sets himself as `close_authority`.
   * Calls `deposit`, supplying `phantom_vault` as `vault_gkhan_account`, depositing `50 BELO`.
   * Receives `50 xBELO`.

3. Bob later calls `complete_vest` (after his vest duration) but passes the **official** vault ATA.
   * `50 BELO` are transferred out of the official vault and his `burn_amount` is burned there.

4. When Alice’s vest completes, the official vault holds only `50 BELO`, so her transaction fails, effectively stealing locking her funds.


**Impact:** Attackers can create “phantom” vaults, deposit through them, and later redeem from the *real* vault. This drains the legitimate vault balance, rendering the protocol insolvent and leaving honest users unable to claim their vested tokens.



**Recommended Mitigation:**
- **Bind the vault address deterministically.**
  Derive the vault PDA with fixed seeds, e.g.
  ```rust
  let (vault_key, _bump) = Pubkey::find_program_address(
      &[b"vault", state.belo_mint.as_ref()],
      program_id,
  );
  require!(vault_gkhan_account.key() == vault_key, ErrorCode::InvalidTokenAccount);
  ```
- **or** strictly enforce ATA-derivation: require
  `vault_gkhan_account.key() == get_associated_token_address(&state.key(), &state.belo_mint)`.


**Doryoku:**
Fixed in [f527d44](https://github.com/Warlands-Nft/xbelo/commit/f527d44e791a57cff7c81e102d5522ffca8489ca) and [034eaac](https://github.com/Warlands-Nft/xbelo/commit/034eaac1863cd4e409b7777220a5e083bdbde030).

**Cyfrin:** Verified.
