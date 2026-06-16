---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/bridge
protocol: "[[Arbitrum Token Bridge]]"
auditors:
  - "[[Poming Lee]]"
report: "https://certificate.quantstamp.com/full/arbitrum-token-bridge/01aa719e-9903-4c16-9478-ee241338c74e/index.html"
genome:
  - "[[frozen-funds]]"
  - "[[role-bypass]]"
  - "[[bridge-message-validation]]"
---
# Missing Permission Check for Function `setBridge()`

- id: 61630
- impact: HIGH
- protocol: [[Arbitrum Token Bridge]]
- reporter: Poming Lee (Quantstamp)
- source: https://certificate.quantstamp.com/full/arbitrum-token-bridge/01aa719e-9903-4c16-9478-ee241338c74e/index.html

## Summary


A bug report was made on 2021-08-03 regarding a missing permission check in the `L1PassiveFastExitManager.sol` file, located in the `packages\arb-bridge-peripherals\contracts\tokenbridge\misc` folder. This issue could potentially be exploited for DDoS attacks. The recommended solution is to add a permission check to the `setBridge` function to prevent unauthorized changes. The bug has since been fixed by deleting the file.

## Details

**Update**
2021-08-03: fixed by deleting the file.

**File(s) affected:**`packages\arb-bridge-peripherals\contracts\tokenbridge\misc\L1PassiveFastExitManager.sol`

**Description:** There is a missing permission check for the function `setBridge`. This could be used for DDoS attacks.

**Recommendation:** Please add a permission check to this function to make sure not everyone can change `bridge` at will.
