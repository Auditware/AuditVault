---
tags:
  - lang/solidity
  - sector/staking
  - sector/token
  - sector/wallet
  - has/github
  - severity/high
protocol: "[[Metamask Delegation Framework]]"
auditors:
  - George Kobakhidze
report: "https://diligence.consensys.io/audits/2025/04/metamask-delegation-framework-april-2025/"
genome:
  - "[[extcall-return-validation]]"
  - "[[specific-token-type]]"
  - "[[variant]]"
---
# Missing Safe Transfer Validation in Execution Logic  Acknowledged

- id: 56800
- impact: HIGH
- protocol: Metamask Delegation Framework April 2025
- reporter:  George Kobakhidze
                         (ConsenSys)
- source: https://diligence.consensys.io/audits/2025/04/metamask-delegation-framework-april-2025/

## Summary


This bug report describes an issue with the `beforeHook` function in the `MultiTokenPeriodEnforcer` contract. The function does not have proper safety checks for ERC-20 token transfers, which could result in silent failures when interacting with non-standard token contracts. The report recommends creating a separate execution logic for ERC-20 token transfers to ensure all edge cases are properly handled.

## Details

...

Export to GitHub ...

Set external GitHub Repo ...

Export to Clipboard (json)

Export to Clipboard (text)

#### Resolution

Acknowledged by the client with the following note:

> We added a warning in the documentation in this hash: [bfca5f9163eb4c5b1a1ff309a5fc9d6a5815f538](https://github.com/MetaMask/delegation-framework/commit/bfca5f9163eb4c5b1a1ff309a5fc9d6a5815f538)

#### Description

In the `beforeHook` function of the `MultiTokenPeriodEnforcer` contract, there is a validation that the mode of execution is `CALLTYPE_SINGLE` and `EXECTYPE_DEFAULT`, so the ERC-20 token transfers will always be executed via `_execute` function, which performs a low-level `call`. However, the function lacks critical safety checks typically found in secure token transfers. There is no validation that the token transfer succeeded by returning `true`, as required by the ERC-20 standard. This omission could result in silent failures when interacting with non-standard token contracts, allowing tokens that don’t revert on failures and just return `false` to be incorrectly treated as successfully transferred.

#### Examples

**src/enforcers/MultiTokenPeriodEnforcer.sol:L131-L144**

```
function beforeHook(
    bytes calldata _terms,
    bytes calldata,
    ModeCode _mode,
    bytes calldata _executionCallData,
    bytes32 _delegationHash,
    address,
    address _redeemer
)
    public
    override
    onlySingleCallTypeMode(_mode)
    onlyDefaultExecutionMode(_mode)
{

```

**src/DeleGatorCore.sol:L182-L216**

```
 * @notice Executes an Execution from this contract
 * @dev Related: @erc7579/MSAAdvanced.sol
 * @dev This method is intended to be called through a UserOp which ensures the invoker has sufficient permissions
 * @param _mode The ModeCode for the execution
 * @param _executionCalldata The calldata for the execution
 */
function execute(ModeCode _mode, bytes calldata _executionCalldata) external payable onlyEntryPoint {
    (CallType callType_, ExecType execType_,,) = _mode.decode();

    // Check if calltype is batch or single
    if (callType_ == CALLTYPE_BATCH) {
        // destructure executionCallData according to batched exec
        Execution[] calldata executions_ = _executionCalldata.decodeBatch();
        // Check if execType is revert or try
        if (execType_ == EXECTYPE_DEFAULT) _execute(executions_);
        else if (execType_ == EXECTYPE_TRY) _tryExecute(executions_);
        else revert UnsupportedExecType(execType_);
    } else if (callType_ == CALLTYPE_SINGLE) {
        // Destructure executionCallData according to single exec
        (address target_, uint256 value_, bytes calldata callData_) = _executionCalldata.decodeSingle();
        // Check if execType is revert or try
        if (execType_ == EXECTYPE_DEFAULT) {
            _execute(target_, value_, callData_);
        } else if (execType_ == EXECTYPE_TRY) {
            bytes[] memory returnData_ = new bytes[](1);
            bool success_;
            (success_, returnData_[0]) = _tryExecute(target_, value_, callData_);
            if (!success_) emit TryExecuteUnsuccessful(0, returnData_[0]);
        } else {
            revert UnsupportedExecType(execType_);
        }
    } else {
        revert UnsupportedCallType(callType_);
    }
}

```

```
// from erc7579-implementation/src/core/ExecutionHelper.sol

    function _execute(
        address target,
        uint256 value,
        bytes calldata callData
    )
        internal
        virtual
        returns (bytes memory result)
    {
        /// @solidity memory-safe-assembly
        assembly {
            result := mload(0x40)
            calldatacopy(result, callData.offset, callData.length)
            if iszero(call(gas(), target, value, result, callData.length, codesize(), 0x00)) {
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

#### Recommendation

We recommend creating a separate execution logic for ERC-20 token transfers, which will validate all the edge case scenarios:

* Even though with the current code a call to EOA will revert, we still recommend verifying that the target address is a contract before executing the low-level `call`, e.g., using `Address.isContract`.
* In cases when the token returns a variable, checking that the token transfer returns `true` or does not return `false`, in line with the ERC-20 specification, as it is done in the SafeERC20 library.
