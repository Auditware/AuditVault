---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - sector/oracle
protocol: "[[Sofamon August]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Sofamon-security-review-August.md"
genome:
  - "[[signature-replay]]"
  - "[[direct-drain]]"
  - "[[permit-fork-replay]]"
---
# [H-01] Signatures can be replayed using different addresses

- id: 41365
- impact: HIGH
- protocol: Sofamon-August
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Sofamon-security-review-August.md

## Summary


This report describes a bug in the `commitToMint` function of a smart contract. This bug allows anyone to replay signatures using different addresses, potentially leading to a loss of funds. The severity of this bug is medium and the likelihood of it occurring is high. To fix this issue, it is recommended to include the address of the executor in the hash that is signed, preventing the signature from being valid for other addresses.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `commitToMint` function in the contract allows signatures signed by the `signer` to be replayed using different addresses. Anyone can see the signatures on-chain and then replay them with different accounts that have the same nonce. An attacker can start inputting previous signatures submitted by a user starting from a nonce of 0 until the current one.

```solidity
/// @param _collectionId The Id of the collection you wish to roll for
/// @param spins The amount of spins you wish to roll
/// @param signature A signature commit to the price, nonce, and minter from the authority address
///
/// @return ticketNonce The nonce to use to claim your mint
function commitToMint(uint256 _collectionId, uint256 spins, address minter, bytes memory signature) public payable returns (uint256 ticketNonce) {
    if (msg.sender != commitController) {
        uint256 nonce = userNonce[msg.sender];
        bytes32 hash = keccak256(abi.encodePacked(_collectionId, spins, nonce, msg.value, minter));
        bytes32 signedHash = hash.toEthSignedMessageHash();
        address approved = ECDSA.recover(signedHash, signature);

        if (approved != signer) {
            revert NotApproved();
        }
    }

    if (msg.value != 0) {
        payable(protocolFeeTo).transfer(msg.value);
    }

    ticketNonce = rng.rng();

    NonceData memory data = NonceData({ owner: minter, collectionId: uint128(_collectionId), spins: uint128(spins) });

    uint256 _userNonce = userNonce[msg.sender];
    userNonce[msg.sender] = _userNonce + 1;

    dataOf[ticketNonce] = data;

    emit MintCommited(msg.sender, minter, spins, msg.value, _userNonce + 1, ticketNonce);
}
```

## Recommendations

To mitigate this issue, it is recommended to either include the address of the executor in the hash that is signed. This ensures that the signature is bound to a specific address and cannot be replayed by others. Here is a possible modification:

```solidity
bytes32 hash = keccak256(abi.encodePacked(_collectionId, spins, nonce, msg.value, minter, msg.sender));
```

This addition ensures that the `msg.sender` address is included in the hash, preventing the signature from being valid for other addresses.
