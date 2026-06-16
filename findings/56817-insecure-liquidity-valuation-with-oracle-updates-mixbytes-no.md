---
tags:
  - sector/oracle
  - has/github
  - severity/high
  - lang/solidity
protocol: "[[XPress]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress/Liquidity%20Vault/README.md#1-insecure-liquidity-valuation-with-oracle-updates"
genome:
  - "[[oracle-manipulation-resistance]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/low-liquidity]]"
  - "[[trigger/price-manipulation]]"
---
# Insecure Liquidity Valuation with Oracle Updates

- id: 56817
- impact: HIGH
- protocol: XPress
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress/Liquidity%20Vault/README.md#1-insecure-liquidity-valuation-with-oracle-updates

## Summary


This bug report is about a problem found in the `addLiquidity` and `removeLiquidity` functions of the `LPManager` contract. The issue is that users can take advantage of sudden changes in prices to make a profit by supplying and removing liquidity in a single transaction. This is a critical problem because it can result in significant losses for the protocol. The recommended solution is to introduce a system of price epochs and update the minimum and maximum prices every time liquidity is added or removed. This will help prevent sudden price manipulations and protect the protocol from potential attacks.

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
