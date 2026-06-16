---
tags:
  - lang/solidity
  - platform/consensys
  - severity/high
  - sector/governance
  - sector/staking
protocol: "[[Geodefi]]"
auditors:
  - "[[Sergii Kravchenko]]"
report: "https://consensys.net/diligence/audits/2022/11/geodefi/"
genome:
  - "[[upgradeable-contract]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[reward-accounting]]"
---
# MiniGovernance - fetchUpgradeProposal will always revert

- id: 20751
- impact: HIGH
- protocol: [[Geodefi]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2022/11/geodefi/

## Summary


This bug report is about an issue in the function `fetchUpgradeProposal()` of the MiniGovernance contract. The issue is that `newProposal()` is called with a hard coded `duration` of 4 weeks, which exceeds the constant `MAX_PROPOSAL_DURATION` of 2 weeks. This means that the function will always revert and MiniGovernance will not be upgradeable. The code can be found in the files `MiniGovernance.sol` and `GeodeUtilsLib.sol`. The recommendation is to switch the hard coded proposal duration to 2 weeks.

## Details

#### Description


In the function `fetchUpgradeProposal()`, `newProposal()` is called with a hard coded `duration` of 4 weeks. This means the function will always revert since `newProposal()` checks that the proposal duration is not more than the constant `MAX_PROPOSAL_DURATION` of 2 weeks. Effectively, this leaves MiniGovernance non-upgradeable.


#### Examples


**code/contracts/Portal/MiniGovernance/MiniGovernance.sol:L183**



```
GEM.newProposal(proposal.CONTROLLER, 2, proposal.NAME, 4 weeks);

```
**code/contracts/Portal/utils/GeodeUtilsLib.sol:L328-L331**



```
require(
 duration <= MAX\_PROPOSAL\_DURATION,
 "GeodeUtils: duration exceeds MAX\_PROPOSAL\_DURATION"
);

```
#### Recommendation


Switch the hard coded proposal duration to 2 weeks.
