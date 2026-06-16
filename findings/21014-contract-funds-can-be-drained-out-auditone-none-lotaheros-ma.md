---
tags:
  - lang/solidity
  - sector/gaming
  - platform/auditone
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - impact/loss-of-funds/direct-drain
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Lotaheros]]"
auditors:
  - "[[AuditOne]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-04-13-Lotaheros.md"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[reentrancy-guard]]"
---
# Contract funds can be drained out

- id: 21014
- impact: HIGH
- protocol: [[Lotaheros]]
- reporter: AuditOne
- source: https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-04-13-Lotaheros.md

## Summary


This bug report is about the reentrancy vulnerability in the setTradeOer and cancelTradeOer functions of the IOTA Heroes Contracts. The setTradeOer function receives funds from the user and the cancelTradeOer function allows the user to cancel the trade and get a refund. The issue is that the cancelTradeOer function makes an external call to transfer the funds back to the user, which opens up the possibility of reentrancy. This means that the user can re-enter the function and withdraw the funds multiple times until all the contract funds are drained. The function does not have any reentrancy protection, and the state is updated after the external call is made. 

The recommendations are to add a non-reentrancy guard and to make the state changes before making the external call. This will prevent the user from re-entering the function and draining the funds from the contract.

## Details

**Description:**

User can call the setT[radeOer and pl](https://github.com/Crelde/IOTA-Heroes-Contracts/blob/3e345747f723637c0a1ce884d1ae0e1584015e98/contracts/TradingPost.sol#L86)ace the trade.

For this, the contract will receive the fund msg.value to the contract.

Later if the user wants to cancel the trade order, they can call the cancelTr[adeOer and the use](https://github.com/Crelde/IOTA-Heroes-Contracts/blob/3e345747f723637c0a1ce884d1ae0e1584015e98/contracts/TradingPost.sol#L154)r would get the refund.

The issue here is, the cancelTradeOer makes external call to transfer the msg.value to the user.

this external call opens the route for reentrancy. The user can re-enter again and withdraw the funds. This can be repeated till all the contract funds are drained.

Note : the function cancelTradeOer does not have the reentrancy protection.

It is updating the stat after calling call . Refer the link

**Recommendations:**

- Add non-reentrancy guard.
- make the state changes before making the external call.
