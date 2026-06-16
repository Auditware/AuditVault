---
tags:
  - lang/rust
  - lang/solidity
  - sector/governance
  - sector/oracle
  - sector/staking
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[SEDA]]"
auditors:
  - "[[Boy2000]]"
  - "[[stuart_the_minion]]"
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[griefing]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# H-1: Chain halt as VerifyVoteExtensionHandler is not guaranteed to run

- id: 55228
- impact: HIGH
- protocol: [[SEDA]] Protocol
- reporter: stuart\_the\_minion (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found by two users, Boy2000 and stuart_the_minion, regarding the seda protocol. The problem occurs when there are late or slow precommit votes, which do not trigger the VerifyVoteExtensionHandler. This can result in a chain halt, as the ProcessProposalHandler expects all vote extensions to be valid. This means that a single malicious or misbehaving validator can inject an invalid vote extension, causing the chain to halt.

The root cause of this issue is that the PrepareProposal function does not re-verify or ignore invalid LocalLastCommit votes. This can be seen in the code snippet provided, where the injection of an invalid vote is not properly handled. Additionally, the ProcessProposalHandler also expects all votes to be valid, which can result in a chain halt if an invalid vote is present.

The attack path for this issue is as follows: a malicious or misbehaving validator injects an invalid vote at the right height, which is not properly validated and added to the LocalLastCommit. This vote is then used in the next block proposal, causing the ProcessProposalHandler to repeatedly fail and ultimately halt the chain.

The impact of this bug is a chain halt, which can disrupt the functionality of the seda protocol. There was no response from the team regarding a proof of concept or mitigation for this issue, but it has been fixed in the following PRs/commits: https://github.com/sedaprotocol/seda-chain/pull/531.

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/30 

## Found by 
Boy2000, stuart\_the\_minion

### Summary

Late/slow precommit votes, after +2/3 votes do not trigger VerifyVoteExtensionHandler. `ProcessProposalHandler` expects all vote extensions to be valid. Single malicious/misbehaving validator can inject invalid vote extension to the (previous) block, resulting in chain halt.

### Root Cause

1. PrepareProposal does not re-verify/ignore invalid LocalLastCommit votes

https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/app/abci/handlers.go#L177
```go
func (h *Handlers) PrepareProposalHandler() sdk.PrepareProposalHandler {
	return func(ctx sdk.Context, req *abcitypes.RequestPrepareProposal) (*abcitypes.ResponsePrepareProposal, error) {
		// Check if there is a batch whose signatures must be collected
		// at this block height.
		var collectSigs bool
		_, err := h.batchingKeeper.GetBatchForHeight(ctx, ctx.BlockHeight()+BlockOffsetCollectPhase)
		if err != nil {
			if !errors.Is(err, collections.ErrNotFound) {
				return nil, err
			}
		} else {
			collectSigs = true
		}

		var injection []byte
		if req.Height > ctx.ConsensusParams().Abci.VoteExtensionsEnableHeight && collectSigs {
			err := baseapp.ValidateVoteExtensions(ctx, h.stakingKeeper, req.Height, ctx.ChainID(), req.LocalLastCommit)
			if err != nil {
				return nil, err
			}

@>			injection, err = json.Marshal(req.LocalLastCommit)
			if err != nil {
				h.logger.Error("failed to marshal extended votes", "err", err)
				return nil, err
			}

			injectionSize := int64(len(injection))
			if injectionSize > req.MaxTxBytes {
				h.logger.Error(
					"vote extension size exceeds block size limit",
					"injection_size", injectionSize,
					"MaxTxBytes", req.MaxTxBytes,
				)
				return nil, ErrVoteExtensionInjectionTooBig
			}
			req.MaxTxBytes -= injectionSize
		}

		defaultRes, err := h.defaultPrepareProposal(ctx, req)
		if err != nil {
			h.logger.Error("failed to run default prepare proposal handler", "err", err)
			return nil, err
		}

		proposalTxs := defaultRes.Txs
		if injection != nil {
			proposalTxs = append([][]byte{injection}, proposalTxs...)
			h.logger.Debug("injected local last commit", "height", req.Height)
		}
		return &abcitypes.ResponsePrepareProposal{
			Txs: proposalTxs,
		}, nil
	}
}
```

2. ProcessProposalHandler expects all votes (batches) to be valid/verified

https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/app/abci/handlers.go#L235
```go
func (h *Handlers) ProcessProposalHandler() sdk.ProcessProposalHandler {
	return func(ctx sdk.Context, req *abcitypes.RequestProcessProposal) (*abcitypes.ResponseProcessProposal, error) {
		if req.Height <= ctx.ConsensusParams().Abci.VoteExtensionsEnableHeight {
			return h.defaultProcessProposal(ctx, req)
		}

		batch, err := h.batchingKeeper.GetBatchForHeight(ctx, ctx.BlockHeight()+BlockOffsetCollectPhase)
		if err != nil {
			if errors.Is(err, collections.ErrNotFound) {
				return h.defaultProcessProposal(ctx, req)
			}
			return nil, err
		}

		var extendedVotes abcitypes.ExtendedCommitInfo
		if err := json.Unmarshal(req.Txs[0], &extendedVotes); err != nil {
			h.logger.Error("failed to decode injected extended votes tx", "err", err)
			return nil, err
		}

		// Validate vote extensions and batch signatures.
		err = baseapp.ValidateVoteExtensions(ctx, h.stakingKeeper, req.Height, ctx.ChainID(), extendedVotes)
		if err != nil {
			return nil, err
		}

		for _, vote := range extendedVotes.Votes {
			// Only consider extensions with pre-commit votes.
			if vote.BlockIdFlag == cmttypes.BlockIDFlagCommit {
				err = h.verifyBatchSignatures(ctx, batch.BatchNumber, batch.BatchId, vote.VoteExtension, vote.Validator.Address)
				if err != nil {
@>					h.logger.Error("proposal contains an invalid vote extension", "vote", vote)
					return nil, err
				}
			}
		}

		req.Txs = req.Txs[1:]
		return h.defaultProcessProposal(ctx, req)
	}
}
```

### Internal Pre-conditions

-

### External Pre-conditions

-

### Attack Path

1. Malicious/misbehaving validator late-injects invalid vote at the right height (when there is a batch to sign, to not return early due to 0 batches). Alternatively optimistically sends invalid votes continuously.
2. The vote is not validated (with app logic) and is added to LocalLastCommit.
3. Next block proposer -> propose block with invalid vote -> ProcessProposalHandler repeatedly fails.

### Impact

Chain halt

### PoC

_No response_

### Mitigation

_No response_

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-chain/pull/531
