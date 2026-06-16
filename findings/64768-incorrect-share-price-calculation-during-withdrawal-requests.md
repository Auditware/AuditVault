---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/stable
  - sector/staking
protocol: "[[Dipcoin]]"
auditors:
  - "[[Hamed Mohammadi]]"
report: "https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html"
genome:
  - "[[price-calculation]]"
  - "[[indirect-loss]]"
  - "[[reward-accounting]]"
---
# Incorrect Share Price Calculation During Withdrawal Requests

- id: 64768
- impact: HIGH
- protocol: [[Dipcoin]] Vault
- reporter: Hamed Mohammadi (Quantstamp)
- source: https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html

## Summary


The report discusses a bug in the `vault.move` file where the `request_withdraw()` function decrements `vault.total_shares` immediately, but the assets backing those shares remain in the vault until the operator calls `fill_withdrawal_requests()`. This causes an issue where the share price is artificially inflated, allowing users to withdraw more value than they are entitled to. The report suggests either not decrementing `total_shares` in `request_withdraw()` or modifying `update_share_price()` to use `total_shares + requested_pending_shares` as the denominator. The bug has been marked as "Fixed" by the client and the fix can be found in a specific code.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `230ad6bd8693581099af2dcfb2f054299b59ce4a`.

> This issue was independently identified by both the audit team and the Dipcoin team as part of their internal review processes.

**File(s) affected:**`vault.move`

**Description:** The `request_withdraw()` function immediately decrements `vault.total_shares` by the requested amount. However, the assets backing those shares remain in the vault (in the Bank or open positions) until the operator calls `fill_withdrawal_requests()`. During this interim period, `update_share_price()` calculates the price as: `price = (Bank Balance + Position Value) / total_shares`. Since `total_shares` has been reduced but the numerator (Assets) has not, the share price is artificially inflated. This allows the withdrawing user (or subsequent users) to extract more value than they are entitled to, effectively stealing from remaining shareholders.

**Exploit Scenario:**

1.   Vault has 1000 USDC and 100 Shares. Price = 10 USDC. 
2.   User A requests withdrawal of 10 Shares (worth 100 USDC). 
3.   `total_shares` becomes 90. Assets remain 1000 USDC. 
4.   Operator calls `fill_withdrawal_requests()`. 
5.   `update_share_price()` is called: `1000 / 90 = 11.11 USDC`. 
6.   User A is paid: `10 shares * 11.11 = 111.11 USDC`. 7. User A steals 11.11 USDC from the vault.

**Recommendation:** Do not decrement `total_shares` in `request_withdraw()`. Instead, only decrement it in `fill_withdrawal_requests()` when the assets are actually paid out. Alternatively, modify `update_share_price()` to use `total_shares + requested_pending_shares` as the denominator.
