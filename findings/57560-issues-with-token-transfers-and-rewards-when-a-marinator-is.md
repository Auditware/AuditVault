---
tags:
  - lang/solidity
  - platform/zokyo
  - has/github
  - severity/high
  - sector/staking
protocol: "[[Umami]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-09-07-Umami .md"
genome:
  - "[[reward-calculation]]"
  - "[[locked-funds]]"
  - "[[reward-accounting]]"
---
# Issues with token transfers and rewards when a marinator is removed from whitelist in MarinateV2.sol.

- id: 57560
- impact: HIGH
- protocol: [[Umami]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-09-07-Umami .md

## Summary


The MarinateV2.sol contract has a bug that can cause issues when a contract holding mUMAMIS is removed from the whitelist. This can lead to uncollected rewards and an incorrect total Multiplied Staked value. The recommendation is to create a storage map for unallocated rewards and allocate them to the totalToken RewardsPerStake. The bug has been resolved with a fix that only allows transfers when both parties are whitelisted and sends rewards to the marinator before it is removed from the whitelist.

## Details

**Description**

MarinateV2.sol - the implementation of hooks_beforeTokenTransfer & _afterToken Transfer leads to issues in specific scenarios in which a marinator (i.e. contract holding mUMAMIS) is being dropped out of the whitelist. The issue is described in the following scenario, shown also in Proof of Concept (POC) tests.
Contract A & B are both whitelisted, so they stake their UMAMI
Contract A is no longer whitelisted
Contract A sends the mUMAMI to B and in the process B collects rewards while A does not
Contract B unstakes all mUMAMI and collects rewards
MarinateV2 is possessing a quantity of uncollectible rewards
The rewards are never claimed for Contract A even if it comes back to the white list
Also in this context the total Multiplied Staked does not hold the expected value proportional to the totalSupply of MarinateV2 since the value it holds at the end of this scenario will actually lead to unallocated funds when new rewards are added since total Token RewardsPerStakeis not fairly distributed.

**Recommendation**

declare a storage map for unallocated Rewards which going to receive rewards in this case and allocate them to totalToken RewardsPerStake.

**Re-audit comment**

Resolved.

fix#1 - Transfers now are only allowed when both parties are whitelisted. Also, rewards are sent to the marinator before it is removed from whitelist.
