---
tags:
  - sector/token
  - has/github
  - severity/high
protocol: "[[XPress Protocol]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#1-several-reentracy-scenarios"
genome:
  - "[[reentrancy-guard]]"
  - "[[missing-modifier]]"
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[admin-is-honest]]"
  - "[[external-call-is-safe]]"
  - "[[add-access-control]]"
  - "[[reentrancy-callback]]"
---
# Several reentracy scenarios

- id: 53799
- impact: HIGH
- protocol: XPress Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#1-several-reentracy-scenarios

## Summary


The report discusses a bug found in the `LOB` contract, which is used for transferring ERC-20 tokens. The bug involves a type of token called ERC-777, which allows an attacker to gain control during a token transfer and launch a "reentrancy" attack. This means they can manipulate the protocol and potentially steal tokens by exploiting an inconsistent state. The severity of this bug is considered critical as it can result in significant financial loss. The report recommends using the OpenZeppelin `nonReentrant` modifier and updating the trader's balance to prevent these attacks.

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
