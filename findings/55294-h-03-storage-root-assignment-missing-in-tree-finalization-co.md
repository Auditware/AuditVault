---
tags:
  - severity/high
  - has/github
  - has/poc
  - sector/bridge
  - platform/code4rena
protocol: "[[Initia]]"
auditors:
  - OMEN
report: "https://code4rena.com/reports/2025-01-initia-rollup-modules"
genome:
  - "[[bridge-merkle-proof]]"
  - "[[cross-contract-state-consistency]]"
  - "[[logic/state-update]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-03] Storage root assignment missing in tree finalization

- id: 55294
- impact: HIGH
- protocol: Initia
- reporter: OMEN (Code4rena)
- source: https://code4rena.com/reports/2025-01-initia-rollup-modules

## Summary


The reported bug is in the `handleTree` function of the challenger's child chain processing. It fails to assign the merkle tree root hash to the storage root return value, causing the output handling logic to never execute. This can have a high impact as it prevents proper state synchronization between L1 and L2 chains, potentially breaking cross-chain verification and disrupting the challenge mechanism. The bug can be fixed by assigning the tree root hash to the storage root in the `handleTree` function. The recommended mitigation steps have been confirmed and commented by the developer.

## Details



<https://github.com/initia-labs/opinit-bots/blob/640649b97cbfa5782925b7dc8c0b62b8fa5367f6/challenger/child/withdraw.go# L117-L170>

### Summary

The `handleTree` function in the challenger’s child chain processing fails to assign the merkle tree root hash to the storage root return value, causing the output handling logic to never execute.

### Impact

Severity: High

The bug prevents proper state synchronization between L1 and L2 chains by:

1. Never triggering output handling.
2. Missing state root updates.
3. Potentially breaking cross-chain verification.
4. Disrupting the challenge mechanism.

### Technical Details

**Location:**

`opinit-bots/challenger/child/withdraw.go`:
```

func (ch *Child) handleTree(ctx types.Context, blockHeight int64, blockHeader cmtproto.Header) (storageRoot []byte, err error) {
    if ch.finalizingBlockHeight == blockHeight {
        finalizedTree, newNodes, treeRootHash, err := ch.Merkle().FinalizeWorkingTree(nil)
        // ... saving trees and nodes ...

        // BUG: treeRootHash is never assigned to storageRoot
        // Should be: storageRoot = treeRootHash
    }
    return storageRoot, nil  // Always returns nil
}
```

**Call Site Impact:**

`opinit-bots/challenger/child/handler.go`
```

func (ch *Child) endBlockHandler(ctx types.Context, args nodetypes.EndBlockArgs) error {
    storageRoot, err := ch.handleTree(ctx, blockHeight, args.Block.Header)
    if storageRoot != nil {  // This condition never evaluates to true
        // Output handling never executes
        err = ch.handleOutput(...)
    }
}
```

### Proof of Concept

1. System processes blocks normally.
2. At finalization height:

   * Tree is finalized successfully.
   * Root hash is calculated.
   * But root hash is never returned.
3. Output handling is skipped.
4. State synchronization fails.

**Root Cause:** Missing assignment of the calculated `treeRootHash` to the return value `storageRoot` in the `handleTree` function.

### Recommended mitigation steps

`opinit-bots/challenger/child/withdraw.go`
```

func (ch *Child) handleTree(ctx types.Context, blockHeight int64, blockHeader cmtproto.Header) (storageRoot []byte, err error) {
    if ch.finalizingBlockHeight == blockHeight {
        finalizedTree, newNodes, treeRootHash, err := ch.Merkle().FinalizeWorkingTree(nil)
        if err != nil {
            return nil, errors.Wrap(err, "failed to finalize working tree")
        }

        // Fix: Assign tree root hash
        storageRoot = treeRootHash

        // ... rest of the function ...
    }
    return storageRoot, nil
}
```

**[beer-1 (Initia) confirmed and commented](https://code4rena.com/audits/2025-01-initia-rollup-modules/submissions/F-17?commentParent=SVXcwySCWZt&commentChild=DG3cHSiXAEA):**

> Mitigation [here](https://github.com/initia-labs/opinit-bots/commit/90594098d4dc95f14bd409c69aee2fd772610041).

---


