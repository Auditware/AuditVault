---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - sector/governance
  - sector/lending
  - sector/nft
  - sector/nft-lending
  - platform/ottersec
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Frakt]]"
auditors:
  - "[[Harrison Green]]"
report: "https://frakt.xyz/"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[liquidation-underwater]]"
---
# Unchecked NFT ownership in loan proposal

- id: 48677
- impact: HIGH
- protocol: [[Frakt]]
- reporter: Harrison Green (OtterSec)
- source: https://frakt.xyz/

## Summary


The report discusses a bug in a loan contract where the program fails to verify if a token account contains the necessary token before accepting it as collateral. This can be exploited by an attacker who creates an empty token account and proposes a loan, causing the program to either freeze or take ownership of the account. If the loan is approved, the attacker receives lamports and the protocol cannot liquidate anything, resulting in loss of funds. The suggested solution is to add a verification step to ensure the token account has a balance of one. A patch has been provided to fix this issue.

## Details

## Loan Proposal Issue with NFT Collateral

When a user proposes a loan via the `proposeLoan` instruction, the contract accepts a token account containing the NFT to be used as collateral. However, it fails to validate that the token account actually contains the token.

## Instructions

### propose_loan.rs (RUST)

```rust
#[account(mut,
// owner = token::ID,
associated_token::mint = nft_mint,
associated_token::authority = user)]
pub nft_user_token_account: Box<Account<'info, TokenAccount>>,
```

Consider the scenario where an attacker creates an empty token account for an NFT’s mint. When they propose a loan with the empty token account, the program either freezes or takes ownership of it. If the admin approves the loan, the attacker receives lamports. The attacker may keep the borrowed lamports, yet the protocol cannot liquidate anything; this constitutes a loss of funds.

## Remediation

Verify that the `nft_user_token_account` has a balance of one.

## Patch

### Diff

```diff
--- a/nft_lending_v2/src/instructions/propose_loan.rs
+++ b/nft_lending_v2/src/instructions/propose_loan.rs
@@ -34,6 +34,7 @@ pub struct ProposeLoan<'info> {
#[account(mut,
// owner = token::ID,
+ constraint = nft_user_token_account.amount == TOKEN_MINT_SUPPLY,
associated_token::mint = nft_mint,
associated_token::authority = user)]
pub nft_user_token_account: Box<Account<'info, TokenAccount>>,
```

© 2022 OtterSec LLC. All Rights Reserved. 6 / 25
