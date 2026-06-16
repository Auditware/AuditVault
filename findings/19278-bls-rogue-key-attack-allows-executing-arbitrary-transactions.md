---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
  - sector/account
protocol: "[[BLS Wallet]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/bls-wallet/review.pdf"
genome:
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[permit-fork-replay]]"
  - "[[reentrancy-guard]]"
---
# BLS Rogue Key Attack Allows Executing Arbitrary Transactions

- id: 19278
- impact: HIGH
- protocol: [[BLS Wallet]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/bls-wallet/review.pdf

## Summary


The BLS Wallet is vulnerable to a cryptographic attack known as the rogue public key attack. This attack allows an attacker to exploit the BLS signature scheme to commit any arbitrary action, including theft of assets. The BLS signature scheme enables a single aggregate signature to be checked by merging all the signatures related to each operation together. This works because of a type of cryptography called pairing-friendly cryptography, which allows for the aggregation of signatures signing arbitrary messages into a single signature. 

When calling the getOrCreateWallet() function inside processBundle(), it is possible to provide a fake public key that is the negative of a real user’s key. This allows the point at infinity (a special type of zero) to be passed as the aggregate signature. This works because when forming the aggregated public key from public keys pk1 and pk2, if pk2 is the negative of pk1 then the aggregated public key simplifies to the point at infinity. 

To prevent this attack, it is recommended that either proof of possession be required when creating a new wallet or message augmentation be used to ensure messages from different accounts are unique. The trade-off with proof of possession is that an additional transaction is required to create a wallet before it may be used, while message augmentation will increase the size of the message data and therefore increase gas costs of verifying each message. Additionally, BLS Wallet operations are also vulnerable to signature replay via reentrancy.

## Details

## Description

By creating a new wallet while executing the function `processBundle()`, we can leverage the cryptographic attack known as the rogue public key attack [^1] to commit any arbitrary action including theft of assets.

When processing a bundle of operations, it is necessary to verify that each operation was approved by checking the owner’s signature. This is done using the BLS signature scheme, which enables a single aggregate signature to be checked. This aggregate signature is formed by merging all the signatures related to each operation together. 

The aggregate signature is possible because BLS signatures use a type of cryptography that is pairing-friendly. What this means is given a mapping 

\[ e : G1 \times G2 \rightarrow GT \]

then for all \( P \in G1 \), all \( Q \in G2 \), and all \( a, b \in FN \) we have that

\[ e(aP, bQ) = e(P, Q)^{ab} \tag{1} \]

In short, this enables us to aggregate signatures signing arbitrary messages into a single signature whilst still being able to check the authenticity of each signed message.

Then, when calling `getOrCreateWallet()` inside `processBundle()`, it is possible to provide a fake public key that is the negative of a real user’s key. If these public keys are then used to confirm identical wallet actions, it is possible to pass the point at infinity (a special type of zero) as the aggregate signature.

The reason this works is because when forming the aggregated public key from public keys \( pk1 \) and \( pk2 \) we have

\[ pk_{agg} = pk1 + pk2 \tag{2} \]

Then when \( pk2 = -pk1 \) this simplifies to 

\[ pk_{agg} = 0 \]

where 0 is used to represent the point at infinity. We can then simply pass the point at infinity as the aggregated signature \( \sigma \) as

\[ \sigma = pk_{agg} \cdot H(m) = 0 \cdot H(m) = 0 \tag{3} \]

where \( H(m) \) is our hashed message.

The fake public key and victim’s real public key will cancel out, allowing this aggregate signature to verify both wallets' actions without having gained the victim’s signature. Because each user’s public key is broadcast on-chain when interacting with BLS Wallet and calculating its negative is trivial, it is almost certain this issue would be exploited against real users.

## Recommendations

Some possible solutions to this issue are:

- Require proof of possession when creating a new wallet, similar to `setSafeWallet()`. The message, unique to each public key, is signed by the private key. Verifying the signature ensures the user knows the private key corresponding to the provided public key. Note, currently `setSafeWallet()` will only sign over the wallet address; it should also include the BLS public key in the signed message.
- Message augmentation may also be used to ensure messages from different accounts are unique by setting the public key as the first bytes of each message. This would mean that two messages from different public keys will have different hashes once processed and so will not aggregate together.

The trade-off here is that proof of possession requires an additional transaction to create a wallet before it may be used. Message augmentation, on the other hand, will increase the size of the message data and therefore increase gas costs of verifying each message.
