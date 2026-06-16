---
tags:
  - lang/move
  - lang/rust
  - platform/ottersec
  - severity/high
  - sector/infra
protocol: "[[Sui]]"
auditors:
  - "[[Cauê Obici]]"
report: "https://mystenlabs.com/"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[commitment-uniqueness]]"
---
# Dynamic Field Hash Collision

- id: 48087
- impact: HIGH
- protocol: [[Mysten Labs Sui]]
- reporter: Cauê Obici (OtterSec)
- source: https://mystenlabs.com/

## Summary


The bug report discusses an issue with the dynamic_fields.move function where it is possible to produce a collision in generated hashes due to the structure of certain data types. This can result in incorrect behavior for some functions. The suggested solution is to insert the length of certain data arrays at the beginning of their values in the hash. This issue has been fixed in a recent patch.

## Details

## Hash Type and Key Computation

In `dynamic_fields.move`, `hash_type_and_key` computes hashes based on an input address and an Object. The hash is created by concatenating three parts:

1. **parent**, `AccountAddress`, which serves as the parent of the object.
2. **k_bytes**, the data of the object being hashed. It includes the values associated with the object.
3. **k_tag_bytes**, the data type of the object. It provides information about the structure of the object.

By combining these three components, the hash uniquely identifies the object based on its parent, data, and data type.

However, due to the semi-arbitrary structure of the Struct and Vector data types, it is possible to produce a collision in the generated hashes. This collision may result in incorrect behavior for `add` and `exists_`, which do not account for the Name parameter when performing native functions. Meanwhile, other functions call native functions using a generic parameter `Field<Name, Value>`.

## Remediation

Insert the length of the `k_bytes` and `k_tag_bytes` arrays at the beginning of their values in the hasher object.

```rust
// crates/sui-framework/src/natives/dynamic_field.rs DIFF
@@ -92,7 +92,9 @@ pub fn hash_type_and_key(
 // hash(parent || k || K)
 let mut hasher = Sha3_256::default();
 hasher.update(parent);
 + hasher.update(k_bytes.len().to_le_bytes());
 hasher.update(k_bytes);
 + hasher.update(k_tag_bytes.len().to_le_bytes());
 hasher.update(k_tag_bytes);
 let hash = hasher.finalize();
```

## Patch

Fixed in `5b71cef`.
