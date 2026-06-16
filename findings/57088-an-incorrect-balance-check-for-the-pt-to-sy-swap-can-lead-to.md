---
tags:
  - lang/solidity
  - sector/dex
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
protocol: "[[FIVA Yield Tokenization Protocol]]"
auditors:
  - Tarun Bansal
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-FIVA-yieldtokenizationprotocol-securityreview.pdf"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
---
# An incorrect balance check for the PT-to-SY swap can lead to a loss of funds

- id: 57088
- impact: HIGH
- protocol: FIVA Yield Tokenization Protocol
- reporter: Tarun Bansal (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-FIVA-yieldtokenizationprotocol-securityreview.pdf

## Summary


This bug report discusses an issue with the FIVA protocol's AMM contract. The contract does not properly account for locked tokens when users attempt to swap between different token types. This can result in users losing their tokens without receiving any in return. The report suggests modifying the code to account for locked tokens in the short term and expanding the test suite to prevent similar issues in the future.

## Details

## Diﬃculty: Medium

## Type: Undeﬁned Behavior

## Description
The AMM contract fails to account for locked SY tokens when validating PT-to-SY swaps, which can lead to users losing their PT tokens without receiving any SY tokens in return. In the FIVA protocol, users can swap between different token types (SY, PT, and YT) through the AMM pool. During certain operations, some tokens may be temporarily locked in the pool. The protocol tracks these locked tokens using the `storage::sy_locked` and `storage::pt_locked` state variables.

When a user attempts to swap PT for SY tokens, the `handle_swap_pt_for_sy` function should verify that the pool has enough available (non-locked) SY tokens to fulfill the swap. However, unlike other swap functions in the codebase, this function checks against only the total SY supply without accounting for locked tokens:

```plaintext
if ((sy_out < max(min_sy_out, MIN_SWAP_AMOUNT)) | (sy_out > (storage::total_supply_sy - MINIMUM_LIQUIDITY))) {
```

_Figure 8.1: The balance check in the PT to SY swaps contracts/AMM/markets/swaps.fc#75_

In contrast, other swap functions correctly account for locked tokens. For example, the `handle_swap_sy_for_yt` function includes `storage::sy_locked` in its validation:

```plaintext
(sy_out > (storage::total_supply_sy - storage::sy_locked - MINIMUM_LIQUIDITY))
```

_Figure 8.2: The balance check in the SY to YT swaps contracts/AMM/markets/swaps.fc#124_

This inconsistency creates a problematic scenario when locked SY tokens are present in the pool. The swap validation may incorrectly pass because it checks against only the total SY supply, not the available supply. When the transaction proceeds to actually transfer SY tokens, it will fail due to an insufficient available balance. This would result in the user permanently losing their PT tokens without receiving any SY tokens in return, while leaving the pool in an inconsistent state where its accounting and actual token balances are out of sync, potentially affecting future operations.

## Exploit Scenario
A user attempts to swap 200 PT tokens for SY in a pool where a significant amount of SY tokens are locked. The pool has a total of 1,000 SY tokens, but 900 of these are locked, leaving only 100 SY tokens actually available. The validation check passes incorrectly because it only compares against the total supply of SY tokens (1,000), not the available supply (100). When the transaction proceeds and the pool’s state is updated, the user’s 200 PT tokens are added to the pool, but the transfer of 200 SY tokens fails due to insufficient available balance. As a result, the user loses their PT tokens without receiving any SY tokens, and the pool’s accounting becomes inconsistent with its actual token balances.

## Recommendations
- **Short term**: Modify the validation check in `handle_swap_pt_for_sy` to account for locked SY tokens.
- **Long term**: Expand the test suite to specifically verify swap behavior when tokens are locked in the pool.
