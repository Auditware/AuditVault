---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - sector/stable
  - sector/staking
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
protocol: "[[CAP Labs Covered Agent Protocol]]"
auditors:
  - Benjamin Samuels
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf"
genome:
  - "[[oracle-freshness]]"
  - "[[stale-price]]"
  - "[[known-pattern]]"
  - "[[oracle-is-reliable]]"
  - "[[add-check]]"
---
# Incorrect oracle staleness period leads to price feed DoS

- id: 61525
- impact: HIGH
- protocol: CAP Labs Covered Agent Protocol
- reporter: Benjamin Samuels (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf

## Summary


The PriceOracle is experiencing a bug where it uses the same time period for all assets, even though different assets have different update frequencies. This causes problems when retrieving prices for some assets and can potentially deny access to certain functions. The bug can be fixed in the short term by modifying the contract to support different time periods for different assets. In the long term, automated tests should be implemented to ensure the configuration is accurate.

## Details

## Difficulty: High

## Type: Configuration

## Description
The PriceOracle uses a unique staleness period for all price feeds, despite different assets having varying update frequencies (heartbeats), causing denial of service in price retrieval functions for some assets. 

```solidity
/// @dev Initialize unchained
/// @param _staleness Staleness period in seconds for asset prices
function __PriceOracle_init_unchained(uint256 _staleness) internal onlyInitializing
{
    getPriceOracleStorage().staleness = _staleness;
}
```
*Figure 2.1: contracts/oracle/PriceOracle.sol#L21-L25*

The assets supposed to be used in the CAP Protocol (stablecoins, ETH, BTC) have different heartbeats:
- USDC/USD: 86400s
- USDT/USD: 86400s
- USDe/USD: 86400s
- DAI / USD: 3600s
- ETH/USD: 3600s
- BTC/USD: 3600s

Currently, the staleness check is unique and is set to one hour in the `DeployInfra._deployInfra` function:

```solidity
// init infra instances
AccessControl(d.accessControl).initialize(users.access_control_admin);
Lender(d.lender).initialize(d.accessControl, d.delegation, d.oracle, 1.33e27, 1 hours, 1 days, 0.1e27, 0.91e27);
Oracle(d.oracle).initialize(d.accessControl, 1 hours);
Delegation(d.delegation).initialize(d.accessControl, d.oracle, 1 days);
```
*Figure 2.1: contracts/deploy/service/DeployInfra.sol#L36-L40*

## Exploit Scenario
Functions that rely on the `Oracle.getPrice` function fail for assets that have update frequencies different from the configured staleness period. If the staleness period is set to accommodate frequently updated assets (e.g., those that are updated once per hour), the PriceOracle will reject valid prices from slower-updating assets (e.g., those that are updated every 24 hours). Conversely, if the staleness period is set for slower assets, the PriceOracle will accept potentially stale prices from frequently updating assets.

## Recommendations
- **Short term**: Modify the Oracle contract to support asset-specific staleness periods.
- **Long term**: Implement automated tests that verify oracle configuration against actual Chainlink price feed update frequencies.

## Reference
- Price Feed Contract Addresses
