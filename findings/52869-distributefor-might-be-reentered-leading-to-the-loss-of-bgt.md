---
tags:
  - lang/solidity
  - sector/staking
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - impact/mev/frontrun
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Berachain]]"
auditors:
  - "[[Kaden]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Berachain-Pol-Spearbit-Security-Review-October-2024.pdf"
genome:
  - "[[single-function]]"
  - "[[frontrun]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[frontrun-exposure]]"
  - "[[reentrancy-guard]]"
  - "[[commitment-uniqueness]]"
---
# distributeFor might be reentered leading to the loss of BGT and incentive tokens

- id: 52869
- impact: HIGH
- protocol: [[Berachain Pol]]
- reporter: Kaden (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Berachain-Pol-Spearbit-Security-Review-October-2024.pdf

## Summary


This bug report is about a high-risk issue in the code of a smart contract called Distributor.sol. The function called "distributeFor" is responsible for giving out tokens to validators. However, there is a problem with the way it is coded. The function first checks for the next block to be processed, then transfers tokens to the validator, and only after that, it increments the block number. This violates a security principle called "Checks-Effects-Interactions" and could potentially allow for a hacker to drain all the tokens from the contract. The report suggests either changing the order of the code or adding a protection against reentrancy. This issue has been fixed in the code by the developers.

## Details

Severity: High Risk
Context: Distributor.sol#L113-L114
Description: The code flow of Distributor.distributeFor is in charge of compensating validators with BGT
tokens and additional vault specific tokens. During the flow of the function, it queries the nextActionableBlock ,
then it is transferring (using a potentially untrusted external call) the incentive tokens to the validator and only
then increments the getNextActionableBlock to make sure the next transaction would not double-spend. The
distributeFor is therefore violating the "Checks-Effects-Interactions" pattern since the external interaction is
executed before the effects (incrementing the getNextActionableBlock ). In case one of the incentive tokens
implements an unsafe external call, the call flow can be hijacked to re-enter distributeFor repeatedly and by
this drain the entire BGT and incentive tokens allocated. The reentrant call will have to provide the necessary
parameters that were used originally for the call but this can be fetched by a front runner spotting the call to
distributeFor in the mempool and writing the value to a contract that will be used through the reentrancy flow.
Recommendation: Consider either switching the order of _distributeFor and _incrementBlock so that _in-
crementBlock will be called first, or alternatively, adding a reentrancy guard todistributeFor . ReentrancyGuard-
Transient.sol might help to do it in a more gas efficient way but has partial support in EVM chains. Please refer to
evmdiff.com for more information about opcodes support.
Berachain: Fixed in commit 534a0eba.
Spearbit: Fixed by implementing the auditor's recommendation.
