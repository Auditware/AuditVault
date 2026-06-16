---
tags:
  - lang/solidity
  - sector/account
  - sector/staking
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Recall]]"
auditors:
  - "[[SBSecurity]]"
report: "https://code4rena.com/reports/2025-02-recall"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[variant]]"
  - "[[vote-delegation-loop]]"
---
# [H-09] Cross msg recipient can block checkpoint submission

- id: 65096
- impact: HIGH
- protocol: [[Recall]]
- reporter: SBSecurity (Code4rena)
- source: https://code4rena.com/reports/2025-02-recall

## Summary


The report discusses a bug in the `LibGateway::executeCrossMsg` function that can potentially allow an attacker to block the checkpoint submission process. This is due to the use of low level `call` method which can be manipulated by the attacker to return a large amount of data and consume all the available gas on the blockchain. The bug can be exploited in both `IpcMsgKind.Call` and `IpcMsgKind.Transfer` messages. The report suggests using the `ExcessivelySafeCall` library to mitigate this issue.

## Details



As mentioned in the natspec of `LibGateway::executeCrossMsg`:
```

/// @dev Execute the cross message using low level `call` method. This way ipc will
    ///      catch contract revert messages as well. We need this because in `CrossMsgHelper.execute`
    ///      there are `require` and `revert` calls, without reflexive call, the execution will
    ///      revert and block the checkpoint submission process.
```

However there’s a still way to block the checkpoint submission entirely. Since the low level call is used, the returndata of the call can be used from the `target` to return gas bomb the execution of all the messages entirely. As we know, it’s impossible to have blockchain without gas limit as this will break the Turing Completeness. With that in mind, the attacker can construct various payloads, depending on the gas limit of chain and deplete it entirely.

### Proof of Concept

Let’s take a look at how low level call is done in Recall. We have `LibGateway::executeCrossMsg`, which does delegate call to `CrossMsgHelper::execute` and when the `IpcMsgKind` is `Call` recipient is called:

[`CrossMsgHelper.sol`](https://github.com/code-423n4/2025-02-recall/blob/main/contracts/contracts/lib/CrossMsgHelper.sol# L185)
```

function execute(
        IpcEnvelope calldata crossMsg,
        Asset memory supplySource
    ) public returns (bool success, bytes memory ret) {
        if (isEmpty(crossMsg)) {
            revert CannotExecuteEmptyEnvelope();
        }

        address recipient = crossMsg.to.rawAddress.extractEvmAddress().normalize();
        if (crossMsg.kind == IpcMsgKind.Transfer) {
            return supplySource.transferFunds({recipient: payable(recipient), value: crossMsg.value});
        } else if (crossMsg.kind == IpcMsgKind.Call || crossMsg.kind == IpcMsgKind.Result) {
            // For a Result message, the idea is to perform a call as this returns control back to the caller.
            // If it's an account, there will be no code to invoke, so this will behave like a bare transfer.
            // But if the original caller was a contract, this give it control so it can handle the result

            // send the envelope directly to the entrypoint
            // use supplySource so the tokens in the message are handled successfully
            // and by the right supply source
            return
                supplySource.performCall(
                    payable(recipient),
                    abi.encodeCall(IIpcHandler.handleIpcMessage, (crossMsg)),
                    crossMsg.value
                );
        }
        return (false, EMPTY_BYTES);
    }
```

[`AssetHelper.sol`](https://github.com/code-423n4/2025-02-recall/blob/main/contracts/contracts/lib/AssetHelper.sol# L101C5-L151C6)
```

function performCall(
        Asset memory asset,
        address payable target,
        bytes memory data,
        uint256 value
    ) internal returns (bool success, bytes memory ret) {
        // If value is zero, we can just go ahead and call the function.
        if (value == 0) {
            return functionCallWithValue(target, data, 0);
        }

        // Otherwise, we need to do something different.
        if (asset.kind == AssetKind.Native) {
            // Use the optimized path to send value along with the call.
            (success, ret) = functionCallWithValue({target: target, data: data, value: value});
        } else if (asset.kind == AssetKind.ERC20) {
            (success, ret) = functionCallWithERC20Value({asset: asset, target: target, data: data, value: value});
        }
        return (success, ret);
    }

    /// @dev Performs the function call with ERC20 value atomically
function functionCallWithERC20Value(
        Asset memory asset,
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bool success, bytes memory ret) {
        // Transfer the tokens first, _then_ perform the call.
        (success, ret) = ierc20Transfer(asset, target, value);

        if (success) {
            // Perform the call only if the ERC20 was successful.
            (success, ret) = functionCallWithValue(target, data, 0);
        }

        if (!success) {
            // following the implementation of `openzeppelin-contracts/utils/Address.sol`
            if (ret.length > 0) {
                assembly {
                    let returndata_size := mload(ret)
                    // see https://ethereum.stackexchange.com/questions/133748/trying-to-understand-solidity-assemblys-revert-function
                    revert(add(32, ret), returndata_size)
                }
            }
            // disable solhint as the failing call does not have return data as well.
            /* solhint-disable reason-string */
            revert();
        }
        return (success, ret);
    }

function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bool success, bytes memory) {
        if (address(this).balance < value) {
            revert NotEnoughBalance();
        }

        if (!isContract(target)) {
            revert InvalidSubnetActor();
        }

        return target.call{value: value}(data);
    }
```

As we see, there’s no restriction on the `returndata` size and it’s always being loaded into memory, no matter the outcome.

When the msg kind is `Transfer`, the attack is even easier, since native supply source is sent directly to the contract and the attacker can have custom logic in his `receive` function to scale and return the payload which is guaranteed to consume all the gas up to the limit.

[`AssetHelper.sol`](https://github.com/code-423n4/2025-02-recall/blob/main/contracts/contracts/lib/AssetHelper.sol# L164)
```

function transferFunds(
        Asset memory asset,
        address payable recipient,
        uint256 value
    ) internal returns (bool success, bytes memory ret) {
        if (asset.kind == AssetKind.Native) {
            success = sendValue(payable(recipient), value);
            return (success, EMPTY_BYTES);
        } else if (asset.kind == AssetKind.ERC20) {
            return ierc20Transfer(asset, recipient, value);
        }
    }

function sendValue(address payable recipient, uint256 value) internal returns (bool) {
        if (address(this).balance < value) {
            revert NotEnoughBalance();
        }
        (bool success, ) = recipient.call{value: value}("");
        return success;
    }
```

The caveat here is that no matter the return value is omitted, it’s still getting loaded into memory implicitly. Only assembly calls won’t load it into memory, unless not manually.

### Recommended mitigation steps

Consider using [`ExcessivelySafeCall`](https://github.com/nomad-xyz/ExcessivelySafeCall) for all the low level calls and restrict them.

**Recall disputed**

---
