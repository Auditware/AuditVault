---
tags:
  - lang/solidity
  - platform/code4rena
  - has/poc
  - severity/high
  - sector/governance
protocol: "[[Sequence]]"
auditors:
  - "[[hgrano]]"
report: "https://code4rena.com/reports/2025-10-sequence"
genome:
  - "[[signature-validation]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
---
# [H-01] Chained signature with checkpointer usage disabled can bypass checkpointer validation

- id: 63760
- impact: HIGH
- protocol: [[Sequence]]
- reporter: hgrano (Code4rena)
- source: https://code4rena.com/reports/2025-10-sequence

Summary
Chained signature + checkpointer-usage bit (0x40) unset → checkpointer ignored → snapshot.imageHash == 0 → final validation bypassed. Evicted signer can sign stale payloads and execute wallet ops.

Details
- Vulnerable code: BaseSig.recover / recoverChained (BaseSig.sol)
- Root cause: when chained signature present and outer _checkpointer == address(0), inner signature may set checkpointer flag but _ignoreCheckpointer true → checkpointer data skipped, leaving snapshot zeroed.
- Impact: unauthorized actions by evicted signer.

Proof of Concept
See PoC test `test_PoC_checkpointer_bypass` included in original report. (Saved in capture zip if needed.)

Remediation
Require checkpointer usage when signature is chained. Example patch (add revert):

```diff
if (signatureFlag & 0x01 == 0x01) {
+  if (signatureFlag & 0x40 == 0) { revert MissingCheckpointer(); }
  return recoverChained(_payload, _checkpointer, snapshot, _signature[rindex:]);
}
```

Artifacts
- Raw JSON + HAR + screenshot saved: /Users/user/Desktop/crawlee-run/first_finding_capture.zip
- Raw response: /Users/user/Desktop/crawlee-run/finding_responses.json

Notes
Add MissingCheckpointer error, add unit test enforcing revert when chained signature lacks checkpointer bit.
