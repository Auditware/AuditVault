---
tags:
  - lang/rust
  - lang/solidity
  - sector/bridge
  - sector/stable
  - sector/token
  - platform/pashov
  - has/github
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Spicenet]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Spicenet-security-review_2026-04-06.md"
genome:
  - "[[decimal-mismatch]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[integer-bounds]]"
  - "[[token-decimal-normalization]]"
---
# [H-01] Inconsistent token decimal handling in `update_mapping` function

- id: 65672
- impact: HIGH
- protocol: Spicenet_2026-04-06
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Spicenet]]-security-review_2026-04-06.md

## Summary


This bug report discusses an issue with the `TokenMapConfigType` mapping that allows the admin to associate multiple chain-specific token addresses with a single receipt token on the rollup. The problem arises when the admin calls `update_mapping` without checking that all `ChainAddress` entries mapped to a given receipt token represent tokens with the same number of decimals. This can lead to a situation where different amounts of tokens are treated as equivalent, resulting in a potential exploit where an attacker can deposit a small amount of tokens on one chain and extract a much larger amount on another chain.

To fix this issue, the report suggests either storing the expected decimal count for each `ChainAddress` and enforcing that all chain tokens mapped to the same receipt token share identical decimal counts, or normalizing amounts during deposit/withdrawal by scaling to a canonical decimal representation. The fix that was implemented introduces a new `ChainTokenConfig` struct and reworks the token mapping to include the decimal precision for each chain token. A `normalize_decimals` utility function was also added to ensure cross-chain amounts are always converted to the correct receipt-token denomination.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium


## Description

The `TokenMapConfigType` mapping (`HashMap<TokenIdOrd, HashSet<ChainAddress>>`) allows the admin to associate multiple chain-specific token addresses across different chains with a single receipt token on the rollup. When the admin calls `update_mapping`, the only validation is that the receipt token exists in `sov_bank`; there is no check that all `ChainAddress` entries mapped to a given receipt token represent tokens with the same number of decimals.

`process_deposit` (in `process_transaction.rs`) takes the raw `u128` amount directly from the decoded L1 ERC-20 `Transfer` event without decimal normalization:

```rust
let amount = Amount(amount_raw);
self.modify_escrow_balance(&chain_token, |b| b.checked_add(amount), state)?;
self.sov_bank.mint(Coins { amount, token_id: receipt_token }, &user, &admin, state)?;
```

Similarly, `execute_intent_auth` processes withdrawal amounts using the raw value from ABI-decoded call data.

Since the same receipt token is minted and burned regardless of which chain the deposit or withdrawal targets, amounts that represent vastly different real-world values are treated as equivalent. This is a realistic admin configuration mistake: when onboarding a new L2 where a bridge has deployed the "same" stablecoin with a different decimal representation (e.g., 18 decimals instead of the canonical 6), mapping it to the existing receipt token inadvertently introduces a cross-chain value extraction vector.

This risk is amplified for Solana (SVM) chains: the `ChainId` enum explicitly supports `Svm { network }` variants, and Solana SPL tokens commonly use 6 or 9 decimals while EVM tokens vary between 6, 8, and 18 decimals. Mapping a Solana 9-decimal token alongside an EVM 18-decimal token to the same receipt token creates a 10^9-unit ratio arbitrage per transaction.

## Attack Flow Example

1. The admin onboards USDC on a new L2 chain where the bridged USDC uses 18 decimals (this is common; several L2 bridges deploy wrapped USDC with 18 decimals). The admin maps both to the same receipt token:
   ```
   receipt_USDC -> { evm:1:USDC_eth (6 decimals), evm:99:USDC_l2 (18 decimals) }
   ```

2. Ethereum escrow holds 50,000 USDC (6 decimals) from existing depositors, i.e. `escrow[evm:1:USDC_eth] = 50_000_000_000` (50k * 10^6).
3. An attacker deposits 100 USDC on the L2 chain (18-decimal representation). The L1 `Transfer` event emits `value = 100_000_000_000_000_000_000` (100 * 10^18). `process_deposit` mints `100 * 10^18` units of `receipt_USDC` to the attacker.
4. The attacker initiates a withdrawal of `50_000_000_000` `receipt_USDC` (50k * 10^6) targeting Ethereum:
   - `escrow[evm:1:USDC_eth]` is subtracted by `50_000_000_000` → succeeds (escrow has exactly this).
   - `50_000_000_000` `receipt_USDC` transferred from attacker to admin - the attacker has `100 * 10^18` tokens, so this is a tiny fraction of their balance.
5. The L1 withdrawal settles on Ethereum, releasing 50,000 real USDC to the attacker.
6. **Result:** The attacker deposited $100 worth of USDC on the L2 and extracted $50,000 worth of USDC from the Ethereum escrow. They still hold approximately `100 * 10^18` receipt tokens for further extraction. The multiplier is `10^(18 - 6) = 10^12`; every 1 raw unit deposited on the 18-decimal chain can extract 10^12 raw units from the 6-decimal chain.

## Recommendation

Store the expected decimal count for each `ChainAddress` and enforce that all chain tokens mapped to the same receipt token share identical decimal counts:

```rust
// In update_mapping:
for (token_id, chain_tokens) in &new_mapping {
    let mut decimals_iter = chain_tokens.iter().map(|ct| ct.decimals);
    if let Some(first_decimals) = decimals_iter.next() {
        for d in decimals_iter {
            if d != first_decimals {
                return Err(SettlementsError::DecimalMismatch {
                    token_id: (*token_id).into(),
                    expected: first_decimals,
                    found: d,
                });
            }
        }
    }
}
```

Alternatively, normalize amounts during deposit/withdrawal by scaling to a canonical decimal representation. The validation-at-config-time approach is simpler and avoids precision loss edge cases.

## Fix Implemented

The fix introduces a new `ChainTokenConfig` struct carrying a `decimals` field, and reworks the token mapping from `HashMap<TokenIdOrd, HashSet<ChainAddress>>` to `HashMap<TokenIdOrd, HashMap<ChainAddress, ChainTokenConfig>>` so each chain token entry now records its decimal precision. A `normalize_decimals` utility function is added that scales an amount by `10^|delta|` (up or down) when the source chain token's decimals differ from the receipt token's decimals. Both the deposit path in `process_transaction` and the withdrawal path in `execute_intent_auth` now call this helper before minting or burning receipt tokens, ensuring cross-chain amounts are always converted to the correct receipt-token denomination.
