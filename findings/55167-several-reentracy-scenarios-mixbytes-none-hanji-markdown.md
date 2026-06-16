---
tags:
  - sector/token
  - has/github
  - severity/high
  - lang/solidity
protocol: "[[Hanji]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/Hanji/OnchainCLOB/README.md#1-several-reentracy-scenarios"
genome:
  - "[[reentrancy-guard]]"
  - "[[missing-modifier]]"
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[admin-is-honest]]"
  - "[[external-call-is-safe]]"
---
# Several reentracy scenarios

- id: 55167
- impact: HIGH
- protocol: Hanji
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Hanji/OnchainCLOB/README.md#1-several-reentracy-scenarios

## Summary


The report states that there is a bug in the `LOB` contract. This bug is related to the ERC-777 standard, which allows for execution control during token transfers. This could lead to a "reentrancy" attack where an attacker can exploit the protocol and potentially cause financial loss. The report recommends applying the `nonReentrant` modifier and updating the trader's balance to prevent this type of attack.

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
