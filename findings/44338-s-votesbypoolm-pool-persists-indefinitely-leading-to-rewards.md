---
tags:
  - lang/solidity
  - sector/governance
  - sector/token
  - platform/mixbytes
  - has/github
  - severity/high
  - precondition/specific-token-type
protocol: "[[EYWA]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#4-s_votesbypoolm_pool-persists-indefinitely-leading-to-rewards-allocation-after-lock-expiry"
genome:
  - "[[wrong-condition]]"
  - "[[specific-token-type]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[reward-accounting]]"
---
# `s_votesByPool[m_pool]` persists indefinitely, leading to rewards allocation after lock expiry

- id: 44338
- impact: HIGH
- protocol: [[EYWA]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#4-s_votesbypoolm_pool-persists-indefinitely-leading-to-rewards-allocation-after-lock-expiry

## Summary


The bug report describes an issue with the `EscrowVoteManagerV1` contract where a user's voting power does not decrease when their lock expires. This allows them to continue influencing reward distribution indefinitely. Additionally, there is a problem where if a user's votes return as 0, they cannot be nullified, giving them permanent voting power. The report recommends implementing a mechanism to track votes on a per-epoch basis to fix these issues.

## Details

##### Description
When a user votes in the `EscrowVoteManagerV1` contract, the value of **s_votesByPool[m_pool]** is incremented by the user's voting power.

https://gitlab.ubertech.dev/blockchainlaboratory/eywa-dao/blob/29465033f28c8d3f09cbc6722e08e44f443bd3b2/contracts/EscrowVoteManagerV1.sol#L307

However, this value does not decrease when the user's lock expires. Instead, it remains unchanged until the user explicitly interacts with one of the following functions.

1. `EscrowVoteManagerV1.vote()`
2. `EscrowVoteManagerV1.poke()`
3. `EscrowVoteManagerV1.reset()`

This behavior allows a user to create a lock, vote once, and ensure that the corresponding pool continues to benefit from their voting power indefinitely, even after the lock has expired. This occurs because the votes are not adjusted or re-evaluated unless the user takes further action.

Additionally, the gauge index is updated whenever new rewards are transferred to `EscrowVoteManagerV1`, which ensures that the gauge tied to the pool continues to receive rewards. This creates an inconsistency where expired locks still influence reward distribution.

https://gitlab.ubertech.dev/blockchainlaboratory/eywa-dao/-/blob/29465033f28c8d3f09cbc6722e08e44f443bd3b2/contracts/EscrowVoteManagerV1.sol#L356

It was also found that if calling `s_escrowManager.getVotesByTokenId(tokenId_)` (https://gitlab.ubertech.dev/blockchainlaboratory/eywa-dao/-/blob/29465033f28c8d3f09cbc6722e08e44f443bd3b2/contracts/EscrowVoteManagerV1.sol#L198) returns `0`, then no one can nullify the user's votes, due to the following revert (https://gitlab.ubertech.dev/blockchainlaboratory/eywa-dao/-/blob/29465033f28c8d3f09cbc6722e08e44f443bd3b2/contracts/EscrowVoteManagerV1.sol#L303):

```
if (m_votesForPool == 0) {
    revert ZeroEntry();
}
```

This way, the user will forever have votes for pools in `EscrowVoteManagerV1`.

##### Recommendation
We recommend implementing a mechanism that tracks users' votes on a per-epoch basis, similar to the approach used in the `IncentiveRewardsDistributor` and `RebaseRewardsDistributorV1` contracts.

***
