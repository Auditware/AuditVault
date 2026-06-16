---
tags:
  - lang/solidity
  - lang/vyper
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/governance
protocol: "[[Yield Basis]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Yield%20Basis/DAO/README.md#3-infinitely-locked-votingescrow-positions-are-not-accounted-during-voting-in-gaugecontroller"
genome:
  - "[[stale-price]]"
  - "[[defi/price-manipulation]]"
  - "[[timestamp-dependence]]"
---
# Infinitely Locked `VotingEscrow` Positions Are Not Accounted During Voting in `GaugeController`

- id: 61924
- impact: HIGH
- protocol: [[Yield Basis]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Yield%20Basis/DAO/README.md#3-infinitely-locked-votingescrow-positions-are-not-accounted-during-voting-in-gaugecontroller

## Summary


The report describes a bug in the `VotingEscrow` code where an infinite lock is not being properly accounted for in calculating vote bias. This results in votes from users with an infinite lock being ignored in gauge voting. The recommendation is to update the code to support infinite locks in the calculation of vote bias.

## Details

##### Description

In `VotingEscrow`, an infinite lock sets a constant vote bias equal to the deposit and a slope of 0. However, in `GaugeController.vote_for_gauge_weights()`, vote bias is recalculated as `slope * dt`, ignoring the constant bias from an infinite lock:

```python
## Prepare slopes and biases in memory
old_slope: VotedSlope = self.vote_user_slopes[msg.sender][_gauge_addr]
old_dt: uint256 = max(old_slope.end, block.timestamp) - block.timestamp
old_bias: uint256 = old_slope.slope * old_dt
new_slope: VotedSlope = VotedSlope(
    slope = slope * _user_weight // 10000,  # slope = 0, so new_slope.slope = 0
    power = _user_weight,
    end = lock_end
)
new_dt: uint256 = lock_end - block.timestamp # 
new_bias: uint256 = new_slope.slope * new_dt # new_bias = 0
```
https://github.com/yield-basis/yb-core/blob/3352c612fc33e48f1a106da41f63810f31bc38be/contracts/dao/GaugeController.vy#L235

As a result, votes from users with an infinite lock are ignored in gauge voting.
<br/>
##### Recommendation

We recommend updating the `new_bias` calculation to support infinite locks.



---
