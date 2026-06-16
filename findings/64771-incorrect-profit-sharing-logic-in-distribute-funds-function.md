---
tags:
  - platform/quantstamp
  - lang/move
  - severity/high
  - sector/vault
protocol: "[[Dipcoin]]"
auditors:
  - "[[Hamed Mohammadi]]"
report: "https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html"
genome:
  - "[[fee-calculation]]"
  - "[[wrong-state]]"
  - "[[fee-accounting]]"
---
# Incorrect Profit Sharing Logic in `distribute_funds()` Function Leads to Fee Leakage

- id: 64771
- impact: HIGH
- protocol: [[Dipcoin]] Vault
- reporter: Hamed Mohammadi (Quantstamp)
- source: https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html

## Summary


The report discusses a bug in the `distribute_funds()` function of the Dipcoin project, which calculates the creator's profit share. The bug allows the creator to receive a tax-free distribution of profit, while the user's share count and cost basis remain unchanged. This results in the erasure of the user's unrealized profit without being taxed. The report also includes an exploit scenario, where a user deposits $100, the vault makes a $100 profit, and the creator distributes $100, resulting in the user receiving only $95 and the creator losing 50% of their fees. The recommendation is to remove the `distribute_funds()` function as it was already planned for removal by the Dipcoin team. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `8036b79578ba123c2bf809cb68ce187d27685ab2`.

> The `distribute_funds()` function was identified for removal during the audit. The Dipcoin team confirmed that it had already been planned for removal prior to the initial report.

**File(s) affected:**`vault.move`

**Description:** The `distribute_funds()` function calculates the creator's profit share by treating the distributed amount as a pro-rata slice of the user's position (containing both principal and profit in proportion to the current share price). However, unlike a withdrawal, the distribution does not reduce the user's share count or adjust their cost basis (`average_price`). This leads to a mathematical flaw where the "principal portion" of the distribution is returned tax-free, but the user's cost basis remains high. This effectively erases the "unrealized profit" from the share price without taxing it.

**Exploit Scenario:**

1.   User deposits $100 (100 shares at $1).
2.   Vault makes $100 profit. Price = $2.
3.   Creator distributes $100 (the profit).
4.   Code calculates: Distribution is 50% of value ($200). So it represents 50 shares.
5.   Profit on 50 shares = $50. Fee = 10% * $50 = $5.
6.   User receives $95.
7.   Vault Share Price drops to $1 (Assets $100 / 100 Shares).
8.   User's remaining unrealized profit is $0 ($1 Price - $1 Entry).
9.   Total Fee Paid = $5. Correct Fee on $100 profit should be $10.
10.   Creator loses 50% of their fees.

**Recommendation:** Since the Dipcoin team stated that `distribute_funds()` will be removed, no remediation is required.
