---
tags:
  - lang/solidity
  - sector/options
  - sector/perpetuals
  - sector/zk
  - platform/quantstamp
  - severity/high
  - novelty/variant
protocol: "[[Dipcoin]]"
auditors:
  - "[[Hamed Mohammadi]]"
report: "https://certificate.quantstamp.com/full/dipcoin-perpetual/ea7e8c75-4423-49da-a381-1d39997cfff7/index.html"
genome:
  - "[[missing-modifier]]"
  - "[[variant]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# Missing On-Chain ZK Proof Verification

- id: 64744
- impact: HIGH
- protocol: [[Dipcoin]] Perpetual
- reporter: Hamed Mohammadi (Quantstamp)
- source: https://certificate.quantstamp.com/full/dipcoin-perpetual/ea7e8c75-4423-49da-a381-1d39997cfff7/index.html

## Summary


The client has acknowledged a bug in their system that affects the `library.move`, `order.move`, and `isolated_trading.move` files. The bug allows for authentication to be bypassed when the scheme byte is set to `SIGNED_USING_ZK_WALLET (3)`, as the function `library::verify_signature()` does not validate any zkLogin-related proofs or check the corresponding public key. The team recommends either verifying ZK proofs on-chain or clearly documenting that zkLogin security is enforced off-chain and not by the contracts themselves.

## Details

**Update**
Marked as "Acknowledged" by the client. The client provided the following explanation:

> Since we operate as an on-chain/off-chain hybrid system, our off-chain infrastructure requires user trust. Additionally, ZK proof verification exclusively applies to ZKLogin users and does not impact wallet users.

**File(s) affected:**`library.move`, `order.move`, `isolated_trading.move`

**Description:** In `library::verify_signature()`, when the scheme byte equals `SIGNED_USING_ZK_WALLET (3)`, the function sets `is_verified = true` without validating any zkLogin-related proofs or checking whether `public_key` corresponds to the claimed zkLogin identity.

The team indicated that these zkLogin proofs are verified off-chain, but the on-chain contracts do not check that such verification actually happened. As a result, any bug in the off-chain verification pipeline would make the on-chain authentication bypassable, since scheme `3` is accepted unconditionally.

**Recommendation:** For zkLogin / ZK wallets, the strongest option is to verify ZK proofs on-chain. If on-chain verification is not wanted, it should be clearly documented that zkLogin security is enforced entirely by off-chain infrastructure and that the contracts themselves do not verify any zkLogin signatures or proofs.
