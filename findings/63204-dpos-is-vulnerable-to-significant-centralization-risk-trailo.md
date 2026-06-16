---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/governance
  - sector/infra
  - sector/staking
protocol: "[[Shardeum]]"
auditors:
  - "[[Guillermo Larregay Trail of Bits PUBLIC]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-10-vechain-vechainthorhayabusaupgrade-securityreview.pdf"
genome:
  - "[[centralization]]"
  - "[[role-bypass]]"
  - "[[antisybil]]"
  - "[[reward-accounting]]"
  - "[[vote-delegation-loop]]"
---
# DPoS is vulnerable to signiﬁcant centralization risk

- id: 63204
- impact: HIGH
- protocol: Upgrade
- reporter: Guillermo Larregay Trail of Bits PUBLIC (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-10-vechain-vechainthorhayabusaupgrade-securityreview.pdf

## Summary


This bug report discusses a potential issue with VeChain's DPoS system, which could lead to centralization and a concentration of power among a few validators. This is because the validators with the highest stakes have a higher chance of proposing the next block, and can also offer incentives to delegators to bond with them. As a result, smaller validators may be pushed out of the network, leading to a plutocracy. The report suggests considering a different type of consensus mechanism, such as PoS, to prevent this issue. It also references previous issues with DPoS systems and the negative effects of plutocracy.

## Details

## Diﬃculty: N/A

## Type: Conﬁguration

## Description
DPoS systems like VeChain are susceptible to centralization risks due to the formation of a plutocracy that governs a large majority of the total stake and voting power. More specifically, there is historical precedence of DPoS systems being vulnerable to vote buying and bribery attacks. In VeChain, the validators that have the highest total stakes have the highest likelihood of proposing the next block. This will naturally incentivize delegators to bond to those validators since this will increase their likelihood of receiving VTHO rewards. More importantly, larger validators can also offer kickbacks or bribes to delegators (outside of the 70% delegation reward) to further incentivize delegators to bond to them.

Over time, this will create a concentrated group of validators that reach the maximum stake possible of 600M VET. At the same time, there will be a group of validators with insufficient stake that are unlikely to propose blocks and will choose to exit the network. As soon as these validators exit the network, the validators with the largest stakes are economically incentivized to spin up new validators and participate in the protocol. The FIFO activation queue is ineffective against a Sybil attack if the total stake gets concentrated into the hands of a few validators and pushes other, smaller validators to exit the network.

It is important to note that under PoA, there is no economic incentive to act maliciously and form a plutocracy of the largest stakeholders. With the migration to DPoS, the original PoA validator set is economically incentivized to push out other validators by accruing as much stake as possible and then activating new validators under different identities to capture an even larger portion of the total stake.

## Recommendations
Long term, consider migrating to a variant of PoS, such as nominated PoS (NPoS) or a pure PoS mechanism like Ethereum. It is important to note that there are no production-grade DPoS systems that have implemented any mitigations that would prevent cartel formation and the concentration of stake.

## References
- A Node Operator’s Confession of EOS DPoS Corruption
- Governance, Part 2: Plutocracy Is Still Bad
