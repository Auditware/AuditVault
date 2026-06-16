---
tags:
  - lang/solidity
  - platform/consensys
  - has/github
  - severity/high
  - vuln/pda/reinitialization
  - precondition/uninitialized
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/initialize-proxy
  - sector/infra
protocol: "[[Linea]]"
auditors:
  - "[[Arturo Roura]]"
report: "https://diligence.consensys.io/audits/2025/10/linea-burn-mechanism/"
genome:
  - "[[reinitialization]]"
  - "[[ownership-takeover]]"
  - "[[data/uninitialized]]"
  - "[[variant]]"
  - "[[frontrun-exposure]]"
  - "[[initializer-auth]]"
  - "[[pda-derivation]]"
---
# 18_deploy_RollupRevenueVault.ts – Deployment Script Leaves Contract Uninitialized; fallback Does Not Enforce msg.value > 0 ✓ Fixed

- id: 63335
- impact: HIGH
- protocol: [[Linea]] - Burn Mechanism
- reporter: Arturo Roura (ConsenSys)
- source: https://diligence.consensys.io/audits/2025/10/linea-burn-mechanism/

## Summary


The bug report describes an issue with the deployment script for the RollupRevenueVault contract. The script attempts to call a non-existent initialize() function with no parameters, leaving the contract uninitialized and allowing anyone to claim it. This is because the contract only defines an initialize() function with 10 parameters, but the script specifies an empty initializer. The recommendation is to remove the fallback function or require a minimum value for the received funds, update the deployment script to call the correct initialize() function with all required parameters, and bundle it with a call to the reinitialize() function to avoid another potential issue. The bug has been fixed in commit 831c529479faebb380df1478e17f03bf0a3b9b80. 

## Details

...

Export to GitHub ...

Set external GitHub Repo ...

Export to Clipboard (json)

Export to Clipboard (text)

#### Resolution

Fixed in commit [831c529479faebb380df1478e17f03bf0a3b9b80](https://github.com/Consensys/linea-monorepo/pull/1599/commits/831c529479faebb380df1478e17f03bf0a3b9b80). The Linea team modified the deployment script to call the initialize function with the proper signature and function arguments, and added `require(msg.value > 0, NoEthSent())` in the fallback.

#### Description

The deployment script for `RollupRevenueVault` incorrectly attempts to call a non-existent `initialize()` function with no parameters, leaving the contract uninitialized and non-functional.

The script specifies `EMPTY_INITIALIZE_SIGNATURE = "initialize()"`, but the `RollupRevenueVault` contract only defines an `initialize(addr, ...)` function that requires 10 parameters. When `deployProxy` (from OpenZeppelin) executes this empty initializer, the call is routed to the contract’s fallback function instead of performing initialization.

As a result, the contract stays uninitialized allowing anyone to claim it.

#### Examples

* Deployment Script calls empty `initialize()`

**contracts/deploy/18\_deploy\_RollupRevenueVault.ts:L15-L17**

```
const contractName = "RollupRevenueVault";
const existingContractAddress = await getDeployedContractAddress(contractName, deployments);
```

**contracts/deploy/18\_deploy\_RollupRevenueVault.ts:L25-L28**

```
const contract = await deployUpgradableFromFactory(contractName, [], {
  initializer: EMPTY_INITIALIZE_SIGNATURE,
  unsafeAllow: ["constructor"],
});
```

* Contract only defines `initialize(uint256,address,address,address,address,address,address,address,address,address)`

Since no zero-argument `initialize()` exists, calls to `initialize()` without parameters trigger the fallback, contributing to hiding this issue. Deployment returns success.

**contracts/src/operational/RollupRevenueVault.sol:L58-L74**

```
function initialize(
  uint256 _lastInvoiceDate,
  address _defaultAdmin,
  address _invoiceSubmitter,
  address _burner,
  address _invoicePaymentReceiver,
  address _tokenBridge,
  address _messageService,
  address _l1LineaTokenBurner,
  address _lineaToken,
  address _dex
) external initializer {
  __AccessControl_init();
  __RollupRevenueVault_init(
    _lastInvoiceDate,
    _defaultAdmin,
    _invoiceSubmitter,
```

**contracts/src/operational/RollupRevenueVault.sol:L282-L288**

```
/**
 * @notice Fallback function - Receives Funds.
 */
fallback() external payable {
  emit EthReceived(msg.value);
}
```

#### Recommendation

* Remove the fallback function or require `msg.value > 0`.
* Update the deployment script to call the correct `initialize(addr, ...)` function and supply all required parameters.
* Bundle with a call to the `reinitialize` function to avoid another front-running window.
