---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/bridge
protocol: "[[Tradable]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-09-01-Tradable.md"
genome:
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[bridge-sender-auth]]"
---
# Lack of proper integration with Gelato relay

- id: 44919
- impact: HIGH
- protocol: [[Tradable]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-09-01-Tradable.md

## Summary


The report states that there is a bug in the protocol that uses Gelato for gasless transactions. This means that users can send transactions without having a balance of the native token. However, with off-chain relaying, the user who initiates the transaction is no longer recognized. This creates a problem because the target smart contract needs to verify the origin of the message and ensure that it was forwarded by the designated relayer. To solve this issue, Gelato suggests using an ERC-2771 compliant contract that encodes data to relay the original msgSender. However, the TradableSideVault contract does not have this compatibility, making any function with the onlyGelatoRelay modifier unusable. This is because the _msgSender() function returns the address of the relayer instead of the original user. The recommendation is to implement Gelato's ERC-2771 compliant logic and follow security best practices.

## Details

**Severity**: High

**Status**:  Resolved

**Description**

The protocol employs Gelato for gasless transactions, enabling users to send transactions without a native token balance. However, with off-chain relaying, msg.sender no longer denotes the user initiating the transaction. When relaying a message to a target smart contract function, it becomes crucial for the function to authenticate the origin of the message and verify that it was correctly forwarded by the designated relayer. To address this challenge, Gelato recommends the utilization of an ERC-2771 compliant contract. This type of contract implements data encoding to relay the original _msgSender from off-chain, ensuring that only the trusted forwarder is able to encode this value. However, the TradableSideVault contract uses GelatoRelayContext, which lacks ERC-2771 compatibility. As a result, any function with the onlyGelatoRelay modifier becomes unusable. The use of the _msgSender() function originates from the Context.sol contract which solely returns the msg.sender value. In the situation where a transaction is initiated through the Gelato relayer, invoking `_msgSender()` will yield the address used by the relayer to forward the transaction, rather than the original user’s address.

**Recommendation**: 

Implement the Gelato’s ERC-2771 complaint logic and follow the security best practices.
