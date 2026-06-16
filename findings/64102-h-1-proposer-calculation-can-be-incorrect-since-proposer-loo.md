---
tags:
  - lang/rust
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/staking
protocol: "[[Fusaka]]"
auditors:
  - "[[hash]]"
report: "https://github.com/sherlock-audit/2025-09-ethereum-fusaka-upgrade-judging"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[bridge-merkle-proof]]"
---
# H-1: Proposer calculation can be incorrect since proposer lookahead is not considered inside get_beacon_proposer_indices

- id: 64102
- impact: HIGH
- protocol: [[Fusaka]] Upgrade
- reporter: hash (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue where there can be a mismatch between the actual proposer and the computed proposer in certain situations. This is due to the `get_beacon_proposer_indices` function not using the cached proposer lookahead array, leading to incorrect proposer calculations. This can cause blocks to not be finalized, resulting in a chain not being able to progress. The bug can be reproduced by applying specific code changes and running a test. There is currently no suggested solution or response from the team. 

## Details


Source: https://github.com/sherlock-audit/2025-09-ethereum-fusaka-upgrade-judging/issues/40 

## Found by 
hash

### Summary

There can be a mismatch b/w the actual proposer and computed proposer in flows which internally invoke `get_beacon_proposer_indices` since effective balance updates can occur in between
  
### Root Cause

The `get_beacon_proposer_indices` computes the proposer indices of the passed in epoch using the relevant formula rather than reading from the cached proposer lookahead array. This function is used in multiple flows where a mistmatch b/w the actual proposer and the computed proposer in this manner can occur

Eg: Data column verification

The `verify_proposer_and_signature` internally invokes the `get_beacon_proposer_indices` function and hence calculates the proposer using the latest effective balance while the actual proposer would've been chosen using the cached proposer_lookahead which uses the effective balance of 1 epoch before

https://github.com/sigp/lighthouse/blob/5928407ce45b539082874ca1f9c5e3e0704f5d85/beacon_node/beacon_chain/src/data_column_verification.rs#L688

```rs
        let epoch = state.current_epoch();
        let proposers = state.get_beacon_proposer_indices(epoch, &chain.spec)?;
```

### Internal Pre-conditions

The effective balance of some validators (those that are involved in the algorithm) should change such that the proposer algorithm picks up a new proposer (eg: if proposer A's effective balance gets increased, then it could be chosen as the proposer now)

### External Pre-conditions

none

### Attack Path

1. At slot == 100 block is produced by proposer A (proposer A was determined based on the proposer_lookahead array which in turn depends on the effective balances as of one epoch ago)
2. The effective balance of another proposer B was increased during the current epoch start causing them to be computed as the beacon proposer inside get_beacon_proposer_indices
3. Now the block won't be finalized since nodes will reject the data column submissions due to `ProposalSignatureInvalid` error

### Impact

Issue is present in lighthouse containing > 33% and hence the chain won't finalize

### PoC

Apply the following diffs and run `cargo test --package beacon_chain --lib -- data_column_verification::test::poc_hash_increase_balance --exact --show-output`. it can be seen that the verification fails

```diff
diff --git a/beacon_node/beacon_chain/src/data_column_verification.rs b/beacon_node/beacon_chain/src/data_column_verification.rs
index 3009522bf..ef64acd03 100644
--- a/beacon_node/beacon_chain/src/data_column_verification.rs
+++ b/beacon_node/beacon_chain/src/data_column_verification.rs
@@ -810,15 +810,178 @@ pub fn observe_gossip_data_column<T: BeaconChainTypes>(
 
 #[cfg(test)]
 mod test {
+    use std::sync::Arc;
+
     use crate::data_column_verification::{
         validate_data_column_sidecar_for_gossip, GossipDataColumnError,
     };
     use crate::observed_data_sidecars::Observe;
-    use crate::test_utils::BeaconChainHarness;
-    use types::{DataColumnSidecar, EthSpec, ForkName, MainnetEthSpec};
+    use crate::test_utils::{generate_rand_block_and_data_columns, BeaconChainHarness, NumBlobs};
+    use crate::{BeaconChainError, BlockError};
+    use alloy_primitives::Address;
+    use bls::SignatureBytes;
+    use rand::rngs::StdRng;
+    use rand::SeedableRng;
+    use types::{ConsolidationRequest, DataColumnSidecar, DataColumnSubnetId, DepositRequest, EthSpec, ExecutionRequests, ForkName, MainnetEthSpec, Slot};
 
     type E = MainnetEthSpec;
 
+    #[tokio::test]
+    async fn poc_hash_increase_balance() {
+        let spec = ForkName::Fulu.make_genesis_spec(E::default_spec());
+
+        let harness = BeaconChainHarness::builder(E::default())
+            .spec(spec.into())
+            .deterministic_keypairs(64)
+            .fresh_ephemeral_store()
+            .mock_execution_layer()
+            .build();
+
+        harness.advance_slot();
+
+        {
+            let mut state1 = harness.get_current_state();
+
+            if let Ok(validator_to_topup) = state1.get_validator(57) {
+                let slot = harness.get_current_slot();
+                println!("current slot {}", slot);
+
+                let deposit_request: DepositRequest = DepositRequest {
+                    index: harness.get_current_state().eth1_deposit_index(),
+                    pubkey: validator_to_topup.pubkey,
+                    withdrawal_credentials: validator_to_topup.withdrawal_credentials,
+                    amount: 2047_000_000_000,            // 32 ETH in Gwei
+                    signature: SignatureBytes::empty(), // You might need a valid signature
+                };
+
+                println!("validator_to_topup.withdrawal_credentials {}",validator_to_topup.withdrawal_credentials);
+     
+                let withdrawal_credentials_hex =
+                    "010000000000000000000000508659dca524a785bfc24f2a85f791e954c3340f";
+
+                // Convert to bytes and extract the address (last 20 bytes)
+                let withdrawal_bytes = hex::decode(withdrawal_credentials_hex).unwrap();
+                let address_bytes: [u8; 20] = withdrawal_bytes[12..32].try_into().unwrap();
+
+                let consolidation_request: ConsolidationRequest = ConsolidationRequest {
+                    source_address: Address::from(address_bytes),
+                    source_pubkey: validator_to_topup.pubkey,
+                    target_pubkey: validator_to_topup.pubkey,
+                };
+
+                let execution_requests = ExecutionRequests::<E> {
+                    deposits: vec![deposit_request].into(),
+                    withdrawals: vec![].into(),    // empty for this test
+                    consolidations: vec![consolidation_request].into(), // empty for this test
+                };
+
+                let mut block = Box::pin(harness.make_block_with_modifier(
+                    harness.get_current_state(),
+                    slot,
+                    |block| {
+                        *block.body_mut().execution_requests_mut().unwrap() = execution_requests
+                    },
+                ))
+                .await
+                .0;
+
+                let Err(BlockError::StateRootMismatch { local, .. }) = harness
+                    .process_block(slot, block.0.canonical_root(), block.clone())
+                    .await
+                else {
+                    panic!("unexpected match of state root");
+                };
+                let mut new_block = block.0.message_fulu().unwrap().clone();
+                new_block.state_root = local;
+                block.0 = Arc::new(
+                    harness.sign_beacon_block(new_block.into(), &harness.get_current_state()),
+                );
+                harness
+                    .process_block(slot, block.0.canonical_root(), block.clone())
+                    .await
+                    .unwrap();
+
+                {
+                    println!(
+                        "latest slot, {}",
+                        harness.get_current_state().latest_block_header().slot
+                    );
+
+                    harness.extend_to_slot(Slot::new(33)).await;
+                    harness.extend_to_slot(Slot::new(66)).await;
+                    harness.extend_to_slot(Slot::new(99)).await;
+                    harness.extend_to_slot(Slot::new(128)).await;
+                    
+                }
+            }
+        }
+
+        let finalized_checkpoint = harness
+            .chain
+            .with_head(|head| Ok::<_, BeaconChainError>(head.beacon_state.finalized_checkpoint()))
+            .unwrap();
+
+
+        // now the data coloumn verification should be invalid here because the prposer calculated using compute_proposer_index will be different from what was cached
+        let mut rng = StdRng::seed_from_u64(0xDEADBEEF0BAD5EEDu64);
+
+        let (_, data_columns) = generate_rand_block_and_data_columns::<E>(
+            ForkName::Fulu,
+            NumBlobs::Number(1),
+            &mut rng,
+            &harness.spec,
+        );
+
+
+        harness.advance_slot();
+        let blockSlot = harness.get_current_slot();
+
+        let ((block, _blobs_opt), _state) = harness
+            .make_block_with_modifier(harness.get_current_state(), blockSlot, |block| {
+                *block.body_mut().blob_kzg_commitments_mut().unwrap() =
+                    data_columns[0].kzg_commitments.clone();
+            })
+            .await;
+        println!(
+            "Proposer index using lookahead is {:?}",
+            block.signed_block_header().message.proposer_index
+        );
+
+        let index = 0;
+        let column_sidecar = DataColumnSidecar::<E> {
+            index,
+            column: data_columns[0].column.clone(),
+            kzg_commitments: data_columns[0].kzg_commitments.clone(),
+            kzg_proofs: data_columns[0].kzg_proofs.clone(),
+            signed_block_header: block.signed_block_header(),
+            kzg_commitments_inclusion_proof: block
+                .message()
+                .body()
+                .kzg_commitments_merkle_proof()
+                .unwrap(),
+        };
+
+        let result = validate_data_column_sidecar_for_gossip::<_, Observe>(
+            column_sidecar.into(),
+            DataColumnSubnetId::from_column_index(index, &harness.spec).into(),
+            &harness.chain,
+        );
+
+        match result {
+            Ok(verified) => {
+                println!("Verification was fine");
+                // use the verified GossipVerifiedDataColumn
+            }
+            Err(e) => {
+                // handle the error
+                eprintln!("Validation failed: {:?}", e);
+            }
+        }
+
+        return;
+
+    }
+
     #[tokio::test]
     async fn empty_data_column_sidecars_fails_validation() {
         let spec = ForkName::Fulu.make_genesis_spec(E::default_spec());
diff --git a/consensus/state_processing/src/per_epoch_processing/single_pass.rs b/consensus/state_processing/src/per_epoch_processing/single_pass.rs
index ae1e33004..07f777c16 100644
--- a/consensus/state_processing/src/per_epoch_processing/single_pass.rs
+++ b/consensus/state_processing/src/per_epoch_processing/single_pass.rs
@@ -1020,8 +1020,9 @@ impl PendingDepositsContext {
                 deposits_to_postpone.push(deposit.clone());
             } else {
                 // Check if deposit fits in the churn, otherwise, do no more deposit processing in this epoch.
-                is_churn_limit_reached =
-                    processed_amount.safe_add(deposit.amount)? > available_for_processing;
+                is_churn_limit_reached = false;
+                //is_churn_limit_reached =
+                //    processed_amount.safe_add(deposit.amount)? > available_for_processing;
                 if is_churn_limit_reached {
                     break;
                 }

```

### Mitigation

_No response_
