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
  - "[[missing-owner-check]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
---
# The Escrow’s owner can arbitrarily increase the balance of any job without spending RNDR tokens

- id: 11878
- impact: HIGH
- protocol: [[Render Network]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/rndr-token-transfer-audit-74b21356b849/

## Summary


This bug report outlines an issue with the `Escrow` contract, which is used to track the address of the associated token contract. The owner of the contract is allowed to change this variable at any time by calling `changeRenderTokenAddress`. If the owner passes the address of an account controlled by them as a parameter, they would be able to call `fundJob` from that account and increase any job balance without spending any tokens. 

It is recommended to remove the `changeRenderTokenAddress` function or properly document the rationale behind its inclusion in the contract, so users are aware of the potential risks. An event is now emitted when the `changeRenderTokenAddress` function is called, and documentation was added explaining the rationale for having this function.

## Details

In the`Escrow` contract, the address of the associated token contract is tracked by the [`renderTokenAddress`](https://github.com/jeualvarez/Token-Audit/blob/e946177747e57312690775204834b8fca1bbb0d5/contracts/Escrow.sol#L17) variable. The owner of the `Escrow` is allowed to change this variable at any time by calling [`changeRenderTokenAddress`](https://github.com/jeualvarez/Token-Audit/blob/e946177747e57312690775204834b8fca1bbb0d5/contracts/Escrow.sol#L55). If the owner called [`changeRenderTokenAddress`](https://github.com/jeualvarez/Token-Audit/blob/e946177747e57312690775204834b8fca1bbb0d5/contracts/Escrow.sol#L55) passing the address of an account controlled by them as a parameter, they would therefore be allowed to call [`fundJob`](https://github.com/jeualvarez/Token-Audit/blob/e946177747e57312690775204834b8fca1bbb0d5/contracts/Escrow.sol#L87) from that account and arbitrarily increase any job balance, at any point in time, without spending any tokens.


Consider analyzing the removal of the [`changeRenderTokenAddress`](https://github.com/jeualvarez/Token-Audit/blob/e946177747e57312690775204834b8fca1bbb0d5/contracts/Escrow.sol#L55) function, or at least properly documenting the rationale behind its inclusion in the contract, so users are aware of such a dangerous scenario. While an attempt to do so was found in [`Escrow.sol`](https://github.com/jeualvarez/Token-Audit/blob/e946177747e57312690775204834b8fca1bbb0d5/contracts/Escrow.sol#L52) , where a comment states that the function “*[…] is included as a failsafe*”, the issues that this mechanism would prevent from occurring are never explained.


***Update:** an event is now [emitted](https://github.com/jeualvarez/Token-Audit/blob/master/contracts/Escrow.sol#L84) when the `changeRenderTokenAddress` function is called, and [documentation](https://github.com/jeualvarez/Token-Audit/blob/master/contracts/Escrow.sol#L73) was added explaining the rationale for having this function.*
