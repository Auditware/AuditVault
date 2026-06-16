---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Kinto]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Kinto/README.md#6-signature-issues-in-kintoid-and-faucet"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[permit-fork-replay]]"
---
# Signature issues in KintoID and Faucet

- id: 30499
- impact: HIGH
- protocol: [[Kinto]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Kinto/README.md#6-signature-issues-in-kintoid-and-faucet

## Summary


This bug report discusses an issue with the KintoID and Faucet contracts in the KintoXYZ project. The problem lies in the incorrect handling of nonces and the construction of the hash for signature, which allows a KYC node to burn a user's KintoID at any time. The report suggests increasing the nonce of the signer, revisiting the logic when the signer and account do not match, and adding the function signature into the hash for which the signature is given.

## Details

##### Description

* https://github.com/KintoXYZ/kinto-core/blob/f7dd98f66b9dfba1f73758703b808051196e740b/src/KintoID.sol#L371-L399
* https://github.com/KintoXYZ/kinto-core/blob/f7dd98f66b9dfba1f73758703b808051196e740b/src/Faucet.sol#L90-L114

In the current implementation, it is assumed that a KYC node can issue a user a KintoID and cannot burn it unless the user signs such a transaction. Incorrect handling of nonces and non-standard construction of the hash for signature lead to the situation where a node with the KYC_PROVIDER_ROLE can at any time burn a user's KintoID.

The `SignatureData` struct has fields `signer` and `account`. Signer is the one who makes the signature. Account is the one to whom the KintoID is issued. The minting and burning functions check the signature of the following structure:
```
keccak256(
    abi.encodePacked(
    '\x19\x01',   // EIP-191 header
    keccak256(abi.encode(
        _signature.signer,
        address(this),
        _signature.account,
        _id,
        _signature.expiresAt,
        nonces[_signature.signer],
        bytes32(block.chainid)
    ))
    )
)
```

It can be noticed that `nonces[_signature.signer]` is hashed. However, after the signature check, `nonces[_signature.account]` is increased, which is incorrect.

Furthermore, in building the hash, the name of the function for which the signature is given is missing. This allows the same signature to be used to call any of the functions, such as `mintIndividualKyc()`, as well as `burnKYC()`.

As the nonce for the signature effectively does not change, the KYC node can subsequently use the same signature that was applied for the `mintIndividualKyc()` function to burn the KintoID through `burnKYC()`.

It should be noted that similar problems are present in the Faucet contract.

##### Recommendation

We recommend increasing the nonce of the signer; revisiting the logic when signer and account does not match; and also adding the function signature into the hash for which the signature is given.
