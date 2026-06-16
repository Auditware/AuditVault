---
tags:
  - lang/solidity
  - platform/auditone
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Aurorafastbridge]]"
auditors:
  - "[[AuditOne]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-05-09-Aurorafastbridge.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[bridge-sender-auth]]"
  - "[[commitment-uniqueness]]"
---
# Potential for Race Condition between Unlock Time and Proof Verification leading to Double Spending

- id: 21064
- impact: HIGH
- protocol: [[Aurorafastbridge]]
- reporter: AuditOne
- source: https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-05-09-Aurorafastbridge.md

## Summary


The Fast Bridge project has a potential race condition that can lead to double spending. This happens when the time window for releasing tokens on the NEAR side is set by the sender when they initiate the transaction, and the LP-Relayer is responsible for releasing the tokens. To prevent this from happening, it is important to have secure verification processes and have multiple parties involved in verifying the proof before the tokens are released. This could include using secure verification processes, and having multiple parties involved in verifying the proof before the tokens are released. Additionally, the LP-Relayer should be trusted and secure.

## Details

**Description:** 

In the Fast Bridge project, a race condition between unlock time and proof verification can lead to double spending. Here's how it can happen:

When a user sends tokens from Ethereum to NEAR, the tokens are locked on the Ethereum side, and the LP-Relayer is responsible for releasing the tokens on the NEAR side once the proof of transaction has been received. The LP-Relayer has a specific time window in which to release the tokens, which is set by the sender when they initiate the transaction.

**Recommendations:**

To prevent this from happening, it's important that the LP- Relayer is trusted and secure, and that there are appropriate measures in place to verify that the proof of transaction is valid before the tokens are released. This can include using secure verification processes, and having multiple parties involved in verifying the proof before the tokens are released.
