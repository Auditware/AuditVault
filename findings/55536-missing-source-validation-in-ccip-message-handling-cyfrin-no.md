---
tags:
  - lang/solidity
  - sector/bridge
  - sector/oracle
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Yieldfi]]"
auditors:
  - Immeas
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-04-24-cyfrin-yieldfi-v2.0.md"
genome:
  - "[[bridge-sender-auth]]"
  - "[[message-spoofing]]"
  - "[[missing-seeds-check]]"
  - "[[variant]]"
  - "[[bridge-is-secure]]"
  - "[[add-check]]"
  - "[[cross-chain-message]]"
---
# Missing source validation in CCIP message handling

- id: 55536
- impact: HIGH
- protocol: Yieldfi
- reporter: Immeas (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-04-24-cyfrin-yieldfi-v2.0.md

## Summary


The YieldFi platform uses Chainlink CCIP to transfer its yield tokens between different blockchains. However, there is a bug in the `BridgeCCIP` contract that allows an attacker to send a message from an untrusted source chain and potentially drain tokens from the bridge or create an unlimited amount of tokens on another blockchain. To prevent this, the report recommends implementing validation to only accept messages from trusted sources. This bug has been fixed in the latest update and has been verified by Cyfrin.

## Details

**Description:** YieldFi integrates with Chainlink CCIP to facilitate cross-chain transfers of its yield tokens (`YToken`). This functionality is handled by the `BridgeCCIP` contract, which manages token accounting for these transfers.

However, in the [`BridgeCCIP::_ccipReceive`](https://github.com/YieldFiLabs/contracts/blob/40caad6c60625d750cc5c3a5a7df92b96a93a2fb/contracts/bridge/ccip/BridgeCCIP.sol#L160-L181) function, there is no validation of the message sender from the source chain:
```solidity
/// handle a received message
function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override {
    bytes memory message = abi.decode(any2EvmMessage.data, (bytes)); // abi-decoding of the sent text
    BridgeSendPayload memory payload = Codec.decodeBridgeSendPayload(message);
    bytes32 _hash = keccak256(abi.encode(message, any2EvmMessage.messageId));
    require(!processedMessages[_hash], "processed");

    processedMessages[_hash] = true;

    require(payload.amount > 0, "!amount");

    ...
}
```

As a result, an attacker could craft a malicious `Any2EVMMessage` containing valid data and trigger the minting or unlocking of arbitrary tokens by sending it through CCIP to the `BridgeCCIP` contract.


**Impact:** An attacker could drain the bridge of tokens on L1 or mint an unlimited amount of tokens on L2. While a two-step redeem process offers some mitigation, such an exploit would still severely disrupt the protocol’s accounting and could be abused when claiming yield for example.

**Recommended Mitigation:** Consider implementing validation to ensure that messages are only accepted from trusted peers on the source chain:
```solidity
mapping(uint64 sourceChain => mapping(address peer => bool allowed)) public allowedPeers;
...
function _ccipReceive(
    Client.Any2EVMMessage memory any2EvmMessage
) internal override {
    address sender = abi.decode(any2EvmMessage.sender, (address));
    require(allowedPeers[any2EvmMessage.sourceChainSelector][sender],"allowed");
    ...
```

**YieldFi:** Fixed in commit [`a03341d`](https://github.com/YieldFiLabs/contracts/commit/a03341d8103ba08473ea1cd39e64192608692aca)

**Cyfrin:** Verified. `sender` is now verified to be a trusted sender.
