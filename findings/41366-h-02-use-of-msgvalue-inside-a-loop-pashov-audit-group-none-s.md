---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[Sofamon August]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Sofamon-security-review-August.md"
genome:
  - "[[wrong-condition]]"
  - "[[integer-bounds]]"
  - "[[permanent]]"
---
# [H-02] Use of `msg.value` inside a loop

- id: 41366
- impact: HIGH
- protocol: Sofamon-August
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Sofamon-security-review-August.md

## Summary


The report states that there is a bug in the `batchCommitToMint` function, which is used to call the `commitToMint` function multiple times in a loop. The problem occurs when the same `msg.value` (transaction value) is used in each iteration, causing the transaction to fail due to insufficient funds. The severity of this bug is medium and the likelihood of it occurring is high. To fix this issue, it is recommended to make changes to both functions to prevent the `msg.value` from being used multiple times.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `batchCommitToMint` function attempts to call the `commitToMint` function multiple times within a loop, each time using the same `msg.value` that was provided when `batchCommitToMint` was called. While the `commitToMint` function works correctly on its own, it fails when invoked within the loop because the same `msg.value` is used multiple times. On the first iteration, the `msg.value` is transferred, but subsequent iterations fail because the `msg.value` has already been sent, causing the transaction to revert due to insufficient funds.

```solidity
/// @dev Note, this function should only be called by the commitController, otherwise it will fail with no signature
/// @param mintData An array of all the spins to spin for
/// @return ticketNonces The nonces for each spin so that the user can claim their rewards
function batchCommitToMint(MintData[] calldata mintData) public payable returns (uint256[] memory ticketNonces) {
    ticketNonces = new uint256[](mintData.length);

    for (uint256 i; i < mintData.length;) {
        MintData memory data = mintData[i];

        uint256 nonce = commitToMint(data.collectionId, data.spins, data.minter, "");
        ticketNonces[i] = nonce;

        unchecked {
            ++i;
        }
    }
}

/// @param _collectionId The Id of the collection you wish to roll for
/// @param spins The amount of spins you wish to roll
/// @param signature A signature commit to the price, nonce, and minter from the authority address
///
/// @return ticketNonce The nonce to use to claim your mint
function commitToMint(uint256 _collectionId, uint256 spins, address minter, bytes memory signature) public payable returns (uint256 ticketNonce) {
    ...
    ...
    ...
    if (msg.value != 0) {
        payable(protocolFeeTo).transfer(msg.value);
    }
    ...
    ...
    ...
}
```

## Recommendations

To mitigate this issue, consider adjusting both functions in a way that will not double account `msg.value` each iteration.
