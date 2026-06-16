---
tags:
  - sector/bridge
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[ZetaChain Cross Chain]]"
auditors:
  - g
report: "https://github.com/sherlock-audit/2025-04-zetachain-cross-chain-judging"
genome:
  - "[[bridge-sender-auth]]"
  - "[[direct-drain]]"
---
# H-4: TON Observer processes each hash in the Outbound tracker and stores the result of the last nonce successfully processed

- id: 58634
- impact: HIGH
- protocol: ZetaChain Cross-Chain
- reporter: g (Sherlock)
- source: N/A

## Summary


This report discusses a bug found in the TON Observer, which is a tool used to process transactions on the Zetachain platform. The bug allows a malicious user to intentionally manipulate the results of a transaction and potentially double their funds at the expense of Zetachain. The root cause of the bug is that the TON Observer only stores the results of the last successfully processed transaction, rather than iterating through all transactions like the Bitcoin Observer does. This means that a malicious user can add a failed transaction with the same nonce as a successful one, causing the successful transaction to be marked as failed. This can lead to a loss of funds for the protocol and a gain of funds for the attacker. There is currently no mitigation in place for this bug.

## Details


Source: https://github.com/sherlock-audit/2025-04-zetachain-cross-chain-judging/issues/375 

## Found by 
g

### Summary

When the TON Observer processes an Outbound tracker, it will process [each hash](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/ton/observer/outbound.go#L86-L94) without stopping if an error is encountered. The last tx hash successfully processed will overwrite any previous successful processing when it calls [`setOutboundByNonce()`](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/ton/observer/outbound.go#L130-L131). This allows any malicious Observer to add the last tx hash to an Outbound Tracker to mess with the results intentionally. 

### Root Cause

Unlike the Bitcoin Observer, which will iterate every tx hash to [find](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/bitcoin/observer/outbound.go#L56-L68) the truly included outbound, the TON Observer will only [store](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/ton/observer/outbound.go#L130-L131) the results of the last transaction it successfully processed as long as:
1. It's a withdrawal transaction.
2. The signer of the payload hash is the TSS address.

There is also [no check](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/ton/observer/outbound.go#L136-L148) that the transaction has incremented the nonce.

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. Outbound 42 is a successful withdrawal where the sender has received their withdrawn amount.
2. A malicious Observer can add the tx hash to the Outbound Tracker of Outbound 42 with a failed withdrawal transaction with the same nonce. This can naturally occur when multiple Observers try to broadcast the same Outbound transaction. They do this at the last moment to ensure their tx hash will dictate the observed status.
3. When the Outbound Tracker for Outbound 42 is processed, their tx hash's results will be used, and it will be a receive_status of [failed](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/ton/observer/outbound.go#L143-L145). This means the attacker can make a successful observation into a failed observation.
4. Every Observer will vote on outbound 42 with a failed observation, marking it as a Pending Revert.
5. The sender of the withdrawal ends up claiming both the withdrawal and the refund on their withdrawal, doubling their funds at the expense of Zetachain.

### Impact

The protocol permanently loses funds equal to the withdrawal amount. The attacker/target will gain funds equal to their withdrawal amount, doubling their withdrawal amount.

### PoC

_No response_

### Mitigation

_No response_


