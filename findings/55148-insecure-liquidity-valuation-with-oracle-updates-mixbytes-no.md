---
tags:
  - sector/oracle
  - has/github
  - severity/high
  - lang/solidity
protocol: "[[Hanji]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/Hanji/Liquidity%20Vault/README.md#1-insecure-liquidity-valuation-with-oracle-updates"
genome:
  - "[[oracle-manipulation-resistance]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/low-liquidity]]"
  - "[[trigger/price-manipulation]]"
---
# Insecure Liquidity Valuation with Oracle Updates

- id: 55148
- impact: HIGH
- protocol: Hanji
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Hanji/Liquidity%20Vault/README.md#1-insecure-liquidity-valuation-with-oracle-updates

## Summary


This bug report discusses an issue with the `addLiquidity` and `removeLiquidity` functions in the `LPManager` contract. The problem arises because Pyth oracles can be updated by users in the same transaction, allowing them to exploit sudden price changes for profit. This is classified as a critical issue because it can cause significant losses to the protocol. The report recommends implementing a system of price epochs and updating the minimum and maximum prices at each liquidity action to mitigate this problem.

## Details

##### Description
This issue has been identified within the `addLiquidity` and `removeLiquidity` functions of the `LPManager` contract. 

Because Pyth oracles can be updated atomically by users in the same transaction, it is possible to supply liquidity at a low price and subsequently remove it at a higher price, all within a single transaction. This creates an arbitrage opportunity that can rapidly extract value from the protocol.

The issue is classified as **critical** severity because it allows attackers to exploit sudden price changes for profit, potentially causing substantial losses to the protocol.

##### Recommendation
We recommend introducing a system of price epochs with duration equals to `maxOracleAge` and updating the minimum/maximum tracked prices at each `addLiquidity`/`removeLiquidity`. Specifically:
- For `addLiquidity`, use the highest price from the last two epochs to calculate the minted shares.
- For `removeLiquidity`, use the lowest price from the last two epochs to calculate the amount of tokens to transfer.
- Update these historical price bounds every time liquidity is added or removed.

This approach helps mitigate abrupt, short-time price manipulations.
