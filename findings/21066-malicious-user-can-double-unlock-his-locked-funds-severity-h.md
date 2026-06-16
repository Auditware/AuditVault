---
tags:
  - lang/rust
  - sector/bridge
  - platform/auditone
  - has/github
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Aurorafastbridge]]"
auditors:
  - "[[AuditOne]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-05-09-Aurorafastbridge.md"
genome:
  - "[[cross-contract]]"
  - "[[locked-funds]]"
  - "[[bridge-message-validation]]"
  - "[[reentrancy-guard]]"
---
# Malicious user can double-unlock his locked funds Severity: High

- id: 21066
- impact: HIGH
- protocol: [[Aurorafastbridge]]
- reporter: AuditOne
- source: https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-05-09-Aurorafastbridge.md

## Summary


This bug report is about the Near protocol’s unlock function. Currently, the unlock function checks whether a pending transfer of the nonce exists or not and, if successful, the callback function increases the balance and removes the transfer. However, since the main call and callback handler are independent transactions, a malicious user can call unlock repeatedly before the callback function is finished. This means that the pending transfer is not removed yet and the user can pass the check in the second call. The second call of remove_transfer in the callback will not panic but only return None, allowing the user to double-unlock their funds. 

The recommendation is to check if the nonce still exists in the pending_transfers at the unlock_callback. This would prevent the malicious user from double-unlocking their funds.

## Details

**Description:**

Currently unlock function checks whether pending transfer of the nonce does exist or not, after its success, the callback function increases balance and remove transfer.

In Near, main call and callback handler are independent transaction, so a malicious user can call unlock repeatedly, before callback function finished.

As pending transfer is not removed yet, user can still pass the check in second call.

Second call of remove\_transfer in callback will not panic but only return None.

As a result, user can double-unlock his funds.

**Recommendations:**

We should check if the nonce still exists in the pending\_transfers at unlock\_callback.
