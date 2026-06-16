---
tags:
  - sector/bridge
  - sector/governance
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
# H-3: A Malicious Observer can use TON's Outbound Tracker to steal funds from Zetachain

- id: 58633
- impact: HIGH
- protocol: ZetaChain Cross-Chain
- reporter: g (Sherlock)
- source: N/A

## Summary


Summary: The `processOutboundTracker()` function in the Zetachain cross-chain system does not check if the nonce of a TON transaction matches the nonce of the corresponding CCTX transaction. This allows a malicious observer to add a transaction hash to the tracker that points to a different withdrawal transaction, resulting in the attacker being able to withdraw funds from Zetachain twice instead of once. This can lead to permanent loss of funds for Zetachain and the attacker gaining more funds than they originally withdrew. The protocol team has fixed this issue in a recent commit.

## Details


Source: https://github.com/sherlock-audit/2025-04-zetachain-cross-chain-judging/issues/373 

## Found by 
g

### Summary

The [`processOutboundTracker()`](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/ton/observer/outbound.go#L102-L134) does not check that the TON transaction's nonce matches the CCTX nonce. This allows a malicious Observer to add a tx hash to the tracker that points to a TON withdrawal transaction with a different nonce and has failed, even though their withdrawal succeeded. This allows them to extract funds from Zetachain twice instead of once. Once through the successful withdrawal in TON and another through the refund for the reverted outbound CCTX in Zetachain. 

### Root Cause

There are no checks in [`processOutboundTracker()`](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/ton/observer/outbound.go#L102-L134) that the TON transaction's nonce does not match the nonce of the outbound CCTX. This enables the passing of withdrawal transaction hashes for different outbound CCTXs (those with different nonces). 

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. A malicious Observer withdraws TON coins from Zetachain to TON, creating an outbound CCTX with nonce 42.
2. Their outbound CCTX is [processed](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/ton/signer/signer.go#L93-L156), and they receive the withdrawn TON.
3.  Before the outbound voting for the outbound CCTX 42 starts, the malicious Observer [adds](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/x/crosschain/keeper/msg_server_add_outbound_tracker.go#L20-L107) a transaction hash to the outbound tracker for CCTX 42. The hash points to a different withdrawal transaction that failed.
4. Every Observer will [process](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/ton/observer/outbound.go#L102-L134) the outbound tracker for 42 and set its [receiveStatus](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/ton/observer/outbound.go#L122) to failed.
5. Every Observer will post a [vote outbound](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/ton/observer/outbound.go#L31-L52) for the outbound CCTX 42. They will vote that they observed a failure.
6. Once the consensus is reached and the vote has been finalized, the failed outbound CCTX 42 will [trigger](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/x/crosschain/keeper/cctx_orchestrator_validate_outbound.go#L188-L190) trigger a revert and refund the TON coins to the sender in Zetachain.


### Impact

Zetachain will permanently lose TON coins to the attacker. The attacker gains TON coins equal to their withdrawal amount on top of the amount withdrawn.

### PoC

_No response_

### Mitigation

Consider checking that the outbound CCTX nonce matches the nonce used in the TON transaction and that the transaction has incremented the nonce.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/zeta-chain/node/pull/3977





