---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - vuln/pda/bump-canonicalization
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - fix/add-check
  - sector/staking
protocol: "[[Cantina Oro February2025]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[bump-canonicalization]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[pda-derivation]]"
  - "[[reward-accounting]]"
---
3.1.7
Incorrect token amount calculation in liquid unstaking leads to asset loss
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: The liquid_unstake() function incorrectly handles token amounts during the unstaking
process, leading to potential asset loss. The root cause lies in two key areas:
1. Token Amount Mismatch: While liquid_stake() accepts GOLD token amount as user input, liq-
uid_unstake() accepts reward tokens amount as user input. This inconsistency creates an asym-
metric relationship between staking and unstaking operations.
6

2. Incorrect State Update: The function decrease config.liquid_amount by the reward token amount
instead of the GOLD token amount. Since liquid_amount tracks the total GOLD tokens in the vault,
this leads to incorrect accounting of the protocol's assets.
This vulnerability can be exploited by users to manipulate the exchange rate between GOLD and reward
tokens, potentially draining the vault.
Recommendation: The function should be modiﬁed to:
1. Use the input amount as GOLD currency to maintain consistency with the liquid_stake() function,
adjusting calculations accordingly.
2. Update config.liquid_amount with the correct GOLD amount.
Here's the proposed ﬁx:
pub fn liquid_unstake(&mut self, amount: u64) -> Result<()> {
let (canonical_bump_pda, _canonical_bump) =
Pubkey::find_program_address(&[b"whitelist", &self.user.key.to_bytes()], &ID);
assert_eq!(canonical_bump_pda, self.whitelist.key());
let cpi_program = self.token_program.to_account_info();
let seeds = &[b"config".as_ref(), &[self.config.bump]];
let signer_seeds = &[&seeds[..]];
let cpi_accounts = Burn {
mint: self.rewards_mint.to_account_info(),
from: self.rewards_ata.to_account_info(),
authority: self.user.to_account_info(),
};
let cpi_context: CpiContext<'_, '_, '_, '_, Burn<'_>> =
CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
-
let amount_to_burn = amount;
-
let amount_to_transfer = amount * self.config.liquid_amount / self.rewards_mint.supply;
+
let amount_to_burn = amount * self.rewards_mint.supply / self.config.liquid_amount;
+
let amount_to_transfer = amount;
burn(cpi_context, amount_to_burn)?;
let transfer_accounts = TransferChecked {
from: self.vault.to_account_info(),
mint: self.mint_a.to_account_info(),
to: self.user_ata_a.to_account_info(),
authority: self.config.to_account_info(),
};
let cpi_ctx = CpiContext::new_with_signer(
self.token_program.to_account_info(),
transfer_accounts,
signer_seeds,
);
let _ = transfer_checked(cpi_ctx, amount_to_transfer, self.mint_a.decimals);
self.config.liquid_amount -= amount;
Ok(())
}
Oro: Fixed in commit 9b580ede.
Cantina Managed: Fix veriﬁed.
