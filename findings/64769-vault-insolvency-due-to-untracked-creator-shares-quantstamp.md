---
tags:
  - lang/solidity
  - sector/stable
  - platform/quantstamp
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Dipcoin]]"
auditors:
  - "[[Hamed Mohammadi]]"
report: "https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html"
genome:
  - "[[fee-calculation]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
---
# Vault Insolvency due to Untracked Creator Shares

- id: 64769
- impact: HIGH
- protocol: [[Dipcoin]] Vault
- reporter: Hamed Mohammadi (Quantstamp)
- source: https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html

## Summary


This bug report discusses a problem in the code of a protocol called `vault.move`. When a user requests to withdraw their funds, the protocol is supposed to calculate a fee and add it to the creator's account. However, the protocol fails to update the total number of shares in the vault, which results in an incorrect share price and can eventually lead to the vault becoming insolvent. The report recommends fixing this issue by updating the code to increment the total shares when the fee is added to the creator's account.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `230ad6bd8693581099af2dcfb2f054299b59ce4a`.

> This issue was independently identified by both the audit team and the Dipcoin team as part of their internal review processes.

**File(s) affected:**`vault.move`

**Description:** When a withdrawal request is filled via `fill_withdrawal_requests()`, the protocol calculates a profit share fee (`share_to_creator`) and adds these shares to the creator's `Position`. However, the protocol fails to increment `vault.total_shares` to reflect this new issuance.

This creates a permanent accounting mismatch where the sum of all user shares exceeds the `total_shares` tracked by the vault. `Sum(User Shares) > Vault Total Shares`

Because `total_shares` (the denominator) is smaller than the actual number of outstanding shares, the share price is permanently artificially inflated. This guarantees that the vault will eventually become insolvent, as the last users to withdraw will find there are insufficient assets to cover their shares at the inflated price.

**Exploit Scenario:**

1.   Vault has 100 USDC and 100 Shares. Price = 1.0.
2.   User withdraws. Fee calculation awards 1 Share to the Creator.
3.   Creator's balance increases by 1.
4.   `vault.total_shares` is NOT increased.
5.   Total Claims = 101 Shares. Total Tracked Shares = 100.
6.   Price = 100 USDC / 100 Shares = 1.0.
7.   If everyone tries to withdraw: 101 Shares * 1.0 = 101 USDC needed.
8.   Vault only has 100 USDC. It is insolvent.

**Recommendation:** In `fill_withdrawal_requests()`, immediately after adding shares to the creator's position, increment `vault.total_shares` by `share_to_creator`.
