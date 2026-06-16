---
tags:
  - lang/solidity
  - lang/vyper
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/cdp
  - sector/oracle
protocol: "[[DeFi Money]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/DeFi%20Money/Core/README.md#1-incorrect-last_tvl-state-after-price-pair-removal"
genome:
  - "[[precision-loss]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[oracle-freshness]]"
---
# Incorrect `last_tvl` state after price pair removal

- id: 33555
- impact: HIGH
- protocol: [[DeFi Money]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DeFi%20Money/Core/README.md#1-incorrect-last_tvl-state-after-price-pair-removal

## Summary


The bug report states that there is an issue with the `AggregateStablePrice` contract, specifically in the `remove_price_pair()` function. This function does not remove the corresponding entry in the `last_tvl` array, which can cause incorrect TVL calculations and price aggregations. The recommendation is to adjust the function to remove the entry in the `last_tvl` array when a price pair is removed.

## Details

##### Description
- https://github.com/defidotmoney/dfm-core/blob/0bde9fb784400d73f434d585aab7d9dd0ad1c679/contracts/cdp/oracles/AggregateStablePrice.vy#L90-L100

The `AggregateStablePrice` contract doesn't remove the corresponding entry in the `last_tvl` array during `remove_price_pair()` call.

This may result in inaccurate TVL calculations and incorrect price aggregations.

##### Recommendation
We recommend adjusting the `remove_price_pair()` function to remove the corresponding entry in the `last_tvl` array when a price pair is removed.
