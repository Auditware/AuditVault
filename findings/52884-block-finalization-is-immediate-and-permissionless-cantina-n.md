---
tags:
  - severity/high
  - lang/rust
  - sector/staking
  - platform/cantina
protocol: "[[Layer N]]"
auditors:
  - Mario Poneder
report: "https://cdn.cantina.xyz/reports/cantina_n1_march2025.pdf"
genome:
  - "[[bridge-dispute-frontrun]]"
  - "[[initializer-auth]]"
  - "[[access-control/missing-auth]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[privileged-tx]]"
  - "[[add-access-control]]"
  - "[[precondition/insider]]"
  - "[[blast-radius/protocol-wide]]"
---
# Block ﬁnalization is immediate and permissionless 

- id: 52884
- impact: HIGH
- protocol: Layer N
- reporter: Mario Poneder (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_n1_march2025.pdf

## Summary


This bug report discusses an issue with the finalization of blocks in a specific context. This issue allows a malicious operator to propose a block with a manipulated withdrawal root, which can then be immediately finalized. This means that a malicious withdrawal can be performed right after the block is proposed. To address this issue, it is recommended to introduce a challenge and validity-proof mechanism that allows validators to challenge a block and prove its validity before it can be finalized. This bug has been fixed in a specific commit, and for the testnet deployment, the operator is trusted but a minimum delay before finalization will be introduced by the team.

## Details

## Block Finalization Security Issue

## Context
`finalize_block.rs#L4-L37`

## Description
Once a block is proposed by the operator, which might be malicious (e.g., containing a specifically crafted withdrawal root), anyone can immediately invoke the `finalize_block` instruction to finalize it. Consequently, a malicious withdrawal can be performed immediately after proposing such a block.

## Recommendation
It is recommended to introduce a challenge as well as a validity-proof mechanism that allows validators to challenge a block and prove its validity before it can be finalized.

## Layer N
Fixed in commit `d74b33e9`.

## Cantina Managed
Fix verified. For the testnet deployment, the operator is trusted, but the team will introduce a minimum delay before finalization.
