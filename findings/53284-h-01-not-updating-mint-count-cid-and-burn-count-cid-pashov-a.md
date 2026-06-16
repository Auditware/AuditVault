---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/gaming
protocol: "[[Gigaverse]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Gigaverse-security-review_2025-01-18.md"
genome:
  - "[[reward-accounting]]"
  - "[[logic/state-update]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-01] Not updating `MINT_COUNT_CID` and `BURN_COUNT_CID`

- id: 53284
- impact: HIGH
- protocol: Gigaverse_2025-01-18
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Gigaverse-security-review_2025-01-18.md

## Summary


This bug report is about a problem with the `GameItems` contract, which is used for batch minting and burning of game items. The severity of the bug is high and the likelihood of it occurring is medium. The issue is that the contract does not update the `MINT_COUNT_CID` and `BURN_COUNT_CID` during batch processing, which can result in incorrect supply calculations. The report recommends adding logic to handle these counts in batch operations.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `GameItems` contract provides the `mintBatch` and `burnBatch` functions for batch minting and burning of game items.

```solidity
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) whenNotPaused {
        _mintBatch(to, ids, amounts, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external onlyRole(MINTER_ROLE) whenNotPaused {
        _mintBatch(to, ids, amounts, "");
    }

    function burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external onlyRole(GAME_LOGIC_CONTRACT_ROLE) whenNotPaused {
        _burnBatch(from, ids, amounts);
    }
```

However, during the batch processing, the `MINT_COUNT_CID` and `BURN_COUNT_CID` are not updated, which will lead to incorrect supply calculations.

## Recommendations

The logic to handle `MINT_COUNT_CID` and `BURN_COUNT_CID` in batch operations should be added.
