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
  - "[[account-ownership]]"
  - "[[account-signer]]"
  - "[[access-control/missing-auth]]"
  - "[[dos/permanent]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# Incorrect Authority Used for Token Transfer Prevents All Redemptions

- id: 58764
- impact: HIGH
- protocol: Exceed Finance Liquid Staking & Early Purchase
- reporter: István Böhm (Quantstamp)
- source: https://certificate.quantstamp.com/full/exceed-finance-liquid-staking-early-purchase/cde4c9ed-dfc2-460f-bc2c-780ce622fff7/index.html

## Summary


The client has marked a bug as "Fixed" in a recent update. The issue was found in the `early_purchase::redeem_receipt::handler()` function, which is responsible for transferring tokens during sale receipt redemption. However, the `token::transfer` CPI is incorrectly configured with the buyer as the authority for the transfer. The recommendation is to modify the CPI to use the sale's PDA as the authority instead. This bug has been addressed in the update `c3a83a530d0eddb65b0b7a780d02b474e56c4881` and unit tests have been updated to ensure the accuracy of the distributed tokens. The affected file is `programs/early-purchase/src/instructions/redeem_receipt.rs`.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `c3a83a530d0eddb65b0b7a780d02b474e56c4881`. The client provided the following explanation:

> The Sale struct was modified to store its ID and bump so that signer seeds could be constructed in the redeem_receipt instruction. Unit tests were updated to prove that the tokens are transferred and that the distributed amount is accurate.

**File(s) affected:**`programs/early-purchase/src/instructions/redeem_receipt.rs`

**Description:** The`early_purchase::redeem_receipt::handler()`function is responsible for transferring the `purchase_mint`tokens from the sale's ATA (`config_purchase_ata`) to the buyer's ATA (`buyer_purchase_ata`) during sale receipt redemption. However, the `token::transfer` CPI is incorrectly configured with the`buyer`as the authority for this transfer:

```
token::transfer(
    CpiContext::new(
        purchase_program.to_account_info(),
        token::Transfer {
            from: config_purchase_ata.to_account_info(),
            to: buyer_purchase_ata.to_account_info(),
            authority: buyer.to_account_info(),
        },
    ),
    num_tokens_pending,
)
```

**Recommendation:** Consider modifying the`token::transfer`CPI to use the`sale.to_account_info()`PDA as the authority for the transfer.

```
token::transfer(
    CpiContext::new(
        purchase_program.to_account_info(),
        token::Transfer {
            from: config_purchase_ata.to_account_info(),
            to: buyer_purchase_ata.to_account_info(),
            authority: sale.to_account_info(),
        },
    ),
    num_tokens_pending,
)
```
