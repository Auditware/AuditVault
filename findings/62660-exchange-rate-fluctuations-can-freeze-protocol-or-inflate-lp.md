---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/dex
  - sector/insurance
protocol: "[[NUTS Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/NUTS%20Finance/Tapio/README.md#1-exchange-rate-fluctuations-can-freeze-protocol-or-inflate-lp-total-supply"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[account-ownership]]"
  - "[[dos-resistance]]"
---
# Exchange Rate Fluctuations Can Freeze Protocol or Inflate LP Total Supply

- id: 62660
- impact: HIGH
- protocol: [[NUTS Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/NUTS%20Finance/Tapio/README.md#1-exchange-rate-fluctuations-can-freeze-protocol-or-inflate-lp-total-supply

## Summary


This bug report discusses an issue with the `collectFeeOrYield()` function in the `SelfPeggingAsset` contract. If the yield margin is low and there is enough liquidity in the pool, even a small decrease in the exchange rate of an underlying token can cause the `ImbalancedPool` error, locking the entire pool until the owner or administrator intervenes. This can lead to a denial-of-service and inflate the total supply of LP tokens, potentially causing pool insolvency. The recommended solution is to adjust the system so that downward price movements are accounted for by reducing the total supply of LP tokens, rather than relying solely on a high yield margin. This will distribute impermanent losses among LP holders and prevent unchecked growth of the LP supply.

## Details

##### Description
This issue has been identified within the `collectFeeOrYield()` logic of the `SelfPeggingAsset` contract.

If yield margin is low and pool has sufficient liquidity, then even a slight decrease in an underlying token’s exchange rate triggers the `ImbalancedPool` error during fee or yield collection, causing the invariant check to revert. Because yield collection occurs in every user-facing function (mint, swap, redeem, etc.), this effectively locks the entire pool until the owner or an administrator intervenes.

To prevent such freezes, one could set the existing yield margin parameter to a high value. However, if price fluctuations occur both up and down, simply using a margin to ignore smaller downward movements will allow total LP supply to inflate when prices fluctuate upward, while downward fluctuations remain unaccounted for. Over time, this mismatch between the total LP supply and actual locked liquidity `D` could diminish the real value of LP tokens or even risk pool insolvency.

This is classified as **high** severity because a downward price move can create a partial or complete denial-of-service, and ignoring repeated negative fluctuations inflates total LP supply without real backing.

##### Recommendation
We recommend adjusting the system so that negative fluctuations are accounted for by proportionally reducing `LPToken.totalSupply`, rather than relying solely on a high yield margin. This ensures impermanent losses caused by decreased exchange rate are distributed among LP holders and prevents LP supply from growing unchecked when both upward and downward price movements occur.
