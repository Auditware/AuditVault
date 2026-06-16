---
tags:
  - lang/rust
  - has/github
  - platform/zokyo
  - severity/high
  - sector/nft
protocol: "[[Basilisk]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-09-08-Basilisk.md"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[access-roles]]"
---
# Extrinsic with multiple storage mutations isn’t annotated with #[transactional]

- id: 56142
- impact: HIGH
- protocol: [[Basilisk]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-09-08-Basilisk.md

## Summary


This bug report describes an issue that occurs in two parts of the Basilisk-node software, specifically in the "duster" and "nft" modules. The problem is related to storage corruption and is caused by not using a specific code structure called #[transactional]. The report recommends using this code structure for any extrinsic (a type of function) that makes more than one change to the storage.

## Details

**Occurs**:

Basilisk-node/pallets/duster/src/lib.rs:197
Basilisk-node/pallets/nft/src/lib.rs:84,107
Not using #[transactional] can lead to storage corruption.


**Recommendation**:

Use #[transactional] for every extrinsic with more than one storage mutation.
