---
tags:
  - check/ec-point-doubling
  - sector/zk
  - lang/circom
---
Does the elliptic curve addition circuit handle the point doubling case (equal inputs) correctly? Verify that EllipticCurveAddUnequal or equivalent component is never called with two equal points - the constraint equations reduce to 0=0 when inputs are equal, letting a prover choose arbitrary outputs and forge the aggregate public key or signature.
