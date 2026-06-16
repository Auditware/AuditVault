---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/perpetuals
protocol: "[[Gigaverse]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Gigaverse-security-review_2025-01-18.md"
genome:
  - "[[dos-resistance]]"
  - "[[frozen-funds]]"
  - "[[variant]]"
---
# [H-04] Stuck ETH in `GigaNameNFT` contract

- id: 53287
- impact: HIGH
- protocol: Gigaverse_2025-01-18
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Gigaverse-security-review_2025-01-18.md

## Summary


The report discusses a bug in the `GigaNameNFT` contract, which is used to mint a special type of digital asset called a **GigaNameNFT** for players. The bug is considered to have a medium impact and a high likelihood of occurring. Currently, the contract does not have a way for the manager to withdraw any ETH that is collected when a player's **GigaNameNFT** is minted. This means that the ETH will be permanently locked in the contract and cannot be accessed. The recommendation is to update the contract to include a mechanism for withdrawing the collected ETH.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `GigaNameNFT` contract is supposed to receive ETH when the minter role calls `mintUsername()` to mint a **GigaNameNFT** for a player, however, this contract doesn't implement a mechanism to enable the manager from withdrawing collected ETH (nor does the parent `GameNFT` contract), which would result in permanently locking the collected ETH in the contract.

## Recommendations

Update `GigaNameNFT` contract to implement a withdrawal mechanism for the collected ETH.
