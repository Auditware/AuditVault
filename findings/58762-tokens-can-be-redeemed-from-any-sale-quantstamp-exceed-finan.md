---
tags:
  - lang/rust
  - sector/liquid-staking
  - sector/staking
  - platform/quantstamp
  - severity/high
protocol: "[[Exceed Finance Liquid Staking & Early Purchase]]"
auditors:
  - István Böhm
report: "https://certificate.quantstamp.com/full/exceed-finance-liquid-staking-early-purchase/cde4c9ed-dfc2-460f-bc2c-780ce622fff7/index.html"
genome:
  - "[[pda-derivation]]"
  - "[[missing-seeds-check]]"
  - "[[variant]]"
  - "[[add-check]]"
---
# Tokens Can Be Redeemed From Any Sale

- id: 58762
- impact: HIGH
- protocol: Exceed Finance Liquid Staking & Early Purchase
- reporter: István Böhm (Quantstamp)
- source: https://certificate.quantstamp.com/full/exceed-finance-liquid-staking-early-purchase/cde4c9ed-dfc2-460f-bc2c-780ce622fff7/index.html

## Summary


This bug report is about a vulnerability in a program that allows an attacker to create fake receipts and use them to redeem legitimate tokens from a sale. The client has marked it as "fixed" and provided an explanation on how they addressed the issue. They also recommend adding a new feature to prevent this type of exploit in the future.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `e57b33c4e7604080c2824c07dba116d77c5d02b5`. The client provided the following explanation:

> The sale key was added to the receipt PDA seeds and new unit tests were created to test this edge case

**File(s) affected:**`programs/early-purchase/src/state/sale.rs`, `programs/early-purchase/src/instructions/purchase_tokens.rs`, `programs/early-purchase/src/instructions/redeem_receipt.rs`

**Description:** Sale accounts can be created by any user and they are assigned as their admins. Additionally, receipt PDAs are derived with the following seeds at the buyer's first token purchase:

```
seeds = [
    Receipt::PREFIX.as_bytes(),
    &buyer.key.to_bytes()
]
```

This implies that `Receipt` accounts are initialized in a 1:1 relation to buyer accounts, allowing an attacker to create a receipt and purchase an amount of a worthless token and redeem the receipt against a sale that holds actual, legitimate tokens.

**Exploit Scenario:**

1.   An attacker creates a new "mock" token.
2.   The attacker creates a sale and sells the "mock" tokens for a very cheap price.
3.   The attacker buys 1000000 "mock" tokens. Their receipt now records the amount of tokens they purchased, but not the sale address.
4.   A legitimate sale ends, and users can start redeeming their receipts.
5.   The attacker uses the receipt from the "mock" tokens to redeem 1000000 tokens from the legit sale.

**Recommendation:** Consider adding the `sale` pubkey to the seeds used to derive the `receipt` PDA and only allow one `receipt` account per token, much like how ATAs work.
