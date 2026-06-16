---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
protocol: "[[Decent]]"
auditors:
  - "[[ZdravkoHr]]"
report: "https://code4rena.com/reports/2024-01-decent"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
---
# [H-03] When `DecentBridgeExecutor.execute` fails, funds will be sent to a random address

- id: 30561
- impact: HIGH
- protocol: [[Decent]]
- reporter: ZdravkoHr (Code4rena)
- source: https://code4rena.com/reports/2024-01-decent

## Summary


This bug report is about a problem in a code that is used for a project called Decent Bridge. The code is written in a programming language called Solidity and is stored in a website called GitHub. The problem is that when a certain function called `DecentBridgeExecutor._executeWeth/_executeEth` does not work, the money that is supposed to be refunded to the person who sent it will be sent to the wrong address and cannot be recovered. This is because the code has a mistake in the way it is written. The report also includes a detailed explanation of how the code works and where the mistake is, as well as a suggestion on how to fix it. The person who wrote the report also found evidence that the problem exists in the actual code that is being used, and that it can lead to a complete loss of the money being transferred. The report was chosen as the best one and the project team has confirmed the problem and its severity.

## Details


<https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DecentEthRouter.sol#L101-L105> 

<https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DecentBridgeExecutor.sol#L63>

When the `DecentBridgeExecutor._executeWeth/_executeEth` target call fails, a refund is issued to the `from` address.

However, this address is wrongly set, so those refunds will be permanently lost.

### Proof of Concept

`UTB.bridgeAndExecute` ([Link](https://github.com/code-423n4/2024-01-decent/blob/main/src/UTB.sol#L259)) calls `DecentBridgeAdapter.bridge` ([Link](https://github.com/code-423n4/2024-01-decent/blob/main/src/UTB.sol#L289)), which calls `DecentEthRouter.bridgeWithPayload` ([Link](https://github.com/code-423n4/2024-01-decent/blob/main/src/bridge_adapters/DecentBridgeAdapter.sol#L117)), where the payload is constructed ([Link](https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DecentEthRouter.sol#L148)):

```solidity
	function _bridgeWithPayload(
	    uint8 msgType,
	    uint16 _dstChainId,
	    address _toAddress,
	    uint _amount,
	    uint64 _dstGasForCall,
	    bytes memory additionalPayload,
	    bool deliverEth
	) internal {
	    (
	        bytes32 destinationBridge,
	        bytes memory adapterParams,
	        bytes memory payload
	    ) = _getCallParams(
	            msgType,
	            _toAddress,
	            _dstChainId,
	            _dstGasForCall,
	            deliverEth,
	            additionalPayload
	        );
	    ...
```

Inside `_getCallParams` the `from` address is the `msg.sender`, i.e. the `DecentBridgeAdapter` address on the source chain ([Link](https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DecentEthRouter.sol#L101-L105)):

```solidity
	function _getCallParams(
	    uint8 msgType,
	    address _toAddress,
	    uint16 _dstChainId,
	    uint64 _dstGasForCall,
	    bool deliverEth,
	    bytes memory additionalPayload
	)
	    private
	    view
	    returns (
	        bytes32 destBridge,
	        bytes memory adapterParams,
	        bytes memory payload
	    )
	{
	    uint256 GAS_FOR_RELAY = 100000;
	    uint256 gasAmount = GAS_FOR_RELAY + _dstGasForCall;
	    adapterParams = abi.encodePacked(PT_SEND_AND_CALL, gasAmount);
	    destBridge = bytes32(abi.encode(destinationBridges[_dstChainId]));
	    if (msgType == MT_ETH_TRANSFER) {
@>	        payload = abi.encode(msgType, msg.sender, _toAddress, deliverEth);
	    } else {
	        payload = abi.encode(
	            msgType,
@>	            msg.sender, //@audit 'from' address
	            _toAddress,
	            deliverEth,
	            additionalPayload
	        );
	    }
	}
```

After the payload is constructed, `DecentEthRouter` sends the message:

```solidity
	dcntEth.sendAndCall{value: gasValue}(
	    address(this), // from address that has dcntEth (so DecentRouter)
	    _dstChainId,
	    destinationBridge, // toAddress
	    _amount, // amount
	    payload, //payload (will have recipients address)
	    _dstGasForCall, // dstGasForCall
	    callParams // refundAddress, zroPaymentAddress, adapterParams
	);
```

Finally, on the destination chain, `DecentEthRouter` will receive the message ([Link](https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DecentEthRouter.sol#L245-L246)):

```solidity
	function onOFTReceived(
	    uint16 _srcChainId,
	    bytes calldata,
	    uint64,
	    bytes32,
	    uint _amount,
	    bytes memory _payload
	) external override onlyLzApp {
		//@audit from is the decentBridgeAdapter address on the source chain
	    (uint8 msgType, address _from, address _to, bool deliverEth) = abi
	        .decode(_payload, (uint8, address, address, bool));
	    ...
	}
```

At the end of this function, the `executor` is invoked with the same `_from` address:

```solidity
	} else {
	    weth.approve(address(executor), _amount);
	    executor.execute(_from, _to, deliverEth, _amount, callPayload);
	}
```

Finally, this is the `execute` function in `DecentBridgeExecutor` ([Link](https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DecentBridgeExecutor.sol#L68)):

```solidity
	function execute(
	    address from,
	    address target,
	    bool deliverEth,
	    uint256 amount,
	    bytes memory callPayload
	) public onlyOwner {
	    weth.transferFrom(msg.sender, address(this), amount);
	    if (!gasCurrencyIsEth || !deliverEth) {
	        _executeWeth(from, target, amount, callPayload);
	    } else {
	        _executeEth(from, target, amount, callPayload);
	    }
	}
```

Both `_executeWeth` and `_executeEth` have the same issue and funds will be lost when the target call fails, for example `_executeEth` ([Link](https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DecentBridgeExecutor.sol#L63)):

```solidity
	function _executeEth(
	    address from,
	    address target,
	    uint256 amount,
	    bytes memory callPayload
	) private {
	    weth.withdraw(amount);
	    (bool success, ) = target.call{value: amount}(callPayload);
	    if (!success) {
@>	        payable(from).transfer(amount); //@audit wrong address as it uses the source address, not destination
	    }
	}
```

Now, `DecentBridgeAdapter` as a refund address seems wrong, as I disclosed in another issue, but let's suppose that it isn't, as it's possible to prove both scenarios.

[As proof by contradiction](https://en.wikipedia.org/wiki/Proof_by_contradiction), funds should be sent to `DecentBridgeAdapter`, and this would be a non-issue if these contracts are deployed with `CREATE2`, as they would have the same address. But they are not deployed like that.

There is hard evidence that they have different addresses, for example, these are the addresses for `DcntEth` and `DecentEthRouter` in two different chains, which are already deployed:

*   `lib/decent-bridge/actual-deployments/latest/arbitrumAddresses.json`

```js
{
  "arbitrum_DcntEth": "0x8450e1A0DebF76fd211A03c0c7F4DdbB1eEF8A85",
  "done": true,
  "arbitrum_DecentEthRouter": "0x17479B712A1FE1FFaeaf155379DE3ad1440fA99e"
}
```

*   `lib/decent-bridge/actual-deployments/latest/optimismAddresses.json`

```js
{
  "DcntEth": "0x4DB4ea27eA4b713E766bC13296A90bb42C5438D0",
  "done": true,
  "DecentEthRouter": "0x57beDF28C3CB3F019f40F330A2a2B0e0116AA0c2"
}
```

If we take a look at the deploy script for `DecentBridgeAdapter` it also doesn't use `CREATE2`, as there isn't a factory:

```solidity
	function deployDecentBridgeAdapter(
	    address utb,
	    address decentEthRouter,
	    address decentBridgeExecutor
	) internal returns (
	    DecentBridgeAdapter decentBridgeAdapter
	) {
	    string memory chain = vm.envString("CHAIN");
	    bool gasIsEth = gasEthLookup[chain];
	    address weth = wethLookup[chain];
	    address bridgeToken = gasIsEth ? address(0) : weth;

@>	    decentBridgeAdapter = new DecentBridgeAdapter(gasIsEth, bridgeToken);
	    decentBridgeAdapter.setUtb(utb);
	    decentBridgeAdapter.setRouter(decentEthRouter);
	    decentBridgeAdapter.setBridgeExecutor(decentBridgeExecutor);
	    UTB(payable(utb)).registerBridge(address(decentBridgeAdapter));
	}
```

So these funds will be sent to a random address in any case.

### Recommended Mitigation Steps

The `executor.execute` call in `DecentEthRouter.onOFTReceived` should be changed to an appropriate address (**e.g. the user refund address**) instead of using `_from`:

```solidity
	} else {
	    weth.approve(address(executor), _amount);
	    executor.execute(_from, _to, deliverEth, _amount, callPayload);
	}
```

**[0xsomeone (Judge) commented](https://github.com/code-423n4/2024-01-decent-findings/issues/436#issuecomment-1924325469):**
 > The Warden has detailed how the encoding of the cross-chain payload will use an incorrect `_from` parameter under normal operating conditions, leading to failed transfers at the target chain refunding the wrong address.
> 
> This submission was selected as the best given that it precisely details that the `_from` address is known to be incorrect at all times when the protocol is used normally.
> 
> A high-risk rating is appropriate as any failed call will lead to **full fund loss for the cross-chain call**.

**[wkantaros (Decent) confirmed](https://github.com/code-423n4/2024-01-decent-findings/issues/436#issuecomment-1942661007)**

***
