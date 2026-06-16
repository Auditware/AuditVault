---
tags:
  - lang/solidity
  - sector/bridge
  - platform/sigmaprime
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - trigger/cross-chain-message
protocol: "[[Taiko]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/taiko/review.pdf"
genome:
  - "[[message-spoofing]]"
  - "[[direct-drain]]"
  - "[[cross-chain-message]]"
  - "[[bridge-sender-auth]]"
---
# Fraudulent Messages May Be Sent Through The Bridge

- id: 35996
- impact: HIGH
- protocol: [[Taiko]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/taiko/review.pdf

## Summary


The bug report describes a vulnerability in the SignalService contract, which allows attackers to steal tokens and Ether from the ERCxxxxVault and Bridge. This is done by sending a malicious message hash to the SignalService contract, which is then processed and stored with a storage slot calculated with msg.sender = Bridge. This allows the attacker to generate a valid proof and steal the Ether from the bridge. The report recommends adding restrictions to message.to and the function selector, and the issue has been resolved by including additional checks on the message.to field. These changes can be seen in PR #15577.

## Details

## Description

Due to the lack of restrictions on `message.to` and `message.data` when processing a message, it is possible to steal tokens stored in the `ERCxxxxVault` and Ether stored in the Bridge by sending a malicious message hash to the `SignalService` contract.

To perform the attack, a message is sent using the `sendMessage()` function from one bridge to another, with the intended receiver being `SignalService.sendSignal()`. The data to send is a hash of an attacker constructed message. After processing the message, the hash of this malicious message is stored in the `SignalService` contract with a storage slot calculated with `msg.sender = Bridge`.

With the hash of the malicious message now stored in the `SignalService` contract, it is possible to generate a valid proof. The malicious message may then be processed on the bridge of the other chain.

## This is a detailed example of how an attacker could steal Ether from the bridge:

1. **On Chain A:**
   - The attacker calls the function `Bridge.sendMessage()` with a message that calls the `SignalService.sendSignal()` function of Chain B. The signal argument used when calling this function should represent a hash of a message that steals Ether from the Chain A bridge. This is an example of a malicious message:

   ```solidity
   Message({
       id: 1337,
       from: ATTACKER,
       srcChainId: ChainAId,
       destChainId: ChainBId,
       owner: ATTACKER,
       to: chainA_bridge_address,
       refundTo: ATTACKER,
       value: valueAmountEther,
       fee: 0,
       gasLimit: 0,
       data: "",
       memo: ""
   });
   ```

   - The attacker calculates the hash of this message and puts it inside a message that calls `SignalService.sendSignal()`. This is an example of this message:

   ```solidity
   IBridge.Message memory message = IBridge.Message({
       from: ATTACKER,
       srcChainId: ChainBId,
       destChainId: ChainAId,
       owner: ATTACKER,
       to: SignalService,
       refundTo: Attacker,
       value: 0,
       fee: 0,
       gasLimit: 0,
       data: abi.encodeWithSelector(SignalService.sendSignal.selector, msgHash),
       memo: ""
   });
   ```

2. **On Chain B:** The attacker calls the function `Bridge.processMessage()`. The signal is now stored and it is possible to generate the proof of it.

3. **On Chain A:** The attacker calls the function `Bridge.processMessage()` and all the Ether stored in the bridge is transferred to the attacker.

## Recommendations

- Add restrictions to `message.to`, restricting the smart contracts which can be called by the bridge.
- Additionally, restrict the function selector such that it calls a specific function when sending messages through the bridge. For example, require the selector matches `onMessageReceived(bytes memory data)`.

## Resolution

The issue has been resolved by including additional checks on the `message.to` field, preventing arbitrary addresses from being called. The `message.to` field is no longer able to be set to the `signalService` in addition to a modifiable `blacklist addressBanned`. The changes can be seen in PR #15577.
