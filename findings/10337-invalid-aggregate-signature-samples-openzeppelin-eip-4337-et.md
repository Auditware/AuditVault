---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/account
protocol: "[[EIP-4337]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/eip-4337-ethereum-account-abstraction-incremental-audit/"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[account-signer]]"
---
# Invalid aggregate signature [samples]

- id: 10337
- impact: HIGH
- protocol: [[EIP]]-4337 – Ethereum Account Abstraction Incremental Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/eip-4337-ethereum-account-abstraction-incremental-audit/

## Summary


This bug report is about the BLSSignatureAggregator component of the account-abstraction repository. This component is used to validate individual signatures before constructing a bundle, and to combine them off-chain and validate them together on-chain. The bug is that it is possible for an account to construct an operation that will pass the individual-signature check but fail the combined-signature check. This occurs if the public key used during individual validation is different from the one used during combined validation. This can be caused by the last 4 words of the initCode not matching the public key, or if they do not use the expected creation function, or if the user’s validation function changes the public key. If a bundler constructs a bundle with these operations, it will be unable to validate the combined signature and will attribute the fault to the aggregator, causing the aggregator to be throttled. The bug was resolved in pull request #195 and commit #268f103 of pull request #216, which were merged at commits #1cc1c97 and #1f505c5, respectively.

## Details

The `BLSSignatureAggregator` exposes a mechanism to let the bundler [validate individual signatures](https://github.com/eth-infinitism/account-abstraction/blob/6dea6d8752f64914dd95d932f673ba0f9ff8e144/contracts/bls/BLSSignatureAggregator.sol#L123) before constructing the bundle. Successful operations are grouped so the bundler can [combine their signatures](https://github.com/eth-infinitism/account-abstraction/blob/6dea6d8752f64914dd95d932f673ba0f9ff8e144/contracts/bls/BLSSignatureAggregator.sol#L143) off-chain and the `EntryPoint` can [validate them together](https://github.com/eth-infinitism/account-abstraction/blob/6dea6d8752f64914dd95d932f673ba0f9ff8e144/contracts/core/EntryPoint.sol#L142) on-chain. However, it is possible for an account to construct an operation that will pass the individual-signature check and still fail the combined-signature check.


In particular, if the public key it exposes [during the individual validation](https://github.com/eth-infinitism/account-abstraction/blob/6dea6d8752f64914dd95d932f673ba0f9ff8e144/contracts/bls/BLSSignatureAggregator.sol#L126) is different from the one used [during the combined validation](https://github.com/eth-infinitism/account-abstraction/blob/6dea6d8752f64914dd95d932f673ba0f9ff8e144/contracts/bls/BLSSignatureAggregator.sol#L60), the two validations will be inconsistent even though the signature is the same. This could occur if the [last 4 words of the `initCode`](https://github.com/eth-infinitism/account-abstraction/blob/6dea6d8752f64914dd95d932f673ba0f9ff8e144/contracts/bls/BLSSignatureAggregator.sol#L23) do not match the public key (because the `initCode` has additional data, or if they do not use the [expected creation function](https://github.com/eth-infinitism/account-abstraction/blob/6dea6d8752f64914dd95d932f673ba0f9ff8e144/contracts/bls/BLSAccountFactory.sol#L29)). It could also occur if the [user’s validation function](https://github.com/eth-infinitism/account-abstraction/blob/6dea6d8752f64914dd95d932f673ba0f9ff8e144/contracts/core/EntryPoint.sol#L135) (which is not invoked during the individual signature validation) changes the public key that is returned by `getBlsPublicKey`.


If a bundler constructs a bundle with these operations, it will be unable to validate the combined signature and will attribute the fault to the aggregator, which will cause the aggregator to be throttled and user operations with the same aggregator will not be processed.


Consider synchronizing the two validation functions so they both use the same public key.


***Update:** Resolved in [pull request #195](https://github.com/eth-infinitism/account-abstraction/pull/195) as well as commit [`268f103`](https://github.com/eth-infinitism/account-abstraction/pull/216/commits/268f103597c0406ba2595cf18d3d5a5473b9c7b9) of [pull request #216](https://github.com/eth-infinitism/account-abstraction/pull/216), which were merged at commits [`1cc1c97`](https://github.com/eth-infinitism/account-abstraction/commit/1cc1c97a00131a7922d1ccebd823e81e823b5d9f) and [`1f505c5`](https://github.com/eth-infinitism/account-abstraction/commit/1f505c5889b04a115b1bf09386c0b84cecdad5c4) respectively.*
