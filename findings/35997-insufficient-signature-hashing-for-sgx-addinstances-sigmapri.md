---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - precondition/insider
  - sector/zk
protocol: "[[Taiko]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/taiko/review.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[insider]]"
  - "[[role-bypass]]"
  - "[[permit-fork-replay]]"
---
# Insuﬃcient Signature Hashing For SGX addInstances()

- id: 35997
- impact: HIGH
- protocol: [[Taiko]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/taiko/review.pdf

## Summary


This report describes a bug in a code function called addInstances() that allows for a non-SGX address to be used, potentially leading to unauthorized access outside of the trusted execution environment. There are two versions of this function, one restricted to onlyOwner and the other allowing for multiple new SGX instances to be added. The bug is caused by the fact that a specific value, called newInstance, is not included in the signedHash, allowing it to be arbitrarily set by the user. This could result in a malicious user creating a signature for extra instances and setting the value of newInstance to an address where the private key is known, allowing for forged SGX proofs to be accepted. To fix this issue, the value of newInstance should be included in the signedHash and domain separation should be added to prevent replay of signatures on other contracts or chains. This has been resolved in a recent update to the code.

## Details

## Description

A bug exists in one of the `addInstances()` functions which allows replacing a current SGX instance with any arbitrary address. The address may be non-SGX and therefore can operate outside of the trusted execution environment. There are two implementations of `addInstances()`, one restricted to `onlyOwner` and the other allowing current SGX instances to add multiple new SGX instances. 

To prevent side-channel attacks on ECDSA signing, each instance must replace the private key and address each time it generates a signature. 

In the code snippet below, it can be seen that `newInstance` is not included in the `signedHash`. There are no other restrictions on the value of `newInstance`. It can therefore be arbitrarily set by `msg.sender` to a non-SGX address.

```solidity
function addInstances(
    uint256 id,
    address newInstance,
    address[] calldata extraInstances,
    bytes calldata signature
) external returns (uint256[] memory ids) {
    bytes32 signedHash = keccak256(abi.encode("ADD_INSTANCES", extraInstances));
    address oldInstance = ECDSA.recover(signedHash, signature);
    if (!_isInstanceValid(id, oldInstance)) revert SGX_INVALID_INSTANCE();
    _replaceInstance(id, oldInstance, newInstance); //@audit newInstance is not signed by the old instance
    ids = _addInstances(extraInstances);
}
```

The impact is high as a malicious instance can create an `ADD_INSTANCES` attestation signature for extra instances. The malicious user then sets the `newInstance` parameter to an address where the private key is known. With the malicious address, they are able to sign forged SGX proofs which are accepted by `verifyProof()`.

## Recommendations

To resolve this issue, include the value of `newInstance` within the `signedHash`. Furthermore, it is recommended to include a domain separator with `address(this)` and `block.chainid` within `signedHash` to prevent replay of signatures on other contracts or chains. This can be achieved through the use of EIP-712: Typed structured data hashing and signing. 

Additionally, domain separation should be added to the function `verifyProof()` to ensure signatures are not re-usable between the functions `addInstances()` and `verifyProof()`.

## Resolution

PR #15514 resolves the issue by updating hashing to include the function parameter `newInstance`. Additionally, domain separation has been included in hashing to prevent replay on other functions or other smart contracts with the same parameters.
