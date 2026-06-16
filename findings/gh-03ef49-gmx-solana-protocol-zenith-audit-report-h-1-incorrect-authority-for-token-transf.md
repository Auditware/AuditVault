---
tags:
  - blockchain/solana
  - lang/rust
  - platform/zenith
  - severity/high
  - sector/perpetuals
protocol: "[[GMX]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[account-ownership]]"
  - "[[token2022-transfer-checked]]"
---
[H-1] Incorrect authority for token transfer in
withdraw_from_treasury_vault()
SEVERITY: High
IMPACT: High
STATUS: Resolved
LIKELIHOOD: Medium
Target
• /programs/gmsol-treasury/src/instructions/treasury.rs#L544-L556
Description:
The authority for WithdrawFromTreasuryVault CPI context is incorrectly set as
self.config.to_account_info(). It should instead be
self.treasury_vault_config.to_account_info().
This issue will cause withdraw_from_treasury_vault() to always fail.
impl<'info> WithdrawFromTreasuryVault<'info> {
fn transfer_checked_ctx(&self) /> CpiContext<'_, '_, '_, 'info,
TransferChecked<'info>> {
CpiContext/:new(
self.token_program.to_account_info(),
TransferChecked {
from:
self.treasury_vault.to_account_info(),
mint:
self.token.to_account_info(),
to:
self.target.to_account_info(),
authority:
self.config.to_account_info(),
},
)
}
}
10

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
Recommendations:
impl<'info> WithdrawFromTreasuryVault<'info> {
fn transfer_checked_ctx(&self) -> CpiContext<'_, '_, '_, 'info,
TransferChecked<'info>> {
CpiContext/:new(
self.token_program.to_account_info(),
TransferChecked {
from:
self.treasury_vault.to_account_info(),
mint:
self.token.to_account_info(),
to:
self.target.to_account_info(),
authority:
self.config.to_account_info(),
authority:
self.treasury_vault_config.to_account_info(),
},
)
}
}
GMX Solana: Fixed in @ea50664122...
Zenith: Verified.
11

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
