---
tags:
  - lang/rust
  - sdk/anchor
  - sector/bridge
  - sector/rwa
  - sector/stable
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
  - lang/anchor
protocol: "[[Securitize]]"
auditors:
  - "[[Ctrus]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-02-19-cyfrin-securitize-svm-on-off-ramp-v2.0.md"
genome:
  - "[[missing-auth]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[account-discriminator-check]]"
  - "[[account-ownership]]"
  - "[[cpi-program-id-validation]]"
  - "[[pda-derivation]]"
---
# Investors can mint DsTokens out of thin air

- id: 65451
- impact: HIGH
- protocol: [[Securitize]] Svm On Off Ramp
- reporter: Ctrus (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-02-19-cyfrin-securitize-svm-on-off-ramp-v2.0.md

## Summary


The bug report describes a problem with the swap logic in a program. The program is taking liquidity from investors and transferring it to a custodian's liquidity token account, then minting ds/spl tokens to the investors. However, there is a vulnerability in the program that allows an investor to exploit it and mint an infinite amount of dsTokens instead of the intended amount. This is because the program does not properly validate the `rwa-rbac` program account, which can be spoofed by an attacker. The impact of this bug is that investors can mint an unlimited number of dsTokens instead of the amount they are entitled to. A proof of concept is provided, along with a recommended mitigation to validate the `rwa-rbac` program Id against the real/legit program. The bug has been fixed and verified by the team.

## Details

**Description:** For the swap logic, we are taking liquidity from investor and transferring it to custodian's liquidity token account and then we're minting the resulting amount of ds/spl tokens to investors. In `swap-ds-token` & `subscribe-ds-token` the `asset_transfer_hook_accounts`, `asset_provider_accounts` & `nav_provider_accounts` are being fetched from user supplied remaining accounts, only check that is implemented is that remaining accounts length > expected length. Investors can not spoof `nav-provider-accounts` as it is validated, they also can't fake the `asset-transfer-hook-accounts` otherwise transfer would fail and hence the whole transaction, but the `asset-provider-accounts` are intresting.. once all validation is done in respective functions, those accounts are passed in `swap-process`. Swap process transfers liquidity from users to vault and issue them ds/spl tokens via their on ramp's asset provider's `supply-to` method... In case the asset provider is `MintingAssetProvider` and token type is `DsTokens`, we are making a cpi to `rwa-rbac` program's `issue-tokens` function with passing the onramp's signing privileges( our program signed for it by providing its seeds):

```rust
                rwa_rbac::cpi::issue_tokens(
                    CpiContext::new_with_signer(
                        rwa_rbac_program.to_account_info(),
                        rwa_rbac::cpi::accounts::IssueTokens {
```
However the `rwa_rbac` program account was fetched from remaining accounts, and was'nt validated( to make sure its intended `rwa-rbac` program , we did'nt validate it via its key/address.

```rust
                let rwa_rbac_program = &additional_accounts[0];
```

An Investor can simply pass his own malicious program account via remaining accounts as `rwa-rbac`. In this malicious `rwa-rbac` program attacker would implement same instruction named `issue-tokens` and the logic of this instruction is in completely hands of attacker, he can do anything in this `issue-tokens` instruction, potentially misusing the passed down signer privileges, for eg.
- the asset token vault and liquidity token vaults of onramps are owned by this authority, since authority signed this transaction, malicious user can implement `issue-tokens` such that it calls token-22's transfer checked and drains both the vaults in attacker's own token accounts.
Flow of cpis: our program -> fake rwa-rbac program(attacker controlled) -> token22(for tranfer)

- A more sever attack could be produced by implementing `issue-tokens` in fake `rwa-rbac` as such:
our program -> fake rwa-rbac program -> real/legit rwa-rbac program -> token22(for minting)
Attacker would pass his fake program as `rwa-rbac` program to our program, we cpi to his fake program, signing with our program, passing in pda signer privileges, now attacker's program's `issue-tokens` craft a fake `cpi_data` (expected by real `rwa-rbac` program) with highly inflated token "amount" .. and cpi into real rwa-rbac program and the rwa-rbac program issues/mints the passed in " highly inflated amount" of tokens to investor.. Investors can simply mint infinite number of dsTokens this way...

**Impact:** Investors can mint infinite/arbitrary number of DsTokens, instead of their entitled amount.

**Proof of Concept:** Lets consider this scenario:
- A malicious investor identify an on-ramp that has following configuration:
[asset_provider = MintingAssetProvider]
[asset_token_type = DsToken]
[investor_subscription_enabled = true]
- Investor deploys a malicious program that implements [issue_tokens] instruction with the same instruction discriminator this malicious program's [issue_tokens] implementation is as follow:
1. Receives the CPI call from `securitize-on-ramp` with [on_ramp_authority] as signer
2. Ignores the original [amount] parameter
3. Constructs new CPI data with [amount = u64::MAX] (or any arbitrary large value)
4. Forwards the call to the real [rwa_rbac] program's `issue-tokens` instruction with the inflated amount
- Investor calls `swap-ds-tokens` with minimal legitimate [liquidity_amount](e.g., 10 USDC)  and sets [asset_provider_accounts[0]] = their malicious program's address
- Investor's 10 usdc is transferred to vault, `swap_process` calls `MintingAssetProvider::supply_to()`, CPI to investor's malicious program (instead of real [rwa_rbac]), Malicious program CPI to real [rwa_rbac::issue_tokens] with [amount = u64::MAX], Real `rwa_rbac` mints [u64::MAX] tokens to investor's token account
- Investor receives ~u64::MAX DS tokens for the cost of 10 USDC + transaction fees

**Recommended Mitigation:** Validate user supplied `rwa-rbac` program Id against real/legit `rwa-rbac` program.
```rust
let rwa_rbac_program = &additional_accounts[0];
require_keys_eq!(
    rwa_rbac_program.key(),
    rwa_rbac::ID,  // Use the declared program ID from the imported crate
    SecuritizeOnRampError::InvalidProgram
);
```
**Securitize:** Fixed in [07f8e44](https://github.com/securitize-io/bc-solana-on-off-ramp-sc/commit/07f8e446b5e79acdc0b50f31e355b38259692971).

**Cyfrin:** Verified.

\clearpage
