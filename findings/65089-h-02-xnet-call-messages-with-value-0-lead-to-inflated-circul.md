---
tags:
  - lang/solidity
  - sector/account
  - sector/token
  - platform/code4rena
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Recall]]"
auditors:
  - "[[sin1st3r__]]"
report: "https://code4rena.com/reports/2025-02-recall"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# [H-02] Xnet call messages with value `> 0` lead to inflated circulating supply of child subnet

- id: 65089
- impact: HIGH
- protocol: [[Recall]]
- reporter: sin1st3r\_\_ (Code4rena)
- source: https://code4rena.com/reports/2025-02-recall

## Summary


This report discusses a vulnerability found in a protocol that can cause an inflated circulating supply of a specific subnet. The vulnerability is caused by an assumption made in the code that a certain type of message does not move funds, which is not always true. This can be exploited by an attacker to transfer funds from one subnet to another and increase the circulating supply of the target subnet. The recommended mitigation is to remove the assumption and increase the total value variable regardless of message type. The vulnerability has been confirmed and a recall has been recommended.

## Details



<https://github.com/code-423n4/2025-02-recall/blob/ab5f90b9b0322016ecce6dd71c528a935544bec5/contracts/contracts/gateway/router/CheckpointingFacet.sol# L137>

### Finding description and impact

One of the main invariants of this protocol (as listed in the contest github page) is:

> The total supply of a subnet must match the total funds locked for that specific subnet in the gateway

The vulnerability explained in detail below leads to a severely inflated circulating supply of the target subnet, in a way that the total funds locked for a particular subnet will NOT equal the total supply of funds associated with the subnet.

The vulnerability exists in the function `CheckpointingFacet::execBottomUpMsgs()`. This function is called by the function `commitCheckpoint()` which ends up getting called when an actor submits a bottom -> top checkpoint for execution in the parent subnet.
```

    /// @notice submit a batch of cross-net messages for execution.
    /// @param msgs The batch of bottom-up cross-network messages to be executed.
    function execBottomUpMsgs(IpcEnvelope[] calldata msgs, Subnet storage subnet) internal {
        uint256 totalValue;
        uint256 crossMsgLength = msgs.length;

        for (uint256 i; i < crossMsgLength; ) {
    ------> if (msgs[i].kind != IpcMsgKind.Call) {
                totalValue += msgs[i].value;
            }
            unchecked {
                ++i;
            }
        }

        uint256 totalAmount = totalValue;

        if (subnet.circSupply < totalAmount) {
            revert NotEnoughSubnetCircSupply();
        }

  ----> subnet.circSupply -= totalAmount;

        // execute cross-messages
        LibGateway.applyMessages(subnet.id, msgs);
    }
```

The highlighted line checks if the bottom -> top message to be executed is NOT of type `Call`. If that’s the case, then it will increase the `totalValue` variable. Then the circulating supply state associated with the child subnet `circSupply` will be decreased by the `totalValue`. The main assumption made here is that a message of type `Call` does not move supply source / genesis funds, which is not necessarily true. A message of type `Call` can have a non-zero `value` property which means that it does move funds.

Let’s take a look at the function `GatewayMessengerFacet::sendContractXnetMessage()` which is responsible for the creation of messages of type `Call`:
```

    function sendContractXnetMessage(
        IpcEnvelope memory envelope
    ) external payable returns (IpcEnvelope memory committed) {
        ........................

        committed = IpcEnvelope({
            kind: IpcMsgKind.Call,
            ..........................
        });

        (bool valid, InvalidXnetMessageReason reason, IPCMsgType applyType) = committed.validateCrossMessage();
        if (!valid) {
            revert InvalidXnetMessage(reason);
        }

        if (applyType == IPCMsgType.TopDown) {
            (, SubnetID memory nextHop) = committed.to.subnetId.down(s.networkName);
            // lock funds on the current subnet gateway for the next hop
      ----> ISubnetActor(nextHop.getActor()).supplySource().lock(envelope.value);
        }

        // Commit xnet message for dispatch.
   ---> bool shouldBurn = LibGateway.commitValidatedCrossMessage(committed);

        // Apply side effects, such as burning funds.
   ---> LibGateway.crossMsgSideEffects({v: committed.value, shouldBurn: shouldBurn});

        // Return a copy of the envelope, which was updated when it was committed.
        // Updates are visible to us because commitCrossMessage takes the envelope with memory scope,
        // which passes the struct by reference.
        return committed;
    }
```


```

    function commitValidatedCrossMessage(IpcEnvelope memory crossMessage) internal returns (bool shouldBurn) {
        GatewayActorStorage storage s = LibGatewayActorStorage.appStorage();

        SubnetID memory to = crossMessage.to.subnetId;
        IPCMsgType applyType = crossMessage.applyType(s.networkName);
        bool isLCA = to.commonParent(crossMessage.from.subnetId).equals(s.networkName);

        // If the directionality is top-down, or if we're inverting the direction
        // because we're the LCA, commit a top-down message.
        if (applyType == IPCMsgType.TopDown || isLCA) {
            (, SubnetID memory subnetId) = to.down(s.networkName);
            (, Subnet storage subnet) = getSubnet(subnetId);
            LibGateway.commitTopDownMsg(subnet, crossMessage);
            return (shouldBurn = false);
        }

        // Else, commit a bottom up message.
        LibGateway.commitBottomUpMsg(crossMessage);
        // gas-opt: original check: value > 0
        return (shouldBurn = crossMessage.value != 0);
    }
```

If a caller in a child subnet creates a xnet message with a non-zero value to call a smart contract in another child subnet, the funds will be burnt (or more precisely, sent to void) and a bottom up message will be committed. The message will then reach the destination and the funds will be transferred successfully to the target in the destination subnet. The circulating supply of the child subnet should reflect that fund transfer, but that’s not what happens.

### Exploit

1. Suppose child subnet A has 1,000,000 native funds locked in, and the current circulating supply for that child subnet is set to 1,000,000 (as it should) in the parent subnet.
2. Attacker in child subnet A will transfer 5,000 funds by constructing a Xnet message which calls a smart contract in child subnet B and transfers the 5,000 funds to it. The 5,000 funds will be burnt and the Xnet message will then arrive at the parent subnet and the parent subnet will then commit a Top -> Bottom message to child subnet B.
3. The circulating supply of child subnet B will be increased by `5000` (as it should). Check the function `LibGateway::commitTopDownMsg()`:
```

    function commitTopDownMsg(Subnet storage subnet, IpcEnvelope memory crossMessage) internal {
        uint64 topDownNonce = subnet.topDownNonce;

        crossMessage.localNonce = topDownNonce;
        // only set the original nonce if the message is from this subnet
        if (crossMessage.from.subnetId.equals(subnet.id)) {
            crossMessage.originalNonce = topDownNonce;
        }
        subnet.topDownNonce = topDownNonce + 1;
  ----> subnet.circSupply += crossMessage.value;

        emit NewTopDownMessage({subnet: subnet.id.getAddress(), message: crossMessage, id: crossMessage.toTracingId()});
    }
```

4. Message will arrive in child subnet B and target contract will be called and the funds will be transferred:
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
     -----> return
     ----->     supplySource.performCall(
                    payable(recipient),
                    abi.encodeCall(IIpcHandler.handleIpcMessage, (crossMsg)),
                    crossMsg.value
                );
        }
        return (false, EMPTY_BYTES);
    }
```


```

    /// @notice Calls the target with the specified data, ensuring it receives the specified value.
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
```


```

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

5. `Call` should succeed and a receipt of value `0` will be created and sent to the parent subnet which will then send a Top -> Bottom checkpoint to child subnet A containing the receipt created by child subnet B. The receipt will have a value of `0` because the call succeeded.
```

    function createResultMsg(
        IpcEnvelope calldata crossMsg,
        OutcomeType outcome,
        bytes memory ret
    ) public pure returns (IpcEnvelope memory) {
        ResultMsg memory message = ResultMsg({id: toTracingId(crossMsg), outcome: outcome, ret: ret});

        uint256 value = crossMsg.value;
        // if the message was executed successfully, the value stayed
        // in the subnet and there's no need to return it.
  ----> if (outcome == OutcomeType.Ok) {
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

6. The circulating supply associated with subnet A will remain at 1,000,000 even though it should be 9,995,000 now that `5000` funds were moved outside of it.

The effect vulnerability can be exaggerated even further if the attacker keeps bridging funds from subnet to parent and from parent to subnet by making xnet calls that have `value > 0`. The `circSupply` associated with the child subnet will keep getting increased but never decreased.

### Recommended mitigation steps

Proposed mitigation is to remove the if check `if (msgs[i].kind != IpcMsgKind.Call)` and to increase the `totalValue` variable regardless of msg type:
```

    /// @notice submit a batch of cross-net messages for execution.
    /// @param msgs The batch of bottom-up cross-network messages to be executed.
    function execBottomUpMsgs(IpcEnvelope[] calldata msgs, Subnet storage subnet) internal {
        uint256 totalValue;
        uint256 crossMsgLength = msgs.length;

        for (uint256 i; i < crossMsgLength; ) {
            totalValue += msgs[i].value;
            unchecked {
                ++i;
            }
        }

        uint256 totalAmount = totalValue;

        if (subnet.circSupply < totalAmount) {
            revert NotEnoughSubnetCircSupply();
        }

        subnet.circSupply -= totalAmount;

        // execute cross-messages
        LibGateway.applyMessages(subnet.id, msgs);
    }
```

**Recall confirmed**

---
