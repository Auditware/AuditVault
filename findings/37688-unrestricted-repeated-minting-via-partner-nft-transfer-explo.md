---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/nft
protocol: "[[Heurist]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-07-01-Heurist.md"
genome:
  - "[[missing-modifier]]"
  - "[[reward-theft]]"
  - "[[access-roles]]"
---
# Unrestricted repeated minting via Partner NFT Transfer Exploit

- id: 37688
- impact: HIGH
- protocol: [[Heurist]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-07-01-Heurist.md

## Summary


A bug was found in the `partnerFreeMint` function, which allows users to repeatedly transfer a partner NFT to different wallets and bypass the time restrictions. This is because the contract does not check the ID of the NFT, allowing users to exploit the system and mint unlimited NFTs. To fix this, the recommendation is to track the usage of each specific NFT ID and prevent users from reusing the same NFT until the time restriction has passed. This bug has been resolved.

## Details

**Severity**: High

**Status**: Resolved

**Description**

The `partnerFreeMint` function is vulnerable to an exploit where users can repeatedly transfer the partner NFT to different wallets, allowing unlimited minting without adhering to the time restrictions. This occurs because the contract does not verify the ID of the partner NFT, making it possible for users to undermine the intended limitations.

**Recommendation**: 

Implement a mechanism to track the usage of each specific partner NFT ID for the `partnerFreeMint` function. This can be achieved by maintaining a mapping of NFT IDs to their last minting timestamp or a boolean indicating whether they have been used for minting. Additionally, ensure that users cannot reuse the same NFT for minting until the time restriction has elapsed.
