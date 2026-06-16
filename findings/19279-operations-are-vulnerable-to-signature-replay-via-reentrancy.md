---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - trigger/reentrancy-callback
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - sector/account
protocol: "[[BLS Wallet]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/bls-wallet/review.pdf"
genome:
  - "[[single-function]]"
  - "[[reentrancy-callback]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[permit-fork-replay]]"
  - "[[reentrancy-guard]]"
---
# Operations Are Vulnerable To Signature Replay Via Reentrancy

- id: 19279
- impact: HIGH
- protocol: [[BLS Wallet]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/bls-wallet/review.pdf

## Summary


This bug report describes a vulnerability in a wallet's operations which allows malicious users to replay a signature without further authorization from the wallet owner. This is done by calling the VerificationGateway.processBundle() function with a preloaded bundle containing a transaction that sends ETH to a malicious contract. This triggers a fallback function which gives control of execution to the attacker. This causes the operation to be executed again, transferring more ETH to the malicious contract each time until the victim's wallet is drained of its assets. This issue is rated as critical as it can be repeated an infinite number of times. 

A possible mitigation for this issue would be to move the incrementNonce() call to before the _performOperation() call. This would increment the nonce for any nested calls, preventing the malicious user from replaying the signature.

## Details

## Description

Operations are vulnerable to signature replay via reentrancy as the nonce is incremented after external calls are made. To prevent an operation from being repeated or operations from running in the wrong order, a nonce is attached to each operation. A wallet’s nonce is checked after the signature is verified; if the nonce is correct, the operation is then executed. Once an operation has been run, successful or not, the nonce is incremented.

However, because the nonce is incremented after an operation has finished, it is possible to replay a nonce by reentering `processBundle()` during an operation execution. This means the same signature can be used repeatedly without further authorization from the wallet owner.

A valid exploitation scenario would consist of a malicious user writing a smart contract that contains a fallback function. The fallback function calls `VerificationGateway.processBundle()` with a preloaded bundle. The malicious user must first store the operation with the replayable signature in their malicious contract. To achieve this, they listen to either the mempool or the off-chain bundle aggregator protocol to see the bundle containing a transaction that sends ETH to their malicious contract. Sending ETH to the malicious contract will trigger the fallback function, which gives control of execution to the attacker.

Now that the attacker has a signed operation that will give them control of execution, they may store the operation in the malicious contract. Next, the attacker will call `VerificationGateway.processBundle()`, where the bundle is the single stored operation. This will execute the operation, transferring ETH to the malicious contract. The malicious contract’s fallback function will be called. Within the fallback function, they may load the operation from storage and again call `VerificationGateway.processBundle()`. The operation will be processed a second time as the nonce has not been incremented and is therefore still valid. Due to executing the operation a second time, more funds are transferred to the malicious contract. The malicious contract may optionally repeat this process, transferring more ETH each time until there is minimal balance left in the victim’s wallet.

This issue is rated as critical, as any bundle with an action that gives control of execution to a third party may be replayed an infinite number of times. As a result, any value transfers may be repeated until there is no value left, draining a wallet of its assets.

## Recommendations

A possible mitigation of this issue would be to move the `incrementNonce()` call on line [160] to before `_performOperation()` on line [151]. As the nonce is checked prior to calling `performOperation()`, this will not affect the current operation but will increment the nonce for any nested calls.
