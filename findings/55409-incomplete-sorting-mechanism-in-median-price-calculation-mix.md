---
tags:
  - severity/high
  - has/github
  - sector/oracle
  - lang/solidity
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Multi%20Scope/README.md#2-incomplete-sorting-mechanism-in-median-price-calculation"
genome:
  - "[[oracle-manipulation-resistance]]"
  - "[[oracle/price-manipulation]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[misassumption/oracle-is-reliable]]"
  - "[[blast-radius/protocol-wide]]"
---
# Incomplete Sorting Mechanism in Median Price Calculation

- id: 55409
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Multi%20Scope/README.md#2-incomplete-sorting-mechanism-in-median-price-calculation

## Summary


A bug has been found in the `getValue` function of the `DIAOracleV2Meta` contract. This function is used to retrieve median price values for a specific asset from registered oracles. However, the function does not correctly calculate the median due to a problem with sorting the data. This means that the function may not return the correct median value because the data is not organized properly. To fix this issue, a sorting mechanism should be introduced in the `getValue` function to ensure that the data is properly sorted before calculating the median. This will ensure that the function can reliably return the correct median value.

## Details

##### Description
A **High** severity issue has been uncovered in the `getValue` function of the `DIAOracleV2Meta` contract. The `getValue` function, which retrieves the median price values for a given asset from the registered oracles, fails to correctly calculate the median due to an incomplete sorting mechanism in its array handling.
The function correctly disregards any values older than the defined threshold but does not properly organize the array of valid values. As a result, it cannot reliably return the median value from the gathered price data as the array may not be sorted in ascending order.

##### Recommendation
We recommend introducing a sorting mechanism in the `getValue` function. Before calculating the median, the function should ensure that the gathered valid values are properly sorted in some order.
