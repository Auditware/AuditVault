---
tags:
  - lang/solidity
  - sector/gaming
  - platform/auditone
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[Lotaheros]]"
auditors:
  - "[[AuditOne]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-04-13-Lotaheros.md"
genome:
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
---
# setTradeOer and cancelTradeOer functions does not use ReentrancyGuard

- id: 21013
- impact: HIGH
- protocol: [[Lotaheros]]
- reporter: AuditOne
- source: https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-04-13-Lotaheros.md

## Summary


This bug report is about the vulnerability of the smart contract to reentrancy attacks. Reentrancy attacks occur when an attacker is able to call a function multiple times before the function has completed executing, allowing them to manipulate the state of the contract to their advantage. The functions setTradeOer and cancelTradeOer are both vulnerable to these attacks since they are not utilizing the ReentrancyGuard from OpenZeppelin, which is designed to prevent such attacks. To prevent this type of attack, it is important to use the ReentrancyGuard or other similar methods to ensure that the functions are executed atomically and not re-entered until the previous invocation has completed.

## Details

**Description:** In the smart contract, the ReentrancyGuard from OpenZeppelin is imported to prevent reentrancy attacks. However, the functions setTradeOer and cancelTradeOer are not utilizing the ReentrancyGuard, making them vulnerable to reentrancy attacks. Both the setTradeOer function and the cancelTradeOer transfers tokens and Ether to a contract address, If an attacker can create a recursive call and re-enter either of these functions before they finish executing, they can potentially manipulate the state of the contract and exploit it to their advantage.

**Recommendations:** To prevent this type of attack, it is important to use the ReentrancyGuard or other similar methods to ensure that the functions are executed atomically and not re-entered until the previous invocation has been completed.
