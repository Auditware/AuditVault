---
tags:
  - lang/rust
  - sdk/anchor
  - sector/lending
  - sector/oracle
  - sector/staking
  - sector/staking-pool
  - sector/uncollat-lending
  - platform/ottersec
  - has/poc
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Hedge Vault]]"
auditors:
  - "[[Robert Chen]]"
report: "https://www.hedge.so/"
genome:
  - "[[decimal-mismatch]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[account-ownership]]"
  - "[[invoke-signed-seed-validation]]"
  - "[[liquidation-underwater]]"
  - "[[pyth-oracle-completeness]]"
  - "[[reward-accounting]]"
  - "[[token-decimal-normalization]]"
---
# Denial of Liquidation

- id: 48836
- impact: HIGH
- protocol: [[Hedge Vault]]
- reporter: Robert Chen (OtterSec)
- source: https://www.hedge.so/

## Summary


The report discusses a bug in the code that makes it impossible to liquidate vaults that have less collateral than debt. This is due to an error in the calculation process, which results in a negative value that causes the system to crash. This issue can be exploited when the price of the collateral is volatile, making it impossible to liquidate any undercollateralized vaults. The report also mentions a potential vulnerability in the token account checks, which could allow malicious users to lock down funds and prevent others from claiming rewards. The report recommends using a different method to derive associated token accounts to avoid this issue. Additionally, the report highlights some general findings, such as missing checks for confidence intervals and hardcoded emergency collateral ratios, which could potentially lead to vulnerabilities in the future. 

## Details

## Liquidation Vaults

It is impossible to liquidate vaults that are undercollateralized. This is due to the fact that the subtraction of higher debt from the collateral produces a negative decimal, which, when converted to `u64`, results in `None`. When `unwrap()` is called on `None`, the result will panic, making it impossible to liquidate undercollateralized accounts. The following snippet shows the affected code:

```rust
processors/liquidate_vault.rs
let market_value_in_ush =
    (Decimal::from_u64(collateral_to_be_liquidated)
    .unwrap()
    .p_mul(collateral_usd_price))
    .p_sub(normalized_debt_to_be_liquidated)
    .to_u64()
    .unwrap();
```

## Proof of Concept

The exploitability of the issue depends on the price of the collateral. When the price of the collateral is volatile, all the vaults with more debt than the collateral will be impossible to liquidate. The following is an example scenario of the issue:

1. Assume the collateral is SOL and its price is 100 USD (USH) at the start.
2. A user creates a vault A, deposits 10 SOL, and takes 900 USH as a loan, which has exactly 110% debt-to-collateral ratio.
3. Assume the price of SOL drops to 89.
4. As vault A is undercollateralized, it should be liquidated. When a liquidator bot tries to liquidate it, it will crash due to the calculation shown below:

   ```
   market_value_in_ush = (10 * 89) - 900 => (-10).to_u64() => None
   ```

## Remediation

It is recommended to perform a `to_u64` conversion only if the `market_value_in_ush` is greater than zero. This can be done by avoiding the conversion to `u64` until the amount is validated to be positive.

### Patch

Ensure `to_u64` conversion does not happen on a negative value. Fixed in #68.

```rust
let market_value_in_ush = collateral_ush_value - normalized_debt_to_be_liquidated;
// if liquidated_value_of_vault_in_usd is positive
if market_value_in_ush > dec!(0) {
```

---

## OS-HDG-ADV-02 [High] [Resolved]: Insufficient TokenAccount Check

## Description

While reviewing account checks in the source code, it was found that multiple checks for TokenAccounts only validate the owner and mint associated with the TokenAccount. Unfortunately, the Solana token program allows any user to create a TokenAccount with an arbitrary owner and mint.

```rust
solana-program-library/token/program/src/processor.rs
pub fn process_initialize_account2(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    owner: Pubkey,
) -> ProgramResult {
    Self::_process_initialize_account(program_id, accounts, Some(&owner), true)
}
```

A malicious user can transfer tokens to such an account instead of the proper staking/liquidation pool associated token accounts. Users would then be unable to claim liquidation profits, as the expected balance in the pool would be less than the actual amount.

## List of Affected Accounts

- context/create_vault.rs
  - fee_pool_associated_ush_token_account
- context/deposit_staking_pool.rs
  - pool_associated_staked_token_account
- context/deposit_vault.rs
  - fee_pool_associated_ush_token_account
- context/liquidate_vault.rs
  - vault_type_associated_token_account
  - pool_associated_token_account
  - fee_pool_associated_token_account
  - fee_pool_associated_ush_token_account
- context/loan_vault.rs
  - fee_pool_associated_ush_token_account
- context/redeem_vault.rs
  - fee_pool_associated_ush_token_account
- context/repay_vault.rs
  - fee_pool_associated_ush_token_account
- context/withdraw_staking_pool.rs
  - pool_associated_staked_token_account
  - pool_associated_ush_token_account
- context/withdraw_vault.rs
  - fee_pool_associated_ush_token_account

## Affected Code Snippet

```rust
context/liquidate_vault.rs
#[account(mut,
    constraint = pool_associated_token_account.owner == pool_state.key(),
    constraint = pool_associated_token_account.mint == vault_type_account.collateral_mint
)]
pub pool_associated_token_account: Account<'info, TokenAccount>
```

```rust
processors/liquidate_vault.rs
solana_program::program::invoke_signed(
    &spl_token::instruction::transfer(
        &spl_token::id(),
        &vault_associated_token_account.key(), // Account
        &pool_associated_token_account.key(),
        [...],
        &[vault_signer_seeds],
    )?;
```

When claiming from the liquidation pool, the passed-in token account must be the associated token account. Thus, users would be unable to claim from the previously passed, but incorrect, token account.

```rust
context/claim_liquidation_pool_position.rs
#[account(mut,
    address = get_associated_token_address(&pool_state.key(), &vault_type_account.collateral_mint)
)]
pub pool_associated_token_account: Account<'info, TokenAccount>
```

```rust
processors/claim_liquidation_pool_position.rs
solana_program::program::invoke_signed(
    &spl_token::instruction::transfer(
        &spl_token::id(),
        &pool_associated_token_account.key(), // Account
        &payer_associated_token_account.key(),
        [...],
    )?;
```

## Proof of Concept

This exploit allows an attacker to lock down funds and break the reward claims from the liquidation and staking pools. The following is an example scenario of the issue:

1. Use the token program to create a TokenAccount with `pool_state.key()` as owner and `vault_type_account.collateral_mint` as mint.
2. Liquidate a vault and use the newly created TokenAccount as the `pool_associated_token_account`. The collateral from the vault will now be transferred to the TokenAccount created by the attacker.
3. Claim rewards from the liquidation pool. Token transfer to the user account will fail as `pool_associated_token_account` is derived in the claim instruction and does not have enough tokens.
4. The funds get locked down in the attacker-created TokenAccount.

## Remediation

It is recommended to always use `get_associated_token_address` to derive the address of an associated token account. If this incurs too much computational cost, consider storing the `Pubkey` directly in the struct.

### Patch

Uses `get_associated_token_address` to derive associated token accounts. Fixed in #79.

```rust
#[account(mut,
    address = get_associated_token_address(&pool_state.key(), &vault_type_account.collateral_mint)
)]
pub pool_associated_token_account: Account<'info, TokenAccount>,
```

---

## General Findings

Here we present a discussion of general findings during our audit. While these findings do not present an immediate security impact, they do represent antipatterns and could introduce a vulnerability in the future.

| ID               | Description                                               |
|------------------|---------------------------------------------------------|
| OS-HDG-SUG-00    | Pyth Oracle price update is missing confidence interval checks. |
| OS-HDG-SUG-01    | Excessive time before oracle is considered stale.       |
| OS-HDG-SUG-02    | Emergency collateral ratio is hardcoded.                |
| OS-HDG-SUG-03    | No delay is present when unstaking from the liquidation or staking pools. |
