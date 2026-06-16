---
tags:
  - check/circuit-input-range-check
  - sector/zk
  - lang/circom
---
Are all circuit inputs range-checked to valid bit widths before use? Verify BigInt limbs, field element witnesses, and decomposed values are each constrained to their declared bit length AND that the parts are re-composed and compared to the original value - partial range checks that omit the binding constraint allow out-of-range witnesses.
