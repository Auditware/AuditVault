---
tags:
  - lang/move
  - sector/staking
  - platform/ottersec
  - severity/high
  - vuln/access-control/missing-signer
  - impact/mev/frontrun
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
protocol: "[[Lombard]]"
auditors:
  - "[[Robert Chen]]"
report: "https://www.lombard.finance/"
genome:
  - "[[missing-signer]]"
  - "[[frontrun]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[account-signer]]"
  - "[[frontrun-exposure]]"
---
# Preventing Minting via Front-Running Payload

- id: 53233
- impact: HIGH
- protocol: [[Lombard]]
- reporter: Robert Chen (OtterSec)
- source: https://www.lombard.finance/

## Summary


This bug report discusses an issue with the function validate_and_store_payload in the Consortium program. This function is used to validate and record the usage of a payload. However, because it is public, anyone can call it, creating a potential attack where a malicious actor can interfere with valid transactions. This can happen if a user submits a valid transaction to validate a payload, but then the attacker calls the same function before the user's transaction is processed. This can cause the user's transaction to fail, as the payload will already be marked as used. The report suggests restricting the function to be callable only by a specific package or managing payload tracking within a different module. This issue has been resolved in a recent patch.

## Details

## validate_and_store_payload in Consortium

`validate_and_store_payload` in Consortium validates and records the usage of a payload. However, since it is public, anyone may call it. This creates a potential front-running attack, where a malicious actor may interfere with the expected execution of a valid transaction. 

Thus, if a user submits a valid transaction that calls `validate_and_store_payload(payload, proof)` to validate the payload, the attacker may front-run this with a similar call to `validate_and_store_payload`, which executes before the user’s call.

```rust
>_ move/consortium/sources/consortium.move rust
public fun validate_and_store_payload(
    consortium: &mut Consortium,
    payload: vector<u8>,
    proof: vector<u8>,
) {
    // Payload should consist of 164 bytes (160 for message and 4 for the action)
    assert!(payload.length() == 164, EInvalidPayloadLength);
    let hash = hash::sha2_256(payload);
    assert!(!consortium.is_payload_used(hash), EUsedPayload);
    // get the signatures from the proof
    let signatures = payload_decoder::decode_signatures(proof);
    // get the validator set for the current epoch
    let signers = consortium.get_validator_set(consortium.epoch);
    assert!(validate_signatures(signers.pub_keys, signatures, signers.weights,
                                 signers.weight_threshold, payload, hash), EInvalidPayload);
    consortium.used_payloads.add(hash, true);
}
```

This stores the payload’s hash in `used_payloads`, marking it as used. Consequently, the user’s call to mint will fail because `is_payload_used(hash)` will return true, preventing the minting of coins.

## Remediation

Restrict `validate_and_store_payload` to be callable only by the lbtc package or ensure that payload tracking is managed within the treasury module.

## Patch

Resolved in 0fd60cf.
