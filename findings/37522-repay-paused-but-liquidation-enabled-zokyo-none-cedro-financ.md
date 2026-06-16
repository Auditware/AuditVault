---
tags:
  - lang/solidity
  - sector/lending
  - sector/token
  - platform/zokyo
  - has/github
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Cedro Finance]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-03-19-Cedro Finance.md"
genome:
  - "[[liquidation-logic]]"
  - "[[use-reentrancy-guard]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
---
# Repay paused but Liquidation enabled

- id: 37522
- impact: HIGH
- protocol: [[Cedro Finance]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-03-19-Cedro Finance.md

## Summary


This bug report is about a problem in a protocol that allows borrowers to take out loans. The issue is that there is a possibility for the protocol to enter a state where borrowers cannot repay their loans, but liquidation is still allowed. This can be a problem because if the market is volatile, borrowers may not be able to repay their loans and could end up being liquidated. The recommendation is to make sure that if repayment is paused, liquidation should also be paused to prevent this issue from happening. The client has acknowledged the problem and is considering a solution.

## Details

**Severity**: High

**Status**: Acknowledged

**Description**

The protocol can enter a state where repay is paused for borrowers but liquidation is open. 
```solidity
 function repayRequest(
       bytes32 id,
       uint256 amount,
       bytes32 route,
       uint256 airdropAmount
   ) external payable nonReentrant {
       if (protocolPause) revert ProtocolPaused(TAG);
       if (repayPause[id]) revert DepositPaused(TAG, id); 
… }
```
Given the volatility of the market, this state will prevent borrowers from repaying their loans leading to the risk of being liquidated. 

If repayment can be paused, liquidation should be paused at the same time as well.

**Recommendation**: 

Please ensure that the protocol does not enter this state. If repayment is paused then liquidation should be paused as well.

**Client commented**: We consider this scenario.
