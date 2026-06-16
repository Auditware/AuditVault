---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/lending
protocol: "[[HypurrFi]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/HypurrFi-security-review_2025-02-12.md"
genome:
  - "[[proxy-initialization]]"
  - "[[access-control/proxy-storage-collision]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-03] Incorrect proxy address tracking misconfigures USDXL pool tokens

- id: 55467
- impact: HIGH
- protocol: HypurrFi_2025-02-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/HypurrFi-security-review_2025-02-12.md

## Summary


This report is about a bug that affects the `DeployUsdxlUtils` contract. The bug causes two functions, `_getUsdxlATokenProxy()` and `_getUsdxlVariableDebtTokenProxy()`, to return the wrong contract addresses. This leads to four main issues, including incorrect contract exports, token configurations, and facilitator configurations. To fix this, the recommendation is to track and use the actual proxy addresses instead of the implementation addresses. This can be done by updating the getter functions and treasury configuration to use the proxy addresses. 

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `DeployUsdxlUtils._getUsdxlATokenProxy()` and `DeployUsdxlUtils._getUsdxlVariableDebtTokenProxy()` functions incorrectly return implementation contract addresses instead of proxy addresses.

```solidity
//File: src/deployments/utils/DeployUsdxlUtils.sol

function _getUsdxlATokenProxy() internal view returns (address) {
    return address(usdxlAToken);    // Returns implementation instead of proxy
}

function _getUsdxlVariableDebtTokenProxy() internal view returns (address) {
    return address(usdxlVariableDebtToken); // Returns implementation instead of proxy
}
```

This causes four main issues:

1. Incorrect contract exports in deployment artifacts in the `_initializeUsdxlReserve()` function.
2. Incorrect token configurations in the `_setUsdxlAddresses()` function, leaving the USDXL pool's `AToken` and `VariableDebtToken` unconfigured.
3. Incorrect facilitator configurations for the USDXL token in the `_addUsdxlATokenAsEntity()` function.
4. Incorrect discount token and strategy configurations in the `_setDiscountTokenAndStrategy()` function.

## Recommendation

Track the actual proxy addresses that are configured in the USDXL pool instead of using implementation addresses. This ensures that token configurations are applied to the correct contract instances that the pool interacts with.

To implement this:

1. Get and track proxy addresses from pool's reserve data after pool initialization:

```diff
function _initializeUsdxlReserve(
    address token,
    IDeployConfigTypes.HypurrDeployRegistry memory deployRegistry
)
    internal
{
    --- SNIPPED 
---
    // set reserves configs
    _getPoolConfigurator(deployRegistry).initReserves(inputs);

+   IPoolAddressesProvider poolAddressesProvider = _getPoolAddressesProvider(deployRegistry);
    //@audit DataTypes should be additional imported
+   DataTypes.ReserveData memory reserveData = IPool(poolAddressesProvider.getPool()).getReserveData(token);

    //@audit Introduce new two state variables to track proxy addresses
+   usdxlATokenProxy = UsdxlAToken(reserveData.aTokenAddress);
+   usdxlVariableDebtTokenProxy = UsdxlVariableDebtToken(reserveData.variableDebtTokenAddress);

    // export contract addresses
    DeployUsdxlFileUtils.exportContract(instanceId, "usdxlATokenProxy", _getUsdxlATokenProxy());
    DeployUsdxlFileUtils.exportContract(instanceId, "usdxlVariableDebtTokenProxy", _getUsdxlVariableDebtTokenProxy());
}
```

2. Update getter functions to return proxy addresses:

```diff
function _getUsdxlATokenProxy() internal view returns (address) {
-    return address(usdxlAToken);
+    return address(usdxlATokenProxy);
}

function _getUsdxlVariableDebtTokenProxy() internal view returns (address) {
-    return address(usdxlVariableDebtToken);
+    return address(usdxlVariableDebtTokenProxy);
}
```

3. Update treasury configuration to use proxy:

```diff
function _setUsdxlAddresses(IDeployConfigTypes.HypurrDeployRegistry memory deployRegistry)
    internal
{
-    usdxlAToken.updateUsdxlTreasury(deployRegistry.treasury);
+    UsdxlAToken(_getUsdxlATokenProxy()).updateUsdxlTreasury(deployRegistry.treasury);

    UsdxlAToken(_getUsdxlATokenProxy()).setVariableDebtToken(_getUsdxlVariableDebtTokenProxy());
    UsdxlVariableDebtToken(_getUsdxlVariableDebtTokenProxy()).setAToken(_getUsdxlATokenProxy());
}
```
