---
tags:
  - blockchain/evm
  - blockchain/evm/mantle
  - lang/solidity
  - sector/insurance
  - sector/staking
  - platform/sigmaprime
  - has/github
  - severity/high
  - impact/mev/frontrun
protocol: "[[Mantle]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/mantle/review.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# Elected TSS Nodes Can Act Without Any Deposit

- id: 19464
- impact: HIGH
- protocol: [[Mantle]] Network
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/mantle/review.pdf

## Summary


This bug report is about a potential security issue in the TSS node system. The issue is that a node can remove its insurance deposit and still be elected as a TSS node. As a result, there is no means of punishing the node for inactivity or malicious behaviour. This is possible because election results are published on-chain and a dishonest node could watch the Ethereum mempool and frontrun the transaction including their own approval by the BITDAO with a call to withdrawToken(). This has the effect of removing their deposit and still being elected in the BITDAO’s transaction.

To address this issue, two possible solutions are proposed. The first is an on-chain solution which would add a check to setTssGroupMember() that validates each elected node still has a sufficient deposit in the TssStakingSlashing contract. The second is an off-chain approach, where the BITDAO would push all election results on-chain using a method such as Flashbots, which avoids transactions entering the mempool where other Ethereum nodes can read them.

The issue has been addressed at PR-826 and is now resolved.

## Details

## Description

A node can remove its insurance deposit and still be elected as an active TSS node. TSS nodes are voted for by the BITDAO, which then pushes the currently elected nodes on-chain. Nodes that wish to be voted for must provide a deposit as insurance that they will perform their role honestly if elected. By timing a withdrawal correctly, a node can remove their deposit and still be elected as an active TSS node. As a result, there is no means of punishing the node for inactivity or malicious behaviour.

This can occur because election results are published on-chain, and so a dishonest node could watch the Ethereum mempool and frontrun the transaction including their own approval by the BITDAO with a call to `withdrawToken()`. This has the effect of removing their deposit and still being elected in the BITDAO’s transaction. As a result, the node would no longer have a deposit from which to deduct funds if they are slashed; this means they are not incentivised to act honestly or timely.

## Recommendations

There are several possible solutions for this issue:

- An on-chain solution could be to add a check to `setTssGroupMember()` that validates each elected node still has a sufficient deposit in the `TssStakingSlashing` contract.
- For an off-chain approach, the BITDAO could push all election results on-chain using a method such as Flashbots, which avoids transactions entering the mempool where other Ethereum nodes can read them. If this approach is taken, then the BITDAO must also manually check all elected nodes have not removed their deposit prior to them pushing the result on-chain.

## Resolution

The issue has been addressed at PR-826.
