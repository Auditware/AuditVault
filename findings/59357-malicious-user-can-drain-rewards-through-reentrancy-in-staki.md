---
tags:
  - lang/solidity
  - sector/staking
  - sector/token
  - platform/quantstamp
  - severity/high
  - vuln/access-control/missing-modifier
  - vuln/logic/reward-calculation
  - vuln/reentrancy/single-function
  - impact/loss-of-funds/reward-theft
  - precondition/specific-token-type
  - fix/add-access-control
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/admin-is-honest
  - misassumption/external-call-is-safe
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - trigger/reentrancy-callback
protocol: "[[Zero Staking]]"
auditors:
  - "[[Jennifer Wu]]"
report: "https://certificate.quantstamp.com/full/zero-staking/40ffa176-7b8d-43ec-a7e2-29732c12f21e/index.html"
genome:
  - "[[missing-modifier]]"
  - "[[reward-calculation]]"
  - "[[single-function]]"
  - "[[reward-theft]]"
  - "[[specific-token-type]]"
  - "[[add-access-control]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
---
# Malicious User Can Drain Rewards Through Reentrancy in Staking

- id: 59357
- impact: HIGH
- protocol: [[Zero Staking]]
- reporter: Jennifer Wu (Quantstamp)
- source: https://certificate.quantstamp.com/full/zero-staking/40ffa176-7b8d-43ec-a7e2-29732c12f21e/index.html

## Summary


The client has marked a bug as "Fixed" in the `StakingERC20.sol` and `StakingERC721.sol` files. The bug allows a malicious user to exploit the `staker.lastUpdatedTimestamp` in the `StakingERC721.stake()` function, resulting in unfair rewards. This is due to a reentrancy vulnerability, where the staker can re-enter the staking contract during the minting process. A similar risk exists in the `StakingERC20.stake()` function if ERC777 tokens are accepted. To fix this, it is recommended to implement a reentrancy guard or update the `staker.lastUpdatedTimestamp` earlier. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `0a9a94bb49ec54fce5e6bd8859be3f981fbbac4a`.

**File(s) affected:**`StakingERC20.sol`, `StakingERC721.sol`

**Description:** The `StakingERC721.stake()` function allows a malicious staker to exploit the stale `staker.lastUpdatedTimestamp` due to a reentrancy vulnerability. During the staking process, the `_stake()` function calls `_safeMint()`, which calls `checkOnERC721Received()`. This allows the staker to re-enter the staking contract during the minting process. Since the `staker.lastUpdatedTimestamp` is only updated at the end of the `stake()` function, the staker can re-enter the `stake()` or `unstake()` function to trigger multiple `_checkRewards` calculations, thereby unfairly increasing their pending rewards based on the `staker.lastUpdatedTimestamp`.

Similar reentrancy risks exist in the `StakingERC20.stake()` function if ERC777 tokens are accepted as staking tokens. The ERC777 token standard was created to extend the capabilities available in ERC20 tokens and one of the features allows the ERC777 token contract to notify the sender and recipient when ERC777 tokens are sent or received, which a malicious staker can use to re-enter the staking function.

**Recommendation:** Implement reentrancy protection in the `stake()` and `unstake()` functions to prevent users from re-entering the functions and exploiting the stale `lastUpdatedTimestamp`. This can be achieved using a reentrancy guard, such as OpenZeppelin's `ReentrancyGuard`, or by updating the `staker.lastUpdatedTimestamp` earlier:

1.   **Use Reentrancy Guard:** Add the `nonReentrant` modifier to the `stake()` and `unstake()` functions to prevent reentrancy.
2.   **Update Timestamp Early:** Update the `staker.lastUpdatedTimestamp` before calling any external functions to ensure that the timestamp is accurate and up-to-date before any potential reentrant calls can occur.
