---
tags:
  - lang/solidity
  - sector/nft
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Bearcave]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-03-01-BearCave.md"
genome:
  - "[[missing-owner-check]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# [C-01] Anyone can steal all `HoneyJar` NFTs in `HoneyJarPortal` and exploit its allowances

- id: 20529
- impact: HIGH
- protocol: [[Bearcave]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-03-01-BearCave.md

## Summary


This bug report is about a vulnerability in the `_debitFrom` function in the `HoneyJarPortal` smart contract. This function allows anyone to call it and pass the address of `HoneyJarPortal` as the `_from` argument and their address as the `_toAddress` argument in the `sendFrom` method, and essentially steal any Non-Fungible Token (NFT) that is owned by the `HoneyJarPortal`. It is also possible to steal NFTs that `HoneyJarPortal` does not own, but is an approved spender of, since the `safeTransferFrom` method will complete successfully.

The impact of this vulnerability is high, as it results in a value loss for users. The likelihood of this vulnerability is also high, as it is a common vulnerability and does not require any preconditions.

The recommendation to fix this vulnerability is to check that the owner of the `_tokenId` NFT is the `msg.sender` in the `_debitFrom` function. This will ensure that the function is only called by the owner of the NFT, and not by anyone else.

## Details

**Impact:**
High, as it is a value loss for users

**Likelihood:**
High, as it is a common vulnerability and requires no preconditions

**Description**

The `_debitFrom` function in `HoneyJarPortal` is exploitable, as it looks like this:

```solidity
function _debitFrom(address _from, uint16, bytes memory, uint _tokenId) internal override {
    honeyJar.safeTransferFrom(_from, address(this), _tokenId); // Performs the owner & approval checks
}
```

Since there is no check for the `_from` argument, anyone can call the function (through the `sendFrom` method in `ONFT721Core`) and pass the address of `HoneyJarPortal` as the `_from` argument and his address as the `_toAddress` argument in the `sendFrom` method and essentially steal every NFT that is owned by the `HoneyJarPortal`. It can also steal NFTs that `HoneyJarPortal` does not own, but is an approved spender of, since the `safeTransferFrom` method will complete successfully.

**Recommendations**

In `_debitFrom` check that the owner of the `_tokenId` NFT is the `msg.sender`.
