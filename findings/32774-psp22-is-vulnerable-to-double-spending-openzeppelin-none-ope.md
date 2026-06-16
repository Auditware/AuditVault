---
tags:
  - lang/rust
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/token
protocol: "[[OpenBrush]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/openbrush-contracts-library-security-review"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
  - "[[commitment-uniqueness]]"
---
# PSP22 Is Vulnerable to Double-Spending

- id: 32774
- impact: HIGH
- protocol: [[OpenBrush]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openbrush-contracts-library-security-review

## Summary


The PSP22 contract has a function called `approve` which allows one user to give permission for another user to spend a specific number of tokens on their behalf. However, this function is vulnerable to a double-spending attack, where the user can spend more tokens than the originally allowed amount. This is because the `approve` function can be used to change the allowance after the tokens have already been spent. The team behind the PSP22 contract is considering removing the `approve` function and potentially creating a new standard for fungible tokens. However, they have acknowledged the issue but have not yet found a solution.

## Details

The PSP22 contract defines the [`approve` function](https://github.com/Brushfam/openbrush-contracts/blob/553347354de6d0ead6a335ba4c197bdd01fb2d12/contracts/src/token/psp22/psp22.rs#L97), which permits a user to specify the number of tokens that another user can expend on their behalf.


However, this function is susceptible to the well-known double-spending attack, functioning as follows:


* Alice grants Bob the authority to expend 1000 tokens on her behalf.
* After some time, Alice decides to decrease the allowance from 1000 tokens to 500 tokens through the `approve` function, using Bob's `AccountId` and the new allowance as parameters.
* Bob anticipates this action and spends 1000 tokens on Alice's behalf, diminishing the allowance from 1000 tokens to 0.
* Alice's action is executed, establishing the new allowance amount as 500 tokens.
* Bob spends 500 tokens on Alice's behalf, resulting in a total of 1500 tokens spent.


Since the PSP22 implementation introduced the [`increaseAllowance`](https://github.com/Brushfam/openbrush-contracts/blob/553347354de6d0ead6a335ba4c197bdd01fb2d12/contracts/src/token/psp22/psp22.rs#L103) and [`decreaseAllowance`](https://github.com/Brushfam/openbrush-contracts/blob/553347354de6d0ead6a335ba4c197bdd01fb2d12/contracts/src/token/psp22/psp22.rs#L108) functions to modify token allowances for user expenditure, and considering the discussions with the OpenBrush team about potentially redefining the PSP22 or proposing a new fungible token contract standard, consider removing the `approve` function from the PSP22 implementation.


***Update:** Acknowledged, not resolved. The Brushfam team stated:*



> *It is not worth to break the standard to incorporate this change.*
