---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/token
protocol: "[[Render Network]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/rndr-token-transfer-audit-74b21356b849/"
genome:
  - "[[missing-event]]"
  - "[[upgrade-safety]]"
  - "[[event-manipulation]]"
---
# Contract owners can change business logic unnoticeably

- id: 11880
- impact: HIGH
- protocol: [[Render Network]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/rndr-token-transfer-audit-74b21356b849/

## Summary


This bug report is about contracts that allow the owner to arbitrarily change the business logic by setting new contract addresses without properly warning users. Examples of this are the 'RenderToken#setEscrowContractAddress', 'Escrow#changeRenderTokenAddress', and 'Escrow#changeDisbursalAddress' contracts. It is recommended that events are emitted to notify users of any changes to the contracts' business logic. This update has been made and events are now emitted to provide users with a mechanism to track these changes.

## Details

In several contracts, the owner can arbitrarily change the business logic by setting new contract addresses, without properly warning users of those changes. Examples are:


* [`RenderToken#setEscrowContractAddress`](https://github.com/jeualvarez/Token-Audit/blob/e946177747e57312690775204834b8fca1bbb0d5/contracts/RenderToken.sol#L58) :the address that will hold tokens in escrow and keep a ledger of funds available for jobs.
* [`Escrow#changeRenderTokenAddress`](https://github.com/jeualvarez/Token-Audit/blob/e946177747e57312690775204834b8fca1bbb0d5/contracts/Escrow.sol#L55) : the address of the token contract.
* [`Escrow#changeDisbursalAddress`](https://github.com/jeualvarez/Token-Audit/blob/e946177747e57312690775204834b8fca1bbb0d5/contracts/Escrow.sol#L45) : the address authorized to distribute tokens for completed jobs.


Consider emitting events to notify users about any modifications of such importance in the contracts’ business logic.


***Update:** events [are](https://github.com/jeualvarez/Token-Audit/blob/master/contracts/RenderToken.sol#L91) [now](https://github.com/jeualvarez/Token-Audit/blob/master/contracts/Escrow.sol#L84) [emitted](https://github.com/jeualvarez/Token-Audit/blob/master/contracts/Escrow.sol#L66) to provide users with a mechanism to track these changes.*
