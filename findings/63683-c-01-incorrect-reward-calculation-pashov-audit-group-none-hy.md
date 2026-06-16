---
tags:
  - lang/solidity
  - sector/nft
  - sector/staking
  - platform/pashov
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[HYBUX]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/HYBUX-security-review_2025-11-11.md"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# [C-01] Incorrect reward calculation

- id: 63683
- impact: HIGH
- protocol: HYBUX_2025-11-11
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[HYBUX]]-security-review_2025-11-11.md

## Summary


The bug report describes an issue with a function called `_unstakeNFTs` in a smart contract. This function is supposed to calculate and transfer rewards to a user when they unstake their NFTs. However, when the user unstakes through a router contract, the rewards are calculated and transferred to the router instead of the user. This is because the function is using the wrong address when calling another function called `_claimRewards`. The report recommends changing the code to ensure rewards are always calculated for the correct user address, regardless of how they unstake their NFTs.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** High

## Description

The `_unstakeNFTs` internal function calls `claimRewards()` instead of `_claimRewards(_sender)` when processing unstaking operations. While this works correctly for direct unstaking (where `msg.sender` is the user), it fails when unstaking through the router because `msg.sender` becomes the router contract address.

```solidity
File: NFTStaking.sol
82:     function unstakeNFTsRouter(address _sender, uint256[] calldata _tokenIds) external {
83:         require(msg.sender == stakingRouterAddress, "Only router");
84: 
85:@>       _unstakeNFTs(_sender, _tokenIds);
86:     }
...
88:     function claimRewards() public {
89:@>       _claimRewards(msg.sender);
90:     }
...
182:     function _unstakeNFTs(address _sender, uint256[] calldata _tokenIds) internal {
183:@>     claimRewards();
```

When a user unstakes through `unstakeNFTsRouter`, the function correctly passes the user's address as `_sender` to `_unstakeNFTs`. However, `_unstakeNFTs` then calls `claimRewards()`, which internally calls `_claimRewards(msg.sender)`. Since `msg.sender` is the router contract, rewards are calculated and transferred to the router instead of the user.

The staking implementation correctly anticipated router usage and consistently used `_sender` for all storage operations. Consider the following scenario:

1. User Alice has staked NFTs for 7 days, accumulating 1000 HYBUX in rewards
2. Alice calls `StakingRouter.unstakeNFTs()` with her NFT token IDs
3. Router calls `NFTStaking.unstakeNFTsRouter(aliceAddress, tokenIds)`
4. `unstakeNFTsRouter` validates caller is router, then calls `_unstakeNFTs(aliceAddress, tokenIds)`
5. `_unstakeNFTs` calls `claimRewards()` - but `msg.sender` is the router contract
6. `_claimRewards(routerAddress)` calculates rewards for router instead of Alice
7. Alice loses her 1000 HYBUX rewards

## Recommendations

`NFTStaking._unstakeNFTs();` change to `_claimRewards(_sender);` to ensure rewards are always calculated for the correct user address regardless of whether unstaking occurs directly or through the router.
