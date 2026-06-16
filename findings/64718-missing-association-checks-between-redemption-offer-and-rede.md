---
tags:
  - lang/rust
  - platform/quantstamp
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/insurance
protocol: "[[Onre]]"
auditors:
  - "[[Paul Clemson]]"
report: "https://certificate.quantstamp.com/full/onre-re-audit-2/41c2f85f-90ce-42ee-aac8-a810e0f0ec99/index.html"
genome:
  - "[[underflow]]"
  - "[[wrong-state]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
---
# Missing Association Checks Between Redemption Offer and Redemption Request Enables State Corruption

- id: 64718
- impact: HIGH
- protocol: [[Onre]] - Re-Audit - 2
- reporter: Paul Clemson (Quantstamp)
- source: https://certificate.quantstamp.com/full/onre-re-audit-2/41c2f85f-90ce-42ee-aac8-a810e0f0ec99/index.html

## Summary


The client has marked a bug as "Fixed" in their code. The bug was found in the `cancel_redemption_request` instruction, which did not check for a relationship between the `redemption_offer` and `redemption_request` accounts. This could be exploited by an authorized signer to cancel a request tied to one offer, but subtract the request amount from a different offer, causing issues with accounting and potentially blocking redemptions. The recommendation is to add constraints to ensure consistency and prevent manipulation between offers and requests.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `9b917d213718092c0d416835a00f1fedef079c8a`. The client provided the following explanation:

> Added missing association checks.

**File(s) affected:**`programs/onreapp/src/instructions/redemption/cancel_redemption_request.rs`

**Description:** The `cancel_redemption_request` instruction accepts both `redemption_offer` and `redemption_request` as mutable accounts but does not enforce any relationship between them. There is no validation that the provided redemption request belongs to the specified redemption offer.

**Exploit Scenario:**

 An authorized signer (redeemer, redemption_admin, or boss) submits a transaction with a valid pending `redemption_request` tied to Offer A, but supplies a different `redemption_offer` (Offer B). The instruction successfully cancels the request and subtracts the request amount from Offer B’s `requested_redemptions`, corrupting its accounting state. This can lead to incorrect redemption limits, blocked redemptions, or underflow-related denial of service.

**Recommendation:** Enforce strict association between redemption offers and requests by adding explicit constraints that should be enforced at the account validation level to guarantee state consistency and prevent cross-offer manipulation.
