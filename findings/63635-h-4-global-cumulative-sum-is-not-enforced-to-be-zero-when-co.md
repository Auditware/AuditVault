---
tags:
  - lang/rust
  - platform/sherlock
  - has/github
  - severity/high
  - sector/zk
protocol: "[[Brevis]]"
auditors:
  - "[[cergyk]]"
report: "https://github.com/sherlock-audit/2025-08-pico-judging"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[circuit-constraint-completeness]]"
---
# H-4: `global_cumulative_sum` is not enforced to be zero when combine is complete

- id: 63635
- impact: HIGH
- protocol: [[Brevis]] Pico ZKVM
- reporter: cergyk (Sherlock)
- source: N/A

## Summary


The bug report describes an issue with the `global_cumulative_sum` variable in the Pico judging system. This variable is supposed to be the sum of points for global sends and receives and needs to be checked to be zero when shards are combined. However, it is not being checked when `flag_complete` is true, which could lead to incorrect results. The report suggests adding a check for `global_cumulative_sum` when `flag_complete` is true to ensure accuracy. The issue has already been fixed by the protocol team in a recent update.

## Details


Source: https://github.com/sherlock-audit/2025-08-pico-judging/issues/133 

## Found by 
cergyk

### Description

`global_cumulative_sum` is the sum of points for global sends and receives. It needs to be checked to be zero accross all shards, when shards are combined (i.e in the combine recursion circuit).

Unfortunately, although the global_cumulative_sum is computed and set in the public values, it is not checked to be zero when `flag_complete`:

[combine/builder.rs#L484-L492](https://github.com/brevis-network/pico/blob/3046e89b1c7bf065b7932d859a06a24920d57531/vm/src/instances/compiler/recursion_circuit/combine/builder.rs#L484-L492):
```rust
    // Deferred Proof Digest Completeness Verification
    assert_deferred_digest_complete(builder, compress_public_values, flag_complete);
    compress_public_values.digest =
        recursion_public_values_digest::<CC, SC>(builder, compress_public_values);


    /*
    Commit public values
        */
    SC::commit_recursion_public_values(builder, *compress_public_values);
```

[recursion/public_values.rs#L244-L264](https://github.com/brevis-network/pico/blob/audit/vm/src/emulator/recursion/public_values.rs#L244-L264):
```rust
pub(crate) fn assert_deferred_digest_complete<C>(
    builder: &mut Builder<C>,
    public_values: &RecursionPublicValues<Felt<C::F>>,
    flag_complete: Felt<C::F>,
) where
    C: CircuitConfig,
{
    let zero: Felt<_> = builder.eval(C::F::ZERO);


    for start_digest in public_values.start_reconstruct_deferred_digest.into_iter() {
        builder.assert_felt_eq(flag_complete * start_digest, zero);
    }

    for (end_digest, expected_digest) in public_values
        .end_reconstruct_deferred_digest
        .into_iter()
        .zip_eq(public_values.deferred_proofs_digest.into_iter())
    {
        builder.assert_felt_eq(flag_complete * (end_digest - expected_digest), zero);
    }
}
```

### Recommendation

Add a check when `flag_complete` is true for `global_cumulative_sum` to be zero:

```diff
+   builder.assert_digest_zero(flag_complete, *compress_public_values.global_cumulative_sum);
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/brevis-network/pico/pull/61
