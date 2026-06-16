---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/lending
  - sector/options
  - sector/stable
  - sector/staking
  - sector/vault
  - sector/yield-aggregator
protocol: "[[Yearn Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Yearn%20Finance/Maker%20Dai%20Delegate/README.md#1-improper-handling-of-losses-in-yearn-dai-vault"
genome:
  - "[[liquidation-logic]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
  - "[[vote-delegation-loop]]"
---
# Improper handling of losses in Yearn DAI vault

- id: 28313
- impact: HIGH
- protocol: [[Yearn Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Yearn%20Finance/Maker%20Dai%20Delegate/README.md#1-improper-handling-of-losses-in-yearn-dai-vault

## Summary


This bug report is about a strategy that uses another Yearn vault to invest DAI to take profit from it. In some rare conditions, that vault can suffer losses, which are not properly handled. This can lead to unfair losses for some users, overreporting losses, and a lack of profits for newcoming investors. It is recommended to implement a manual function to fix losses at the DAI yVault. This would involve reporting losses to the parent vault and rebalancing debt/collaterial at the Maker vault to make DAI debt equal to the DAI balance available to the strategy. In some cases, a flash-borrow of WANT tokens from "the fixer" may be required to proceed with the rebalance during a liquidity shortage.

## Details

##### Description
The strategy is using another Yearn vault to invest DAI to take profit from it. In some rare conditions, that vault can suffer losses. Such conditions are not properly handled.

1. At the [prepareReturn](https://github.com/therealmonoloco/maker-dai-delegate/blob/97949a51062df956fd0172b7b1c778f66844b634/contracts/Strategy.sol#L303) the strategy is not reporting losses from `DAI yVault` until it is completely unable to conceal. As a result, losses are not fairly distributed between vault users. Some users may suffer unfair penalty on withdraw.
2. At the [liquidatePosition](https://github.com/therealmonoloco/maker-dai-delegate/blob/97949a51062df956fd0172b7b1c778f66844b634/contracts/Strategy.sol#L407) in some conditions, the strategy can overreport losses while it still has enought assets to complete the liquidation request by rebalancing `DAI` debt/collaterial at the `Maker vault`.
3. The losses in `DAI yVault` are never fixed, so even newcoming investors will not be able to take a profit until recent losses are compensated. On large losses it can take years to recover.
##### Recommendation
It is recommended to implement manual function to fix losses at `DAI yVault`:
1. To report losses to the parent vault
2. To rebalance debt/collaterial at Maker vault to make DAI debt equals to DAI balance available to the strategy

In some rare conditions, the option to flash-borrow WANT tokens from "the fixer" can be required to proceed rebalance during a liquidity shortage.
