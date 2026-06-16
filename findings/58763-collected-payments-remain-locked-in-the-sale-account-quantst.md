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
  - "[[fee-accounting]]"
  - "[[dos/frozen-funds]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/protocol-wide]]"
---
# Collected Payments Remain Locked in the Sale Account

- id: 58763
- impact: HIGH
- protocol: Exceed Finance Liquid Staking & Early Purchase
- reporter: István Böhm (Quantstamp)
- source: https://certificate.quantstamp.com/full/exceed-finance-liquid-staking-early-purchase/cde4c9ed-dfc2-460f-bc2c-780ce622fff7/index.html

## Summary


The report states that a bug was fixed by the client in a program called `early-purchase`. The bug was related to transferring payments from buyers to the sale organizer during the token purchase phase. The program did not have a way to transfer these payments to the designated recipient address. The report suggests implementing a mechanism to allow the sale organizer or admin to withdraw the payments and SOL to a designated address.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `de2c6f30136f9ff9cfd6fef5ed6a920024ab7675`. The client provided the following explanation:

> The purchase instruction, sale struct and unit tests were changed and a new 'withdraw_funds' instruction was added.

**File(s) affected:**`programs/early-purchase/src/instructions/deposit_tokens.rs`

**Description:** During the token purchase phase in the `early-purchase` program, buyers transfer their payments (either SPL tokens to the `sale_payment_ata` or SOL directly to the Sale PDA). The sale organizer (acting through a Guardian) deposits the `sale.purchase_mint` tokens for distribution after the sale ends. However, the program lacks a mechanism to transfer the collected buyer payments from the `Sale` PDA and ATA accounts to the sale organizer or a designated treasury.

It is also noted that the address of the user initiating the sale is not saved in the `Sale` PDA, and only guardians with `deposit_tokens` permission can deposit the `sale.purchase_mint` tokens.

**Recommendation:** Consider implementing a mechanism to allow the designated sale organizer or admin to withdraw the collected payment tokens and SOL to a designated recipient address.
