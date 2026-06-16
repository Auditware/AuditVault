---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Barter DAO]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Barter%20DAO/Barter%20DAO%20(diff)/README.md#1-bypassing-payment-fees-through-various-methods"
genome:
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
---
# Bypassing payment fees through various methods

- id: 27744
- impact: HIGH
- protocol: [[Barter DAO]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Barter%20DAO/Barter%20DAO%20(diff)/README.md#1-bypassing-payment-fees-through-various-methods

## Summary


A bug report has been filed regarding the SwapExecutor, a contract responsible for executing token swaps, which is vulnerable to multiple methods of bypassing payment fees. This allows an attacker to perform swaps without paying the required fees, resulting in potential financial losses for the SwapExecutor owners.

The first method involves specifying a personal transfer of all tokens in the final swap, leaving only 2 wei of the tokenToTransfer on the contract to avoid paying fees. The second method involves passing a swap-path that ends with a poisonous token created by the attacker. The attacker pays fees in their own token, which is worthless, thus bypassing payment fees. The third method involves copying the code of SwapExecutor and removing the payment logic, allowing the attacker to continue using the SwapFacade without paying any fees.

The recommended solution is to take a fixed fee in a fixed token, such as Ether, in SwapFacade. This would help prevent attackers from bypassing payment fees and causing financial losses.

## Details

##### Description

SwapExecutor, a contract responsible for executing token swaps, is vulnerable to multiple methods of bypassing payment fees, allowing an attacker to perform swaps without paying the required fees.

The first method involves specifying a personal transfer of all tokens in the final swap, leaving only 2 wei of `tokenToTransfer` on the contract to avoid paying fees. This enables the attacker to evade payment and execute swaps at no cost.

- https://github.com/BarterLab/argon/blob/22239aaccdbb78d4aa7ac5c4d0859a9b31c0fc00/contracts/SwapExecutor.sol#L146

The second method involves passing a swap-path that ends with a poisonous token created by the attacker. The attacker pays fees in their own token, which is worthless, thus bypassing payment fees.

- https://github.com/BarterLab/argon/blob/22239aaccdbb78d4aa7ac5c4d0859a9b31c0fc00/contracts/SwapFacade.sol#L35

The third method involves copying the code of SwapExecutor and removing the payment logic, allowing the attacker to continue using the SwapFacade without paying any fees by passing the custom SwapExecutor to `SwapFacade.swap()`.

- https://github.com/BarterLab/argon/blob/22239aaccdbb78d4aa7ac5c4d0859a9b31c0fc00/contracts/SwapFacade.sol#L29

Overall, these vulnerabilities allow attackers to perform swaps without paying the required fees, leading to potential financial losses for the SwapExecutor owners.

##### Recommendation

One way to address the vulnerabilities in SwapExecutor is to take a fixed fee in a fixed token, such as Ether, in SwapFacade.
