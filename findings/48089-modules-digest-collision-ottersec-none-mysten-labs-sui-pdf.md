---
tags:
  - lang/move
  - lang/rust
  - platform/ottersec
  - has/poc
  - severity/high
  - sector/gaming
protocol: "[[Sui]]"
auditors:
  - "[[Cauê Obici]]"
report: "https://mystenlabs.com/"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[commitment-uniqueness]]"
---
# Modules Digest Collision

- id: 48089
- impact: HIGH
- protocol: [[Mysten Labs Sui]]
- reporter: Cauê Obici (OtterSec)
- source: https://mystenlabs.com/

## Summary


This bug report discusses an issue in the move_package.rs file of a Rust project. The function compute_digest_for_modules_and_deps is supposed to calculate a unique hash based on the modules and object IDs provided. However, due to a lack of padding between items, there can be collisions in the hash, which can cause problems for certain protocols. A proof of concept is provided in the form of a Rust test, which shows that the digest of a package with two modules can be the same as the digest of a package with just one module if the second module is hidden in the serialized data of the first module. The report suggests a modification to the hash computation to prevent these collisions. The issue has been fixed in a recent patch.

## Details

## Vulnerabilities

In `move_package.rs`, `compute_digest_for_modules_and_deps` calculates a unique hash according to the modules and object_ids supplied. Since some protocols depend on this hash to mandate proper upgrades, this hash must be unique. However, the current implementation lacks padding between items, which results in hash collisions.

```rust
crates/sui-types/src/move_package.rs
pub fn compute_digest_for_modules_and_deps<'a>(
    modules: impl IntoIterator<Item = &'a Vec<u8>>,
    object_ids: impl IntoIterator<Item = &'a ObjectID>,
) -> [u8; 32] {
    let mut bytes: Vec<&[u8]> = modules
        .into_iter()
        .map(|x| x.as_ref())
        .chain(object_ids.into_iter().map(|obj_id| obj_id.as_ref()))
        .collect();

    // NB: sorting so the order of the modules and the order of the
    // dependencies does not matter.
    bytes.sort();
    let mut digest = DefaultHash::default();
    for b in bytes {
        digest.update(b);
    }
    digest.finalize().digest
}
```

## Proof of Concept

The provided file describes the issue through a Rust test. It demonstrates the issue by showing that the digest of a package containing two modules, `[m1, m2]`, may be equal to the digest of a package with just one module, `[m1]`, if we hide the serialized `m2` in the trailing bytes of the serialized `m1`.

```rust
PoC.rs
#[test]
fn package_digest_collision() {
    let module = empty_module();
    let package = vec![module.clone(), module.clone()];
    let serialized_package1: Vec<Vec<u8>> = package
        .into_iter()
        .map(|m| {
            let mut b = vec![];
            m.serialize(&mut b);
            b
        })
        .collect();
        
    let digest1 = MovePackage::compute_digest_for_modules_and_deps(&serialized_package1, &vec![]);
    
    let serialized_package2 = vec![{
        let mut v = serialized_package1[0].clone();
        v.extend(serialized_package1[1].clone());
        v
    }];
    
    let digest2 = MovePackage::compute_digest_for_modules_and_deps(&serialized_package2, &vec![]);
    
    assert!(digest1 == digest2);
}
```

## Remediation

Modify the hash computation by applying the hash function to each module and then another round of hashing to the concatenation of their respective hash outputs.

### Patch

Fixed in commit `4ebc390`.
