---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/token
protocol: "[[Storj]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/storj-token-audit-32a9af082797/"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[integer-bounds]]"
---
# Problems with PaymentForwarder’s pay function

- id: 12068
- impact: HIGH
- protocol: [[Storj]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/storj-token-audit-32a9af082797/

## Summary


The `pay` function in PaymentForwarder.sol has two severe issues. The first is that it accepts zero-valued payments, which can lead to the variable `customerCount` being incremented twice due to a calculation error. To address this, a precondition was added to ensure `msg.value != 0`. The second issue is that anyone can call the `pay` function with arbitrary data, and it was not clear who should be allowed to do so. This was intended behavior, however, so no changes were necessary.

## Details

`pay` function in [line 44 of PaymentForwarder.sol](https://github.com/Storj/storj-contracts/blob/2bdeb27c0216d2f0889b6e7363d8a84b54cd7f39/contracts/PaymentForwarder.sol#L44) has two severe problems.


1. The [`pay`](https://github.com/Storj/storj-contracts/blob/2bdeb27c0216d2f0889b6e7363d8a84b54cd7f39/contracts/PaymentForwarder.sol#L44-L66) function accepts zero-valued payments. This is not desirable, per se, but in this case it brings a greater problem.


The code assumes that all payments are nonzero in the calculation of the variable `customerCount` (see [lines 53 to 55](https://github.com/Storj/storj-contracts/blob/2bdeb27c0216d2f0889b6e7363d8a84b54cd7f39/contracts/PaymentForwarder.sol#L53-L55)). If two calls are made to `pay` with the same `customerId` and the first one has `msg.value == 0`, `customerCount` will be incremented both times because `weiAmount` will be 0 in [line 57](https://github.com/Storj/storj-contracts/blob/2bdeb27c0216d2f0889b6e7363d8a84b54cd7f39/contracts/PaymentForwarder.sol#L57).


Add a precondition to ensure `msg.value != 0`.


**EDIT**: Addressed in <https://github.com/Storj/storj-contracts/commit/40b8dd82ec58ad795c21b1f37e11ebccdb10a6c8>.


1. Anyone will be able to call the `pay` function with arbitrary data. We don’t have access to the rest of the crowdsale code and couldn’t determine what the desired behavior is here. For example, who should be allowed to call the `pay` function is not clear. Consider making the function only callable from a specific address if that’s the intended behavior.


**EDIT:** This was intended behavior.
