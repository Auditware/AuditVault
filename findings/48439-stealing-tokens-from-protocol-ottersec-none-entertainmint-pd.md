---
tags:
  - lang/solidity
  - sector/stable
  - sector/token
  - platform/ottersec
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Entertainmint]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://www.entertainmint.com/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[timestamp-dependence]]"
---
# Stealing Tokens From Protocol

- id: 48439
- impact: HIGH
- protocol: [[Entertainmint]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://www.entertainmint.com/

## Summary


This bug report discusses an issue with the protocol's allowed addresses, called creators. A creator can create projects and start raises, but there is a problem with the Raise struct and the Tier values. The project owner is able to modify the prices and currency of the raise, even though they should not be able to do so. This allows them to steal tokens and ETH from other projects. A proof of concept is provided to demonstrate how this can be done. The recommended solution is to prevent the project owner from changing the raise and tier parameters after the start of minting raise tokens. This has been fixed in the code by checking the block timestamp.

## Details

## Protocol Overview

The protocol has a list of allowed addresses called **creators**. A creator can create projects and start raises for those projects. The **Raise** struct is used to store the values related to a raise. A raise also has tiers for storing different types of tokens, which have different supply caps and prices. 

These Raise and Tier values can be updated by the project owner when the raise is in **Scheduled** state. The raise will be in scheduled state in two cases: before presale and in between presale end and public sale start. 

However, since the raise tokens are minted in presale, the project owner should not be able to modify the prices and the currency of the raise. This is not enforced properly, leading to a scenario where a project owner can steal tokens and ETH from the contract raised by other projects.

## Proof of Concept

1. The controller adds a creator’s address to the creators list.
2. The creator creates a project and a raise for that project with a pre-approved token as currency (e.g., USDT) and adds their own address to the allowlist of addresses that can mint tokens in presale, with a very low amount as the goal for the raise.
3. In the presale, the creator can mint the tokens and make the raise reach its goal.
4. When the raise is back in its scheduled phase (between presale end and public sale start), the creator can update the currency of the raise to a higher value currency (e.g., ETH) and close the raise, changing its state to **Funded**.
5. The project owner can then use the `withdraw` function to withdraw the `raise.balance` amount from the contract address. Instead of receiving USDT, they will get ETH transferred to their account.

## Remediation

This issue can be fixed by not allowing the project owner to change the raise and tier parameters after the start of minting raise tokens. This can be accomplished by modifying the condition in the update function to check if the `block.timestamp` is less than `raise.presaleStart`.

## Patch

The issue was fixed by checking the block timestamp in commit `35c8d1f`.
