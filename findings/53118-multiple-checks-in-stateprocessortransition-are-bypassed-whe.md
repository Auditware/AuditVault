---
tags:
  - lang/solidity
  - sector/staking
  - platform/cantina
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Berachain]]"
auditors:
  - "[[zigtur]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_berachain_january2025.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[proposal-state-check]]"
---
# Multiple checks in stateProcessor.Transition are bypassed when execution engine send Er- rAcceptedPayloadStatus 

- id: 53118
- impact: HIGH
- protocol: [[Berachain]]
- reporter: zigtur (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_berachain_january2025.pdf

## Summary


The bug report discusses an issue in the process of verifying a beacon block's validity in a blockchain system called Berachain. The report mentions that there is a possibility of an error being triggered during the verification process, which can bypass important checks on the execution payload. This can lead to potential security vulnerabilities, such as bypassing RANDAO checks, withdrawals checks, state root checks, and more. The report provides code snippets to explain how the error can occur and mentions that it has been fixed in a recent commit. The recommendation is to ensure that all necessary checks are executed when this error occurs to prevent any potential security risks.

## Details

## Context
- `process_proposal.go#L314-L321`
- `state_processor_payload.go#L64-L72`
- `state_processor_payload.go#L189-L219`

## Description
During `ProcessProposal`, a beacon block is processed to ensure its validity. A lot of verification happens in `stateProcessor.Transition`. We can see that Berachain is aware that the execution engine can return `AcceptedPayloadStatus` errors as the following comment in `verifyStateRoot` shows it:

```go
func (s *Service[
	_, _, ConsensusBlockT,
	_, _, _,
]) verifyStateRoot(
	// ...
	&transition.Context{
		Context:                  ctx,
		OptimisticEngine:        false,
		SkipPayloadVerification:  false,
		SkipValidateResult:      false,
		SkipValidateRandao:      false,
		ProposerAddress:         proposerAddress,
		ConsensusTime:           consensusTime,
	},
	st, blk,
) 
	if errors.Is(err, engineerrors.ErrAcceptedPayloadStatus) {
		// It is safe for the validator to ignore this error since
		// the state transition will enforce that the block is part
		// of the canonical chain.
		//
		// TODO: this is only true because we are assuming SSF.
		return nil
	}
	return err
}
```

However, such error will bypass a lot of checks done on the execution payload while accepting the payload.

## Impact
This issue allows bypassing RANDAO checks, withdrawals checks, state root checks, and more on the execution payload.

## Code snippet
The call graph that triggers the `ErrAcceptedPayloadStatus` error is:

```
ProcessProposal → VerifyIncomingBlock → verifyStateRoot → stateProcessor.Transition → ProcessBlock → validateExecutionPayload → validateStatefulExecution → VerifyAndNotifyNewPayload
```

For example, looking at the `ProcessBlock` function shows that a lot of checks are being bypassed in case of such error.

```go
// ProcessBlock processes the block, it optionally verifies the
// state root.
func (sp *StateProcessor[
	ContextT, _,
]) ProcessBlock(
	ctx ContextT,
	st *state.StateDB,
	blk *ctypes.BeaconBlock,
) error {
	if err := sp.processBlockHeader(ctx, st, blk); err != nil {
		return err
	}
	if err := sp.processExecutionPayload(ctx, st, blk); err != nil {
		return err // @POC: Return early here!!!
	}
	if err := sp.processWithdrawals(st, blk); err != nil { // @POC: verification bypassed
		return err
	}
	if err := sp.processRandaoReveal(ctx, st, blk); err != nil { // @POC: verification bypassed
		return err
	}
	if err := sp.processOperations(st, blk); err != nil { // @POC: verification bypassed
		return err
	}
	// If we are skipping validate, we can skip calculating the state
	// root to save compute.
	if ctx.GetSkipValidateResult() { // @POC: verification bypassed
		return nil
	}
	// Ensure the calculated state root matches the state root on
	// the block.
	stateRoot := st.HashTreeRoot()
	if blk.GetStateRoot() != stateRoot { // @POC: verification bypassed
		return errors.Wrapf(
			ErrStateRootMismatch, "expected %s, got %s",
			stateRoot, blk.GetStateRoot(),
		)
	}
	return nil
}
```

Another example is in `validateStatefulPayload` itself; the "Verify RANDAO" part will not be executed.

```go
// validateStatefulPayload performs stateful checks on the execution payload.
func (sp *StateProcessor[
	_, _,
]) validateStatefulPayload(
	ctx context.Context,
	st *statedb.StateDB,
	blk *ctypes.BeaconBlock,
	consensusTime math.U64,
	optimisticEngine bool,
) error {
	// ...
	parentBeaconBlockRoot := blk.GetParentBlockRoot()
	if err = sp.executionEngine.VerifyAndNotifyNewPayload(
		ctx, ctypes.BuildNewPayloadRequest(
			payload,
			body.GetBlobKzgCommitments().ToVersionedHashes(),
			&parentBeaconBlockRoot,
			optimisticEngine,
		),
	); err != nil { // @POC: in case of Accepter error, return the error
		return err
	}
	// Verify RANDAO // @POC: all the following code is not executed
	slot, err := st.GetSlot()
	if err != nil {
		return err
	}
	expectedMix, err := st.GetRandaoMixAtIndex(
		sp.cs.SlotToEpoch(slot).Unwrap() % sp.cs.EpochsPerHistoricalVector())
	if err != nil {
		return err
	}
	if payload.GetPrevRandao() != expectedMix {
		return errors.Wrapf(
			ErrRandaoMixMismatch,
			"prev randao does not match, expected: %x, got: %x",
			expectedMix, payload.GetPrevRandao(),
		)
	}
	return nil
}
```

Also, the setting of the execution payload header through `SetLatestExecutionPayloadHeader` in the `processExecutionPayload` function is not executed in such a case. Another edge-case is that `Transition` will return `nil` instead of `validatorUpdates` in such cases.

## Recommendation
When this `ErrAcceptedPayloadStatus` error is triggered in `processExecutionPayload`, all the checks made on `processWithdrawals`, `processRandaoReveal`, etc., must be executed to sanitize the execution payload.

## Berachain
Fixed in commit `2e9cec4c`.
