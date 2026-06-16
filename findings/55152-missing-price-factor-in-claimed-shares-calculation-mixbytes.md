---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[Hanji]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/Hanji/Liquidity%20Vault/README.md#5-missing-price-factor-in-claimed-shares-calculation"
genome:
  - "[[fee-accounting]]"
  - "[[arithmetic/precision-loss]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# Missing Price Factor in Claimed Shares Calculation

- id: 55152
- impact: HIGH
- protocol: Hanji
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Hanji/Liquidity%20Vault/README.md#5-missing-price-factor-in-claimed-shares-calculation

## Summary


This bug report is about a problem in the `_claimOrder` function of the `ProxyLOB` contract. When `isAsk` is false, the code does not correctly calculate the value of claimed shares, leading to a higher-than-accurate reserves value. This is a critical issue as it affects the reported balances of the protocol. The recommended solution is to use a different calculation that takes into account the proper value of the claimed amount.

## Details

##### Description
This issue has been identified within the `_claimOrder` function of the `ProxyLOB` contract. 

When `isAsk = false`, the current code subtracts `(totalClaimedShares + passiveFee) * scalingFactorTokenY` from the reserves without multiplying `totalClaimedShares` by `price`. Consequently, the actual value of the claimed shares is not correctly accounted for, resulting in a higher-than-accurate reserves value.

The issue is classified as **critical** severity because it leads to a miscalculation of the claimed token’s worth, which inflates the protocol’s reported balances.

##### Recommendation
We recommend using `(totalClaimedShares * price + passiveFee) * scalingFactorTokenY` for the subtraction. This ensures the claimed amount is converted into its proper value before being removed from the reserves.


***
