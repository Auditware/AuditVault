---
tags:
  - lang/solidity
  - sector/staking
  - platform/code4rena
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - fix/use-reentrancy-guard
protocol: "[[Recall]]"
auditors:
  - "[[sin1st3r__]]"
report: "https://code4rena.com/reports/2025-02-recall"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[reentrancy-guard]]"
---
# [H-03] Reliance on incorrect hash in `IpcContract.sol` leads to permanent fund loss and receipt message execution failure

- id: 65090
- impact: HIGH
- protocol: [[Recall]]
- reporter: sin1st3r\_\_ (Code4rena)
- source: https://code4rena.com/reports/2025-02-recall

## Summary


The `IpcContract.sol` contract is used for sending messages between different parts of a program. There is a mistake in the code that can cause problems when trying to send and receive these messages. The mistake makes it impossible to handle receipts, which are important for keeping track of the messages. This can result in a loss of funds and problems with the program. To fix this, a new property should be added to the messages and used instead of the current one. 

## Details



<https://github.com/code-423n4/2025-02-recall/blob/ab5f90b9b0322016ecce6dd71c528a935544bec5/contracts/sdk/IpcContract.sol# L39>

### Overview of the `IpcContract.sol` contract & Xnet messaging

The in-scope `IpcContract.sol` contract is an abstract contract which is meant to be extended upon to create contracts that are “IPC Xnet compatible”. It has the method `performIpcCall()` which is called to create a new IPC envelope or Xnet message to be sent to the parent subnet or another child subnet. It also has the method `handleIpcMessage()` which is used to handle `Call`/Xnet messages coming from other subnets and it is also used to handle receipts.

When you, from a source subnet, send a Xnet message to a destination subnet and that message reaches the destination subnet and is executed there, that destination subnet will then generate a message of kind “Result” which we call a “Receipt”. This “Receipt” message is then sent back to the source subnet. The method `handleIpcMessage()` in the `IpcContract.sol` (or any contract extending it) is responsible for handling those receipts.

### Finding description and impact

The vulnerability exists in the highlighted lines in the functions `performIpcCall()` and `handleIpcMessage()`:
```

    /// @notice Method the implementation of this contract can invoke to perform an IPC call.
    function performIpcCall(
        IPCAddress memory to,
        CallMsg memory callMsg,
        uint256 value
    ) internal nonReentrant returns (IpcEnvelope memory envelope) {
        // Queue the cross-net message for dispatch.
        envelope = IGateway(gatewayAddr).sendContractXnetMessage{value: value}(
            IpcEnvelope({
                kind: IpcMsgKind.Call,
                from: to, // TODO: will anyway be replaced by sendContractXnetMessage.
                to: to,
                localNonce: 0, // TODO: will be replaced.
                originalNonce: 0, // TODO: will be replaced
                value: value,
                message: abi.encode(callMsg)
            })
        );
        // Add the message to the list of inflights
 -----> bytes32 id = envelope.toHash();
 -----> inflightMsgs[id] = envelope;
    }
```


```

    function handleIpcMessage(IpcEnvelope calldata envelope) external payable onlyGateway returns (bytes memory) {
        ...................
        } else if (envelope.kind == IpcMsgKind.Result) {
            ResultMsg memory result = abi.decode(envelope.message, (ResultMsg));

            // Recover the original message.
            // If we were not tracking it, or if some details don't match, refuse to handle the receipt.
    ------> IpcEnvelope storage orig = inflightMsgs[result.id]; // @audit-issue
            if (orig.message.length == 0 || keccak256(abi.encode(envelope.from)) != keccak256(abi.encode(orig.to))) {
                revert IIpcHandler.UnrecognizedResult();
            }

            /// Note: if the result handler reverts, we will
            _handleIpcResult(orig, envelope, result);
            delete inflightMsgs[result.id];
            return EMPTY_BYTES;
        }
        revert UnsupportedMsgKind();
    }
```

When you call the function `performIpcCall()` to create a new Xnet message to be sent to a destination subnet, the function calls `GatewayMessengerFacet::sendContractXnetMessage()`; which will update the `localNonce`, `originalNonce` and `to` properties of the IPC envelope. Then the envelope will be hashed using the `toHash()` function:
```

    function toHash(IpcEnvelope memory crossMsg) internal pure returns (bytes32) {
        return keccak256(abi.encode(crossMsg));
    }
```

Then the hash of that IPC envelope will be stored in the `inflightMsgs` mapping:
```

        // Add the message to the list of inflights
 -----> bytes32 id = envelope.toHash();
 -----> inflightMsgs[id] = envelope;
```

After the Xnet message is sent to and executed on the destination, the destination will then create a receipt message which will be sent back to the source subnet (which the message originated from). The function `CrossMsgHelper::createResultMsg()` is called to create the receipt, **notice the highlighted line**:
```

    /// @notice Creates a receipt message for the given envelope.
    /// It reverts the from and to to return to the original sender
    /// and identifies the receipt through the hash of the original message.
    function createResultMsg(
        IpcEnvelope calldata crossMsg,
        OutcomeType outcome,
        bytes memory ret
    ) public pure returns (IpcEnvelope memory) {
------> ResultMsg memory message = ResultMsg({id: toTracingId(crossMsg), outcome: outcome, ret: ret});

        uint256 value = crossMsg.value;
        // if the message was executed successfully, the value stayed
        // in the subnet and there's no need to return it.
        if (outcome == OutcomeType.Ok) {
            value = 0;
        }
        return
            IpcEnvelope({
                kind: IpcMsgKind.Result,
                from: crossMsg.to,
                to: crossMsg.from,
                value: value,
                message: abi.encode(message),
                originalNonce: 0,
                localNonce: 0
            });
    }
```

Notice how it sets the `id` of the receipt message to be equal to the hash output of the function `toTracingId()` which is given the original message as a parameter.

Let’s take a look at the `toTracingId()` function:
```

    /// @notice Returns a deterministic hash for the given cross message, excluding the nonce,
    /// which is useful for generating a `tracingId` for cross messages.
    function toTracingId(IpcEnvelope memory crossMsg) internal pure returns (bytes32) {
        return
            keccak256(
                // solhint-disable-next-line func-named-parameters
                abi.encode(
                    crossMsg.kind,
                    crossMsg.to,
                    crossMsg.from,
                    crossMsg.value,
                    crossMsg.message,
                    crossMsg.originalNonce
                )
            );
    }
```

The hash output of the `toTracingId()` function is different from the hash output of the function `toHash()`, which was utilized to create a hash of the original message to be stored in the `inflightMsgs` mapping of the `IpcContract` contract. `toTracingId()`, unlike `toHash()` does not include the `localNonce` of the original message.

After the receipt is created and sent back to the source subnet, then the function `handleIpcMessage()` in the `IpcContract.sol` contract deployed in source subnet, will be called to handle the receipt. The `handleIpcMessage()` function will retrieve the `id` property of the receipt message as if it represents/is equal to the hash of the original message generated during the creation of the original message in `performIpcCall()`, **which is not the case**. The `id` property has the hash output of the `toTracingId()` function which is different from the hash output of `toHash()` initially stored in the mapping `inflightMsgs`.
```

    function handleIpcMessage(IpcEnvelope calldata envelope) external payable onlyGateway returns (bytes memory) {
        ...................
        } else if (envelope.kind == IpcMsgKind.Result) {
            ResultMsg memory result = abi.decode(envelope.message, (ResultMsg));

            // Recover the original message.
            // If we were not tracking it, or if some details don't match, refuse to handle the receipt.
    ------> IpcEnvelope storage orig = inflightMsgs[result.id]; // @audit-issue
            if (orig.message.length == 0 || keccak256(abi.encode(envelope.from)) != keccak256(abi.encode(orig.to))) {
                revert IIpcHandler.UnrecognizedResult();
            }

            /// Note: if the result handler reverts, we will
            _handleIpcResult(orig, envelope, result);
            delete inflightMsgs[result.id];
            return EMPTY_BYTES;
        }
        revert UnsupportedMsgKind();
    }
```

The original message will NOT be recovered because the hash in the `.id` property of the receipt message is not equal to the ones originally stored in the mapping, and so the function will **revert**.

### Impact

This vulnerability will lead to a permanent loss of funds if a Xnet call has `value > 0` and the call has failed on the destination. Additionally, receipts will never be handled on destination subnets.

### Recommended mitigation steps

One way to fix this is to add a `hash` property to the original message/IPC envelope. This property should be set by the function `sendContractXnetMessage()` and should not change. Then when a receipt is created, the receipt IPC envelope struct should also have that `hash` property and have it set to the hash of the original message. Then in `IpcContract` that `hash` property should be relied on instead.

**Recall confirmed**

---
