---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - sector/vault
protocol: "[[Superform]]"
auditors:
  - "[[MiloTruck]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[bridge-merkle-proof]]"
---
# Lack of hookAddress in merkle tree schema in SuperVaultAggregator.sol

- id: 63080
- impact: HIGH
- protocol: [[Superform]] v2 Periphery
- reporter: MiloTruck (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf

## Summary


The bug report discusses a problem in the SuperVaultAggregator contract that can potentially lead to a loss of funds. The issue is caused by the `_createLeaf()` function, which does not properly consider the hook address when creating an authorization leaf. This means that different hook addresses with the same encoded arguments can share the same leaf, allowing a malicious caller to execute unintended actions and potentially steal funds. The report recommends updating the `_createLeaf()` function to include the hook address in the leaf creation process.

## Details

## Severity: High Risk

## Context
SuperVaultAggregator.sol#L960-L966

## Description
The `_createLeaf()` function double-hashes the calldata and ignores the hook address, so different hook addresses with identical encoded arguments share the same authorization leaf. 

An example is the `RequestDeposit7540VaultHook.sol`, which has the following data format:

```solidity
function _buildHookExecutions(
    address prevHook,
    address account,
    bytes calldata data
) internal view override returns (Execution[] memory executions) {
    address yieldSource = data.extractYieldSource();
    uint256 amount = _decodeAmount(data);
    bool usePrevHookAmount = _decodeBool(data, USE_PREV_HOOK_AMOUNT_POSITION);
    
    if (usePrevHookAmount) {
        amount = ISuperHookResult(prevHook).outAmount();
    }
}
```

Similarly, the `RequestRedeem7540VaultHook.sol` has the data format:

```solidity
/// @inheritdoc BaseHook
function _buildHookExecutions(
    address prevHook,
    address account,
    bytes calldata data
) internal view override returns (Execution[] memory executions) {
    address yieldSource = data.extractYieldSource();
    uint256 shares = _decodeAmount(data);
    bool usePrevHookAmount = _decodeBool(data, USE_PREV_HOOK_AMOUNT_POSITION);
    
    if (usePrevHookAmount) {
        shares = ISuperHookResult(prevHook).outAmount();
    }
}
```

Both hooks follow the same data format: `address + uint256`, and both hooks have the same inspect function:

```solidity
/// @inheritdoc ISuperHookInspector
function inspect(bytes calldata data) external pure returns (bytes memory) {
    return abi.encodePacked(data.extractYieldSource());
}
```

### Vulnerability
A malicious caller can:
- Use `RequestDeposit7540VaultHook.sol` data to execute a redeem action.
- Use `RequestRedeem7540VaultHook.sol` data to execute a deposit action.

This leads to a potential loss of funds.

## Recommendation
The leaf should be created using the hook address and hook arguments:

```solidity
function _createLeaf(address hookAddress, bytes calldata hookArgs) internal pure returns (bytes32) {
    /// @dev note the leaf is just composed by the args, not by the address of the hook
    /// @dev this means hooks with different addresses but with the same type of encodings will have
    /// the same authorization (same proof is going to be generated). Is this ok?
    return keccak256(bytes.concat(keccak256(abi.encode(hookAddress, hookArgs))));
}
```
