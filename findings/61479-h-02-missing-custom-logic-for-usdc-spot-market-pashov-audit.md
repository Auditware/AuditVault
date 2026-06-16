---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/infra
  - sector/lending
  - sector/stable
protocol: "[[Blueberry]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Blueberry-security-review_2025-04-30.md"
genome:
  - "[[missing-check]]"
  - "[[wrong-state]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-02] Missing custom logic for USDC spot market

- id: 61479
- impact: HIGH
- protocol: Blueberry_2025-04-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Blueberry]]-security-review_2025-04-30.md

## Summary


The bug report discusses an issue with adding a supported asset using the addAsset() function. It states that when trying to fetch the USD value of the deposited asset through a precompile call using the getRate() function, there is no valid spot market for USDC. This is because all listed tokens are traded against USDC, making it the quote asset and already denominated in USD. The report recommends implementing a special case for USDC in the getRate() function to return a constant value of 1e18, representing a 1:1 USD value. 

## Details


## Severity

**Impact:** Medium

**Likelihood:** High

## Description

When adding a supported asset using addAsset(), the spotMarket ID must be provided. This market ID is later used in getRate() to fetch the USD value of the deposited asset through a precompile call. However, in the case of USDC, there is no valid spot market to get its price:

```
Universe: [
  {'tokens': [1, 0], 'name': 'PURR/USDC', 'index': 0, 'isCanonical': True},
  {'tokens': [2, 0], 'name': '@1', 'index': 1, 'isCanonical': False},
  {'tokens': [3, 0], 'name': '@2', 'index': 2, 'isCanonical': False}
]
```
All listed tokens are traded against USDC, implying that USDC is the quote asset. Therefore, it cannot have a valid market where its price is retrieved in USD, since it's already denominated in USD.

## Recommendations

Implement a special case in the getRate() function (or upstream during asset addition) to return a constant value of 1e18 for USDC, representing a 1:1 USD value. 
