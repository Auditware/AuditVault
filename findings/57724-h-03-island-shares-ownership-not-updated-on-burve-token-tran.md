---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/dex
protocol: "[[Burve]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-03-05.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[logic/state-update]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# [H-03] Island shares ownership not updated on Burve token transfer

- id: 57724
- impact: HIGH
- protocol: Burve_2025-03-05
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-03-05.md

## Summary


This bug report describes an issue with the `Burve` contract on Kodiak Island. When a user provides liquidity to the Uniswap pools, they receive `Burve` tokens and island shares. However, if the user transfers their `Burve` tokens to another address, the island shares remain assigned to the original user. This means that the new owner of the `Burve` tokens will not be able to harvest rewards or exchange the shares for liquidity. The report recommends updating the `_update()` function to withdraw and deposit the appropriate amount of LP tokens and update the `islandSharesPerOwner` mapping for both the old and new owner when a transfer occurs. This will fix the issue and allow for proper use of the `Burve` contract.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

When a Kodiak island contract is set in the `Burve`, on `mint()` a portion of the liquidity will be used to mint island shares, which will then be deposited into the station proxy at the name of the recipient, and the `islandSharesPerOwner` mapping will be updated for the recipient. The recipient will also receive `Burve` tokens (shares) for the liquidity provided to the Uniswap pools.

However, if the recipient transfers the `Burve` tokens to another address, the island shares are still assigned to him, both in `StationProxy` and in the `Burve`'s `islandSharesPerOwner` mapping. This means that after the transfer, the new owner of the `Burve` tokens will not be able to harvest the rewards in `StationProxy`, nor will he be able to burn the island shares in exchange for the underlying liquidity.

## Recommendations

Overwrite the `_update()` function so that on `Burve` transfers:

- The proportional amount of LP tokens are withdrawn from `StationProxy`.
- The LP tokens are deposited again in the name of the new owner.
- `islandSharesPerOwner` is updated by both the old and new owner.
