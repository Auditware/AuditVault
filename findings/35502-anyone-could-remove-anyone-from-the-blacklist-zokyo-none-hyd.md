---
tags:
  - lang/move
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/token

protocol: "[[Hydro]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-04-23-Hydro.md"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# Anyone could remove anyone from the blacklist

- id: 35502
- impact: HIGH
- protocol: [[Hydro]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-04-23-Hydro.md

## Summary


This bug report is about a function called "remove_addr_from_blacklist" that doesn't have any checks to make sure the person calling it is the owner of the contract. This means that anyone can use this function to remove any address from the "DenyList" by providing the current list and the address they want to remove. To fix this, the report suggests adding an input argument for the owner's address and checking it against the transaction sender's address. This will ensure that only the owner can use this function to remove addresses from the list. The report also mentions that other functions in the same contract have similar checks in place.

## Details

**Severity**: High

**Status**: Invalid

**Where**: token.move


**Details**: 

the function "remove_addr_from_blacklist" doesn't contain any ownership checks, so anyone could call it by providing the current `DenyList` as well as any address in the giving list, resulting in the removal of the provided address from the `DenyList`.

**Recommendations**: 

by analogy with other mutating functions in the given contract, add an input argument of the type Owner and check its "owner" field to be equal to the transaction sender address
