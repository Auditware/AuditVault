---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/nft
  - sector/governance
protocol: "[[OnchainHeroes]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/OnchainHeroes-security-review_2025-01-13.md"
genome:
  - "[[commitment-uniqueness]]"
  - "[[logic/missing-check]]"
  - "[[loss-of-funds/fee-theft]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/protocol-wide]]"
---
# [C-02] Malicious users can mint the double Guaranteed Mints per RING

- id: 55405
- impact: HIGH
- protocol: OnchainHeroes_2025-01-13
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/OnchainHeroes-security-review_2025-01-13.md

## Summary


This report discusses a bug found in the `HeroERC721A.sol` contract, which is used for NFTs (non-fungible tokens). The bug allows malicious users to mint more tokens than they are supposed to by taking advantage of the contract's functionality. This bug has a high impact and likelihood of occurring. The report provides a proof of concept (POC) code to demonstrate how the bug can be exploited. The report recommends a code change to fix the bug.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

`HeroERC721A.sol` is an NFT contract, It guarantees the first phase **OG Phase** the whitelisted addresses will get:

- 1 Free Mint
- 2 Guaranteed Mints per **RING** (RING is NFT, so they take a Snapshot for holders)

`HeroERC721A.sol#ogMint()` function is how users mint tokens for OG whitelisted addresses.
Users who are eligible for the two types of OG mint have the flexibility to call `ogMint()` multiple times,
So they can take the free mint and the guaranteed mint in two different transactions.

Malicious users can take this privilege to mint double the number of Guaranteed Mints tokens by:

- 1. Call `ogMint()` and set `freeMint` to false and set `paidMintQty = 10` so `numOfRing = 5`.
     It mints 10 NFT and this is how the `aux` will be:

```
 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000
 1010 0000 0000 0000 0000 0000 0000
```

- 2. Call `ogMint()` and set `freeMint` to true and set `paidMintQty = 0`.
     It mints 1 NFT (the free one), this is how the `aux` will be:

```
 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000
 0000 0000 0000 0000 0000 0000 1000
```

We can see that [24-63] is now empty. This is because `_ogMint()` deleted the old values in this step:

```solidity
 uint64 aux = (_getAux(to) >> 3) & 0x0fffff;
```

- 3. Call `ogMint()` and set `freeMint` to false and set `paidMintQty = 10` so `numOfRing = 5`
     It mints 10 NFT and the `aux` will be:

```
 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000
 1010 0000 0000 0000 0000 0000 1000
```

So, this Malicious has mint 20 from the OG paid mints when he only has 5 RING.

Note:
Aux Bit Layout
The aux is a 64-bit number with the following bit layout:

[0-1]: Tracking `publicMint` status
[2-2]: Hero list mint tracking
[3-23]: Tracking the number of OG free mints (capacity : 2\***\*20 -1)
[24-63]: Tracking the number of OG paid mints (capacity : 2\*\***40 -1)

**POC:**

```solidity
    function testMinting() public {
        // og mint
        vm.warp(uint256(hero721.OG_MINT_TIMESTAMP()));
        bytes32[] memory b = new bytes32[](3);
        b[0] = bytes32(0xf6cad13a027fce5304a21819a989779362a06a4fbd07521b18209cd6ddc4e41c);
        b[1] = bytes32(0xc41bc74587e0ba059b462f9e0d8a6abd430876040e77e050ca8ec3f11d8bab38);
        b[2] = bytes32(0x31d93cf3542a493f93d6d5304dc473819fb4d0bf018b05c910f1802ea619ab5d);

        hero721.ogMint{value: 4e17}(ALICE, false, 4, 2, b);

        hero721.ogMint{value: 0}(ALICE, true, 0, 2, b);

        hero721.ogMint{value: 4e17}(ALICE, false, 4, 2, b);
        assertEq(hero721.balanceOf(ALICE), 10);
    }

```

## Recommendations

```diff
    function _ogMint(address to, uint64 numOfRings) internal {
+        uint64 _aux = _getAux(to);
+        uint64 aux = (_aux >> 3) & 0x0fffff;
-        uint64 aux = (_getAux(to) >> 3) & 0x0fffff;
        if (aux == numOfRings) revert AlreadyMinted();
-        _setAux(to, uint64(aux | (numOfRings << 3))); // Set OG free mint flag
+        _setAux(to, uint64(_aux | (numOfRings << 3))); // Set OG free mint flag
        _safeMint(to, numOfRings);
    }
```
