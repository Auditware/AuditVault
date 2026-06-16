---
tags:
  - lang/solidity
  - platform/zokyo
  - has/github
  - severity/high
  - sector/dex
  - sector/stable
  - sector/token
protocol: "[[Defactor]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-12-Defactor.md"
genome:
  - "[[wrong-type]]"
  - "[[temporary]]"
  - "[[dos-resistance]]"
  - "[[fot-slippage]]"
---
# Certain ERC20 tokens do not return bool from approve which breaks the core logic

- id: 58469
- impact: HIGH
- protocol: [[Defactor]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-12-Defactor.md

## Summary


The BrightPoolLenger and Uniswap Exchange contracts have a bug where they try to approve a token for other contracts, but some tokens do not return a value when this happens. This causes an error and prevents the transaction from going through. The recommendation is to use SafeApprove instead of approve to avoid this issue. This bug has been resolved in a recent audit.

## Details

**Description**

The BrightPoolLenger and Uniswap Exchange contracts attempt to approve the ask or bid token for other contracts and require the approve function to return true. However, some ERC20 implementations (e.g., mainnet USDT) do not return a value. This will cause a revert when the implementation tries to decode the boolean return value of the call to approve.
if (!order.bid.token.approve (address (exchangeable), order.bid.amount)) revert Insufficient Funds();
However, some ERC20 implementations (e.g., mainnet USDT) do not return a value. This will cause a revert when the implementation tries to decode the boolean return value of the call to approve.

**Recommendation**

Consider using SafeApprove instead of approve.

**Re-audit comment**

Resolved
