---
tags:
  - lang/solidity
  - sector/token
  - has/github
  - severity/high
protocol: "[[XPress]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress/OnchainCLOB/README.md#1-several-reentracy-scenarios"
genome:
  - "[[reentrancy-guard]]"
  - "[[missing-modifier]]"
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[admin-is-honest]]"
  - "[[external-call-is-safe]]"
  - "[[add-access-control]]"
  - "[[reentrancy-callback]]"
---
# Several reentracy scenarios

- id: 56836
- impact: HIGH
- protocol: XPress
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress/OnchainCLOB/README.md#1-several-reentracy-scenarios

## Summary


The report describes a bug in the `LOB` contract that could lead to financial loss. The bug is related to the use of ERC-20 tokens with extensions, which can give an attacker control during a token transfer. This control can be used to exploit the protocol and gain profit through a "reentrancy" attack. This attack involves setting up send/receive hooks and executing additional calls to the protocol to double-spend tokens. The severity of this bug is classified as critical. To prevent this issue, it is recommended to apply the OpenZeppelin `nonReentrant` modifier to all public and external functions and to update the trader's balance before performing transfer operations.

## Details

##### Description
The issue is identified within the `LOB` contract.

Some ERC-20 tokens implement extensions, such as the ERC-777 standard, that allow an account to gain execution control during token transfers. As the protocol is planned to be deployed on several networks and support various tokens, it may encounter issues related to these types of tokens.

If an attacker gains control during a token transfer, they can launch a "reentrancy" attack against the protocol by following these steps:
1. Set up send/receive hooks.
2. Perform an action that causes the protocol to send or receive tokens.
3. Execute additional calls to the protocol, exploiting the inconsistent state from step 2 to gain profit.

At a minimum, the following scenarios can be exploited:
- Withdraw tokens, reenter the protocol, and withdraw the same tokens again, effectively double-spending.
- Deposit tokens, reenter the protocol with the `placeOrder` function, and double-spend the tokens.

This issue is classified as **critical** severity because it can lead to significant financial loss through double-spending.

##### Recommendation
We recommend applying the OpenZeppelin `nonReentrant` modifier to all public and external mutable functions to prevent reentrancy attacks. Additionally, consider updating the trader's balance before performing the transfer operations.
