---
tags:
  - lang/solidity
  - sector/oracle
  - platform/mixbytes
  - has/github
  - severity/high
  - impact/mev/frontrun
protocol: "[[NUTS Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/NUTS%20Finance/Tapio/README.md#2-arbitrage-on-oracle-driven-price-updates"
genome:
  - "[[slippage]]"
  - "[[indirect-loss]]"
  - "[[frontrun]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
---
# Arbitrage on Oracle-Driven Price Updates

- id: 62661
- impact: HIGH
- protocol: [[NUTS Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/NUTS%20Finance/Tapio/README.md#2-arbitrage-on-oracle-driven-price-updates

## Summary


The report describes a problem with the `SelfPeggingAsset` contract, specifically with the `swap`, `mint`, and `redeem` functions. The issue is that the pool's price is highly sensitive to changes in external oracle exchange rates, allowing attackers to profit by swapping or minting before the rates change and redeeming once the rates shift in their favor. This can result in significant profits for the attackers with minimal slippage. The severity of the issue is considered high because it can consistently be exploited to extract value. The recommendation is to implement dynamic fees that increase temporarily when the pool becomes imbalanced, similar to the approach used by Curve's stableswap-ng design. This will mitigate the arbitrage opportunities caused by sudden oracle updates while keeping fees lower during normal market conditions.

## Details

##### Description
This issue has been identified within the `swap`, `mint`, and `redeem` operations of the `SelfPeggingAsset` contract. 

The pool’s effective price relies on external oracle exchange rates, causing it to instantly reflect any oracle-based updates. Attackers who can detect or anticipate these rate changes (e.g., via mempool monitoring or privileged oracle access) can profit by:

- **Swap before** the oracle change, then **swap again** after the change, or 
- **Mint before** the new rate is applied, then **redeem** once the oracle rate shifts in a favorable direction.

Because the amplification coefficient `A` can be large, the pool’s price is highly sensitive, allowing attackers to execute substantial swaps with minimal slippage. Attempting to compensate by raising fees poses a trade-off between competitiveness and effective front-run prevention. Even then, sudden high oracle-driven price changes (for instance, 0.5% or greater) can exceed those fees, making arbitrage profitable.

The issue is classified as **high** severity because high oracle-driven changes can be exploited to consistently extract value, particularly when large trading volumes incur minimal slippage.

##### Recommendation
We recommend implementing dynamic fees that temporarily increase when the pool becomes imbalanced, similar to the approach in Curve’s stableswap-ng design. This mitigates arbitrage opportunities caused by sudden oracle updates while keeping fees lower during normal market conditions. Once balances are stable again, fees can revert to a baseline level.
