---
tags:
  - lang/solidity
  - sector/governance
  - sector/nft
  - platform/mixbytes
  - has/github
  - severity/high
  - trigger/governance-vote
protocol: "[[EYWA]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#3-duplicate-voting-via-escrowmanager-nft-transfers"
genome:
  - "[[proposal-manipulation]]"
  - "[[governance-vote]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[governance-voting-power-snapshot]]"
---
# Duplicate voting via EscrowManager NFT transfers

- id: 44333
- impact: HIGH
- protocol: [[EYWA]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#3-duplicate-voting-via-escrowmanager-nft-transfers

## Summary


The `ProposalManager` contract has a bug where a user can transfer their voting power to another account and both accounts can vote on the same proposal using the same voting power. This can be exploited by an attacker to artificially increase the total votes for a proposal and potentially pass it without having the required voting power. It is recommended to fix this issue by ensuring that each voting NFT token can only be used once per proposal, even if transferred.

## Details

##### Description

The `ProposalManager` contract relies on the `token().getPastVotes(account, timepoint)` method to determine the voting power of an account at a specific snapshot `timepoint`. However, there is no restriction preventing a user from voting on a proposal and then transferring their `tokenId` to another user, who can also vote on the same proposal using the same voting power.

```javascript
const timestamp = BigInt(await time.latest()) - EPOCH_DURATION / 2n;

console.log("BEFORE ALICE", 
            await escrowManager.getPastVotes(alice.address, timestamp));
console.log("BEFORE malory", 
            await escrowManager.getPastVotes(malory.address, timestamp));

const tx = await escrowManager.connect(alice).
    transferFrom(alice.address, malory.address, aliceTokenId1);
await tx.wait();

console.log("AFTER ALICE", 
            await escrowManager.getPastVotes(alice.address, timestamp));
console.log("AFTER malory", 
            await escrowManager.getPastVotes(malory.address, timestamp));

// output:
// BEFORE ALICE 5393550315271500n
// BEFORE malory 0n
// AFTER ALICE 5393550315271500n
// AFTER malory 5393550315271500n
```

In the provided test case, after Alice transfers her `tokenId` to Malory, both Alice and Malory have the same voting power at the `timepoint`. This duplication occurs because `getPastVotes` returns the historical votes for an account at a given timestamp, regardless of subsequent transfers. As a result, both accounts can vote using the same voting power, effectively doubling the influence.

By repeatedly transferring the `tokenId` to multiple accounts, an attacker can artificially inflate the total votes for a proposal, potentially passing proposals without holding the requisite voting power legitimately.

##### Recommendation
We recommend ensuring that each voting NFT token can only be used once per proposal, even if transferred.

***
