---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/token
protocol: "[[Decentraland]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/decentraland-mana-token-audit-ee56a6bca708/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
---
# Owner can finalize crowdsale before it has ended

- id: 12058
- impact: HIGH
- protocol: [[Decentraland]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/decentraland-mana-token-audit-ee56a6bca708/

## Summary


This bug report is about the `finalize` function from `FinalizableCrowdsale` being overriden by `MANACrowdsale` in the code. This modification removes the precondition requiring that the crowdsale `hasEnded` which is not required by the smart contract specification and makes the crowdsale vulnerable to premature closing by the owner. It also introduces a race condition in which investors can purchase tokens after the crowdsale is finalized but before the continuous sale is started. This causes an imbalance in the ratio of the shares between the foundation and the investors since the foundation’s shares are emitted on finalization. The bug was fixed in commit `9f07555e51df352aff7bc58b6830904215a7dd14` by removing the overriding of `finalize` in `MANACrowdsale`, and also the overriding of `hasEnded` in the code.

## Details

`finalize` function from `FinalizableCrowdsale` is overriden by `MANACrowdsale` in [line 115](https://github.com/decentraland/mana/blob/a13905356378cc0153dd3c2153c8ceae6400970d/contracts/MANACrowdsale.sol#L115). The modified version removes the precondition requiring that the crowdsale `hasEnded`. This is not required by the smart contract specification, and makes the crowdsale vulnerable to premature closing by the owner.


It also introduces a race condition in which investors can still purchase tokens after the crowdsale is finalized but before the continuous sale is started, as the validation for processing a purchase in [line 33](https://github.com/decentraland/mana/blob/a13905356378cc0153dd3c2153c8ceae6400970d/contracts/ContinuousCrowdsale.sol#L33) of `ContinuousCrowdsale` does not check the `isFinalized` flag. This causes an imbalance in the ratio of the shares between the foundation and the investors, since the foundation’s shares are emitted on finalization.


Remove the overriding of `finalize` in `MANACrowdsale`, and also the overriding of `hasEnded` in [line 111](https://github.com/decentraland/mana/blob/a13905356378cc0153dd3c2153c8ceae6400970d/contracts/MANACrowdsale.sol#L111).


**EDIT**: fixed in commit [`9f07555e51df352aff7bc58b6830904215a7dd14`](https://github.com/decentraland/mana/commit/9f07555e51df352aff7bc58b6830904215a7dd14).
