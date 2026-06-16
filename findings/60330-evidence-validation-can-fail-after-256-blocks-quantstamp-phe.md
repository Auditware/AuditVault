---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/staking
protocol: "[[Pheasant Network]]"
auditors:
  - "[[Danny Aksenov]]"
report: "https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html"
genome:
  - "[[wrong-condition]]"
  - "[[temporary]]"
  - "[[frontrun-exposure]]"
---
# Evidence Validation Can Fail After 256 Blocks

- id: 60330
- impact: HIGH
- protocol: [[Pheasant Network]]
- reporter: Danny Aksenov (Quantstamp)
- source: https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html

## Summary


This bug report discusses an issue with the Pheasant Network protocol related to the "Dispute Against a Transaction More Than 256 Blocks Ago" section of the Roadmap. The problem is that the slash period lasts for 14 days, but the blockhash() function will only work for the last 256 blocks. This means that if the block hash is not uploaded within 51 minutes, the transaction will fail. The recommendation is to update the documentation to clearly state the 256 blocks limit for dispute submission and setting state variables.

## Details

**Update**
The risk associated with this issue should be clearly stated in the documentation risk section.

![Image 68: Alert icon](https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/static/media/info-icon-alert.3c9578483b1cf3181c9bfb6fec7dc641.svg)

**Update**
The client provided the following explanation:

> In the "Dispute Against a Transaction More Than 256 Blocks Ago" section of the Roadmap, we have addressed the issues related to the 256-block limitation and outlined how we plan to handle them. https://docs.pheasant.network/protocol/roadmap#dispute-against-a-transaction-more-than-256-blocks-ago

**Description:** The slash period lasts for `14` days, but `blockhash()` will not work beyond the last `256` blocks (which, at a rate of `12` seconds per block, equals `51` minutes). If the block hash has not been uploaded to the checkpoint manager within `51` minutes, the block hash will not exist, and the transaction will revert.

**Recommendation:** The documentation must clearly state that the `256` blocks period limit for dispute submission and all state variables must be set according to the `256` blocks limit.
