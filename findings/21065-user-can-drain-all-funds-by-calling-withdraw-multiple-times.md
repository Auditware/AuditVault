---
tags:
  - lang/rust
  - platform/auditone
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - sector/bridge
protocol: "[[Aurorafastbridge]]"
auditors:
  - "[[AuditOne]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-05-09-Aurorafastbridge.md"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
---
# User can drain all funds by calling withdraw multiple times Severity: High

- id: 21065
- impact: HIGH
- protocol: [[Aurorafastbridge]]
- reporter: AuditOne
- source: https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-05-09-Aurorafastbridge.md

## Summary


This bug report is about the withdraw function of a system. Currently, the withdraw function transfers tokens and the callback function decreases the user's balance. However, as the main call and the callback handler are independent transactions, a malicious user can call the withdraw function repeatedly before the callback function is called. As a result, the user's balance is not decreased and the user can still transfer tokens.

The report recommends following the CEI pattern in this case. This means that the decrease_balance should be moved to the withdraw function, above the ft_transfer. This will ensure that the user's balance is decreased before the tokens are transferred.

## Details

**Description:**

Currently withdraw function transfer tokens and after its success, the callback function decreases user's balance. As main call and callback handler are independent transaction, a malicious user can call withdraw repeatedly, before callback function called.

As user's balance is still not decreased, user can still transfer tokens.

**Recommendations:**

We should follow CEI pattern in this case.

We should move decrease\_balance to withdraw, above ft\_transfer.
