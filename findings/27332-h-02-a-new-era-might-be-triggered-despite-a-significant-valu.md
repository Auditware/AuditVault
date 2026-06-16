---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/staking
  - sector/staking-pool
protocol: "[[Reserve]]"
auditors:
  - "[[0xA5DF]]"
report: "https://code4rena.com/reports/2023-06-reserve"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
  - "[[reward-accounting]]"
---
# [H-02] A new era might be triggered despite a significant value being held in the previous era

- id: 27332
- impact: HIGH
- protocol: [[Reserve]]
- reporter: 0xA5DF (Code4rena)
- source: https://code4rena.com/reports/2023-06-reserve

## Summary


This bug report is about the Reserve Protocol, a decentralized financial system. It concerns the StRSR.sol file, which is responsible for regulating the staking and drafting rate. When a RSR seizure occurs, the staking and drafting rate is adjusted, and if either rate is above a certain threshold, a new era begins, wiping out all of the holdings of the current era. This is an issue because in some cases, a previous seizure could cause the rate to be close to the threshold, and then a small seizure could cause the rate to cross the threshold, resulting in a large amount of staking or drafts being wiped out. 

This bug has an impact on stakers, who will lose their holdings or pending drafts. A proof of concept was provided which demonstrated how a 10% seizure could cause the staking rate to cross the threshold and start a new era, resulting in stakings being wiped out despite holding a significant amount of value.

The recommended mitigation step was to add a 'migration' feature, where a new era would be created but users would be able to transfer the funds from the previous era into the new era. However, this would require some significant code changes and checking that this doesn't break anything or introduce new bugs. 

The Reserve Protocol team then suggested a governance function that requires the ratio be out of bounds, that does `beginEra()` and/or `beginDraftEra()`. However, they were still unsure how to mitigate this one, and agreed it should be considered HIGH and a new issue. 

The bug was eventually mitigated by adding a governance function to manually push the era forward, and the mitigation was confirmed.

## Details


<https://github.com/reserve-protocol/protocol/blob/c4ec2473bbcb4831d62af55d275368e73e16b984/contracts/p1/StRSR.sol#L441-L444> <br><https://github.com/reserve-protocol/protocol/blob/c4ec2473bbcb4831d62af55d275368e73e16b984/contracts/p1/StRSR.sol#L457-L460>

When RSR seizure occurs the staking and drafting rate is adjusted accordingly, if any of those rates is above some threshold then a new era begins (draft or staking era accordingly), wiping out all of the holdings of the current era.
The assumption is that if the rate is above the threshold then there's not much staking or drafts left after the seizure (and therefore it makes sense to begin a new era).
However, there might be a case where a previous seizure has increased the staking/draft rate close to the threshold, and then even a small seizure would make it cross this threshold. In that case the total value of staking or drafts can be very high, and they will all be wiped out by starting a new era.

### Impact

Stakers will lose their holdings or pending drafts.

### Proof of Concept

Consider the following scenario:

*   Max stake rate is 1e9
*   A seizure occurs and the new rate is now 91e7
*   Not much staking is left after the seizure, but as time passes users keep staking bring back the total stakes to a significant value
*   A 10% seizure occurs, this causes the staking rate to cross the threshold (getting to 1.01e9) and start a new era

This means the stakings were wiped out despite holding a significant amount of value, causing a loss for the holders.

### Recommended Mitigation Steps

This one is a bit difficult to mitigate.
One way I can think of is to add a 'migration' feature, where in such cases a new era would be created but users would be able to transfer the funds that they held in the previous era into the new era. But this would require some significant code changes and checking that this doesn't break anything or introduces new bugs.


**[tbrent (Reserve) commented](https://github.com/code-423n4/2023-06-reserve-findings/issues/2#issuecomment-1588260840):**
 > @0xA5DF thoughts on a governance function that requires the ratio be out of bounds, that does `beginEra()` and/or `beginDraftEra()`? 
> 
> The idea is that stakers can mostly withdraw, and since governance thresholds are all percentage, vote to immolate themselves and re-start the staking pool. I think it should treat `beginEra()` and `beginDraftEra()` separately, but I'm not confident in that yet. 

**[tbrent (Reserve) acknowledged and commented](https://github.com/code-423n4/2023-06-reserve-findings/issues/2#issuecomment-1620824773):**
 > We're still not sure how to mitigate this one. Agree it should be considered HIGH and a new issue.

**[Reserve mitigated](https://github.com/code-423n4/2023-08-reserve-mitigation#individual-prs):**
> Adds governance function to manually push the era forward.<br>
> PR: https://github.com/reserve-protocol/protocol/pull/888

**Status:** Mitigation confirmed. Full details in reports from [0xA5DF](https://github.com/code-423n4/2023-08-reserve-mitigation-findings/issues/31), [ronnyx2017](https://github.com/code-423n4/2023-08-reserve-mitigation-findings/issues/8), and [rvierdiiev](https://github.com/code-423n4/2023-08-reserve-mitigation-findings/issues/11) - and also shared below in the [Mitigation Review](#mitigation-review) section.



***
