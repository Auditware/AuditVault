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
  - "[[locked-funds]]"
  - "[[vote-delegation-loop]]"
---
# Some unlocked tokens can become locked after delegation is rejected ✓ Addressed

- id: 13828
- impact: HIGH
- protocol: [[Skale Token]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2020/01/skale-token/

## Summary


This bug report is about an issue where tokens requested to be delegated to a validator can be rejected, but the previous status of the tokens (locked or unlocked) is changed. This occurs when the initial status of the tokens is stored as either completely locked or unlocked. The code in question is found in the TokenState.sol file, lines 205-214 and 272-278. The recommendation is to not change the status of the rejected tokens. The issue has been fixed as part of major code changes in skalenetwork/skale-manager#92.

## Details

#### Resolution



Issue is fixed as a part of the major code changes in [skalenetwork/skale-manager#92](https://github.com/skalenetwork/skale-manager/pull/92)


#### Description


When some amount of tokens are requested to be delegated to a validator, the validator can reject the request. The previous status of these tokens should be intact and not changed (locked or unlocked).


Here the initial status of tokens gets stored and it’s either completely `locked` or `unlocked`:


**code/contracts/delegation/TokenState.sol:L205-L214**



```
if (\_purchased[delegation.holder] > 0) {
    \_isPurchased[delegationId] = true;
    if (\_purchased[delegation.holder] > delegation.amount) {
        \_purchased[delegation.holder] -= delegation.amount;
    } else {
        \_purchased[delegation.holder] = 0;
    }
} else {
    \_isPurchased[delegationId] = false;
}

```
The problem is that if some amount of these tokens are locked at the time of the request and the rest tokens are unlocked, they will all be considered as locked after the delegation was rejected.


**code/contracts/delegation/TokenState.sol:L272-L278**



```
function \_cancel(uint delegationId, DelegationController.Delegation memory delegation) internal returns (State state) {
    if (\_isPurchased[delegationId]) {
        state = purchasedProposedToPurchased(delegationId, delegation);
    } else {
        state = proposedToUnlocked(delegationId);
    }
}

```
#### Recommendation


Don’t change the status of the rejected tokens.
