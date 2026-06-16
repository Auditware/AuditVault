---
tags:
  - lang/solidity
  - sector/bridge
  - platform/auditone
  - has/github
  - severity/high
  - trigger/reorg
protocol: "[[Aurorafastbridge]]"
auditors:
  - "[[AuditOne]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-05-09-Aurorafastbridge.md"
genome:
  - "[[replay]]"
  - "[[reorg]]"
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
  - "[[cross-contract-state-consistency]]"
  - "[[commitment-uniqueness]]"
---
# Block Reorg Can Allow For Double Spending

- id: 21063
- impact: HIGH
- protocol: [[Aurorafastbridge]]
- reporter: AuditOne
- source: https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-05-09-Aurorafastbridge.md

## Summary


Block reorg is a situation where a competing chain replaces the main blockchain. This can occur when multiple miners find valid blocks at the same time, and the network has to decide which block to include in the blockchain. In order to reduce the risk of block reorgs, the Fast Bridge project may need to take additional precautions, such as waiting for multiple confirmations before processing token transfers or implementing a fallback mechanism in case of a block reorg.

## Details

**Description**: 

Block reorg, also known as blockchain reorganization, is a situation where a competing chain replaces the main blockchain. This can happen when multiple miners find valid blocks at the same time, and the network has to decide which block to include in the blockchain. In some cases, the network may choose to include a block that is not in the main blockchain, resulting in a reorganization of the chain.

**Recommendations:**

To mitigate the risk of block reorgs, the Fast Bridge project may need to implement additional measures, such as waiting for multiple confirmations before proceeding with token transfers or implementing a fallback mechanism in case of a block reorg.
