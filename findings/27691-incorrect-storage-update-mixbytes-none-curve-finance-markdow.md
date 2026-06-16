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
report: "https://github.com/mixbytes/audits_public/blob/master/Curve%20Finance/StableSwapNG/README.md#2-incorrect-storage-update"
genome:
  - "[[fee-calculation]]"
  - "[[permanent]]"
  - "[[fot-slippage]]"
---
# Incorrect storage update

- id: 27691
- impact: HIGH
- protocol: [[Curve Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Curve%20Finance/StableSwapNG/README.md#2-incorrect-storage-update

## Summary


A bug has been identified in the code for the meta_pool on CurveStableSwapMetaNG.vy, which affects the stored_balances of meta_coin. Currently, the stored_balances is increased by dx_w_fee for meta_coin, but this is incorrect. The actual increase in meta_coin balance should be less than dx_w_fee due to possible fees on liquidity addition, so the dx_w_fee that is returned from the _meta_add_liquidity should be used instead. If this bug is not fixed, the current implementation of the meta_pool will become broken after one call of the exchange_underlying() function, as exchange_received will not work after this. The recommended solution is to update the storage value with the correct value.

## Details

##### Description
`stored_balances` is increased by `dx_w_fee` for meta_coin in meta_pool here https://github.com/curvefi/stableswap-ng/blob/8c78731ed43c22e6bcdcb5d39b0a7d02f8cb0386/contracts/main/CurveStableSwapMetaNG.vy#L1065 but actually it should be increased by `dx_w_fee` that returned from the `_meta_add_liquidity` because the actual increase in meta_coin balance will be less than `dx_w_fee` from `_transfer_in` due to possible fees on liquidity addition. This finding is classified as HIGH because the current implementation of the meta_pool will become broken after one call of the exchange_underlying() function (exchange_received will not work after this).

##### Recommendation
We recommend updating the storage value with the correct value.


***
