---
tags:
  - lang/solidity
  - sector/governance
  - sector/oracle
  - platform/spearbit
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Buck Labs]]"
auditors:
  - "[[R0bert]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Strong-DAO-Spearbit-Security-Review-December-2025.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fee-accounting]]"
  - "[[oracle-freshness]]"
---
# ABI struct mismatch in band config

- id: 64664
- impact: HIGH
- protocol: [[Buck Labs]]: Smart Contracts
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Strong-DAO-Spearbit-Security-Review-December-2025.pdf

## Summary


This bug report is about a mismatch in the struct definition of `BandConfig` between two contracts, `LiquidityWindow` and `PolicyManager`. This causes `LiquidityWindow` to decode the wrong fields from `PolicyManager.getBandConfig`, leading to incorrect calculations for the reserve floor. This can result in refunds draining reserves more than intended, weakening reserve protection. The recommendation is to update `LiquidityWindow` to use the same `BandConfig` definition as `PolicyManager` or to add a dedicated getter for the floor. The bug has been fixed in the commit `5d79958` by removing the local `BandConfig` decode in `LiquidityWindow` and adding a dedicated floor getter in `PolicyManager`.

## Details

## Severity: High Risk

## Context
`LiquidityWindow.sol#L33-L41`

## Description
`LiquidityWindow` defines a `localIPolicyManager.BandConfig` struct that does not match the layout used by `PolicyManager`. This compiles because function selectors depend only on the function name and inputs, but the return value is ABI-decoded using the caller's struct layout. The result is that `LiquidityWindow` decodes the wrong fields from `PolicyManager.getBandConfig`.

In `LiquidityWindow` the interface is:
```solidity
struct BandConfig {
    uint16 mintFeeBps;
    uint16 refundFeeBps;
    uint16 halfSpreadBps;
    uint16 alphaBps;
    uint16 floorBps;
    uint16 dexBuyFeeBps;
    uint16 dexSellFeeBps;
}
```

In `PolicyManager` the actual struct is:
```solidity
struct BandConfig {
    uint16 halfSpreadBps;
    uint16 mintFeeBps;
    uint16 refundFeeBps;
    uint32 oracleStaleSeconds;
    uint16 deviationThresholdBps;
    uint16 alphaBps;
    uint16 floorBps;
    uint16 distributionSkimBps;
    CapSettings caps;
}
```

`LiquidityWindow.requestRefund` fetches the config and uses `floorBps` to compute the reserve floor:
```solidity
IPolicyManager.BandConfig memory bandConfig = 
    IPolicyManager(policyManager).getBandConfig(params.currentBand);
uint256 floor = _calculateFloor(bandConfig);
uint256 floorAmount18 = (totalSupply * config.floorBps) / BPS_DENOMINATOR;
```

Because `LiquidityWindow` expects `floorBps` as the fifth item, it decodes the fifth field of `PolicyManager.BandConfig`, which is `deviationThresholdBps`. With the default settings, `deviationThresholdBps` is 25/50/100 while `floorBps` is 100, so the computed floor is too small in Green and Yellow.

## Impact
Refunds can drain reserves down to `deviationThresholdBps` instead of the configured `floorBps`, reducing the intended liquidity floor and weakening reserve protection.

## Recommendation
Consider updating `LiquidityWindow` to use the exact same `BandConfig` definition as `PolicyManager`, ideally by importing a shared interface. If only the floor is needed, replace the struct return with a dedicated getter, for example:
```solidity
function getBandFloorBps(Band band) external view returns (uint16);
```

## Buck Labs
Fixed in commit `5d79958`.

## Spearbit
Fix verified. Commit `5d79958` fixes the ABI struct mismatch by removing the local `BandConfig` decode in `LiquidityWindow` and using a dedicated floor getter instead:
- `src/liquidity/LiquidityWindow.sol` now calls `getBandFloorBps` and passes the returned `uint16` into `_calculateFloor`, so it no longer decodes the wrong field from `PolicyManager.BandConfig`.
- `src/policy/PolicyManager.sol` adds `getBandFloorBps`, matching the recommendation for a dedicated getter.
