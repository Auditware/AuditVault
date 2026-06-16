---
tags:
  - lang/rust
  - sector/bridge
  - sector/governance
  - sector/staking
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[ZetaChain Cross Chain]]"
auditors:
  - berndartmueller
report: "https://github.com/sherlock-audit/2025-04-zetachain-cross-chain-judging"
genome:
  - "[[bridge-lock-mint-parity]]"
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# H-1: Malicious observer can drain Solana bridge by adding failed deposit transaction to inbound tracker

- id: 58631
- impact: HIGH
- protocol: ZetaChain Cross-Chain
- reporter: berndartmueller (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability in the Solana-Zetachain bridge that allows a single entity with admin or observer role to drain the bridge. This is due to a lack of validation on the Solana transaction's meta, which allows for spoofed deposits to be processed as valid. This can result in the theft of all lamports and SPL tokens deposited in the bridge. A proof of concept has been provided and a mitigation has been suggested. The protocol team has fixed this issue in a recent pull request. 

## Details


Source: https://github.com/sherlock-audit/2025-04-zetachain-cross-chain-judging/issues/58 

## Found by 
0xalpharush, berndartmueller

### Summary

Any single entity with the admin or observer role can drain the Solana-Zetachain bridge. Deposits can be spoofed by encoding a deposit instruction such that the transaction fails yet is still processed as valid when a malicious observer adds the tx to the inbound CCTX tracker. This is due to the lack of validation on the solana transaction’s meta not containing an error. Normally, observers will not process failing transactions, but this code path fails to perform the same validation unlike its EVM counterpart. While this requires a "privileged" role, [every validator is an observer](https://www.zetachain.com/docs/developers/architecture/observers/) and BFT consensus is supposed to be byzantine tolerant i.e. tolerate <1/3 malicious parties. Thus, one malicious observer should not be able to forge a deposit and induce honest validators to vote to mint ZRC20 Sol for failed transactions through the inbound tracker, which lacks validations for its Solana implementation.

### Root Cause

The `ProcessInboundEvents` [function](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/solana/observer/inbound.go#L147-L157) does not require a transaction to have succeeded unlike the EVM inbound observer which does this correctly [here](https://github.com/zeta-chain/node/blob/f7cd1b57a3e289288671bfd38c41c43248d4491a/zetaclient/chains/evm/observer/inbound.go#L555-L557). Since the instruction is decoded as if it succeeded, a malicious observer can spoof a deposit for the entire ZRC20-SOL balance and then withdraw the SOL locked in the Solana side of the bridge, stealing all lamports in the bridge. This attack could also be used to withdraw SPL tokens or perform arbitrary deposits and calls. For example, [removing the writable property from the gateway’s PDA](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/e2e/runner/solana.go#L72) in the deposit instruction results in a failing transaction (see the anchor constraint error in the POC), and it can still be processed once added to the inbound tracker via `MsgAddInboundTracker`.

### Internal Pre-conditions

1. A malicious or negligent observer adds the a failing Solana tx that contains Gateway instructions to the inbound tracker using `MsgAddInboundTracker`, resulting in all validators processing and voting to mint ZRC20 Sol on Zetachain.
2. The CCTX receives sufficient votes and unbacked ZRC20 Sol on Zetachain is minted.

### External Pre-conditions

1. Any party sends a failing transaction to the gateway with a deposit instruction (or deposit and call).
2. The recipient of the ZRC20 Sol on Zetachain withdraws it and receives lamports on Solana.

### Attack Path

1. Any party sends a failing transaction to the gateway with a [deposit](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/protocol-contracts-solana/programs/gateway/src/instructions/deposit.rs#L14) instruction (or deposit and call).
2. A malicious or negligent observer adds the a failing Solana tx that contains Gateway instructions to the inbound tracker [using](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/x/crosschain/keeper/msg_server_add_inbound_tracker.go#L15-L36) `MsgAddInboundTracker`, resulting in all validators processing and voting to mint ZRC20 Sol on Zetachain.
3. The `ProcessInboundTrackers` [task](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/solana/observer/inbound_tracker.go#L13) causes the spoofed CCTX to received sufficient votes, and unbacked ZRC20 Sol on Zetachain is minted.
4. The recipient of the ZRC20 Sol on Zetachain withdraws it and receives lamports on Solana.

### Impact

All lamports and SPL tokens deposited in the Solana bridge can be stolen given deposits can be forged for any amount (they are processed despite the Gateway program causing the txs to revert). 

### PoC

Apply the git diff [here](https://gist.github.com/0xalpharush/a3bfd706019bb3e5df2e964e81b6feb0) to the `node/`.

Run the following tests
```bash
$ export E2E_ARGS='--verbose'
$ make start-solana-test  
$ docker logs orchestrator --follow
```
Observe in the orchestrator's logs that the `solana_deposit ` test passes, and ZRC20 is minted for a failing deposit transaction (fails with `AnchorError caused by account: pda. Error Code: ConstraintMut. Error Number: 2000`).

### Mitigation

Do not process events from failing Solana txs by checking its `Meta.Err` is `nil` as [this patch does](https://gist.github.com/0xalpharush/a3bfd706019bb3e5df2e964e81b6feb0#file-example_fix-patch).

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/zeta-chain/node/pull/3914


**gjaldon**

Fixed by [adding a check](https://github.com/zeta-chain/node/pull/3914/files\#diff-a7a25c64f1579daa309e07a058f631b8f9867587fc45fc9c531b3625c5f87b28R152-R155) that the transaction succeeded before observing it as an Inbound.




