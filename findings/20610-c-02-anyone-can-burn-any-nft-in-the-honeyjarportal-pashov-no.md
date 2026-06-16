---
tags:
  - lang/solidity
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - sector/nft
protocol: "[[Bearcave]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-06-01-BearCave.md"
genome:
  - "[[missing-owner-check]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
---
# [C-02] Anyone can burn any NFT in the `HoneyJarPortal`

- id: 20610
- impact: HIGH
- protocol: [[Bearcave]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-06-01-BearCave.md

## Summary


This bug report is about a vulnerability in the `HoneyJarPortal` which allows anyone to burn any `HoneyJar` Non-Fungible Token (NFT) without any preconditions. This is a serious issue as it means that NFTs can be lost forever.

The bug is due to a redundant check in the `_debitFrom` method, which is called by the `sendFrom` method of `ONFT721Core` without an access control check. The redundant check is the following:

```solidity
if (_from != _msgSender()) revert OwnerNotCaller();
```

This shows an intention for an access control check, but does not actually check if the caller owns the NFT.

The recommendation is to update the code to check that the caller actually owns the NFT that is about to get burned.

## Details

**Impact:**
High, because the NFTs won't be retrievable from the portal anymore

**Likelihood:**
High, because it does not require any preconditions to be exploited

**Description**

The `_debitFrom` method in `HoneyJarPortal` allows burning of any `HoneyJar` NFT, given its ID. This method is freely callable through `ONFT721Core`'s `sendFrom` method, which calls `_send` which calls the `_debitFrom` method without an access control check. This results in the ability for anyone to burn any HoneyJar NFT, no matter who holds it. There is the following check in the method:

```solidity
if (_from != _msgSender()) revert OwnerNotCaller();
```

which shows an access control intention, but is actually redundant as the `_from` argument is not used in the burning process.

**Recommendations**

The code should check that the caller actually owns the NFT that is about to get burned - the current check does not do this. Update it accordingly.
