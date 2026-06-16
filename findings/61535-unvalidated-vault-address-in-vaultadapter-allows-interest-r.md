---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/oracle
  - sector/lending
  - platform/trailofbits
protocol: "[[CAP Labs Covered Agent Protocol]]"
auditors:
  - Benjamin Samuels
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf"
genome:
  - "[[oracle-manipulation-resistance]]"
  - "[[extcall-return-validation]]"
  - "[[oracle/price-manipulation]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/privileged-caller]]"
  - "[[misassumption/external-call-is-safe]]"
  - "[[blast-radius/protocol-wide]]"
---
# Unvalidated _vault address in VaultAdapter allows interest rate manipulation

- id: 61535
- impact: HIGH
- protocol: CAP Labs Covered Agent Protocol
- reporter: Benjamin Samuels (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf

## Summary


This report describes a bug in the `VaultAdapter.rate` function, which accepts an unvalidated address and makes external calls to it without verifying its legitimacy. This can be exploited by an attacker who supplies a malicious contract as the address, allowing them to manipulate critical storage values that determine interest rates. This can cause borrowers to pay excessive interest. To fix this issue, it is recommended to implement access control or an allowlist mechanism in the short term, and add comprehensive input validation in the long term.

## Details

## Diﬃculty: Medium

## Type: Data Validation

## Description
The `VaultAdapter.rate` function accepts an unvalidated `_vault` address and makes external calls to it without verifying that it is a legitimate vault. An attacker can supply a malicious contract as the vault address, which would allow manipulation of critical storage values (`$.utilizationData[_asset].index`, `$.utilizationData[_asset].lastUpdate`, and `$.utilizationData[_asset].utilizationMultiplier`) that determine interest rates throughout the protocol, as shown in Figure 12.1.

```solidity
function rate(address _vault, address _asset) external returns (uint256 latestAnswer) {
    VaultAdapterStorage storage $ = getVaultAdapterStorage();
    uint256 elapsed;
    uint256 utilization;
    if (block.timestamp > $.utilizationData[_asset].lastUpdate) {
        uint256 index = IVault(_vault).currentUtilizationIndex(_asset);
        elapsed = block.timestamp - $.utilizationData[_asset].lastUpdate;
        /// Use average utilization except on the first rate update
        if (elapsed != block.timestamp) {
            utilization = (index - $.utilizationData[_asset].index) / elapsed;
        } else {
            utilization = IVault(_vault).utilization(_asset);
        }
        $.utilizationData[_asset].index = index;
        $.utilizationData[_asset].lastUpdate = block.timestamp;
    } else {
        utilization = IVault(_vault).utilization(_asset);
    }
    latestAnswer = _applySlopes(_asset, utilization, elapsed);
}
```

**Figure 12.1:** `contracts/oracle/libraries/VaultAdapter.sol#L26-L49`

## Exploit Scenario
An attacker deploys a malicious contract implementing the `IVault` interface. They call the `VaultAdapter.rate` function with their malicious contract as the `_vault` parameter, which returns crafted values from the `currentUtilizationIndex` and `utilization` methods. This manipulates storage values in `VaultAdapter`, artificially inflating interest rates returned by `_applySlopes`. The inflated rates propagate through `RateOracle.utilizationRate` to `InterestDebtToken.nextInterestRate`, causing borrowers to pay excessive interest.

## Recommendations
- **Short term:** Implement access control on the `rate` function or add an allowlist mechanism to validate vault addresses before making external calls to them.
- **Long term:** Add comprehensive input validation throughout the codebase to prevent similar issues in other functions.
