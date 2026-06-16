---
tags:
  - lang/rust
  - sdk/anchor
  - has/github
  - platform/zokyo
  - severity/high
  - sector/staking
  - lang/anchor
protocol: "[[Vaultka]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-07-06-Vaultka.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# `Position_amount` never updated after withdrawal

- id: 37705
- impact: HIGH
- protocol: [[Vaultka]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-07-06-Vaultka.md

## Summary


A critical bug was found in the code for the "PositionInfo" function in the file "strategy/programs/vaultka/src/lib.rs". The function `request_deposit` sets the `position_amount` to 0 and then the `execute_deposit` function updates it to be equal to the `received_amount`. However, the `request_withdraw` function does not check if `position_info.is_in_withdraw_request` is already true, allowing for multiple calls and the possibility of receiving more tokens than intended. It is recommended to thoroughly review and document the logic in these functions and isolate their functionality.

## Details

**Description**

The function 'request_deposit sets initiates the "PositionInfo" with `position_amount $=\emptyset$. Then, the function 'execute_deposit' updates it to be equal to received_amount right before the end of the function execution. The 'request_withdraw` uses this value to determine the amount to be withdrew and, actually does send tokens to the keeper. There's also no check if the position_info.is_in_withdraw_request is already `true`, which makes it possible to call it again many times always getting the tokens.
File: strategy/programs/vaultka/src/lib.rs

**Recommendation**

re-check the logic in those four function, it seems to be totally corrupted. Try to isolate functionality and make sure to document all checks you needed

**Re-audit comment**

Resolved
