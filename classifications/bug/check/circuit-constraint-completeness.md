---
tags:
  - check/circuit-constraint-completeness
  - sector/zk
  - lang/circom
---
Are all witness values fully constrained? Verify no circuit component leaves outputs unconstrained - malicious provers can supply arbitrary values for any signal not tied to inputs via constraints (e.g., missing equality between read/write columns, range limbs unbound to original value).
