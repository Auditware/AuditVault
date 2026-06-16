---
tags:
  - lang/solidity
  - sector/bridge
  - sector/nft
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - trigger/cross-chain-message
protocol: "[[Bearcave]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-06-01-BearCave.md"
genome:
  - "[[frozen-funds]]"
  - "[[cross-chain-message]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
---
# [C-01] State is not properly updated on L2, leading to stuck prize NFTs

- id: 20609
- impact: HIGH
- protocol: [[Bearcave]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-06-01-BearCave.md

## Summary


This bug report is about an issue in the `addToParty` method in the `HibernationDen` contract. This method does not send a cross-chain message, which prevents the `party.sleepoors` array on L1 from updating on L2. This means that the `party.sleepoors.length` value is incorrect, and therefore the calculations and validations done based on this value will be incorrect too. As a result, the sleeper NFTs will be stuck and won't be claimable.

In order to solve this problem, it is recommended to send a cross-chain message to add the sleepers to the `party.sleeepoors` array on the L2. This will ensure that the calculations and validations are done correctly, and the sleeper NFTs can be claimed.

## Details

**Impact:**
High, as winning prize NFTs won't be claimable

**Likelihood:**
High, as functionality is never working correctly

**Description**

The `addToParty` method in `HibernationDen` does not send a cross-chain message, even though it pushes sleepers into the `party.sleepoors` array on L1. Since the array won't be updated on L2, now all the calculations and validations that are done based on the `party.sleepoors.length` value will be incorrect. This essentially means that the sleeper NFTs will be stuck as in `wakeSleeper` there is the following check:

```solidity
if (party.numUsed == party.sleepoors.length) revert PartyAlreadyWoke(bundleId_);
```

Which means that even though there are actually let's say 10 sleepers (they were 7, but then 3 were added), when `numUsed` is 7 then no more sleepers would be claimable - the `wakeSleeper` call will revert will `PartyAlreadyWoke`.

**Recommendations**

Make sure to send a cross-chain message to add the sleepers to the `party.sleeepoors` array on the L2.
