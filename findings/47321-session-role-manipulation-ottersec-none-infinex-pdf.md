---
tags:
  - lang/rust
  - platform/ottersec
  - has/poc
  - severity/high
  - vuln/dos/init-constraint
  - impact/mev/frontrun
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/add-check
  - sector/account
protocol: "[[Infinex]]"
auditors:
  - "[[Robert Chen]]"
report: "https://infinex.xyz/"
genome:
  - "[[init-constraint]]"
  - "[[frontrun]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[initializer-auth]]"
  - "[[pda-derivation]]"
---
# Session Role Manipulation

- id: 47321
- impact: HIGH
- protocol: [[Infinex]]
- reporter: Robert Chen (OtterSec)
- source: https://infinex.xyz/

## Summary


This report highlights a vulnerability in a program called "create_session" that can be exploited by attackers. By manipulating the SessionProof structure, the attacker can change the role of the session and potentially reduce its functionality or access privileges. The report provides a step-by-step example of how the attack can be carried out and recommends implementing validation mechanisms to prevent it. The vulnerability has been resolved in the patch 5a917d6.

## Details

## Vulnerabilities - Proof of Concept

A **n attacker may front-run the `create_session` instruction and modify its role by manipulating the `SessionProof` structure. This structure includes two fields: `parameters` and `signatures`. Before submitting the transaction, the attacker removes keys with `role = origin` from the signatures field of `SessionProof`. As a result, the attacker changes the session’s role to a less functional one.**

```rust
// Path to the file
> _programs/authorizer/src/state/session.rs

pub struct SessionProof {
    pub parameters: SessionProofParameters,
    pub signatures: Vec<SecurityKeySignature>,
}

pub fn populate<'info>(
    &mut self,
    bump: u8,
    session_authority: &Pubkey,
    proof: SessionProof,
    wallet_info: &Account<'info, WalletInfo>,
    remaining_accounts: &[AccountInfo<'info>],
) -> Result<()> {
    [...]
    let role = if has_origin_key(&keys) {
        SecurityKeyRole::Origin
    } else if has_recovery_key(&keys) {
        SecurityKeyRole::Recovery
    } else {
        err!(AuthorizerError::InvalidSecurityKeySignature)?
    };
    [...]
}
```

**The transaction remains valid as long as it is signed by the remaining signer keys, despite removing some keys with `role = origin`. Consequently, the session loses its origin role, potentially reducing functionality or access privileges.**

© 2024 Otter Audits LLC. All Rights Reserved. 11/28

## InfineX Audit 04 - Vulnerabilities

### Proof of Concept

1. A user invokes the `create_session` instruction with signatures [key1-origin, key2-recovery, key3-recovery].
2. The session is initialized with the role recovery as it contains keys with roles origin and recovery.
3. The attacker front-runs the user’s transaction and omits some signatures, resulting in the following remaining signatures: [key2-recovery, key3-recovery].
4. As a result, the session associated with `session_authority` is initialized with a role of recovery since it no longer contains a signature from the origin key.
5. However, the user’s transaction fails because a session with the same program derived account is already initialized.

### Remediation

Implement validation mechanisms within the `create_session` instruction to ensure the integrity of the `SessionProof` structure. Validate that all required signatures are present and correspond to authorized parties.

### Patch

Resolved in commit `5a917d6`.

© 2024 Otter Audits LLC. All Rights Reserved. 12/28
