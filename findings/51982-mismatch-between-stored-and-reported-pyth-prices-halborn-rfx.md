---
tags:
  - lang/solidity
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - sector/oracle
protocol: "[[RFX]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/rfx-exchange/v21"
genome:
  - "[[decimal-mismatch]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[integer-bounds]]"
  - "[[pyth-oracle-completeness]]"
---
# Mismatch between stored and reported Pyth prices

- id: 51982
- impact: HIGH
- protocol: v2.1
- reporter: Halborn
- source: https://www.halborn.com/audits/rfx-exchange/v21

## Summary


Summary: 

The Pyth oracle is returning incorrect values for the price and exponent fields when the price of an asset falls below 1. This is due to the contract handling negative exponents incorrectly. The team at Relative Finance has solved this issue by updating the multiplier and handling negative exponents correctly. The issue has been resolved in the latest commit.

## Details

##### Description

When the price of a given asset falls below `1`, Pyth oracle returns a positive `price` field **BUT** a negative `expo`. However, the contract `PythDataStreamProvider` retrieves such a value from the `dataStore`' s storage, being type-casted as an `uint256`. That makes the contract handle the price wrongly as for an exponent of `-1`, it will treat the price as if it had an exponent of `1`, which is completely erroneous as it does not reflect the actual value of the given asset.

##### Proof of Concept

The bug is pretty visual:

<https://github.com/relative-finance/rfx-contracts/blob/feb04bf331c97a379556ed2eba30972415980034/contracts/oracle/PythDataStreamProvider.sol#L74>

```
        uint256 precision = _getDataStreamMultiplier(token);
        uint256 adjustedBidPrice = Precision.mulDiv(uint256(minPrice), precision, Precision.FLOAT_PRECISION);
        uint256 adjustedAskPrice = Precision.mulDiv(uint256(maxPrice), precision, Precision.FLOAT_PRECISION);
```

The function being called is defined as:

<https://github.com/relative-finance/rfx-contracts/blob/feb04bf331c97a379556ed2eba30972415980034/contracts/oracle/PythDataStreamProvider.sol#L87C1-L95C6>

```
    function _getDataStreamMultiplier(address token) internal view returns (uint256) {
        uint256 multiplier = dataStore.getUint(Keys.dataStreamMultiplierKey(token));

        if (multiplier == 0) {
            revert Errors.EmptyDataStreamMultiplier(token);
        }

        return multiplier;
    }
```

It can be seen that the possible values for such a multiplier are only positive or zero, and the final price is multiplied by it. That makes it impossible to handle negative exponents that would otherwise return less-than-one prices.

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:C/A:N/D:C/Y:N/R:N/S:C (10.0)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:C/A:N/D:C/Y:N/R:N/S:C)

##### Recommendation

It is recommended to handle prices with negative coefficients by upcasting or downcasting the prices depending on the value of such a coefficient before doing any calculations.

### Remediation Plan

**SOLVED:** The **Relative Finance team** solved this issue by updating the given `multiplier` depending on the value of the returned `expo` field from the Pyth price feed:

<https://github.com/relative-finance/rfx-contracts/blob/53b871efdaa63437c8397aa7bae4f3cdb6364ae5/contracts/oracle/PythDataStreamProvider.sol#L69C1-L87C117>

```
            report.maxPrice = (r1.maxPrice * (10 ** 18)) / r2.minPrice;
            report.minPrice = (r1.minPrice * (10 ** 18)) / r2.maxPrice;
            report.expo = r1.expo - r2.expo - 18;

            report.publishTime = r1.publishTime > r2.publishTime ? r1.publishTime : r2.publishTime;
        }

        if (report.minPrice <= 0 || report.maxPrice <= 0) {
            revert Errors.InvalidDataStreamPrices(token, int192(report.minPrice), int192(report.maxPrice));
        }

        uint256 precision = _getDataStreamMultiplier(token);
        if (report.expo < 0) {
            precision = precision / (10 ** uint32(-1 * report.expo));
        } else {
            precision = precision * (10 ** uint32(report.expo));
        }
        uint256 adjustedBidPrice = Precision.mulDiv(uint256(report.minPrice), precision, Precision.FLOAT_PRECISION);
        uint256 adjustedAskPrice = Precision.mulDiv(uint256(report.maxPrice), precision, Precision.FLOAT_PRECISION);
```

##### Remediation Hash

<https://github.com/relative-finance/rfx-contracts/commit/53b871efdaa63437c8397aa7bae4f3cdb6364ae5>
