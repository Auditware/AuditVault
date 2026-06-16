---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/lending
protocol: "[[Eternal Finance]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://eternalfinance.io/"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Critical Access Control Check

- id: 48364
- impact: HIGH
- protocol: [[Eternal Finance]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://eternalfinance.io/

## Summary


The bug report discusses an issue with the resource_signer function in the common_config.move file. This function is used to obtain a signer from a stored resource, but it is currently accessible to other modules. This could potentially lead to unauthorized access and misuse of funds. To fix this issue, the access level of the function should be restricted to only trusted protocol modules. The issue has been resolved in the latest patch.

## Details

## Resource Signer Function in common_config.move

In `common_config.move`, the `resource_signer` function is utilized to obtain the signer from the signer capability that is stored in the resource based on the provided seed. This function is employed by other modules to generate, save, and retrieve resource accounts. Since the created resource account is used to store tokens in other modules, it is crucial that only the protocol modules can access this function.

## Function Definition

```rust
public fun resource_signer(seed: vector<u8>): signer acquires ResourceOwnershipCapStore {
    assert!(resource_acc_exists_at(seed), ERROR_SEED);
    let resources = &borrow_global<ResourceOwnershipCapStore>(@LYF).resources;
    account::create_signer_with_capability(&table::borrow(resources, seed).signer_cap)
}
```

To prevent unauthorized access to the `resource_signer` function while protecting the funds in the `wmasterchef` module, it is recommended to restrict the access of this function to only the protocol modules.

## Remediation

This issue can be fixed by changing the access level of the function to `friend` and providing access to the function only to the trusted protocol modules.

## Patch

Fixed in `e69fea5`.
