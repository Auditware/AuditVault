---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - sector/dex
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/pda/bump-canonicalization
  - vuln/pda/missing-seeds-check
  - novelty/variant
  - fix/add-check
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[bump-canonicalization]]"
  - "[[missing-seeds-check]]"
  - "[[role-bypass]]"
  - "[[variant]]"
  - "[[account-discriminator-check]]"
  - "[[pda-derivation]]"
---
# Missing Version Validation for Private Clients Account in `new_private_client`

- id: 64499
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


The `new_private_client()` function has a bug where it does not properly check if the provided account matches the protocol version specified in `root_state`. This could potentially allow an unauthorized person to modify the private client queue of a different version, violating the intended isolation between versions. The recommended solution is to verify that the account address matches the expected address derived from `root_state.version`. This bug has been fixed and verified.

## Details

**Description:** The `new_private_client()` function fails to validate that the provided `private_clients_acc` account matches the protocol version specified in `root_state`.

Since different protocol versions use different PDA seeds (which include the version), each version has its own isolated `private_clients_acc`. However, the function does not verify this correspondence, potentially allowing cross-version account misuse.

```rust
// src/program/processor/new_root_account.rs:291
let seed = get_seed_bytes(version, account_type::PRIVATE_CLIENTS);
// get_seed_bytes includes version in the seed (lines 73-77)
let bump_seed = check_new_program_account(
    private_clients_acc,
    &drvs_auth,
    program_id,
    &seed,
    AccountType::PrivateClients,
)?;
```

However, in `new_private_client()`, the function only validates:
1. The admin is the operator
2. Private mode is enabled
3. Wallet owner is system program

It **does not validate**:
- `private_clients_acc.owner` matches `program_id`
- `private_clients_acc` discriminator tag is `PRIVATE_CLIENTS`
- `private_clients_acc` discriminator version matches `root_state.version`
- `private_clients_acc` PDA address matches the expected address for `root_state.version`

```rust
// src/program/processor/new_private_client.rs:70-100
let private_clients_acc: &AccountInfo<'_> = next_account_info!(account_iter)?;
// ...
let root_state: &RootState = RootState::from_account_info(root_acc, program_id)?;

// ❌ No validation of `private_clients_acc` here

if !root_state.is_private_mode() {
    bail!(DeriverseErrorKind::MustBeInPrivateMode);
}

// Directly uses private_clients_acc without version check
let private_clients = private_clients_acc
    .try_borrow_data()
    .map_err(|err| drv_err!(err.into()))?;
```

**Impact:** **Cross-Version Account Manipulation:** An operator authorized for one protocol version (e.g., version 1) could potentially pass a `private_clients_acc` from a different version (e.g., version 2), allowing unauthorized modification of another version's private client queue. This violates the intended isolation between protocol versions.

**Recommended Mitigation:** Verify the account address matches the expected PDA derived from `root_state.version`

**Deriverse:** Fixed in commit [6165c9a](https://github.com/deriverse/protocol-v1/commit/6165c9a9c80d9c895dbda04098d8f3521ab79e2c).

**Cyfrin:** Verified.
