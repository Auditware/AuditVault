---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
  - sector/farm
  - sector/governance
  - sector/lending
protocol: "[[KittenSwap]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-07-31.md"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# [H-01] Repeated distributions for killed gauges can block valid distributions

- id: 61951
- impact: HIGH
- protocol: KittenSwap_2025-07-31
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[KittenSwap]]-security-review_2025-07-31.md

## Summary


The bug report talks about a vulnerability that allows an attacker to repeatedly trigger distributions for a killed gauge, transferring emissions meant for other gauges back to the `minter` contract. This results in valid distribution calls failing for other gauges and loss of rewards for voters who voted for the affected gauge. The report suggests introducing a separate flag to prevent repeated distributions for killed gauges.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

**Note: Distributions for killed (standard) gauges will currently fail, so this report assumes that the killed gauge referred to is an AlgebraGauge**.

When a gauge is killed, the pending emissions for that gauge, for the current period, are re-routed back to the `minter` contract. Additionally, the `es.distributed` flag is *not* set to `true`. This is done so that, when the gauge is revived, we are able to re-distribute these missed emissions:

```solidity
    function _distribute(uint256 _period, address _gauge) internal {
...
        IVoter.Emissions storage es = ps.gaugeEmissions[_gauge];
        if (es.distributed) revert EmissionsAlreadyDistributedForPeriod();

        uint256 emissions = (ps.totalEmissions * ps.gaugeTotalVotes[_gauge]) /
            ps.globalTotalVotes;
...
        if (gauge[_pool].isAlive == false) {
            kitten.transfer(address(minter), emissions);
            emissions = 0;
        } else {
            es.amount = emissions;
            es.distributed = true;
        }

        if (gauge[_pool].isAlgebra) _claimAndDistributeAlgebraPoolFees(_pool);
        kitten.approve(_gauge, emissions);
        IGauge(_gauge).notifyRewardAmount(emissions);
...
    }
```

Because of this, an attacker is able to repeatedly trigger distributions for a killed gauge and effectively transfer emissions meant for other gauges back to the `minter` contract. This will then result in valid distribution calls failing for those other gauges, since the Voter contract will not have enough `KITTEN` tokens left to actually distribute. 

It is important to note that there are two distinct impacts from this bug:

1. Valid emission distributions are temporarily blocked (affects standard *and* algebra gauges): 

- An attacker can repeatedly trigger distributions for a killed gauge, draining the Voter’s KITTEN balance back to the minter contract. This prevents valid distributions for other gauges in the current period from succeeding. Those missed emissions will have to be retroactively distributed in later periods. 


2. Loss of rewards for voters (only affects `AlgebraGauges`): 

- If any of the affected gauges whose distributions are blocked are `AlgebraGauges`, the pool fees they accumulated for the current period will never be claimable by voters who voted for them during that period. This happens because pool fees in `AlgebraGauges` are **period‑specific**. When a distribution occurs, the fees are credited as voting rewards in the gauges `votingReward` contract, but only for the current period’s voters. If the distribution for that period fails (due to the exploit), the pending fees remain in the gauge’s community vault and will instead be credited as voting rewards to a later period when a distribution eventually succeeds. These voting rewards cannot be retroactively credited to the original period’s voters. As a result, voters who voted for the `AlgebraGauge` in the affected period will permanently lose those rewards unless they continue voting for the same gauge in subsequent periods, until the gauge finally receives a successful distribution.

### Exploit Scenario

Consider the following scenario:

We are in `period_1` and there are 3 gauges, `gauge_a`, `gauge_b`, and `gauge_c`. When voting for `period_2`, Alice allocates 45 votes to `gauge_a`, Bob allocates 45 votes to `gauge_b`, and Carol allocates 10 votes for `gauge_c`. Suppose that `gauge_c` is now killed during `period_1`. Now `period_2` begins, and suppose there are `100` KITTEN tokens that will be distributed as emissions for the gauges, so:

```
## current state before distributions

minter_contract_balance = 100
voter_contract_balance = 0

## gauge_a_expected_emissions = 45
## gauge_b_expected_emissions = 45
## gauge_c_expected_emissions = 10 (killed gauge)
```

At the beginning of `period_2`, an attacker calls `distribute(gauge_c)`, this results in the `100` KITTEN being transferred from the minter contract to the voter contract and, since `gauge_c` is killed, its 10 KITTEN emissions are routed back to the minter contract. At this point the state is:

```
## current state after distribution for gauge_c

minter_contract_balance = 10
voter_contract_balance = 90
```

Now, suppose the attacker calls `distribute(gauge_c)` again, this will result in another `10` KITTEN tokens being transferred from the voter contract back to the `minter` contract. New state:

```
## current state after second distribution call for gauge_c

minter_contract_balance = 20
voter_contract_balance = 80
```

As you can see, the attacker can call `distribute(gauge_c)` 8 more times to transfer the Voter's entire KITTEN balance back to the `minter` contract. When this happens, calls to distribute emissions for `gauge_a` and `gauge_b` will fail since the Voter contract will no longer have enough KITTEN tokens for the distributions. 

An attacker is able to perform this exploit for future distributions as well, potentially blocking a majority of these future distributions. However, this can only occur for future distributions if:

1. The killed algebra gauge has not been revived.
2. The algebra pool's (associated with the killed gauge) `algebraFee` was *not* set to `0`.
3. The eternal farming virtual pool incentive for the killed gauge was *not* deactivated.

Note that deactivating a killed algebra gauge can not be undone, so this will likely not occur if the gauge is expected to be revived. If an `algebraFee` is set to `0`, then this will represent a loss for the `algebraFeeReceiver`, but this is possible. However, even if the `algebraFee` is set to `0` in the next period, the affected algebra gauges' pending fees for the current period will have been redirected to the next period, which results in a loss for users who voted for those gauges for the current period. 

**Technicalities for exploit:** An attacker will have to ensure that their `distribute(killed_algebra_gauge)` calls get included at the top of the current period *before* any other calls to distribute to other gauges. 

## Recommendations
Introduce a separate flag (e.g., `es.killedDistributed`) for killed gauges. When a distribution is invoked for a killed gauge:

- If `es.killedDistributed` is already set to `true` for the given `period`, return early without transferring emissions back to the `minter` contract.

- Otherwise, perform a single distribution for the killed gauge, then set `es.killedDistributed = true`.

This ensures that a killed gauge can only trigger **one** distribution per valid period, preventing repeated distributions. This will still allow the proper emissions to be distributed retroactively when the gauge is revived. 
