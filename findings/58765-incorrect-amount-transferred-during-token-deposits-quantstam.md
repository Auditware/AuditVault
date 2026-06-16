---
tags:
  - severity/high
  - lang/rust
  - sector/staking
  - sector/liquid-staking
  - platform/quantstamp
protocol: "[[Exceed Finance Liquid Staking & Early Purchase]]"
auditors:
  - István Böhm
report: "https://certificate.quantstamp.com/full/exceed-finance-liquid-staking-early-purchase/cde4c9ed-dfc2-460f-bc2c-780ce622fff7/index.html"
genome:
  - "[[token-approval-flow]]"
  - "[[arithmetic/precision-loss]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# Incorrect Amount Transferred During Token Deposits

- id: 58765
- impact: HIGH
- protocol: Exceed Finance Liquid Staking & Early Purchase
- reporter: István Böhm (Quantstamp)
- source: https://certificate.quantstamp.com/full/exceed-finance-liquid-staking-early-purchase/cde4c9ed-dfc2-460f-bc2c-780ce622fff7/index.html

## Summary


The client has marked a bug as "Fixed" and provided an explanation. The bug was found in the `early_purchase::deposit_tokens::handler()` function, which is supposed to allow a Guardian to deposit a specific amount of `purchase_mint` tokens into a sale token vault. However, the `token::transfer` CPI used within this function incorrectly uses `sale.calculate_base_purchase_cost(amount_to_deposit)` instead of the actual `amount_to_deposit`, resulting in a different value being transferred. The recommendation is to update the `token::transfer` CPI to transfer the exact amount of `params.amount_to_deposit` of `sale.purchase_mint` tokens.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `8a5ba98aaae2ae916bd19c5252896114f8a72a29`. The client provided the following explanation:

> The code was updated to transfer the exact number of tokens requested, a unit test was added.

**File(s) affected:**`programs/early-purchase/src/instructions/deposit_tokens.rs`

**Description:** The`early_purchase::deposit_tokens::handler()`function is intended to enable a Guardian to deposit a specified quantity of`purchase_mint`tokens (`params.amount_to_deposit`) into the sale token vault `sale_purchase_ata`. However, the`token::transfer`CPI within this instruction incorrectly uses`sale.calculate_base_purchase_cost(amount_to_deposit)`as the amount argument for the transfer instead of the `amount_to_deposit`, resulting in a significantly different value:

```
token::transfer(
    CpiContext::new(
        purchase_program.to_account_info(),
        token::Transfer {
            from: authority_purchase_ata.to_account_info(),
            to: sale_purchase_ata.to_account_info(),
            authority: authority.to_account_info(),
        },
    ),
    sale.calculate_base_purchase_cost(amount_to_deposit),
)
```

**Recommendation:** Consider updating the`token::transfer`CPI to transfer the exact`params.amount_to_deposit`of`sale.purchase_mint`tokens.
