---
tags:
  - platform/openzeppelin
  - has/github
  - lang/solidity
  - severity/high
  - sector/token
protocol: "[[Decentraland]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/decentraland-mana-token-audit-ee56a6bca708/"
genome:
  - "[[fee-accounting]]"
---
# Code for processPurchase is duplicated

- id: 12059
- impact: HIGH
- protocol: [[Decentraland]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/decentraland-mana-token-audit-ee56a6bca708/

## Summary


A bug has been identified in the code of the ContinuousCrowdsale and MANACrowdsale functions. The function processPurchase is defined in ContinuousCrowdsale and then redefined in MANACrowdsale. The code in the latter consists of nearly the same code, except it calls getRate instead of reading the rate state variable. This duplication may cause issues and should be avoided. To fix this issue, the function processPurchase should be defined in ContinuousCrowdsale in its most generic version, calling getRate. Then, getRate should be redefined with the desired logic in MANACrowdsale. This bug will be fixed along with issue #9 on the Decentraland Mana Github repository.

## Details

The function `processPurchase` is defined in `ContinuousCrowdsale` and then redefined in `MANACrowdsale`. The latter consists of nearly the same code, except it calls `getRate` instead of reading the `rate` state variable. It’s unclear whether such duplication was intentional or not. To avoid the issues duplication can cause, define the function in `ContinuousCrowdsale` in its most generic version calling `getRate`, with a simple implementation that returns the value of the `rate` state variable. Redefine `getRate` with the desired logic in `MANACrowdsale`.


**EDIT:** will be fixed along with [issue #9](https://github.com/decentraland/mana/issues/9).
