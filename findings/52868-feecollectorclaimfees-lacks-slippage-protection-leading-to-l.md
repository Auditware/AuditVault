---
tags:
  - lang/solidity
  - sector/dex
  - platform/spearbit
  - has/github
  - severity/high
  - impact/mev/frontrun
protocol: "[[Berachain]]"
auditors:
  - "[[Kaden]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Berachain-Pol-Spearbit-Security-Review-October-2024.pdf"
genome:
  - "[[spot-price]]"
  - "[[frontrun]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
---
# FeeCollector.claimFees lacks slippage protection leading to loss of payoutAmount

- id: 52868
- impact: HIGH
- protocol: [[Berachain Pol]]
- reporter: Kaden (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Berachain-Pol-Spearbit-Security-Review-October-2024.pdf

## Summary


This bug report discusses a high-risk issue in the FeeCollector contract, which is inspired by the Uniswap V3 Factory Owner contract. The issue occurs when fees are collected in any token and can be claimed by anyone, but there is no protection against slippage. This means that a delayed or front run transaction could result in the loss of the payout amount. Even if the fee tokens revert on zero value transfers, the issue remains if there is still some amount of fee tokens remaining. To address this issue, the report recommends implementing a similar approach to Uniswap where callers can specify minimum amounts per fee token. If this is not possible, the report suggests providing a sample contract or code snippet to guide bot builders in implementing the necessary slippage checks. The team has acknowledged the issue and plans to provide proper documentation, but it is strongly recommended to implement the proposed solution or provide guidance to avoid this issue.

## Details

Severity: High Risk
Context: /src/pol/FeeCollector.sol#L91
Description: As documented, FeeCollector.claimFees draws inspiration from the Uniswap V3 Factory Owner
contract. Here fees are collected in any token, remaining claimable by anyone so long as payoutAmount of the
payoutToken is provided to the contract in exchange. In effect, a swap.
There is no slippage protection on this swap meaning any non-reverting but delayed transaction may lose the
payoutAmount . A delayed or front run transaction will trigger this issue. If the fee tokens revert on zero value
transfers the issues is still present so long as there is some greater than 0 amount of fee tokens remaining. As
malicious actor could force the issue by returning dust to the contract after calling claimFees .
Recommendation: Similar to the approach adopted by Uniswap allow callers to specify minimum amounts ex-
pected per fee token. Departing from Uniswap, this will need to be in the form of an array.
Berachain: Acknowledged. We'll manage to put some proper documentation on the fact that caller should do
checks on her side otherwise she will be subject to this issue.
Spearbit: The team has acknowledged the issue; however, we strongly recommend implementing the proposed
solution above. If this approach is not adopted, we highly suggest including a sample contract or code snippet with
the necessary slippage checks to guide bot builders.
