---
tags:
  - lang/solidity
  - platform/pashov-audit-group
  - has/github
  - has/poc
  - severity/high
  - sector/nft
protocol: "[[Museumofmahomes]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-09-01-MuseumOfMahomes.md"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
---
# [H-01] Last NFT from the supply can't be minted

- id: 26477
- impact: HIGH
- protocol: [[Museumofmahomes]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-09-01-MuseumOfMahomes.md

## Summary


This bug report concerns a problem with the `mint` and `mintPhysical` methods in the MuseumOfMahomes contract. The issue is that the code contains a check which is incorrect, as it prevents the last NFT of the MAX_SUPPLY from being minted. This results in a medium impact, as only one NFT won't be available for minting, but this is value loss to the protocol. The likelihood of this issue is high, as it's impossible to mint the last NFT.

The bug report includes a Proof of Concept unit test demonstrating the issue. This test shows that when the `nextId` is `MAX_SUPPLY - 1` then an `amount` of 1 should be allowed, but with the current check the code will revert.

The bug report recommends the following change to the code in both `mint` and `mintPhysical`:

```diff
- if (nextId + amount >= MAX_SUPPLY) revert ExceedsMaxSupply();
+ if (nextId + amount > MAX_SUPPLY) revert ExceedsMaxSupply();
```

This change should resolve the issue, as it will allow the last NFT of the MAX_SUPPLY to be minted.

## Details

**Severity**

**Impact:**
Medium, as only one NFT won't be available for minting, but this is value loss to the protocol

**Likelihood:**
High, as it's impossible to mint the last NFT

**Description**

Currently both the `mint` and `mintPhysical` methods have the following check:

```solidity
if (nextId + amount >= MAX_SUPPLY) revert ExceedsMaxSupply();
```

This is incorrect, as even when the `nextId` is `MAX_SUPPLY - 1` then an `amount` of 1 should be allowed but with the current check the code will revert. This is due to the `equal` sign in the check, which shouldn't be there. Here is a Proof of Concept unit test demonstrating the issue (add it to `MuseumOfMahomes.t.sol`):

```solidity
    function testNotAllNFTsCanBeMinted() public {
        museum.setPrice(PRICE);
        uint256 allButOneNFTSupply = 3089;

        // mint all but one from the NFT `MAX_SUPPLY` (3090)
        museum.mint{value: allButOneNFTSupply * PRICE}(address(this), allButOneNFTSupply);
        require(allButOneNFTSupply == museum.balanceOf(address(this)), "Mint did not work");

        // try to mint the last NFT from the supply, but it doesn't work
        vm.expectRevert(MuseumOfMahomes.ExceedsMaxSupply.selector);
        museum.mint{value: PRICE}(address(this), 1);
    }
```

**Recommendations**

Do the following change in both `mint` and `mintPhysical`:

```diff
- if (nextId + amount >= MAX_SUPPLY) revert ExceedsMaxSupply();
+ if (nextId + amount > MAX_SUPPLY) revert ExceedsMaxSupply();
```
