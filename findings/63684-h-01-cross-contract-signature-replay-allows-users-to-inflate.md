---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/nft
  - sector/staking
protocol: "[[HYBUX]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/HYBUX-security-review_2025-11-11.md"
genome:
  - "[[signature-replay]]"
  - "[[reward-theft]]"
  - "[[permit-fork-replay]]"
---
# [H-01] Cross-contract signature replay allows users to inflate rewards

- id: 63684
- impact: HIGH
- protocol: HYBUX_2025-11-11
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[HYBUX]]-security-review_2025-11-11.md

## Summary


This bug report states that there is a problem with the signature verification in the `NFTStaking._stakeNFTs()` function. This means that an attacker can use the same signature on different contracts and exploit the system by staking low-rarity NFTs and receiving rewards as if they were high-rarity. To fix this issue, the contract address needs to be included in the signature hash to prevent this type of attack.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The signature verification in `NFTStaking._stakeNFTs()` does not include the contract address in the hash, allowing signatures to be replayed across the three different NFTStaking contracts (WORLDS_STAKING, GRAYBOYS_STAKING, AVATARS_STAKING).

```solidity
bytes32 hash = keccak256(abi.encode(_sender, _tokenIds, _rarityWeightIndexes));
```

An attacker who owns the same token ID across different NFT collections can obtain a signature for a high-rarity NFT in one collection, then replay that signature when staking a low-rarity NFT with the same token ID in another collection. This results in the low-rarity NFT receiving rewards as if it were high-rarity.

Attack Example:
1. User owns token #100 in both Worlds (e.g. legendary, weight 100) and Grayboys (e.g. common, weight 1) collections
2. User obtains valid signature and stakes in Worlds contract (legitimate)
3. User replays the same signature on Grayboys contract with the common NFT
4. Common NFT now earns rewards with legendary multiplier

## Recommendations

Include the contract address in the signature hash to prevent cross-contract replay:

```solidity
bytes32 hash = keccak256(abi.encode(_sender, _tokenIds, _rarityWeightIndexes, address(this)));
```
