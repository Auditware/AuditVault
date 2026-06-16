---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/staking
  - sector/token
protocol: "[[Remora]]"
auditors:
  - "[[0xStalin]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-22-cyfrin-remora-dynamic-tokens-v2.1.md"
genome:
  - "[[state-update]]"
  - "[[wrong-state]]"
  - "[[reward-accounting]]"
---
# Updating the entity allowance when the individual belongs to a group that has multiple catalysts for different entities can result in mistakenly modifying the allowance of entities where the individual is not even part of

- id: 63781
- impact: HIGH
- protocol: [[Remora]] Dynamic Tokens
- reporter: 0xStalin (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-22-cyfrin-remora-dynamic-tokens-v2.1.md

## Summary


This bug report describes a problem where entities not related to the sender or receiver can have their allowances changed or cause the transaction to fail. This issue occurs due to the system allowing for various combinations of individuals, groups, and entities. In a specific scenario, a transfer from one individual can affect entities that they are not a part of, causing incorrect allowance modifications or transaction failures. The recommended solution is to refactor the code to prevent this scenario from happening. The bug has been acknowledged and verified by the developers.

## Details

**Description:** The problem is that entities that have nothing to do with either the sender or the receiver can end up getting their allowances modified or causing the tx to revert.

The system allows to register:
- Individuals who belong to at most one group, or none.
- Groups with multiple individuals
- Entities with multiple individuals but only one catalyst.
- Each group can have multiple individuals who are catalysts for different entities
- Individuals in one group don't necessarily belong to all the same entities that the rest of the individuals belong to
- One investor can be the catalyst for multiple entities.

This combination of possibilities allows for a scenario as follows:

| Entity | Investors | Catalyst |
|---|---|---|
| EntityA | InvestorA, InvestorB | InvestorB |
| EntityB | InvestorB, InvestorC | InvestorB |
| EntityC | InvestorA, InvestorC | InvestorA |
| EntityD | InvestorB, InvestorC | InvestorB |


| Group | Investors | groups.numOfCatalysts |
|---|---|---|
| GroupA | InvestorA, InvestorB | 4 |
| GroupB | InvestorC, InvestorD | 0 |


| Investors | individualData.numOfCatalysts |
| --|---|
| InvestorA | 1 |
| InvestorB | 3 |
| InvestorC | 0 |
| InvestorD| 0 |


Using the previous configuration, a transfer `from` InvestorA will end up affecting entityB and entityD because InvestorA and investorB are in the same group, and InvestorB is the catalyst on EntityB and EntityD (where InvestorC and InvestorD are part of and have nothing to do with InvestorA).

The issue occurs in these blocks of code on the `FiveFiftyRule::canTransfer` function:
```solidity
    function canTransfer(address from, address to, uint256 amount) external returns (bool) {
        ...

            if (iFrom.isEntity) {
                entityData[from].allowance += SafeCast.toUint64(amount);
//@audit-info => If `from` is on a group and that group has multiple catalysts!
            } else if (gId != 0 && groups[gId].numCatalyst != 0) {
                //@audit-info => iterates over ALL the individuals of the group `from` belongs to!
                uint256 len = groups[gId].individuals.length;
                for (uint256 i; i<len; ++i) {
                    address ind = groups[gId].individuals[i];
//@audit-issue => ENTERS If the current individual of the group (doesn't matter if this individual is the `from`) is a catalyst on at least one entity
@>                  if (individualData[ind].numCatalyst != 0)
                        _updateEntityAllowance(true, ind, amount);
                }
            }
        ...

    function _updateEntityAllowance(bool add, address inv, uint256 amount) internal returns (bool) {
//@audit-info => total times the individual is a catalyst on != entities!
        uint8 numCatalyst = individualData[inv].numCatalyst;

//@audit-info => Entities the individual belongs to!
        uint256 len = findEntity[inv].length;

 //@audit-info => iterates over the entities the individual belongs to
        for (uint256 i; i<len; ++i) {
//@audit-info => if individual is not a catalyst on any entity, break out of the loop!
            if (numCatalyst == 0) break;

//@audit-info => Loads the entity data the individual belongs to on the current indx being iterated
            EntityData storage aData = entityData[findEntity[inv][i]];

//@audit-info => if the catalyst of the entity is not the investor, continue to the next entity!
            if (aData.catalyst != inv) continue;

 //@audit-info => If reaches here it means the investor is the catalyst of the entity!

            --numCatalyst;

            uint64 adjusted_amt = SafeCast.toUint64(
                (REMORA_PERCENT_DENOMINATOR / aData.equity) * amount
            );
//@audit-issue => Modifies allowance or could cause a revert on an entity that has nothing to do with the actual `from` individual because the catalyst of that entity belonged to the same group as the `from` individual, which caused execution to get here, regardless that `from` individual is not even part of the entity being modified
            if (add) aData.allowance += adjusted_amt;
            else if (adjusted_amt > aData.allowance) return false;
            else aData.allowance -= adjusted_amt;
        }
        return true;
    }

```


**Impact:** This bug can lead to two different paths:
1. On the sender - When ALL the entities have enough allowance, then the allowances for entities where the individual doesn't belong can result in being mistakenly modified.
2. On the receiver - When one of the entities doesn't have enough allowance, the tx will revert.

**Recommended Mitigation:** Consider refactoring the update of allowances to entities so that they do not fall in this scenario. Consider not updating the allowances of entities where the `from` or `to` are not part of.

**Remora:** Acknowledged. Groups should be seen as individuals, so if individual A and B are in the same group, but are in different entities, either of their transfers should affect all entities that are tied to that group one way or another.

**Cyfrin:** Verified.

\clearpage
