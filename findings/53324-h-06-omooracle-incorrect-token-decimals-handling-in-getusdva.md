---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[token-decimal-normalization]]"
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# [H-06] OmoOracle incorrect token decimals handling in `getUSDValue` and `convertUSDToToken`

- id: 53324
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


This bug report discusses a problem with the `getUSDValue()` function in the OmoOracle contract. This function does not take into account the decimals of different tokens when converting amounts, which can result in incorrect calculations. The recommended solution is to adjust for the decimals of each token involved in the conversion.

## Details

## **Severity**

**Impact:** High

**Likelihood:** Medium

## **Description**

The `getUSDValue()` function in the OmoOracle contract does not consider token decimals when converting amounts. It assumes all tokens have the same number of decimals (1e18), which can lead to incorrect conversions and amounts calculations. The function uses the following approach:

```solidity
    function getUSDValue(address token, uint256 amount) public view returns (uint256) {
        --snip--
        uint8 decimals = priceFeed.decimals();
        uint256 normalizedPrice = uint256(price) * 1e18 / 10**decimals;

        return (amount * normalizedPrice) / 1e18;
    }
```

## Recommendations

The correct way to handle asset amount conversions, considering their decimals, is to adjust for the respective decimals of each token involved in the conversion. The formula should look like this:

```
amountUSD = (amountToken * priceTokenToUSD * decimalsUSD) / (decimalsToken * 1e18);
```
