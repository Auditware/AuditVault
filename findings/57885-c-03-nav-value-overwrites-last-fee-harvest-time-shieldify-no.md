---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - platform/shieldify
  - sector/bridge
protocol: "[[Harmonixfinance Hyperliquid]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-Hyperliquid-Security-Review.md"
genome:
  - "[[upgrade-safety]]"
  - "[[fee-accounting]]"
  - "[[logic/state-update]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# [C-03] NAV Value Overwrites Last Fee Harvest Time

- id: 57885
- impact: HIGH
- protocol: Harmonixfinance Hyperliquid
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-Hyperliquid-Security-Review.md

## Summary



The `VaultStore` library has a bug that affects the protocol's revenue. This is because the library defines a critical storage key incorrectly, causing a function to always revert. The bug is located in the `lib/VaultStore.sol` file and can be fixed by changing the storage key to use the correct identifier. The team has responded that the bug has been fixed.

## Details

## Severity

Critical Risk

## Description

The `VaultStore` library defines a critical storage key incorrectly:

```solidity
bytes32 public constant LAST_HARVEST_PERFORMANCE_FEE_TIME = keccak256(abi.encode("NAV"));
```

Instead of using a unique identifier for the last performance fee harvest time, it reuses the same key as NAV.

When `setVaultState()` is called (e.g., in `_updateVaultState()`), it stores the NAV value in `LAST_HARVEST_PERFORMANCE_FEE_TIME`. Consequently, `getLastHarvestPerformanceFeeTime()` returns the NAV value instead of the expected timestamp.

This causes `harvestPerformanceFee()` to always revert because:

```solidity
require(block.timestamp >= lastHarvest + minHarvestInterval, "HARVEST_TOO_SOON");
```

Since `lastHarvest` is set to a large NAV value, the condition will never pass.

## Location of Affected Code

File: [lib/VaultStore.sol](https://github.com/harmonixfi/core-contracts/blob/f02157aba919dcdd4a1133669361224108c5caef/contracts/lib/VaultStore.sol)

```solidity
// @audit this would return NAV value instead of LAST_HARVEST_PERFORMANCE_FEE_TIME value
bytes32 public constant LAST_HARVEST_PERFORMANCE_FEE_TIME = keccak256(abi.encode("NAV"));
```

```solidity
function setVaultState(
    FundStorage fundStorage,
    bytes32 key,
    VaultState memory vaultState
) internal {
    fundStorage.setUint256(
        keccak256(abi.encode(key, PRICE_PER_SHARE)),
        vaultState.pricePerShare
    );
    fundStorage.setUint256(
        keccak256(abi.encode(key, WITHDRAW_POOL_AMOUNT)),
        vaultState.withdrawPoolAmount
    );
    fundStorage.setUint256(
        keccak256(abi.encode(key, LAST_HARVEST_MANAGEMENT_FEE_TIME)),
        vaultState.lastHarvestManagementFeeTime
    );
    fundStorage.setUint256(
        keccak256(abi.encode(key, LAST_HARVEST_PERFORMANCE_FEE_TIME)),
        vaultState.lastHarvestPerformanceFeeTime
    );
    fundStorage.setUint256(keccak256(abi.encode(key, NAV)), vaultState.nav);
}
```

## Impact

Performance fees cannot be collected, leading to lost protocol revenue.

## Recommendation

Fix the storage key to use the correct identifier:

```solidity
bytes32 public constant LAST_HARVEST_PERFORMANCE_FEE_TIME = keccak256(abi.encode("LAST_HARVEST_PERFORMANCE_FEE_TIME"));
```

## Team Response

Fixed.
