---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - sector/dex
  - sector/governance
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/access-control/missing-signer
  - precondition/insider
  - novelty/variant
  - misassumption/admin-is-honest
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[missing-signer]]"
  - "[[insider]]"
  - "[[variant]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
  - "[[account-signer]]"
---
# Missing Signer Verification in `voting_reset` Function Allows Unauthorized Execution

- id: 64515
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


The `voting_reset` function in the `src/program/processor/voting_reset.rs` file does not properly check if the `admin` account is a signer of the transaction, allowing an attacker to reset important voting parameters without proper authorization. This can be fixed by adding a signer verification check before the operator address check. This issue has been fixed in the `bfc0c96` commit by the Deriverse team and has been verified by Cyfrin.

## Details

**Description:** The `voting_reset` function in `src/program/processor/voting_reset.rs` only verifies that the `admin` account's public key matches the operator address, but does not verify that the `admin` account is actually a signer of the transaction. **This allows an attacker to execute the `voting reset` instruction by passing account that matches the operator address but no signing is required, resetting critical voting parameters without proper authorization.**

```rust
    let root_state: &RootState = RootState::from_account_info(root_acc, program_id)?;

    if root_state.operator_address != *admin.key {
        bail!(InvalidAdminAccount {
            expected_address: root_state.operator_address,
            actual_address: *admin.key
        })
    }
```

**Impact:** An attacker could execute `voting_reset` without possessing the operator's private key,  resetting critical voting parameters without proper authorization.


**Recommended Mitigation:** Add a signer verification check before the operator address check.

```rust
    if !admin.is_signer {
        bail!(MustBeSigner {
            address: *admin.key
        })
    }
```
**Deriverse:** Fixed in commit [bfc0c96](https://github.com/deriverse/protocol-v1/commit/bfc0c96991d10b19da49c63483999955a810c62b).

**Cyfrin:** Verified
