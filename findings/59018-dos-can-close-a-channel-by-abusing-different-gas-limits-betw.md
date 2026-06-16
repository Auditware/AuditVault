---
tags:
  - lang/solidity
  - sector/bridge
  - platform/quantstamp
  - severity/high
  - vuln/dos/unbounded-loop
  - novelty/known-pattern
protocol: "[[Datachain IBC]]"
auditors:
  - "[[Andrei Stefan]]"
report: "https://certificate.quantstamp.com/full/datachain-ibc/1e53ee14-4316-4cb1-9977-45753e49d5b2/index.html"
genome:
  - "[[unbounded-loop]]"
  - "[[temporary]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
---
# DoS Can Close a Channel by Abusing Different Gas Limits Between Chains

- id: 59018
- impact: HIGH
- protocol: Datachain - IBC
- reporter: Andrei Stefan (Quantstamp)
- source: https://certificate.quantstamp.com/full/datachain-ibc/1e53ee14-4316-4cb1-9977-45753e49d5b2/index.html

## Summary


The client has acknowledged an important issue with the cross-chain protocol. The problem occurs when a packet times out instead of being executed, which can lead to a denial of service attack. This is because different chains have different gas limits, causing one chain to run out of gas while processing the packet. The recommended solution is to add a configuration for different chains to ensure the data field adheres to the gas limits. This bug affects the files `IBCChannelPacketSendRecv.sol` and `IBCChannelPacketTimeout.sol`.

## Details

**Update**
Marked as "Acknowledged" by the client. Addressed in: `af68fc1feac5a4964538a1f295425810895479dd`. The client provided the following explanation:

> This is indeed an important issue for the cross-chain protocol. However, it is difficut to address this within the TAO layer defined in the IBC, as the TAO layer does not support validation based on additional counterparty chain information. Therefore, we believe it is appropriate to resolve this issue in the App layer (i.e., the module contract). We propose fixing this issue by adding a developer warning in the ibc-solidity documentation to clarify the responsibilities of the module regarding this issue. Specifically, we would emphasise that the module should handle such concerns and ensure that it does not send any packet data that could lead to this vulnerability.

**File(s) affected:**`contracts/core/04-chanel/IBCChannelPacketSendRecv.sol`, `contracts/core/04-chanel/IBCChannelPacketTimeout.sol`

**Description:** In order to send data (a packet) through IBC, a module needs to call the function `IBCChannelPacketSendRecv.sendPacket()`, and then the `IBCChannelPacketSendRecv.recvPacket()` function is called by a module in order to receive an IBC packet sent on the corresponding channel end on the counterparty chain. If a packet timeouts instead of being executed, on the originated chain the function `IBCChannelPacketTimeout.timeoutPacket()` is invoked, and the channel will be closed if it is of type `ORDERED`, thus not allowing following packets to be send. This feature can be leveraged in the context of EVM chains where you could find chains with significant gas limit differences per block (e.g, Ethereum with 30m gas limit vs Zircuit with 10m gas limit) to create a DoS by sending a large amount of data that could be processed by one chain but not by the other, therefore running into an `out of gas` error and making the packet timeout. The bigger the difference between the chains' gas limit per block, the easier it is to exploit the vulnerability.

**Exploit Scenario:**

1.   Alice sends through moduleA a packet that takes chainA 16 millions gas units to process.
2.   The packet is relayed on chainB and processed, however chainB runs into an `out of gas` error as the chainB maximum gas limit per block is 10 million gas units. 
3.   The function `timeoutPacket()` is called on chainA, and because the channel is `ORDERED`, it will be closed and the rest of the packets will not be sent anymore.

**Recommendation:** Add a configuration in storage where you configure for different chains different gas limits and ensure that `data` field adheres to them.
