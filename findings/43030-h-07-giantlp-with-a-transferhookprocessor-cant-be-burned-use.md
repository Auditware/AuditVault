---
tags:
  - lang/solidity
  - sector/staking
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/locked-funds
  - precondition/specific-token-type
protocol: "[[Stakehouse Protocol]]"
auditors:
  - "[[Trust]]"
report: "https://code4rena.com/reports/2022-11-stakehouse"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[specific-token-type]]"
  - "[[reward-accounting]]"
---
# [H-07] GiantLP with a `transferHookProcessor` cant be burned, users' funds will be stuck in the Giant Pool

- id: 43030
- impact: HIGH
- protocol: [[Stakehouse Protocol]]
- reporter: Trust (Code4rena)
- source: https://code4rena.com/reports/2022-11-stakehouse

## Summary


This bug report discusses an issue with the GiantLP smart contract, specifically with the transferHookProcessor function. This function is intended to call a specific function when the contract is transferred, minted, or burned. However, there is a problem with the `to` address being set as address(0x00) in the erc20 `_burn` function. This causes the `GiantMevAndFeesPool` contract to call the function `SyndicateRewardsProcessor._distributeETHRewardsToUserForToken` with a zero address check, which will cause any withdraw function with a burning operation to revert. This means that users' funds will be stuck in the Giant Pool contracts. 

To demonstrate this issue, the reporter has provided a proof of concept test that shows how the `GiantMevAndFeesPool.withdrawETH` function will be reverted due to the zero address check. The recommended mitigation steps include skipping the update of rewards for zero addresses. This issue has been confirmed as a duplicate of another issue by Stakehouse. 

## Details


<https://github.com/code-423n4/2022-11-stakehouse/blob/main/contracts/liquid-staking/GiantLP.sol#L39-L47><br>
<https://github.com/code-423n4/2022-11-stakehouse/blob/main/contracts/liquid-staking/GiantMevAndFeesPool.sol#L73-L78><br>
<https://github.com/code-423n4/2022-11-stakehouse/blob/main/contracts/liquid-staking/SyndicateRewardsProcessor.sol#L51-L57><br>

The GiantLP with a transferHookProcessor will call `transferHookProcessor.beforeTokenTransfer(_from, _to, _amount)` when it's transferred / minted / burned.

But the `to` address is address(0x00) in the erc20 `_burn` function. The GiantMevAndFeesPool.beforeTokenTransfer will call the function `SyndicateRewardsProcessor._distributeETHRewardsToUserForToken` will a zero address check in the first line:

    function _distributeETHRewardsToUserForToken(...) internal {
        require(_recipient != address(0), "Zero address");

So any withdraw function with a operation of burning the GiantLP token with a transferHookProcessor will revert because of the zero address check. The users' funds will be stuck in the Giant Pool contracts.

### Proof of Concept

I wrote a test about `GiantMevAndFeesPool.withdrawETH` function which is used to withdraw eth from the Giant Pool. It will be reverted.

test/foundry/LpBurn.t.sol

    pragma solidity ^0.8.13;

    // SPDX-License-Identifier: MIT
    import {GiantPoolTests} from "./GiantPools.t.sol";

    contract LpBurnTests is GiantPoolTests {
        function testburn() public{
            address feesAndMevUserOne = accountOne; vm.deal(feesAndMevUserOne, 4 ether);
            vm.startPrank(feesAndMevUserOne);
            giantFeesAndMevPool.depositETH{value: 4 ether}(4 ether);
            giantFeesAndMevPool.withdrawETH(4 ether);
            vm.stopPrank();
        }
    }

run test

    forge test --match-test testburn -vvv

test log:

    ...
    ...
        ├─ [115584] GiantMevAndFeesPool::withdrawETH(4000000000000000000) 
        │   ├─ [585] GiantLP::balanceOf(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266) [staticcall]
        │   │   └─ ← 4000000000000000000
        │   ├─ [128081] GiantLP::burn(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, 4000000000000000000) 
        │   │   ├─ [126775] GiantMevAndFeesPool::beforeTokenTransfer(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, 0x0000000000000000000000000000000000000000, 4000000000000000000) 
        │   │   │   ├─ [371] GiantLP::totalSupply() [staticcall]
        │   │   │   │   └─ ← 4000000000000000000
        │   │   │   ├─ emit ETHReceived(amount: 4000000000000000000)
        │   │   │   ├─ [585] GiantLP::balanceOf(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266) [staticcall]
        │   │   │   │   └─ ← 4000000000000000000
        │   │   │   ├─ [0] 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266::fallback{value: 4000000000000000000}() 
        │   │   │   │   └─ ← ()
        │   │   │   ├─ emit ETHDistributed(user: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, recipient: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, amount: 4000000000000000000)
        │   │   │   ├─ [2585] GiantLP::balanceOf(0x0000000000000000000000000000000000000000) [staticcall]
        │   │   │   │   └─ ← 0
        │   │   │   └─ ← "Zero address"
        │   │   └─ ← "Zero address"
        │   └─ ← "Zero address"
        └─ ← "Zero address"

### Tools Used

foundry

### Recommended Mitigation Steps

Skip update rewards for zero address.

**[vince0656 (Stakehouse) confirmed duplicate issue #60](https://github.com/code-423n4/2022-11-stakehouse-findings/issues/60#event-7905446439)**



***
