---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/perpetuals
protocol: "[[Dipcoin]]"
auditors:
  - "[[Hamed Mohammadi]]"
report: "https://certificate.quantstamp.com/full/dipcoin-perpetual/ea7e8c75-4423-49da-a381-1d39997cfff7/index.html"
genome:
  - "[[missing-auth]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# Skipped Signature Verification for Privileged Addresses

- id: 64745
- impact: HIGH
- protocol: [[Dipcoin]] Perpetual
- reporter: Hamed Mohammadi (Quantstamp)
- source: https://certificate.quantstamp.com/full/dipcoin-perpetual/ea7e8c75-4423-49da-a381-1d39997cfff7/index.html

## Summary


In this bug report, the client has acknowledged an issue with the `order.move`, `library.move`, and `isolated_trading.move` files. The `order::verify_order_signature()` function is skipping signature verification when the `creator` is a privileged address listed in `ProtocolConfig.privileged_addresses`. This means that any user can submit an order that appears to be signed by a privileged account, compromising the security of the system. The team suggests removing the unconditional skip for privileged addresses and requiring a valid signature from the actual signer, as relying solely on off-chain systems for security can make on-chain authentication bypassable. 

## Details

**Update**
Marked as "Acknowledged" by the client. The client provided the following explanation:

> To enhance efficiency, privileged addresses trade off a small degree of security. The security of privileged addresses is fully guaranteed by the off-chain system. If a privileged address is compromised, only the address itself will be affected-other users remain unaffected.

**File(s) affected:**`order.move`, `library.move`, `isolated_trading.move`

**Description:**`order::verify_order_signature()` skips signature verification when the `creator` is a privileged address listed in `ProtocolConfig.privileged_addresses`. By placing a privileged address into the `creator` field, any user can submit an order that is treated as if it were signed by that privileged account.

The team indicated that off-chain systems are used to prevent such misuse, but these protections are not visible or enforceable from the on-chain contracts. Because this behavior relies entirely on off-chain systems to prevent misuse, on-chain authentication becomes bypassable if any future function depends solely on the contract’s signature verification logic.

**Recommendation:** Remove the unconditional skip for privileged addresses. All orders and cancellations should require a valid signature from the actual signer, regardless of privilege status. While skipping verification may save some gas costs for privileged users, we believe the security trade-off is not worth the added risk of weaker authentication.
