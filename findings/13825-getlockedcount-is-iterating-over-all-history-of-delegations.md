---
tags:
  - lang/solidity
  - platform/consensys
  - has/github
  - severity/high
  - sector/staking
protocol: "[[Skale Token]]"
auditors:
  - "[[Sergii Kravchenko]]"
report: "https://consensys.net/diligence/audits/2020/01/skale-token/"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[vote-delegation-loop]]"
---
# getLockedCount is iterating over all history of delegations ✓ Addressed

- id: 13825
- impact: HIGH
- protocol: [[Skale Token]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2020/01/skale-token/

## Summary


A bug was identified in the code/contracts/delegation/TokenState.sol file, which caused the `getLockedCount` function to iterate over all delegations of a specific holder, potentially growing more than the gas limit and locking all tokens forever. This caused any token transfer to be much more expensive than it should be. The issue was fixed as a part of the major code changes in the skale-manager#92 pull request. The recommendation was to remove iterations over a potentially unlimited amount of tokens and precalculate necessary data, so that the `getLockedCount` function can have O(1) complexity.

## Details

#### Resolution



Issue is fixed as a part of the major code changes in [skalenetwork/skale-manager#92](https://github.com/skalenetwork/skale-manager/pull/92)


#### Description


`getLockedCount` is iterating over all delegations of a specific holder and may even change the state of these delegations by calling `getState`.


**code/contracts/delegation/TokenState.sol:L60-L71**



```
function getLockedCount(address holder) external returns (uint amount) {
    amount = 0;
    DelegationController delegationController = DelegationController(contractManager.getContract("DelegationController"));
    uint[] memory delegationIds = delegationController.getDelegationsByHolder(holder);
    for (uint i = 0; i < delegationIds.length; ++i) {
        uint id = delegationIds[i];
        if (isLocked(getState(id))) {
            amount += delegationController.getDelegation(id).amount;
        }
    }
    return amount + getPurchasedAmount(holder) + this.getSlashedAmount(holder);
}

```
This problem is major because delegations number is growing over time and may even potentially grow more than the gas limit and lock all tokens forever. `getLockedCount` is called during every transfer which makes any token transfer much more expensive than it should be.


#### Recommendation


Remove iterations over a potentially unlimited amount of tokens. All the necessary data can be precalculated before and `getLockedCount` function can have O(1) complexity.
