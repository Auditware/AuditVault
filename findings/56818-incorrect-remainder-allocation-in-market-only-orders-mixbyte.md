---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[XPress]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress/Liquidity%20Vault/README.md#2-incorrect-remainder-allocation-in-market-only-orders"
genome:
  - "[[fee-accounting]]"
  - "[[logic/fee-calculation]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# Incorrect Remainder Allocation in Market-Only Orders

- id: 56818
- impact: HIGH
- protocol: XPress
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress/Liquidity%20Vault/README.md#2-incorrect-remainder-allocation-in-market-only-orders

## Summary


The `_placeOrder` function in the `ProxyLOB` contract has a bug where orders are not being properly recorded in the `IOnchainTrie` when the `marketOnly` parameter is set to `true`. This causes the `remainShares` variable to be calculated incorrectly, resulting in non-existent shares being added to `lobReservesByTokenId` and throwing off the total balance of the protocol. To fix this, it is recommended to set `remainShares` to zero when `marketOnly` is `true` to accurately reflect the lack of remaining shares and maintain correct reserve accounting. This bug is classified as critical because it can lead to insolvency and potential losses for liquidity providers.

## Details

##### Description
This issue has been identified within the `_placeOrder` function of the `ProxyLOB` contract. 

When `marketOnly` is set to `true` the order is not included into `IOnchainTrie` within the `IOnchainLOB.placeOrder`, but the code still calculates `remainShares` as `quantity - executedShares`, instead of correctly setting it to zero. As a result, these non-existent leftover shares are added to `lobReservesByTokenId` and factored into `_getReserves`, ultimately inflating the protocol’s reported total balance. Since `_getReserves` then shows a value higher than what truly exists, this discrepancy can lead to insolvency of the protocol.

The issue is classified as **critical** severity because overstated reserves severely undermine the protocol’s financial stability, risking potential losses for liquidity providers.

##### Recommendation
We recommend setting `remainShares` to zero when `marketOnly` is `true`, ensuring no residual shares are mistakenly recorded. This accurately reflects that market orders have no remaining portion and preserves correct reserve accounting.

---
