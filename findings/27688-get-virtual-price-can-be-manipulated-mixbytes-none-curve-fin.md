---
tags:
  - lang/vyper
  - sector/dex
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/oracle/spot-price
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
  - fix/use-twap
protocol: "[[Curve Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Curve%20Finance/StableSwapNG/README.md#2-get_virtual_price-can-be-manipulated"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[oracle-manipulation-resistance]]"
---
# `get_virtual_price()` can be manipulated

- id: 27688
- impact: HIGH
- protocol: [[Curve Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Curve%20Finance/StableSwapNG/README.md#2-get_virtual_price-can-be-manipulated

## Summary


A bug has been identified in the code for the `get_virtual_price()` function used in the CurveStableSwapNG and CurveStableSwapMetaNG contracts. This bug allows hackers to manipulate the virtual price of the pool by directly transferring tokens to it. This can be done by first transferring tokens to a base_pool, then using the `remove_liquidity_one_coin()` function in the meta_pool to increase the virtual_price of the base_pool LP token. Finally, the hacker can call `exchange_received` in the base_pool to return the funds they deposited. As many protocols rely on the virtual_price of the pool, this bug is classified as critical.

To address the issue, we recommend updating the design of the exchange_received() and _balances() functions so that they work with donations correctly.

## Details

##### Description
`get_virtual_price()` can be manipulated by directly transferring tokens to the pools. The thing is that directly transferred tokens can be skimmed via the `exchange_received()` function:
https://github.com/curvefi/stableswap-ng/blob/8c78731ed43c22e6bcdcb5d39b0a7d02f8cb0386/contracts/main/CurveStableSwapNG.vy#L1629
https://github.com/curvefi/stableswap-ng/blob/8c78731ed43c22e6bcdcb5d39b0a7d02f8cb0386/contracts/main/CurveStableSwapMetaNG.vy#L1610
One example of an attack that can make a profit for a hacker is:
1. Directly transfer one of the tokens to a base_pool that was added to a meta_pool.
2. `get_virtual_price()` increases, because D increases and total_supply remains the same.
3. The hacker can call `remove_liquidity_one_coin()` in meta_pool. Due to the increased virtual_price of the base_pool LP token, it will cost a lot less to remove coin[0] from meta_pool.
4. After this, the hacker can call `exchange_received` in the base_pool and return the deposited in (1) funds.
The test scenario was sent to the client during the audit.
This finding is classified as critical because many protocols rely on the virtual_price of the pool (even Curve relies on it), and manipulation of the virtual_price is very dangerous.

##### Recommendation
We recommend updating the design of the exchange_received() and _balances() functions so that they work with donations correctly.


***
