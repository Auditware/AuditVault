---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[XPress]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress/Liquidity%20Vault/README.md#5-missing-price-factor-in-claimed-shares-calculation"
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

- id: 56821
- impact: HIGH
- protocol: XPress
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress/Liquidity%20Vault/README.md#5-missing-price-factor-in-claimed-shares-calculation

## Summary


This report discusses a bug in the `_claimOrder` function of the `ProxyLOB` contract. When a certain condition is met, the code does not correctly calculate the value of claimed shares, resulting in a higher-than-accurate reserves value. This bug is considered critical because it affects the reported balances of the protocol. To fix this, the suggested solution is to use a different calculation method.

## Details

##### Description
This issue has been identified within the `_claimOrder` function of the `ProxyLOB` contract. 

When `isAsk = false`, the current code subtracts `(totalClaimedShares + passiveFee) * scalingFactorTokenY` from the reserves without multiplying `totalClaimedShares` by `price`. Consequently, the actual value of the claimed shares is not correctly accounted for, resulting in a higher-than-accurate reserves value.

The issue is classified as **critical** severity because it leads to a miscalculation of the claimed token’s worth, which inflates the protocol’s reported balances.

##### Recommendation
We recommend using `(totalClaimedShares * price + passiveFee) * scalingFactorTokenY` for the subtraction. This ensures the claimed amount is converted into its proper value before being removed from the reserves.


***
