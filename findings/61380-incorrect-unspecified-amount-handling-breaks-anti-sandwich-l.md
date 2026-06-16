---
tags:
  - lang/solidity
  - sector/dex
  - platform/openzeppelin
  - has/github
  - severity/high
  - impact/mev/sandwich
  - trigger/sandwich-attack
protocol: "[[Uniswap Hooks]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit"
genome:
  - "[[wrong-condition]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[frontrun-exposure]]"
  - "[[mev-multihop]]"
---
# Incorrect Unspecified Amount Handling Breaks Anti-Sandwich Logic

- id: 61380
- impact: HIGH
- protocol: OpenZeppelin [[Uniswap Hooks]] v1.1.0 RC 1 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit

## Summary


The current implementation of the `AntiSandwichHook` contract has a flaw that allows attackers to successfully execute sandwich attacks. This is because the contract assumes that the "unspecified amount" in a swap always refers to the output amount, but it can also represent the input amount. This means that the anti-sandwich protection does not work in certain situations, allowing attackers to profit from the attack. The vulnerability can be exploited by initiating a swap from one token to another and then manipulating the "unspecified amount" in subsequent swaps. To fix this issue, the contract needs to correctly handle both input and output cases and distinguish between them.

## Details

The current implementation of the `AntiSandwichHook` contract [assumes](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/AntiSandwichHook.sol#L167-L198) that the “unspecified amount” in a swap always refers to the output amount the user will receive. However, it can also represent the input amount that the user is willing to pay. Due to this flawed assumption, the anti-sandwich protection becomes ineffective in certain conditions, allowing an attacker to successfully execute a sandwich attack.

#### Exploit Scenario

1. Attacker initiates a swap from token₀ to 10,000 token₁ (`zeroForOne = true`).
   * `unspecified amount`: the amount (input) the attacker must pay: 10,000
   * `targetOutput`: set to 10,000, as that is what the attacker receives.
2. Victim follows up with a swap from 10,000 token₀ to 9,500 token₁ (`zeroForOne = true`).
3. Attacker performs the closing leg of the sandwich, swapping 10,000 token₁ back to token₀ (`zeroForOne = false`).
   * The attacker specifies only how much they want to receive, e.g., 12,000 token₀.
   * `unspecified amount`: now represents how much token₁ the attacker is willing to pay, say 10,000.
   * The code calculates `targetOutput` using the initial state from the first trade (before the victim’s), which gives a value of 12,000.
   * Since `targetOutput > unspecified amount`, the hook incorrectly **caps `targetOutput` to 10,000**, which does not trigger a fee or block the swap.

As a result, the attacker successfully extracts profit - swapping 10,000 token₁ for 12,000 token₀ - completing the sandwich attack.

A similar attack is also possible in the reverse direction, such as: `!zeroForOne → !zeroForOne → zeroForOne`.

The vulnerability stems from treating the “unspecified amount” exclusively as the amount to be received instead of handling both input and output cases correctly.

To prevent this class of sandwich attacks, the anti-sandwich hook must distinguish whether the unspecified amount represents input or output. In case it represents the amount to be paid (i.e., input), then:

* if the unspecified amount is greater than `targetOutput`, then `targetOutput` must be set equal to the unspecified amount
* if the `targetOutput` is greater than the unspecified amount, then the user must end up paying the `targetOutput` amount instead
