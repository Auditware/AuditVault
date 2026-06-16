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
  - "[[access-roles]]"
  - "[[access-control/missing-auth]]"
  - "[[privilege-escalation/role-bypass]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-access-control]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-user]]"
---
# [H-02] Unauthorized access to `update()` function

- id: 53285
- impact: HIGH
- protocol: Gigaverse_2025-01-18
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Gigaverse-security-review_2025-01-18.md

## Summary


This bug report discusses an issue with two handler contracts, called `GigaNameNFTBeforeUpdateHandler` and `GigaNoobNFTBeforeUpdateHandler`, that are used in the `GameNFT._update()` function. These handler contracts rely on a specific permission granted in the `AccountSystem` contract to store and remove data related to the ownership of tokens. However, the `update()` function in these handler contracts can be accessed by anyone, which allows them to change the ownership of tokens that have already been minted. This can cause issues for the new owner, as they may not be able to mint a certain type of token. The recommendation is to restrict access to the `update()` function in the `GigaNameNFTBeforeUpdateHandler` contract to only the `GigaNameNFT` contract.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `GigaNameNFTBeforeUpdateHandler` and `GigaNoobNFTBeforeUpdateHandler` handler contracts are called by the `GameNFT._update()` function when **GigaNameNFT** or **GigaNoobNFT** tokens are minted, transferred, or burnt, where these handler contracts rely on the `GAME_LOGIC_CONTRACT_ROLE` granted in the `AccountSystem` contract to store the new owner data and remove the old owner data from the datastore.
However, the `update()` function in these handler contracts isn't protected and can be accessed by anyone, which allows anyone to call the `update()` function on tokens that have already been minted, and removing the original owner's record from the datastore and setting a new owner, which will result in the new owner not being able to mint a **GigaNoobNFT** via **AccountSystem.mintWithEth()**, as the minting process will revert with the error:
**"User already has an account"**

```solidity
function update(
        address tokenContract,
        address to,
        uint256 tokenId,
        address //auth
    ) external override {
        //...
    }

```

## Recommendations

Restrict the access of the `GigaNameNFTBeforeUpdateHandler.update()` function to the `GigaNameNFT` contract.
