---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/account
  - sector/insurance
  - sector/options
  - sector/staking
protocol: "[[Biconomy]]"
auditors:
  - "[[blockdev]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Biconomy-Spearbit-Security-Review-October-2024.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[account-ownership]]"
---
# ERC-7484 registry checks missing on calls to modules

- id: 43812
- impact: HIGH
- protocol: [[Biconomy]] Nexus
- reporter: Blockdev (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Biconomy-Spearbit-Security-Review-October-2024.pdf

## Summary


This bug report discusses a problem with the ERC-7484 registry not being checked when certain functions are called. The check is supposed to be performed when executors are used or when new modules are installed, but it is not being done for calls to validators, fallback handlers, or hooks. This means that if a module is deemed unsafe and removed by attesters, it could still be used by the smart account. The impact of this bug could be high and it is recommended to use the withRegistry modifier or call the check function on the registry before calling these functions. The bug has been acknowledged and a fix has been proposed in a pull request, but it has not been fully addressed yet. 

## Details

## Security Review Report

## Severity: High Risk

### Context:
_No context files were provided by the reviewer._

### Description:
The ERC-7484 registry is not checked when calls to validators, fallback handlers, or hooks are made. The check is performed when executors are used through the use of the `withRegistry` modifier.

```solidity
function executeFromExecutor(
    ExecutionMode mode,
    bytes calldata executionCalldata
) external payable onlyExecutorModule withHook withRegistry(msg.sender, MODULE_TYPE_EXECUTOR) returns (
    bytes[] memory returnData
) { 
    // function logic
}
```

The check is also performed when any new module is installed:

```solidity
function _installValidator(address validator, bytes calldata data) internal virtual withRegistry(validator, MODULE_TYPE_VALIDATOR) { 
    // function logic
}
// ...
function _installExecutor(address executor, bytes calldata data) internal virtual withRegistry(executor, MODULE_TYPE_EXECUTOR) { 
    // function logic
}
// ...
function _installHook(address hook, bytes calldata data) internal virtual withRegistry(hook, MODULE_TYPE_HOOK) { 
    // function logic
}
// ...
function _installFallbackHandler(address handler, bytes calldata params) internal virtual withRegistry(handler, MODULE_TYPE_FALLBACK) { 
    // function logic
}
```

The smart account owner has the option to opt-in or opt-out of using the ERC-7484 registry by setting the `registry` variable.

```solidity
modifier withRegistry(address module, uint256 moduleType) {
    _checkRegistry(module, moduleType);
    _;
}
```

```solidity
function _checkRegistry(address module, uint256 moduleType) internal view {
    IERC7484 moduleRegistry = registry;
    if (address(moduleRegistry) != address(0)) {
        // this will revert if attestations / threshold are not met
        moduleRegistry.check(module, moduleType);
    }
}
```

The `withRegistry` modifier first checks storage to see if an address has been set for `registry`. If it is set, then `check()` is called on the ERC-7484 registry, passing the module and the module type. If the number of attesters does not meet the threshold for this module/type combination, then the transaction reverts.

The ERC-7579 standard states:
> the Adapter SHOULD implement the following functionality: Revert the transaction flow when the Registry reverts. Query the Registry about module A on installation of A. Query the Registry about module A on execution of A.

While the current logic does perform the query on installation, it fails to do so during the execution of hooks, fallback handlers, and validations.

If a user opts-in to using the registry, installs a validator that has sufficient support from the ERC-7484 attesters, and then subsequently that validator is determined to be unsafe and the attesters remove their attestation, then this unsafe validator will continue to be used by the smart account since there is no check upon usage. 

The impact from using such an unsafe validator could be very high. It is reasonable to imagine a scenario where a module was initially deemed safe and later found to be unsafe, causing attesters to change their position. As such, the likelihood is deemed to be medium with an overall severity rating of high.

### Recommendation:
Use the `withRegistry` modifier or otherwise call `check` on the registry for all functions that will invoke calls to hooks, fallback handlers, and validators. 

According to ERC-7484, the module should be checked against the registry any time it is called. This may be through the use of the `withRegistry` modifier or by calling `_checkRegistry` within a function before a module is called.

- `fallback()`: call `_checkRegistry(handler)` before calling the handler.
- `withHook()`: call `_checkRegistry(hook)` before calling the preCheck on the hook.
- `validateUserOp()`: call `_checkRegistry(validator)` before calling the `validateUserOp` on the validator.

### Acknowledgment:
**Biconomy**: Acknowledged. I don't think we can do:
> `validateUserOp()`: call `_checkRegistry(validator)` before calling the `validateUserOp` on the validator.

Addressed in PR 151.

**Spearbit**: The check has been added to the Hook and Fallback but not Validators as mentioned.
