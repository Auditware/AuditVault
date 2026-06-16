---
tags:
  - blockchain/evm
  - lang/solidity
  - sector/bridge
  - platform/pashov
  - severity/high
  - novelty/known-pattern
protocol: "[[LayerZero]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
---
[H-01]
Denial of Service Risk Due to Frozen
token_escrow
in
ONFT::Adapter
High
Fixed
[M-01]
Unchecked Math Operations Leading to Potential Arith-
metic Errors
Medium
Fixed
[M-02]
Unlimited Decimals of Local Token Mints Result in DoS
and Potential Overflow
Medium
Fixed
[M-03]
Missing Size Checks for compose_msg can Lead to Over-
sized Messages and Transaction Failures
Medium
Fixed
[L-01]
Require New Admin as Co-signer for Admin Setting in
transfer_admin instruction
Low
Fixed
[L-02]
Inconsistent
compose_msg
Function Implementation
May Lead to Silent Failures
Low
Fixed
[L-03]
Lackof Pause Functionalityfor Cross-ChainTokenTrans-
fers Could Lead to Security Risks
Low
Acknowledged
5

7. Findings
