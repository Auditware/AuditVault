---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/staking
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Origin]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/origin-governance-audit/"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Extending the staking duration discards rewards

- id: 10564
- impact: HIGH
- protocol: [[Origin]] Governance Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/origin-governance-audit/

## Summary


A bug has been reported in the OgvStaking contract, which is part of the OriginProtocol/ousd-governance project. The bug is related to the incorrect calculation of rewards for users.

The bug is caused by the two-step process for updating user rewards. The first step is to call the internal function _collectRewards, which updates the accumulated per share rewards for all users and then computes and transfers an individual user’s total outstanding rewards. The second step is to update the mapping rewardDebt for internal bookkeeping. However, the function extend only performs an update on rewardDebt without a prior call to _collectRewards, resulting in the rewards being discarded instead of being paid out.

To fix the bug, the root cause needs to be addressed by migrating to a mapping rewardDebtPerShare. This mapping can be updated within the _collectRewards function, which does not need to account for changes in the user’s balance, thereby avoiding any future mismatches in reward accounting.

The bug has been fixed by the changes made in pull requests #88 and #98.

## Details

In the [`OgvStaking`](https://github.com/OriginProtocol/ousd-governance/blob/2b9761606d4ac4062b69367ebbad88220cea45ce/contracts/OgvStaking.sol) contract, updating a user’s rewards is a two step process: First, the internal function [`_collectRewards`](https://github.com/OriginProtocol/ousd-governance/blob/2b9761606d4ac4062b69367ebbad88220cea45ce/contracts/OgvStaking.sol#L184) must be called, which updates the accumulated per share rewards for all users and then computes and transfers an individual user’s total outstanding rewards. The computation of a user’s outstanding rewards uses the mapping `rewardDebt` for internal bookkeeping. Because `rewardDebt` contains a user’s debt in absolute terms, it can only be updated as a second step outside of the `_collectRewards` function after a potential change of the user’s stake has been accounted for. In effect, user rewards can only be computed correctly if a call to `_collectRewards` is jointly used with an update of `rewardDebt`.


The function [`extend`](https://github.com/OriginProtocol/ousd-governance/blob/2b9761606d4ac4062b69367ebbad88220cea45ce/contracts/OgvStaking.sol#L127) only performs an update on `rewardDebt` without a prior call to `_collectRewards`. Hence, it always discards the rewards earned by a user instead of paying them out.


While calling `_collectRewards` within the `extend` function would mitigate the issue, consider instead solving the root cause by migrating to a mapping `rewardDebtPerShare`. This mapping can be updated within the `_collectRewards` function, which does not need to account for changes in the user’s balance, thereby avoiding any future mismatches in reward accounting.


**Update**: *Fixed by the changes made in pull requests [#88](https://github.com/OriginProtocol/ousd-governance/pull/88) and [#98](https://github.com/OriginProtocol/ousd-governance/pull/98).*
