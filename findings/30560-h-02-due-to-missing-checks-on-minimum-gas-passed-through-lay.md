---
tags:
  - lang/solidity
  - sector/bridge
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/unbounded-loop
  - novelty/known-pattern
protocol: "[[Decent]]"
auditors:
  - "[[iamandreiski]]"
report: "https://code4rena.com/reports/2024-01-decent"
genome:
  - "[[unbounded-loop]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# [H-02] Due to missing checks on minimum gas passed through LayerZero, executions can fail on the destination chain

- id: 30560
- impact: HIGH
- protocol: [[Decent]]
- reporter: iamandreiski (Code4rena)
- source: https://code4rena.com/reports/2024-01-decent

## Summary


This bug report discusses a problem with the code in the DecentEthRouter contract, which is used for transferring assets between different blockchains. The issue is related to the amount of gas (a unit of measurement for transaction fees) that is required for a successful transfer. The contract logic assumes that the user will first estimate the fees and then pass that amount when making the transfer, but this is not enforced and can lead to errors if the user inputs an insufficient amount of gas. This can result in failed transfers and a blockage in communication between the source and destination blockchains. The severity of this issue is considered high, as it can permanently block the cross-chain communication. A proposed solution is to enforce a minimum amount of gas at the transaction level and a maximum amount at the executor level to prevent this issue from occurring. The Decent team has since implemented an upgrade to address this vulnerability.

## Details


<https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DecentEthRouter.sol#L148-L194> 

<https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DecentEthRouter.sol#L80-L111>

In LayerZero, the destination chain's function call requires a specific gas amount; otherwise, it will revert with an out-of-gas exception. It falls under the responsibility of the User Application to ensure that appropriate limits are established. These limits guide relayers in specifying the correct gas amount on the source chain, preventing users from inputting insufficient values for gas.

The contract logic in `DecentEthRouter`, assumes that a user will first get their estimated fees through `estimateSendAndCallFee()` and pass it as an argument in either `bridge()` or `bridgeWithPayload()` to be added to the calculation together with the hardcoded `GAS_FOR_RELAY` so that it can be passed as the adapter params when `CommonOFT.LzCallParams` is called, although this is not enforced and is left on the user's responsibility.

A user can pass an arbitrary value as the `_dstGasForCall` argument to be added to the hardcoded `GAS_FOR_RELAY` fee, thus sending less gas than required which can lead to out-of-gas exceptions.

Once the message is received by destination, the message is considered delivered (transitioning from INFLIGHT to either SUCCESS or STORED), even though it threw an out-of-gas error.

Any uncaught errors/exceptions (including out-of-gas) will cause the message to transition into STORED. A STORED message will block the delivery of any future message from source to all destination on the same destination chain and can be retried until the message becomes SUCCESS.

As per: <https://layerzero.gitbook.io/docs/faq/messaging-properties>

### Proof of Concept

According to the LayerZero integration checklist: <br><https://layerzero.gitbook.io/docs/troubleshooting/layerzero-integration-checklist>

LayerZero recommends a 200,000 amount of gas to be enough for most chains and is set as default.

*   "200k for OFT for all EVMs except Arbitrum is enough. For Arbitrum, set as 2M."

In the DecentEthRouter, the `GAS_FOR_RELAY` is hardcoded at 100,000.

            uint256 GAS_FOR_RELAY = 100000;
            uint256 gasAmount = GAS_FOR_RELAY + _dstGasForCall;

The contract logic assumes that a user would willingly first call the `estimateSendAndCallFee` to get the `nativeFee` + the `zroFee` fom `dcntEth.estimateSendAndCallFee` and then pass the addition of the nativeFee + zeroFee as the `_dstGasForCall` argument when calling `bridge()` or `bridgeWithPayload()`:

        function bridgeWithPayload(
            uint16 _dstChainId,
            address _toAddress,
            uint _amount,
            bool deliverEth,
            uint64 _dstGasForCall,
            bytes memory additionalPayload
        ) public payable {
            return
                _bridgeWithPayload(
                    MT_ETH_TRANSFER_WITH_PAYLOAD,
                    _dstChainId,
                    _toAddress,
                    _amount,
                    _dstGasForCall,
                    additionalPayload,
                    deliverEth
                );
        }

Once the internal `_bridgeWithPayload` function is called:

```
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


        ICommonOFT.LzCallParams memory callParams = ICommonOFT.LzCallParams({
            refundAddress: payable(msg.sender),
            zroPaymentAddress: address(0x0),
            adapterParams: adapterParams
        });

```

It calls the `_getCallParams` function which will calculate and pack the needed arguments to be passed as the LayerZero call params, without performing any checks whether the total gas amount is sufficient or that the user passed argument `_dstGasForCall` is greater than the total of `(uint nativeFee, uint zroFee) = dcntEth.estimateSendAndCallFee`.

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

This can lead to failed messages on the destination. Which would yield the above-message results of a possible blockage in the communication with the source and destination.

*   A malicious or an unbeknownst user can pass 1,000 as an argument for `_dstGasForCall`, making the total gas forwarded to the `LzCallParams()` 101,000 which will make a certain type of calls fail (depending on payload), and especially calls made on Arbitrum.

### Recommended Mitigation Steps

Validate/require that the `_dstGasForCall` parameter is greater than `nativeFee` + `zroFee` or re-engineer the architecture to make the `estimateSendAndCallFee()` function a mandatory step of the process.

**[0xsomeone (Judge) increased severity to High and commented](https://github.com/code-423n4/2024-01-decent-findings/issues/525#issuecomment-1923713863):**
 > This and all duplicate exhibits highlight that the `GAS_FOR_RELAY` is a hard-coded value and that the overall gas supplied for a cross-chain call can be controlled by a user.
> 
> A severity of high is appropriate given that the cross-chain LayerZero channel will be permanently blocked.
> 
> None of the submissions have correctly proposed a solution as a mere adjustment of the `GAS_FOR_RELAY` is insufficient. The `DecentBridgeExecutor` permits arbitrary calls to be made that can force the transaction to run out-of-gas regardless of the gas limit imposed. This is properly defined in [#697](https://github.com/code-423n4/2024-01-decent-findings/issues/697).
> 
> A valid solution for this problem would be a combination of a minimum enforced at the transaction level and a maximum gas consumed enforced at the executor level, ensuring that the gas remainder **after the executor performs the arbitrary call** is enough to store the failed message. This can be achieved by performing a subtraction from the `gasleft` value (hard to implement as it would need to take into account the cost of `keccak256` encoding the data payload) or by enforcing a fixed value that should be much less than the minimum imposed on the source chain.
> 
> This submission was selected as the best given that it illustrates in-depth knowledge of the LayerZero system states and correctly highlights that a user can also maliciously block the channel.

**[wkantaros (Decent) acknowledged via duplicate #212, but disagreed with severity and commented](https://github.com/code-423n4/2024-01-decent-findings/issues/212#issuecomment-1917870512):**
> This vulnerability is not a concern in Layer Zero v2. Decent designed the contracts expecting to use LZ v2 and have since implemented this upgrade.

***
