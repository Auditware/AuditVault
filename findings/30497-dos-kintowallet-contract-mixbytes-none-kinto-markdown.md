---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/access-control/missing-signer
  - novelty/variant
  - misassumption/admin-is-honest
  - sector/lending
protocol: "[[Kinto]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Kinto/README.md#4-dos-kintowallet-contract"
genome:
  - "[[missing-signer]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
  - "[[account-signer]]"
  - "[[dos-resistance]]"
---
# DoS `KintoWallet` contract

- id: 30497
- impact: HIGH
- protocol: [[Kinto]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Kinto/README.md#4-dos-kintowallet-contract

## Summary


The bug report discusses an issue with the `_resetSigners` function in the KintoWallet contract. This function does not take into account the current `SignerPolicy`, which can lead to a user accidentally resetting the signers with an array length of 1, even if the current policy is greater than 1. This can cause the `_validateSignature` method to always return an error, requiring the user to wait 7 days and restore their account. The recommendation is to check the `policy` variable when calling `resetSigners` and adjust it if necessary.

## Details

##### Description

- https://github.com/KintoXYZ/kinto-core/blob/f7dd98f66b9dfba1f73758703b808051196e740b/src/wallet/KintoWallet.sol#L235

`_resetSigners` does not take into account the current `SignerPolicy` in any way. A user can accidentally call `resetSigners` with an array length of 1 (with current `policy > 1`). A sample code is below:

```solidity
abi.encodeWithSignature(
    'resetSigners(address[])', 
    [address1, address2])

abi.encodeWithSignature(
    'setSignerPolicy(uint8)',
    2)

abi.encodeWithSignature(
    'resetSigners(address[])',
    [address1])

// _kintoWalletv1.signerPolicy() == 2
// _kintoWalletv1.getOwnersCount() == 1
```

Thus, the following code (https://github.com/KintoXYZ/kinto-core/blob/f7dd98f66b9dfba1f73758703b808051196e740b/src/wallet/KintoWallet.sol#L220) will be called:
```solidity
...
else {
    (signatures[0], signatures[1], signatures[2]) = 
        ByteSignature.extractThreeSignatures(
            userOp.signature);
}
for (uint i = 0; i < owners.length; i++) {
    if (
        owners[i] == hash.recover(signatures[i])
        ) {
        requiredSigners--;
    }
}
return requiredSigners;
```

and since `owners.length == 1`, the `_validateSignature` method will always return an error. You will need to wait for 7 days and restore the account (`finishRecovery`).

##### Recommendation
We recommend that when calling `resetSigners` you also check the `policy` variable and adjust it if necessary.
