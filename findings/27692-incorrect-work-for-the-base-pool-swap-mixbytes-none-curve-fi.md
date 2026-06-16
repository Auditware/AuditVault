---
tags:
  - lang/vyper
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Curve Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Curve%20Finance/StableSwapNG/README.md#3-incorrect-work-for-the-base_pool-swap"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[fot-slippage]]"
---
# Incorrect work for the base_pool swap

- id: 27692
- impact: HIGH
- protocol: [[Curve Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Curve%20Finance/StableSwapNG/README.md#3-incorrect-work-for-the-base_pool-swap

## Summary


This bug report is about an issue with Meta_pool, a feature in the CurveStableSwapMetaNG.vy protocol. When a user tries to swap tokens in the base_pool from the meta_pool, the `stored_balances` is incorrectly updated in the `_transfer_in` function. This causes the pool to become broken and transactions to always revert on the `exchange_received` call. To address this issue, the recommendation is to either remove the ability to swap base_pool tokens from meta_pool or correctly update the meta_pool storage in such cases.

## Details

##### Description
Meta_pool incorrectly updates `stored_balances` when a user tries to swap tokens in base_pool from the meta_pool. https://github.com/curvefi/stableswap-ng/blob/8c78731ed43c22e6bcdcb5d39b0a7d02f8cb0386/contracts/main/CurveStableSwapMetaNG.vy#L1087-L1089 In the case of swap base_pool tokens from meta_pool, `stored_balances` shouldn't be updated in `_transfer_in`. Because of this update, the pool will become broken and always revert on the `exchange_received` call.

##### Recommendation
We recommend removing the ability to swap base_pool tokens from meta_pool or correctly updating meta_pool storage in such cases.


***
