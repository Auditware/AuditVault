---
tags:
  - lang/solidity
  - sector/governance
  - platform/mixbytes
  - has/github
  - severity/high
  - fix/add-snapshot
protocol: "[[EYWA]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#2-incorrect-checkpoint-handling-nullifies-voting-weights"
genome:
  - "[[wrong-condition]]"
  - "[[add-snapshot]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[timestamp-dependence]]"
---
# Incorrect checkpoint handling nullifies voting weights

- id: 44332
- impact: HIGH
- protocol: [[EYWA]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#2-incorrect-checkpoint-handling-nullifies-voting-weights

## Summary


The report describes a bug found in the `_findCheckpoint` method of the `EscrowManager` contract. This bug occurs when multiple checkpoints are created at the same time, causing the method to retrieve the wrong historical value. This can be exploited by an attacker to reset a user's voting power to zero. To fix this, it is recommended to avoid increments to the `s_checkpointsNumberByAccount` mapping and ensure that duplicate tokens are not added to the tokenIds array.

## Details

##### Description
- https://gitlab.ubertech.dev/blockchainlaboratory/eywa-dao/blob/29465033f28c8d3f09cbc6722e08e44f443bd3b2/contracts/EscrowManager.sol#L869

A vulnerability has been identified in the `_findCheckpoint` method of the `EscrowManager` contract, where it incorrectly handles checkpoints that occur within the same `block.timestamp`. When the current timestamp equals the timestamp of the checkpoint `[currentCheckpointNumber - 1]`, the same token is added to the tokenIds array, and `s_checkpointsNumberByAccount` is incremented by one. As a result, this creates a checkpoint with an empty `tokenIds` array.

When multiple checkpoints share the same timestamp, the method erroneously retrieves the current value instead of the correct historical value. This issue arises because `s_checkpoints[account_][m_checkpointsNumber - 1].timestamp == block.timestamp` leads to improper retrieval logic.

The `_moveVotes` function (see [EscrowManager.sol#L723](https://gitlab.ubertech.dev/blockchainlaboratory/eywa-dao/-/blob/29465033f28c8d3f09cbc6722e08e44f443bd3b2/contracts/EscrowManager.sol#L723)) does not account for this condition, causing an error where `m_oldTokenIds == s_checkpoint.tokenIds`. This inconsistency leads to `++s_checkpointsNumberByAccount[to_]` pointing to a non-existent array element, effectively corrupting the vote tracking mechanism.

An attacker can exploit this vulnerability to nullify any user's votes by performing actions that create multiple checkpoints at the same `block.timestamp`. For instance, by transferring a minimal amount (e.g., `1 wei` of EYWA tokens) to the target user's account multiple times within the same block, the attacker can reset the user's voting power to zero.

**Attack Example:**
```javascript
// Hardhat configuration: allowUnlimitedContractSize: true
await escrowManager.connect(alice)["createLock(uint256,uint256,address)"](
    1, lockDuration, bob.address);
await escrowManager.connect(alice)["createLock(uint256,uint256,address)"](
    1, lockDuration, bob.address);

console.log("getVotes(bob)", await escrowManager.getVotes(bob.address));
// Output: 0
```
In this example, Alice creates two locks for Bob within the same block timestamp, resulting in Bob's votes being reset to zero.

##### Recommendation
We recommend avoiding increments to the `s_checkpointsNumberByAccount` mapping when changes occur at the same timestamp. Additionally, ensure that the same token is not pushed into the tokenIds array if it already exists within the same checkpoint.


***
