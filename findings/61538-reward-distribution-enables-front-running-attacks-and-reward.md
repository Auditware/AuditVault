---
tags:
  - lang/solidity
  - sector/lending
  - sector/restaking
  - sector/staking
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
protocol: "[[CAP Labs Covered Agent Protocol]]"
auditors:
  - Benjamin Samuels
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf"
genome:
  - "[[frontrun-exposure]]"
  - "[[mev/frontrun]]"
---
# Reward distribution enables front-running attacks and reward siphoning

- id: 61538
- impact: HIGH
- protocol: CAP Labs Covered Agent Protocol
- reporter: Benjamin Samuels (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf

## Summary


The bug report discusses a problem with the reward distribution mechanism in a specific file called `Delegation.sol`. This bug allows opportunistic actors to unfairly receive rewards by strategically adding deposits before a loan repayment transaction. This means that these actors can siphon rewards from long-term backers who have shouldered the actual lending risks. The report recommends modifying the reward distribution mechanism in the short term to exclude any collateral added in the current epoch from reward eligibility. In the long term, it suggests implementing a comprehensive reward accounting system to accurately track and distribute rewards based on the risk and support provided by each vault over time.

## Details

## Difficulty: High

## Type: Data Validation

**File:** `contracts/delegation/Delegation.sol`

### Description
The reward distribution mechanism, called during loan repayment, allocates rewards to all vaults backing an agent at the time of repayment with no consideration for the amount of time the restaker has been delegating to the agent. This creates a significant timing vulnerability where actors can monitor pending repayment transactions in the mempool and strategically add deposits before repayment to capture a proportional share of rewards. This allows opportunistic actors to systematically siphon rewards from long-term backers who shouldered the actual lending risks.

### Exploit Scenario
An agent takes out a large loan backed by Vault A, which has provided collateral for several months. When the time comes to repay the loan with substantial accrued interest, Vault B front-runs the repayment transaction and strategically adds delegation just before repayment and rewards distribution. When the agent repays, the interest rewards are distributed proportionally based on the current delegation, allowing Vault B to receive a significant portion of the rewards despite only backing the agent for a minimal time period. This allows Vault B to capture rewards without taking an equivalent risk.

### Recommendations
- **Short term:** Modify the reward distribution mechanism to exclude any collateral added in the current epoch from reward eligibility. Consider adding a mechanism that allows rewards to vest based on the amount of delegation and time delegated instead of delegation amount at a specific time.
- **Long term:** Implement a comprehensive reward accounting system that tracks and logs the historical collateral contributions of each vault throughout the lifecycle of loans, ensuring that reward distribution accurately reflects the risk and support provided by each vault over time.
