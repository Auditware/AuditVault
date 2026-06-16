---
tags:
  - sector/oracle
  - platform/quantstamp
  - severity/high
protocol: "[[Crouton Finance   StableSwap]]"
auditors:
  - Julio Aguilar
report: "https://certificate.quantstamp.com/full/crouton-finance-stable-swap/14a85512-535f-4145-bbe9-1069ef8ce9a9/index.html"
genome:
  - "[[bridge-validator-threshold]]"
  - "[[missing-signer]]"
  - "[[single-source]]"
  - "[[variant]]"
  - "[[admin-is-honest]]"
  - "[[oracle-is-reliable]]"
  - "[[add-access-control]]"
  - "[[use-multi-oracle]]"
---
# Duplicate Signatures Allow Single Signer to Bypass Oracle Valid Signer Threshold Requirement

- id: 58836
- impact: HIGH
- protocol: Crouton Finance - StableSwap
- reporter: Julio Aguilar (Quantstamp)
- source: https://certificate.quantstamp.com/full/crouton-finance-stable-swap/14a85512-535f-4145-bbe9-1069ef8ce9a9/index.html

## Summary


The client has marked a bug as "Fixed" in the file `oracle.fc`. The problem was that the `handle_update_price()` function did not check for duplicate signatures in the signatures dictionary. This means that a single signer could submit multiple valid duplicate signatures, which would bypass the intended threshold requirement. This could allow a compromised or malicious signer to unilaterally validate a price update, even if the threshold was set to require multiple independent signers. The recommendation is to sort the signatures by `pk` and check for consecutive entries to prevent this issue.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `dcabe19b6f07c98c6cbec3cee7d659f750c88812`.

**File(s) affected:**`oracle.fc`

**Description:** In the oracle contract, the `handle_update_price()` function does not check for duplicate signatures in the signatures dictionary. This allows a single signer to submit multiple valid duplicate signatures, artificially increasing the `valid_signer_counter` and bypassing the intended threshold requirement. As a result, a single compromised or malicious signer could unilaterally validate a price update even if the threshold is set to require multiple independent signers.

**Recommendation:** Consider requiring the signatures to be uniquely sorted (i.e. by `pk`) and checking consecutive entries accordingly.
