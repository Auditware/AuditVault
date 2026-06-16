---
tags:
  - lang/solidity
  - sector/account
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/access-control/missing-signer
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
protocol: "[[Kinto]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Kinto/README.md#5-incorrect-signature-validation-for-different-signer-policies"
genome:
  - "[[missing-signer]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[account-signer]]"
  - "[[dos-resistance]]"
---
# Incorrect signature validation for different signer policies

- id: 30498
- impact: HIGH
- protocol: [[Kinto]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Kinto/README.md#5-incorrect-signature-validation-for-different-signer-policies

## Summary


This bug report discusses issues with the verification of signers in the KintoWallet smart contract. This can potentially lead to a loss of funds or denial of service for users. There are four main problems identified in the report:

1. The use of the `MINUS_ONE_SIGNER` policy can lead to a loss of funds when there is only one owner, as the contract does not check the current signer policy before allowing withdrawals.
2. The use of the `SINGLE_SIGNER` policy is inconsistent and can lead to denial of service.
3. If the first owner loses their key or does not have KYC, the other owners lose access to the wallet.
4. The current implementation of `_validateSignature()` may return unexpected values, which can cause issues with the account abstraction feature.

To fix these problems, the report recommends limiting the result of `_validateSignature()` to only 0 and 1, checking the signer policy and owners to avoid checking zero signatures, standardizing the operation of `_validateSignature()` for the `SINGLE_SIGNER` policy, and considering any owner's signature as valid only if they have passed KYC.

## Details

##### Description

* https://github.com/KintoXYZ/kinto-core/blob/f7dd98f66b9dfba1f73758703b808051196e740b/src/wallet/KintoWallet.sol#L200

A KintoWallet can have from one to three owners and have different signer policies. Incorrect verification of signers in `_validateSignature()` in KintoWallet can lead to DOS (Denial of Service) of wallets or loss of funds.

**Problem 1.** Using the `MINUS_ONE_SIGNER` can lead to a loss of funds at the moment when the owner sets a single owner, as `_resetSigners()` does not check the current `signerPolicy`, and `_validateSignature()` in such a situation will check **zero** valid signatures, making the wallet accessible for withdrawal by any actors:
```
uint requiredSigners = 
    signerPolicy == 3 ? 
    owners.length : 
    owners.length - 1;
```

**Problem 2.** The use of the `SINGLE_SIGNER` policy is inconsistent and can lead to DOS.

If it is assumed that the `SINGLE_SIGNER` policy is always 1/1 scheme, then the question arises as to how to organize a 1/3 scheme and why, when changing the signer policy via `setSignerPolicy()`, it is possible to set the `SINGLE_SIGNER` policy with more than one owner:
```
function setSignerPolicy(uint8 policy) external override onlySelf {
    require(
        policy > 0 && 
        policy < 4 && 
        policy != signerPolicy, 
        'invalid policy'
        );
    
    require(
        policy == 1 || 
        owners.length > 1, 
        'invalid policy'
        );
    
    emit WalletPolicyChanged(policy, signerPolicy);
    signerPolicy = policy;
}
```

If it is assumed that `SINGLE_SIGNER` can be 1/2 or 1/3 scheme, then in `_validateSignature()` there is an incorrect check, because only the `owner[0]` is checked and otherwise the transaction is reverted: 
```
if (signerPolicy == 1) {
    if (owners[0] != hash.recover(userOp.signature))
        return SIG_VALIDATION_FAILED;
    return 0;
}
```

Thus, if the first owner loses their key, the other owners lose access to the KintoWallet.

**Problem 3.** If a KintoWallet has more than one owner and the first owner burns their KYC, the rest lose access to the wallet because `_validateSignature()` reverts if the first owner does not have KYC:
```
if (!kintoID.isKYC(owners[0])) {
    return SIG_VALIDATION_FAILED;
}
```

**Problem 4.** Using `MINUS_ONE_SIGNER` or `ALL_SIGNERS` policies currently lead to `_validateSignature()` possibly returning value of `2` or `3` as a result. Values above 1 have a different meaning in account abstraction and may be interpreted by the entryPoint in an unexpected way:
```
for (uint i = 0; i < owners.length; i++) {
    if (owners[i] == hash.recover(signatures[i])) {
        requiredSigners--;
    }
}
return requiredSigners;
```

Especially if `_validateSignature` returns greater than 1, this is the wrong architecture for ERC-4337. Since EntryPoint considers that the Aggregator is returned (this is considered a valid signature).

##### Recommendation

We recommend:
1. Limit the result of `_validateSignature()` to only 0 and 1.
2. Check the signer policy and owners to avoid a situation where the wallet checks zero signatures.
3. Standardize the operation of `_validateSignature()` in such a way that for the SINGLE_SIGNER policy, one signature from the list of owners is checked (not necessarily the very first owner).
4. Instead of checking the KYC of the first owner, simply consider any owner's signature as valid only if its owner passed KYC.
