---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
protocol: "[[Subsquid]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md"
genome:
  - "[[reward-accounting]]"
  - "[[arithmetic/overflow]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[specific-state]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# [H-02] `computationUnitsAvailable` can overestimate number of available units if staking duration is too small

- id: 58246
- impact: HIGH
- protocol: Subsquid
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md

## Summary


This bug report discusses a problem with the `computationUnitsAvailable` function in the `GatewayRegistry.sol` contract. This function is used to calculate the amount of computation units available to a `peerId`, but it has a flaw that can be easily exploited by malicious users. If the staking duration is set to be less than the epoch length, the computation units available per block will be calculated to be higher than the total amount of computation units available to the peerId. This can lead to inflated compute unit allocation and allow malicious users to repeatedly stake small amounts and increase their computational units allocation. To fix this issue, it is recommended to set a minimum staking duration of 1 epoch.

## Details

## Severity

**Impact**: High, can lead to inflated compute unit allocation

**Likelihood**: Medium, can be easily exploited by a malicious user at no cost

## Description

The `computationUnitsAvailable` function computes the amount of computation units available to a `peerId`. This is defined in the `GatewayRegistry.sol` contract as shown below.

```solidity
for (uint256 i = 0; i < _stakes.length; i++) {
    Stake memory _stake = _stakes[i];
    if (
        _stake.lockStart <= blockNumber && _stake.lockEnd > blockNumber
    ) {
        total +=
            (_stake.computationUnits * epochLength) /
            (uint256(_stake.lockEnd - _stake.lockStart));
    }
}
return total;
```

If `_stake.lockEnd - _stake.lockStart` is less than `epochLength`, the computation units available per epoch will be higher than the total amount of computation units available to the peerId.

The `_stake.computationUnits` is calculated during staking, and is the total amount of computation units available to the peerId during the entire staking duration. The objective of the `computationUnitsAvailable` function is to compute the amount of computation units available per block. However, if the staking duration is lower than the epoch length, the computation units available per block will be calculated to be higher than the total amount of computation units available to the peerId.

During staking, there is no restriction on the staking duration, so users can set it to be arbitrarily small. Thus `epochLength/duration` gives a large number, instead of calculating the inverse of the number of epochs passed.

A short POC demonstrates the issue:

```solidity
function test_AttackStake() public {
    gatewayRegistry.stake(peerId, 10 ether, 1);
    GatewayRegistry.Stake[] memory stakes = gatewayRegistry.getStakes(
        peerId
    );
    goToNextEpoch();
    emit log_named_uint("Stake compute units", stakes[0].computationUnits);
    emit log_named_uint(
        "Available compute units",
        gatewayRegistry.computationUnitsAvailable(peerId)
    );
}
```

The output:

```bash
[PASS] test_AttackStake() (gas: 212925)
Logs:
  Stake compute units: 10
  Available compute units: 50
```

This shows that while the total number of units assigned was 10, the per-epoch units available is 50.

Since `computationUnitsAvailable` is used off-chain to calculate the amount of computation units to allocate to workers, this can be used to assign extra computational units than intended.

Thus malicious users can repeatedly stake small amounts and pump up the amount of available computation units, and then unstake to get back their stake. They can increase their computational units allocation by a factor of `epochLength` by setting the duration to 1.

## Recommendations

Set a minimum staking duration of 1 epoch.
