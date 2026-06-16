---
tags:
  - lang/solidity
  - sector/staking
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Resolv]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Resolv/Staking/README.md#1-checkpoint-resets-totaleffectivesupply"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[locked-funds]]"
  - "[[integer-bounds]]"
---
# `checkpoint()` resets `totalEffectiveSupply`

- id: 56917
- impact: HIGH
- protocol: [[Resolv]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Resolv/Staking/README.md#1-checkpoint-resets-totaleffectivesupply

## Summary


The bug report describes an issue where the `totalEffectiveSupply` variable in the `ResolvStaking` contract is being reset to zero when the `ResolvStaking.checkpoint()` function is called with the zero address as the user. This is due to the `ResolvStakingCheckpoints.updateEffectiveBalance()` function returning zero for the zero address. This bug can be exploited by a hacker to prevent users from withdrawing their funds from the contract. The report recommends two solutions: 1) returning the current `totalEffectiveSupply` when the user address is zero and 2) changing the order of operations when calculating `newTotalEffectiveSupply` to avoid an underflow. 

## Details

##### Description
When `ResolvStaking.checkpoint()` is called with the zero address as the user, the variable `totalEffectiveSupply` is reset to zero because the function `ResolvStakingCheckpoints.updateEffectiveBalance()` returns zero for the zero address.

- https://github.com/resolv-im/resolv-contracts/blob/530d997b010b803691abab53835ad70f780ac5db/contracts/staking/libraries/ResolvStakingCheckpoints.sol#L128

A hacker can pass the zero address to the `checkpoint()` function via `ResolvStaking.updateCheckpoint()`. Resetting `totalEffectiveSupply` to zero would prevent users from being able to withdraw funds from the contract due to an underflow at the following line:
```solidity
newTotalEffectiveSupply = 
    // (
    _params.totalEffectiveSupply // =0
    - oldEffectiveBalance // >0
    // )
    + newEffectiveBalance;
```
https://github.com/resolv-im/resolv-contracts/blob/530d997b010b803691abab53835ad70f780ac5db/contracts/staking/libraries/ResolvStakingCheckpoints.sol#L163
<br/>
##### Recommendation
1. In `ResolvStakingCheckpoints.updateEffectiveBalance()`, return the current `totalEffectiveSupply` when the user address is zero.
2. Change the order of operations when calculating `newTotalEffectiveSupply`, adding first, subtracting last:
   ```solidity
   newTotalEffectiveSupply = 
       (_params.totalEffectiveSupply + 
        newEffectiveBalance) 
        - oldEffectiveBalance;
   ```

> **Client's Commentary:**
> https://github.com/resolv-im/resolv-contracts/commit/56f2fe95f87a4e1f51221a366efb4fa697fdb2d0

---
