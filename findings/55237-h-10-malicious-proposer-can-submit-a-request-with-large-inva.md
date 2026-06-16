---
tags:
  - sector/governance
  - sector/staking
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - lang/solidity
  - lang/rust
protocol: "[[SEDA Protocol]]"
auditors:
  - bronze\_pickaxe
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[dos-resistance]]"
  - "[[variant]]"
---
# H-10: Malicious proposer can submit a request with large invalid transactions because of no mempool to bloat the block store

- id: 55237
- impact: HIGH
- protocol: SEDA Protocol
- reporter: bronze\_pickaxe (Sherlock)
- source: N/A

## Summary


The report discusses a bug found in the SEDA Chain protocol, where a malicious proposer can submit a block filled with invalid transactions, causing unnecessary bloat in the chain. This is due to the lack of transaction validation in the default proposal handlers, which are configured to use a no-op mempool. The impact of this bug includes increased network bandwidth, CPU/memory usage, and storage space. The bug has been fixed by the protocol team in a recent PR. To mitigate this issue, it is recommended to replace the no-op mempool with a valid one when configuring the proposal handlers. 

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/241 

## Found by 
Boy2000, bronze\_pickaxe, g

### Summary

Context:
- Raw transaction bytes of every transaction included in a proposed block will be stored by CometBFT in its Blockstore
- There is no BlockStore pruning done by SEDA Chain

The SEDA Chain's proposal handlers are configured with a [no-op mempool](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/app/app.go#L1012). This default ProcessProposal handler
is [called](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/app/abci/handlers.go#L273) after the vote extensions have been verified. Since 
the handler is configured with a no-op mempool, [no additional processing](https://github.com/cosmos/cosmos-sdk/blob/main/baseapp/abci_utils.go#L421-L427) is done and the transactions are accepted with verification.

Given the above, a malicious proposer can abuse the lack of transaction validation and fill every block they propose with invalid
transactions up to the MaxBlockSize (a consensus parameter set in CometBFT). 

### Root Cause

In [`app.go:1012`](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/app/app.go#L1012), the default proposal handlers are configured to use the `NoOpMempool`. However, it is not advisable to use that in production because
of the lack of transaction verification.

```golang
defaultProposalHandler := baseapp.NewDefaultProposalHandler(mempool.NoOpMempool{}, bApp)
```

### Internal Pre-conditions
None


### External Pre-conditions
None


### Attack Path

1. A proposer proposes a block with a valid first transaction and the rest of the block filled with invalid transactions up to the MaxBlockSize.
2. This block with mostly invalid transactions will be accepted by every validator even if all the other transactions fail. The raw transaction bytes of all the transactions will be recorded in the BlockStore.


### Impact

Permanent storage of invalid transactions that would bloat the chain unnecessarily and consume more resources during:
- Block propagation (network bandwidth)
- Block processing (CPU/memory)
- Block storage (disk space)
- Future node synchronization

### PoC
None


### Mitigation
Consider replacing `NoOpMempool` with a valid mempool when configuring the proposal handlers.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-chain/pull/520
