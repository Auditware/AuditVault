---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/lending
  - sector/stable
  - sector/staking
  - sector/vault
  - sector/yield-aggregator
protocol: "[[Yearn Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Yearn%20Finance/Maker%20Dai%20Delegate/README.md#2-strategy-migration-reverts-after-maker-liquidation"
genome:
  - "[[liquidation-logic]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[vote-delegation-loop]]"
---
# Strategy migration reverts after Maker liquidation

- id: 28314
- impact: HIGH
- protocol: [[Yearn Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Yearn%20Finance/Maker%20Dai%20Delegate/README.md#2-strategy-migration-reverts-after-maker-liquidation

## Summary


This bug report is about the unlikely situation when a Maker collateral is liquidated. This would result in all operations with the collateral being reversed, including the migration to a new strategy. The Maker contract doesn't provide any functionality for getting the collateral's owner by cdpId to check if the liquidation has happened. To prevent this, developers should use the try/catch functionality in Solidity (0.6 and higher) and check the security modifier error.

## Details

##### Description
Unlikely, but possible situation when `Maker` collateral will be liquidated. In this case all operations with collateral will be reverted because the owner would be changed. After the liquidation you can't migrate to a new strategy because `prepareMigration` will be reverted for the above reasons.

https://github.com/therealmonoloco/maker-dai-delegate/blob/97949a51062df956fd0172b7b1c778f66844b634/contracts/Strategy.sol#L450

##### Recommendation
The `Maker`'s contract does not provide any functionality for getting the collateral's owner by cdpId (for checking that the liquidation didn't happen). That's why you have to cautch all exceptions of transferCdp call by using try/catch functionality in Solidity (0.6 and higher) and check the security modifier error.
