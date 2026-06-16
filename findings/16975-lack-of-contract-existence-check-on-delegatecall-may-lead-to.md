---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/staking
protocol: "[[Yield Basis]]"
auditors:
  - "[[Natalie Chin]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/YieldV2.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[vote-delegation-loop]]"
---
# Lack of contract existence check on delegatecall may lead to unexpected behavior

- id: 16975
- impact: HIGH
- protocol: [[Yield V2]]
- reporter: Natalie Chin (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/YieldV2.pdf

## Summary


This bug report is about the Ladle contract which uses the delegatecall proxy pattern. If the implementation contract is incorrectly set or is self-destructed, the contract may not detect failed executions. The Ladle contract implements the batch and moduleCall functions; users invoke the former to execute batched calls within a single transaction and the latter to make a call to an external module. Neither function performs a contract existence check prior to executing a delegatecall. 

The external module’s address must be registered by an administrator before the function calls that module. If the administrator sets the module to an incorrect address or to the address of a contract that is subsequently destroyed, a delegatecall to it will still return success. This means that if one call in a batch does not execute any code, it will still appear to have been successful, rather than causing the entire batch to fail. 

The Solidity documentation includes the following warning: “The low-level functions call, delegatecall and staticcall return true as their first return value if the account called is non-existent, as part of the design of the EVM. Account existence must be checked prior to calling if needed.”

The exploit scenario is that Alice, a privileged member of the Yield team, accidentally sets a module to an incorrect address. Bob, a user, invokes the moduleCall method to execute a batch of calls. Despite Alice’s mistake, the delegatecall returns success without making any state changes or executing any code.

The recommendations are to implement a contract existence check before a delegatecall and document the fact that using suicide or selfdestruct can lead to unexpected behavior, and prevent future upgrades from introducing these functions. Long term, carefully review the Solidity documentation, especially the “Warnings” section, and the pitfalls of using the delegatecall proxy pattern.

## Details

## Diﬃculty: High

## Type: Data Validation

## Description
The Ladle contract uses the delegatecall proxy pattern. If the implementation contract is incorrectly set or is self-destructed, the contract may not detect failed executions. The Ladle contract implements the `batch` and `moduleCall` functions; users invoke the former to execute batched calls within a single transaction and the latter to make a call to an external module. Neither function performs a contract existence check prior to executing a delegatecall. 

**Figure 1.1** shows the `moduleCall` function.

```solidity
/// @dev Allow users to use functionality coded in a module, to be used with batch
/// @notice Modules must not do any changes to the vault (owner, seriesId, ilkId),
/// it would be disastrous in combination with batch vault caching
function moduleCall(address module, bytes calldata data)
    external payable
    returns (bytes memory result)
{
}
require (modules[module], "Unregistered module");
bool success;
(success, result) = module.delegatecall(data);
if (!success) revert(RevertMsgExtractor.getRevertMsg(result));
```
*Figure 1.1: vault-v2/contracts/Ladle.sol#L186-L197*  

An external module’s address must be registered by an administrator before the function calls that module.

```solidity
/// @dev Add or remove a module.
function addModule(address module, bool set)
    external
{
    modules[module] = set;
    emit ModuleAdded(module, set);
}
```
*Figure 1.2: vault-v2/contracts/Ladle.sol#L143-L150*

If the administrator sets the module to an incorrect address or to the address of a contract that is subsequently destroyed, a delegatecall to it will still return success. This means that if one call in a batch does not execute any code, it will still appear to have been successful, rather than causing the entire batch to fail.

The Solidity documentation includes the following warning:

> The low-level functions `call`, `delegatecall` and `staticcall` return true as their first return value if the account called is non-existent, as part of the design of the EVM. Account existence must be checked prior to calling if needed.

*Figure 1.3: A snippet of the Solidity documentation detailing unexpected behavior related to delegatecall*

## Exploit Scenario
Alice, a privileged member of the Yield team, accidentally sets a module to an incorrect address. Bob, a user, invokes the `moduleCall` method to execute a batch of calls. Despite Alice’s mistake, the delegatecall returns success without making any state changes or executing any code.

## Recommendations
- **Short term**: Implement a contract existence check before a delegatecall. Document the fact that using `suicide` or `selfdestruct` can lead to unexpected behavior, and prevent future upgrades from introducing these functions.
- **Long term**: Carefully review the Solidity documentation, especially the “Warnings” section, and the pitfalls of using the delegatecall proxy pattern.
