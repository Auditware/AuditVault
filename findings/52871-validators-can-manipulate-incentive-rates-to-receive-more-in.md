---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/staking
protocol: "[[Berachain]]"
auditors:
  - "[[Kaden]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Berachain-Pol-Spearbit-Security-Review-October-2024.pdf"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Validators can manipulate incentive rates to receive more incentives than intended

- id: 52871
- impact: HIGH
- protocol: [[Berachain Pol]]
- reporter: Kaden (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Berachain-Pol-Spearbit-Security-Review-October-2024.pdf

## Summary


This bug report describes a high-risk issue in the BerachainRewardsVault contract. The issue is located in the addIncentive function at lines 328-330. It allows anyone to set the incentive rate of an incentive token, as long as they meet certain requirements. However, this can be exploited by validators who know that they will receive a distribution soon. By increasing the incentive rate, they can receive the full amount of the incentive while also being refunded for the tokens they were forced to transfer. An example is provided to illustrate this issue. 

## Details

Severity: High Risk
Context: BerachainRewardsVault.sol#L328-L330
Description: In BerachainRewardsVault.addIncentive , it's possible for anyone to arbitrarily set theincentiveR-
ate of an incentive token given the following requirements:
• The caller must transfer in at least the incentive.minIncentiveRate amount of tokens.
• The incentive.amountRemaining must be at most the incentive.minIncentiveRate .
• The new incentive.incentiveRate must be at least the incentive.minIncentiveRate .
Knowing that the distribution for the block that they validated is upcoming, if the incentive.amountRemaining
will be less than or equal to the incentive.minIncentiveRate but the amount of incentives the validator will
receive is less than the incentive.amountRemaining , a validator can exploit this logic by increasing the in-
centive.incentiveRate sufficiently that they will receive the full incentive.amountRemaining while also being
refunded the tokens that they were forced to transfer in.
Consider the following example (assuming 18 decimal tokens):
• incentive.minIncentiveRate = 100e18
• incentive.incentiveRate = 100e18
• incentive.amountRemaining = 99e18
• bgtEmitted = 0.5e18
Normally, in this case the validator can expect to receive bgtEmitted * incentive.incentiveRate ==
