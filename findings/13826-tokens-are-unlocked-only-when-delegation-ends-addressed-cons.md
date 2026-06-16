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
# Tokens are unlocked only when delegation ends ✓ Addressed

- id: 13826
- impact: HIGH
- protocol: [[Skale Token]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2020/01/skale-token/

## Summary


A bug was reported in the code/contracts/delegation/TokenState.sol file, line 258 to 264. It was discovered that after the first 3 months since at least 50% of tokens are delegated, all tokens should be unlocked. However, in practice, they are only unlocked if at least 50% of tokens, that were bought on the initial launch, are undelegated. This bug has been fixed as a part of the major code changes in [skalenetwork/skale-manager#92](https://github.com/skalenetwork/skale-manager/pull/92). The recommendation is to implement a lock mechanism according to the legal requirement.

## Details

#### Resolution



Issue is fixed as a part of the major code changes in [skalenetwork/skale-manager#92](https://github.com/skalenetwork/skale-manager/pull/92)


#### Description


After the first 3 months since at least 50% of tokens are delegated, all tokens should be unlocked. In practice, they are only unlocked if at least 50% of tokens, that were bought on the initial launch, are undelegated.


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


Implement lock mechanism according to the legal requirement.
