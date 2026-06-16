---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/perpetuals
protocol: "[[Gigaverse]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Gigaverse-security-review_2025-01-18.md"
genome:
  - "[[fee-accounting]]"
  - "[[logic/fee-calculation]]"
  - "[[loss-of-funds/fee-theft]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-05] Zero Username price when it is minted with `mintUsername()`

- id: 53288
- impact: HIGH
- protocol: Gigaverse_2025-01-18
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Gigaverse-security-review_2025-01-18.md

## Summary


This bug report discusses a problem with the `AccountSystem` contract, which allows users to create new accounts by paying Ether. The issue is that there is a way to bypass the payment requirement by calling a function in the `GigaNameNFT` contract, which does not properly check the price in the `AccountSystem` table. This means that users can mint accounts for free, which is not intended. The report recommends that the contracts be updated to ensure that both reference the same price in the `AccountSystem` table.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `AccountSystem` contract allows users to mint new accounts by paying Ether through the `mintWithEth` function. This function correctly enforces the payment requirement by checking the mint price stored in the` ETH_MINT_PRICE_CID` column of the `AccountSystem` table. Manager can set this price using the `setMintPrice` function in the AccountSystem contract.

However, there is an alternative path to mint an account for free by calling the `mintUsername` function in the `GigaNameNFT` contract. This function also checks the mint price against the `ETH_MINT_PRICE_CID` value, but it references the `GigaNameNFT` table, which has the value set to zero by default. Additionally, there is no function in the `GigaNameNFT` contract to set the mint price in its table, leaving it perpetually zero.

```solidity
    function mintUsername(address to, string memory username) external payable {
        require(msg.value >= getTableUint256Value(ETH_MINT_PRICE_CID), "Insufficient payment");
        confirmMint(to, username);
    }
```

## Recommendations

Ensure that both the `AccountSystem` and `GigaNameNFT` contracts reference the same price in the AccountSystem table.
