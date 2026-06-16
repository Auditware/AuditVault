---
tags:
  - lang/solidity
  - platform/trust-security
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Mozaic]]"
auditors:
  - "[[Trust Security]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Trust Security/2023-05-23-Mozaic Archimedes.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[bridge-message-validation]]"
  - "[[cross-contract-state-consistency]]"
---
# TRST-H-3 All LayerZero requests will fail, making the contracts are unfunctional

- id: 18996
- impact: HIGH
- protocol: [[Mozaic]] Archimedes
- reporter: Trust Security
- source: https://github.com/solodit/solodit_content/blob/main/reports/Trust Security/2023-05-23-Mozaic Archimedes.md

## Summary


This bug report is about the LayerZero architecture not accounting for native tokens when sending messages. This caused the contracts to be completely non-functional. The recommended mitigation was to pass value in each of the functions and perform more meticulous testing. The team response was that the bug was fixed, and the mitigation review was that the Controller and Vault now pass appropriate value in native tokens for messaging, and the contracts can be topped-up with the `receive()` method.

## Details

**Description:**
When sending messages using the LayerZero architecture, native tokens must be supplied to 
cover the cost of delivering the message at the receiving chain. However, none of the Mozaic 
contracts account for it. The controller calls the bridge's `requestSnapshot()`, `requestSettle()`, 
`requestExecute()` without passing value. Vault calls `reportSnapshot()`, `reportSettle()` similarly. 
StargatePlugin calls the StargateRouter's swap() which also requires value. As a result, the 
contracts are completely unfunctional.

**Recommended Mitigation:**
Pass value in each of the functions above. Perform more meticulous testing with LayerZero 
endpoints. Contracts should support receiving base tokens with the `receive()` fallback, to pay 
for fees.

**Team response:**
Fixed

**Mitigation Review:**
The Controller and Vault now pass appropriate value in native tokens for messaging. The 
contracts can be topped-up with the `receive()` method.
