---
tags:
  - blockchain/solana
  - lang/rust
  - platform/pashov
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - impact/dos/permanent
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/dex
  - check/same-token-swap-protection
  - check/token-dust-handling
protocol: "[[Stixswapsolana]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[decimal-mismatch]]"
  - "[[permanent]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[token-decimal-normalization]]"
  - "[[token2022-transfer-checked]]"
  - "[[same-token-swap-protection]]"
  - "[[token-dust-handling]]"
---
[H-04] Permanent DOS and loss of funds
due to unhandled token dust
Severity
Impact: High
Likelihood: Medium
Description
The cancel_offer  and take_offer  functions close the vault token account
used to hold the input token amount. However, these functions do not account
for any additional tokens transferred to the vault by an attacker. Since non-
native token accounts must have a zero balance before being closed, even a
17

minimal token transfer (e.g., 0.0000001 tokens) to the vault would result in the
following condition from the close  function in the Token-2022 program being
triggered:
if !source_account.base.is_native() && u64::from
  (source_account.base.amount) != 0 {  
    return Err(TokenError::NonNativeHasBalance.into());  
}
This would cause both the cancel_offer  and take_offer  functions to revert,
leading to:
1. Permanent Denial-of-Service (DoS) for these functions.
2. Permanent lock of funds for the users involved in the offer.
An attacker can execute this exploit at negligible cost, sending a minimal
amount of tokens to the vault, which prevents its closure.
Impact
Critical Impact: Permanent DoS for both cancel_offer  and take_offer
functions.
Permanent lock of user funds in the vault.
Minimal cost for the attacker to execute the exploit.
Recommendations
Before closing the vault token account, ensure that all the balance is
transferred:
To the maker in the cancel_offer  function.
To the taker in the take_offer  function.
Example adjustment:
18

// Transfer remaining balance before closing the vault  
let balance = vault_token_account.amount;  
    token_interface::transfer_checked(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token_interface::TransferChecked {
                from: ctx.accounts.vault_token_account.to_account_info(),
                mint: ctx.accounts.input_token_mint.to_account_info(),
                to: ctx.accounts.maker_token_account.to_account_info
                //(), // in case of cancellation 
                authority: offer_auth_info.clone(),
            },
            &[seeds]
        ),
        balance,
        input_token_decimals,
    )?;
// Proceed with closing the account  
    token_interface::close_account(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token_interface::CloseAccount {
                account: ctx.accounts.vault_token_account.to_account_info(),
                destination: ctx.accounts.maker.to_account_info(),
                authority: offer_auth_info,
            },
            &[seeds]
        )
    )?;
This ensures that any dust tokens are appropriately transferred, preventing the
DoS vulnerability and allowing account closure.
19

8.3. Medium Findings
[M-01] Whitelisted taker can DoS attack
other whitelisted takers
Severity
Impact: Medium
Likelihood: Medium
Description
When taking _offer , the Whitelist  account will be closed:
#[account(
        mut,
        seeds = [b"whitelist", offer.maker.as_ref()],
        bump,
        constraint = whitelist.takers.contains(&taker.key
          ()) @ SwapError::TakerNotWhitelisted,
@>      close = maker 
    )]
    pub whitelist: Account<'info, Whitelist>,
In addition, the order can be partially traded. As a result, the malicious taker
could block other takers from trading, and the attacker would only need to
close a small number of orders to be unable to continue trading.
Recommendations
Remove the taker from the whitelist after take_offer  instead of closing the
Whitelist account.
[M-02] Same token swap protection missing
Severity
Impact: Medium
20

Likelihood: Medium
