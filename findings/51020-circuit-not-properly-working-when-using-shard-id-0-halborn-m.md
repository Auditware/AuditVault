---
tags:
  - blockchain/evm
  - blockchain/evm/zksync
  - lang/rust
  - lang/solidity
  - platform/halborn
  - has/github
  - severity/high
  - sector/privacy
  - sector/zk
protocol: "[[zkSync]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/matterlabs/zksync-era-zero-knowledge-security-assessment"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[circuit-constraint-completeness]]"
---
# CIRCUIT NOT PROPERLY WORKING WHEN USING SHARD ID > 0

- id: 51020
- impact: HIGH
- protocol: [[zkSync]] Era
- reporter: Halborn
- source: https://www.halborn.com/audits/matterlabs/zksync-era-zero-knowledge-security-assessment

## Summary


The `STORAGE QUERIES FILTER` circuit is not working correctly when the shard ID is greater than 0. This is because the `pack_key` function is returning an incorrect key, which causes the resulting queue to be unordered. This bug has been solved by the MatterLabs team by fixing the offset and adding an assertion.

## Details

##### Description

The `STORAGE QUERIES FILTER` circuit (`storage_validity_by_grand_product`) does not produce the intended output when shard ID is greater than `0`. When the keys of each element of the initial queue are being packed throughout the sorting of the queues, the second linear combination is wrongly created, overlapping the bits of the address variable, due to using the incorrect coefficient.

The problem with this bug, is that as the `pack_key` function is returning an incorrect packed key to the sorting functionality, the final sorted queue of the circuit is not being properly generated, leading to even more issues afterward. This can be seen as a completeness bug.

Code Location
-------
---
---

#### storage\_validity\_by\_grand\_product/mod.rs

```
const PACKED_WIDTHS: [usize; 2] = [192, 232];
// now resolve a logic
for (item, is_trivial) in it {
    // check if keys are equal and check a value
    let TimestampedStorageLogRecord { record, timestamp } = item;

    let packed_key = pack_key(
        cs,
        (record.shard_id.clone(), record.address.clone(), record.key),
    )?;

    // ensure sorting
    let (keys_are_equal, previous_key_is_greater) =
        prepacked_long_comparison(cs, &previous_packed_key, &packed_key, &PACKED_WIDTHS)?;

    can_not_be_false_if_flagged(cs, &previous_key_is_greater.not(), &is_trivial.not())?;

    // if keys are the same then timestamps are sorted
    let (_, previous_timestamp_is_less) = previous_timestamp.sub(cs, &timestamp)?;
    // enforce if keys are the same and not trivial
    let must_enforce = smart_and(cs, &[keys_are_equal, is_trivial.not()])?;
    can_not_be_false_if_flagged(cs, &previous_timestamp_is_less, &must_enforce)?;

    // we follow the procedure:
    // if keys are different then we finish with a previous one and update parameters
    // else we just update parameters

```

#### storage\_validity\_by\_grand\_product/mod.rs

```
pub fn pack_key<E: Engine, CS: ConstraintSystem<E>>(
    cs: &mut CS,
    key_tuple: (Byte<E>, UInt160<E>, UInt256<E>),
) -> Result<[Num<E>; 2], SynthesisError> {
    let shifts = compute_shifts::<E::Fr>();

    // LE packing

    let (shard_id, address, key) = key_tuple;
    let mut lc_0 = LinearCombination::zero();
    lc_0.add_assign_number_with_coeff(&key.inner[0].inner, shifts[0]);
    lc_0.add_assign_number_with_coeff(&key.inner[1].inner, shifts[64]);
    lc_0.add_assign_number_with_coeff(&key.inner[2].inner, shifts[128]);
    // 192 in total
    let value_0 = lc_0.into_num(cs)?;

    let mut lc_1 = LinearCombination::zero();
    lc_1.add_assign_number_with_coeff(&key.inner[3].inner, shifts[0]);
    lc_1.add_assign_number_with_coeff(&address.inner, shifts[64]);
    lc_1.add_assign_number_with_coeff(&shard_id.inner, shifts[160]);
    let value_1 = lc_1.into_num(cs)?;
    // 64 + 160 + 8 = 232 in total

    Ok([value_0, value_1])
}

```

1. The STORAGE QUERIES FILTER circuit receives as input witness the storage access requests queue.
2. This circuit aims to order the resulting queue of all the elements in the initial queue by a generated key.
3. The circuit calls the pack\_key function to generate the key for the current element of the queue.
4. A shard\_id different from 0 is being used.
5. Within the generated key, the bits of the address parameter gets overlapped with the bits of the shard\_id.
6. An incorrect key is returned to the main function of the circuit, thus breaking the overall functionality of the circuit.
7. The resulting queue is not ordered as expected, leading to even more issues afterward.

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:M/A:C/D:M/Y:C/R:P/S:C (9.4)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:M/A:C/D:M/Y:C/R:P/S:C)

##### Recommendation

**SOLVED**: The `MatterLabs team` solved the issue by fixing the offset and adding assertion.

`Commit ID :` [5109e0768c7de799f87ec67bf40b6a544cca4e4e](https://github.com/matter-labs/sync_vm/commit/5109e0768c7de799f87ec67bf40b6a544cca4e4e)
