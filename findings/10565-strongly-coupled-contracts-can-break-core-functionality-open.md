---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/governance
  - sector/staking
protocol: "[[Origin]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/origin-governance-audit/"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# Strongly coupled contracts can break core functionality

- id: 10565
- impact: HIGH
- protocol: [[Origin]] Governance Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/origin-governance-audit/

## Summary


This bug report is about two Ethereum contracts: OgvStaking and RewardsSource. OgvStaking is strongly coupled with RewardsSource, meaning that any issue in RewardsSource will affect OgvStaking. In particular, OgvStaking's external functions stake, unstake, and extend must call the internal function _collectRewards to update and transfer a user's rewards. This function calls RewardsSource.collectRewards to update the accRewardPerShare variable and receive all rewards that accrued within RewardsSource since the last call to collectRewards. 

The issue is further amplified by misleading documentation in the RewardsSource.setRewardsTarget function, which contains the comment "Okay to be zero, just disables collecting rewards." However, setting the rewardTarget to the zero address would cause any calls from OgvStaking to RewardsSource.collectRewards to revert, disabling staking and not allowing any new OGV holders to participate in governance.

To fix this issue, it is suggested to wrap the external call to RewardsSource.collectReward into a try/catch block. This will decouple reward mechanics and staking-based governance. Additionally, it is suggested to remove the noRewards parameter of the unstake function. The issue has been fixed in pull request #97, where it is also suggested to catch the error reason and emit it as an event parameter to allow detection of the otherwise silent error.

## Details

The [`OgvStaking`](https://github.com/OriginProtocol/ousd-governance/blob/2b9761606d4ac4062b69367ebbad88220cea45ce/contracts/OgvStaking.sol) contract is strongly coupled with the [`RewardsSource`](https://github.com/OriginProtocol/ousd-governance/blob/2b9761606d4ac4062b69367ebbad88220cea45ce/contracts/RewardsSource.sol) contract:


* In `OgvStaking` the external functions `stake`, `unstake` and `extend` must call the internal function `_collectRewards` to update and transfer a user’s rewards.
* `_collectRewards` calls [`RewardsSource.collectRewards`](https://github.com/OriginProtocol/ousd-governance/blob/2b9761606d4ac4062b69367ebbad88220cea45ce/contracts/RewardsSource.sol#L34) to update the `accRewardPerShare` variable and receive all rewards that accrued within `RewardsSource` since the last call to `collectRewards`.


In consequence, any issue within the rewards distribution of the `RewardsSource.collectRewards` function will escalate into the governance-related functions of the `OgvStaking` contract.


This issue is further amplified by misleading documentation in the [`RewardsSource.setRewardsTarget`](https://github.com/OriginProtocol/ousd-governance/blob/2b9761606d4ac4062b69367ebbad88220cea45ce/contracts/RewardsSource.sol#L123) function, which contains the comment “Okay to be zero, just disables collecting rewards”. However, setting the `rewardTarget` to the zero address would cause any calls from `OgvStaking` to `RewardsSource.collectRewards` to revert, which will disable `staking`, thereby not allowing any new `OGV` holders to participate in governance.


Consider wrapping the external call to [`RewardsSource.collectReward`](https://github.com/OriginProtocol/ousd-governance/blob/2b9761606d4ac4062b69367ebbad88220cea45ce/contracts/OgvStaking.sol#L189) into a try/catch block to achieve decoupling of reward mechanics and staking-based governance. Additionally, consider removing the `noRewards` parameter of the `unstake` function which was originally intended for emergency withdrawals.


**Update**: *Fixed in pull request [#97](https://github.com/OriginProtocol/ousd-governance/pull/97). In addition, consider catching the error reason and emitting it as an event parameter to allow detection of the otherwise silent error.*
