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
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[vote-delegation-loop]]"
---
# Tokens after delegation should not be unlocked automatically ✓ Addressed

- id: 13827
- impact: HIGH
- protocol: [[Skale Token]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2020/01/skale-token/

## Summary


This bug report is about an issue that occurs when tokens are delegated to a validator. When the delegation period ends, the tokens should be added to the `_purchased` state as they were in that state before their delegation. However, this has not been happening. The resolution for this issue is part of the major code changes in [skalenetwork/skale-manager#92](https://github.com/skalenetwork/skale-manager/pull/92). The recommendation is that tokens should only be unlocked if the main legal requirement `(_totalDelegated[holder] >= _purchased[holder])` is satisfied.

## Details

#### Resolution



Issue is fixed as a part of the major code changes in [skalenetwork/skale-manager#92](https://github.com/skalenetwork/skale-manager/pull/92)


#### Description


When some amount of tokens are delegated to a validator when the delegation period ends, these tokens are unlocked. However these tokens should be added to `_purchased` as they were in that state before their delegation.


**code/contracts/delegation/TokenState.sol:L258-L264**



```
if (\_isPurchased[delegationId]) {
    address holder = delegation.holder;
    \_totalDelegated[holder] += delegation.amount;
    if (\_totalDelegated[holder] >= \_purchased[holder]) {
        purchasedToUnlocked(holder);
    }
}

```
#### Recommendation


Tokens should only be unlocked if the main legal requirement `(_totalDelegated[holder] >= _purchased[holder])` is satisfied, which in the above case this has not happened.
