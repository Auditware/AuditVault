---
tags:
  - platform/cantina
  - lang/solidity
  - has/poc
  - severity/high
  - sector/infra
protocol: "[[Berachain]]"
auditors:
  - "[[zigtur]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_berachain_january2025.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[proposal-state-check]]"
---
# VerifyIncomingBlock will return incorrect error status after building optimistic payload 

- id: 53116
- impact: HIGH
- protocol: [[Berachain]]
- reporter: zigtur (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_berachain_january2025.pdf

## Summary


The VerifyIncomingBlock function in the CometBFT process does not properly handle errors when verifying the state root of an incoming block. This means that invalid blocks can continue to be processed and finalized, leading to potential issues. The recommendation is to return the error from the verifyStateRoot function instead of the error from GetLatestExecutionPayloadHeader. This bug has been fixed in a recent commit.

## Details

## Context
`process_proposal.go#L222-L257`

## Description
The `VerifyIncomingBlock` function is called during the `ProcessProposal` step of CometBFT. This function verifies the state root of the incoming block by calling `verifyStateRoot`. 

However, when the optimistic payload builds configuration is set, the function will not return errors occurring in `verifyStateRoot` but will return the error result from the optimistic build. This means that failing blocks will proceed as they don't return any error.

On the impact side, this leads the `ProcessProposal` to continue execution of the block despite this block being invalid. This will then lead `finalizeBlock` to finalize invalid blocks.

In `VerifyIncomingBlock`, a call to `verifyStateRoot` is made. If it fails (i.e., the block is invalid), an optimistic payload is built. However, the result from the optimistic payload is returned instead of the error from `verifyStateRoot`.

```go
// Verify the state root of the incoming block.
err := s.verifyStateRoot(
    ctx,
    postState,
    beaconBlk,
    consensusTime,
    proposerAddress,
)
if err != nil { // @POC: There was an error in `verifyStateRoot`
    s.logger.Error(
        "Rejecting incoming beacon block ",
        "state_root",
        beaconBlk.GetStateRoot(),
        "reason",
        err,
    )
    if s.shouldBuildOptimisticPayloads() {
        var lph *ctypes.ExecutionPayloadHeader
        lph, err = preState.GetLatestExecutionPayloadHeader() // @POC: Override `err` with `nil` as it succeeds
        if err != nil {
            return err
        }
        go s.handleRebuildPayloadForRejectedBlock(
            ctx,
            preState,
            payloadtime.Next(
                consensusTime,
                lph.GetTimestamp(),
                true, // buildOptimistically
            ),
        )
    }
    return err // @POC: `nil` is returned instead of the error!!!
}
```

## Recommendation
Return the error from `verifyStateRoot` instead of the error from `GetLatestExecutionPayloadHeader`.

## Diff
```diff
diff --git a/beacon/blockchain/process_proposal.go b/beacon/blockchain/process_proposal.go
index 9043527..0ec7c76 100644
--- a/beacon/blockchain/process_proposal.go
+++ b/beacon/blockchain/process_proposal.go
@@ -237,8 +237,10 @@ func (s *Service[
    if s.shouldBuildOptimisticPayloads() {
        var lph *ctypes.ExecutionPayloadHeader
        - lph, err = preState.GetLatestExecutionPayloadHeader()
        - if err != nil {
        + lph, err2 := preState.GetLatestExecutionPayloadHeader()
        + if err2 != nil {
        + // If we fail to get the latest execution payload header,
        + // then return `verifyStateRoot` error
        return err
        }
    }
```

**Berachain:** Fixed in commit `1a9aeae6`.
