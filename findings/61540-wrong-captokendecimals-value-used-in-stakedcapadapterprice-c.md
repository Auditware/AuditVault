---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/oracle
  - sector/staking
  - platform/trailofbits
protocol: "[[CAP Labs Covered Agent Protocol]]"
auditors:
  - Benjamin Samuels
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf"
genome:
  - "[[token-decimal-normalization]]"
  - "[[arithmetic/decimal-mismatch]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/protocol-wide]]"
---
# Wrong capTokenDecimals value used in StakedCapAdapter.price causes inaccurate prices

- id: 61540
- impact: HIGH
- protocol: CAP Labs Covered Agent Protocol
- reporter: Benjamin Samuels (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf

## Summary


The StakedCapAdapter library has decimal handling errors that cause incorrect price calculations. This is because the price calculation logic uses the decimal count instead of the scaling factor in two places, resulting in prices being calculated incorrectly by several orders of magnitude. This can be exploited by malicious actors who can take advantage of the price disparity. To fix this, the decimal handling should be corrected by using the proper scaling factors instead of the decimal count. In the long term, comprehensive unit tests should be implemented to catch potential errors and validate calculated prices against expected ranges.

## Details

## Diﬃculty: High

## Type: Data Validation

### Description
The StakedCapAdapter library contains critical decimal handling errors that will cause wildly inaccurate price calculations. The price calculation logic incorrectly uses the decimal count itself (e.g., 18) rather than the corresponding scaling factor (10^18) in two places, causing prices to be calculated incorrectly by several orders of magnitude.

```solidity
function price(address _asset) external view returns (uint256 latestAnswer, uint256 lastUpdated) {
    address capToken = IERC4626(_asset).asset();
    (latestAnswer, lastUpdated) = IOracle(msg.sender).getPrice(capToken);
    uint256 capTokenDecimals = IERC20Metadata(capToken).decimals();
    uint256 pricePerFullShare = IERC4626(_asset).convertToAssets(capTokenDecimals);
    latestAnswer = latestAnswer * pricePerFullShare / capTokenDecimals;
}
```

*Figure 17.1: contracts/oracle/libraries/StakedCapAdapter.sol#L15-L21*

First, it incorrectly passes the decimal count (e.g., 18) to the `convertToAssets` function instead of passing a proper share amount (e.g., 10^18). The `convertToAssets` function expects a share amount, not a decimal count. Second, it divides by the decimal count itself (e.g., 18) rather than the decimal scaling factor (10^18), which would dramatically inflate the resulting price.

### Exploit Scenario
A malicious actor observes that the StakedCapAdapter is reporting inaccurate prices for staked CAP tokens. They exploit this by executing trades that take advantage of the price disparity.

### Recommendations
- **Short term:** Correct the decimal handling by using the proper scaling factors instead of the decimal counts.
- **Long term:** Implement comprehensive unit tests specifically for price oracles with edge cases around decimal handling, and add validation that compares calculated prices against expected ranges to catch potential errors.
