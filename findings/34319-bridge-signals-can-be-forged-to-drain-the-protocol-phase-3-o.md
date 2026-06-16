---
tags:
  - lang/solidity
  - sector/bridge
  - sector/nft
  - sector/staking
  - sector/token
  - sector/vault
  - platform/openzeppelin
  - has/github
  - severity/high
  - trigger/cross-chain-message
  - novelty/variant
protocol: "[[Taiko]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/taiko-protocol-audit"
genome:
  - "[[message-spoofing]]"
  - "[[cross-chain-message]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[bridge-sender-auth]]"
  - "[[vote-delegation-loop]]"
  - "[[commitment-uniqueness]]"
---
# Bridge Signals Can Be Forged to Drain the Protocol - Phase 3

- id: 34319
- impact: HIGH
- protocol: [[Taiko]] Protocol Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/taiko-protocol-audit

## Summary


The bug report describes a vulnerability in the `Bridge` contract, which allows an attacker to send arbitrary messages and manipulate the system. The `sendMessage` function in the `Bridge` contract calls the `sendSignal` function in the `SignalService` contract, which checks the quota and validates the message before making an external call to the destination address. However, when a message is retried, these checks are not applied, allowing an attacker to exploit the system.

To exploit this vulnerability, the attacker can send a message on the destination chain that will exceed the quota and be set to `RETRIABLE` without being validated. The attacker can then retry the message and make the `Bridge` contract invoke the call to `sendSignal`, which can be used to spoof addresses and drain user assets.

The vulnerability can occur between any two layers where one layer has an ETH quota defined. The report suggests validating messages before setting them to `RETRIABLE` or when retrying them to prevent this exploit.

The bug has been fixed in a recent pull request, but it introduced another vulnerability that allows for double spending of the fee. This has also been addressed in a subsequent pull request.

In summary, the bug report highlights a vulnerability in the `Bridge` contract that allows an attacker to send arbitrary messages and manipulate the system. The suggested fix is to validate messages before setting them to `RETRIABLE` or when retrying them. 

## Details

Cross-chain messages can be sent by calling the `sendMessage` function on the `Bridge` contract. This function in turn calls `sendSignal` on the `SignalService` contract [with the hash of the sent message](https://github.com/taikoxyz/taiko-mono/blob/b90b932f29e6a933625d973bc32c2f0a1c6908e4/packages/protocol/contracts/bridge/Bridge.sol#L162). When a message is processed on the destination chain, `_message.value + _message.fee` is checked [not to exceed the current quota](https://github.com/taikoxyz/taiko-mono/blob/b90b932f29e6a933625d973bc32c2f0a1c6908e4/packages/protocol/contracts/bridge/Bridge.sol#L247). If it exceeds the quota, the message's status is set to `RETRIABLE` and can be re-executed later. Otherwise, the message is [validated](https://github.com/taikoxyz/taiko-mono/blob/b90b932f29e6a933625d973bc32c2f0a1c6908e4/packages/protocol/contracts/bridge/Bridge.sol#L253) not to call forbidden addresses and to match `onMessageInvocation`'s function selector, after which the [external call is made to the destination address](https://github.com/taikoxyz/taiko-mono/blob/b90b932f29e6a933625d973bc32c2f0a1c6908e4/packages/protocol/contracts/bridge/Bridge.sol#L264).


However, the [checks](https://github.com/taikoxyz/taiko-mono/blob/b90b932f29e6a933625d973bc32c2f0a1c6908e4/packages/protocol/contracts/bridge/Bridge.sol#L639-L645) constraining the target of the message or the function selector are consequently not applied when a message is retried. Assuming an ETH quota on L1, an attacker can thus perform the following actions to invoke any message on L2:


1. [Send a message](https://github.com/taikoxyz/taiko-mono/blob/dd8725f8d27f835102fa3c5a013003090268357d/packages/protocol/contracts/bridge/Bridge.sol#L126) on L2 that will exceed the available L1 ETH quota, targeting the `SignalService` to call `sendSignal`. The sent signal must be the hash of the crafted message, which the attacker will process on L2 in step 5.
2. The attacker attempts to process this message on L1, but as the [message exceeds the quota](https://github.com/taikoxyz/taiko-mono/blob/dd8725f8d27f835102fa3c5a013003090268357d/packages/protocol/contracts/bridge/Bridge.sol#L213), it would be directly set to `RETRIABLE` without validating its target or the function selector.
3. This message can then be retried and will make the `Bridge` contract [invoke the call](https://github.com/taikoxyz/taiko-mono/blob/b90b932f29e6a933625d973bc32c2f0a1c6908e4/packages/protocol/contracts/bridge/Bridge.sol#L325) to `sendSignal`. Note that `sendSignal` is non-payable, so the message in step 1 would need to have a value of zero but a fee in excess of the available L1 ETH quota.
4. The L1 signal will be synchronized with L2 through normal protocol operation.
5. The attacker can [process](https://github.com/taikoxyz/taiko-mono/blob/dd8725f8d27f835102fa3c5a013003090268357d/packages/protocol/contracts/bridge/Bridge.sol#L213) the crafted message.


Sending arbitrary messages from the `Bridge` is a powerful attack vector as it also allows spoofing any address through the [`Bridge` context](https://github.com/taikoxyz/taiko-mono/blob/dd8725f8d27f835102fa3c5a013003090268357d/packages/protocol/contracts/bridge/Bridge.sol#L487). This makes it possible to forward arbitrary amounts of [ETH](https://github.com/taikoxyz/taiko-mono/blob/b90b932f29e6a933625d973bc32c2f0a1c6908e4/packages/protocol/contracts/bridge/IBridge.sol#L51) or mint any [ERC-20](https://github.com/taikoxyz/taiko-mono/blob/b90b932f29e6a933625d973bc32c2f0a1c6908e4/packages/protocol/contracts/tokenvault/ERC20Vault.sol#L279-L280), [ERC-721](https://github.com/taikoxyz/taiko-mono/blob/b90b932f29e6a933625d973bc32c2f0a1c6908e4/packages/protocol/contracts/tokenvault/ERC721Vault.sol#L99-L100), or [ERC-1155](https://github.com/taikoxyz/taiko-mono/blob/b90b932f29e6a933625d973bc32c2f0a1c6908e4/packages/protocol/contracts/tokenvault/ERC1155Vault.sol#L104-L105) token on the L2. These tokens can then be bridged back to drain user assets from the `Bridge` and vault contracts on L1, subject to quotas per amount of time given by the `QuotaManager`. Furthermore, by spoofing the [`realOwner` of the `DelegateOwner`](https://github.com/taikoxyz/taiko-mono/blob/dd8725f8d27f835102fa3c5a013003090268357d/packages/protocol/contracts/L2/DelegateOwner.sol#L80-L84) contract, a backdoor can be installed that will be exploited at a later point in time.


Note that we assumed above for simplicity, but without loss of generality, that there were only two layers. This is because the exploit can occur between any two layers where one layer has an ETH quota defined.


Consider [validating](https://github.com/taikoxyz/taiko-mono/blob/b90b932f29e6a933625d973bc32c2f0a1c6908e4/packages/protocol/contracts/bridge/Bridge.sol#L253C17-L253C43) that messages are not calling arbitrary functions or forbidden addresses before setting their status to `RETRIABLE` or when retrying the message.


***Update:** Resolved in [pull request #17411](https://github.com/taikoxyz/taiko-mono/pull/17411) at commit [304aec2](https://github.com/taikoxyz/taiko-mono/commit/304aec216b605e597b2d11201665adba20a35c2f). The invocation target and function signature are now also checked in the `retryMessage` function. However, the fix introduced a double spending attack vector of the fee that was addressed in [pull request #17446](https://github.com/taikoxyz/taiko-mono/pull/17446) at commit [891967d](https://github.com/taikoxyz/taiko-mono/pull/17446/commits/891967dc1505ed0d332fdc408402029f0a6ff1ff).*
