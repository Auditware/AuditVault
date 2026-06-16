---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/vault
protocol: "[[Yield Basis]]"
auditors:
  - "[[Gereon Mendler]]"
report: "https://certificate.quantstamp.com/full/yield-basis/e07ecad3-524c-4609-b4f6-71ed7fdc3281/index.html"
genome:
  - "[[missing-check]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
---
# No Fee Enforcement in `LT` Contract

- id: 62011
- impact: HIGH
- protocol: [[Yield Basis]]
- reporter: Gereon Mendler (Quantstamp)
- source: https://certificate.quantstamp.com/full/yield-basis/e07ecad3-524c-4609-b4f6-71ed7fdc3281/index.html

## Summary


The bug report is about a problem that was found in a client's code. The issue was fixed by the client, and the explanation for the fix was provided. The affected file is `LT.vy` and the problem was that the `min_admin_fee` was not assigned, which meant that no admin fees could be charged from the LT contract. The recommendation is to assign `min_admin_fee` during the deployment of the LT contract and to allow the admin role to change its value. It is also suggested to test this to make sure it is working correctly.

## Details

**Update**
The client fixed the issue in commit `30bf611d68363724044c281ec60afda151aeb4ca`. and provided the following explanation:

> This was already fixed on Apr 5 by setting min_admin_fee in factory

**File(s) affected:**`contracts/LT.vy`

**Description:**`LT.min_admin_fee` is never assigned, preventing any admin fees to be charged from the LT contract.

**Recommendation:** Assign `min_admin_fee` during `LT` contract deployment. Optionally, allow the admin role to change its value. Further, test this for correctness.
