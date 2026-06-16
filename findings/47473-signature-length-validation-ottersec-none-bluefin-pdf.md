---
tags:
  - lang/move
  - platform/ottersec
  - has/poc
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/perpetuals
protocol: "[[BlueFin]]"
auditors:
  - "[[Robert Chen]]"
report: "https://bluefin.io/"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# Signature Length Validation

- id: 47473
- impact: HIGH
- protocol: [[BlueFin]]
- reporter: Robert Chen (OtterSec)
- source: https://bluefin.io/

## Summary


This bug report discusses a potential security issue in the "claim_rewards" function in the "distributor" code. The problem arises from the process of creating a digest from the signature bytes using SHA-256 and encoding it as hexadecimal. If the signature bytes contain extra bytes beyond the expected format, it can result in a different digest and potentially lead to incorrect validation of previously claimed rewards. An attacker could exploit this vulnerability by crafting a malicious transaction with extra bytes in the signature, allowing them to repeatedly claim the same rewards. The recommended patch involves validating the length of the serialized payload and signature bytes and using the signature nonce for indexing instead of the digest. 

## Details

## Potential Security Loop Hole in `claim_rewards`

A potential security loop hole exists in `claim_rewards` within `distributor`, particularly concerning deriving the digest from the `signature_bytes`. The process involves creating a digest by hashing the `signature_bytes` utilizing SHA-256 and encoding the outcome as hexadecimal. Subsequently, this digest is used as a key in a table (`pool.claimed`) to verify whether rewards have been previously claimed.

> _sources/distributor.mover_
>
> ```rust
> entry fun claim_rewards<RewardCoin>(pool: &mut RewardPool<RewardCoin>, payload_bytes: vector<u8>, signature_bytes: vector<u8>, ctx: &mut TxContext) {
>     [...]
>     // create digest from the signature
>     let digest = string::utf8(hex::encode(sha2_256(signature_bytes)));
>     // revert if the rewards are already claimed
>     // if the table has an entry for the digest, implies rewards are claimed
>     assert!(!table::contains(&pool.claimed, digest), errors::already_claimed());
>     [...]
> }
> ```

The vulnerability arises from the possibility of `signature_bytes` containing extraneous bytes beyond the serialized payload. In the presence of additional bytes, they become part of the hash computation, potentially resulting in a different digest than anticipated. This, in turn, may result in the incorrect validation of if rewards have been previously claimed.

## Proof of Concept

An attacker may craft a malicious transaction wherein the `signature_bytes` encompass additional bytes beyond the expected format in `claim_rewards`. If these extrabytes modify the hash, the function may incorrectly consider the rewards as not claimed, allowing the attacker to claim the same rewards repeatedly.

## Remediation

Ensure that `signature_bytes` contains only the expected bytes of the serialized payload.

© 2024 Otter Audits LLC. All Rights Reserved. 6/18  
### Bluefin Audit 04 - Vulnerabilities

## Patch

The serialized payload bytes length and signature bytes length is validated to ensure that there are no extraneous bytes in `deb6b48` and `3fb61c3`. The digest was removed in favor of using the nonce of the signature for indexing claimed in `8751e83`.

© 2024 Otter Audits LLC. All Rights Reserved. 7/18
