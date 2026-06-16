---
tags:
  - lang/solidity
  - sector/nft
  - platform/zokyo
  - has/github
  - severity/high
  - impact/loss-of-funds/reward-theft
  - novelty/variant
protocol: "[[Heurist]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-07-01-Heurist.md"
genome:
  - "[[wrong-condition]]"
  - "[[reward-theft]]"
  - "[[variant]]"
  - "[[permit-fork-replay]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# Insufficient Validation of Referral Address in mint

- id: 37690
- impact: HIGH
- protocol: [[Heurist]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-07-01-Heurist.md

## Summary


The `mint` function in the ZkImagine NFT project allows users to get a discount by specifying a referral address. However, this address is not checked for validity, which means that users can exploit the system and potentially steal referral rewards. To prevent this, the team should implement checks to verify the referral address. Additionally, the `partnerFreeMint` function allows unlimited minting for users who hold a single partner NFT, which goes against the intended scarcity of the NFTs. To fix this, the team should limit the number of free mints a single partner NFT holder can perform. The auditor also found an issue with the `signatureFreeMint` function, which can be replayed without limit.

## Details

**Severity**: High

**Status**: Acknowledged

**Description**

The `mint` function allows users to specify a referral address to receive a discount on the minting fee. However, the referral address is not validated. This means that users can set the referral address to any arbitrary address, including an address that they control, to exploit the discount mechanism and potentially drain referral rewards.

**Recommendation**: 

To prevent abuse of the referral system, implement validation checks to ensure that the referral address is a legitimate and authorized referrer.

 ### Holder of Partner NFT can mint unlimited NFTs in `partnerFreeMint`

**Severity**: High

**Status**: Acknowledged

**Description**

The `partnerFreeMint` function allows users to mint a new token if they hold at least one token of a whitelisted partner NFT. However, this can be exploited by an attacker who holds a single partner NFT, allowing them to mint an unlimited number of `ZkImagine` NFTs over time. This undermines the intended scarcity and value of the NFTs.

**Recommendation**: 

Limit the number of free mints a single partner NFT holder can perform.

**Auditor’s Comment**:

In the snippet below:
```solidity
        _updateGlobalTimeThreshold();
        nextMint[partnerNFTAddress][partnerNFTtokenId] = globalTimeThreshold;
```
The new value of `globalTimeThreshold` becomes ~ `block.timestamp`. 
Theoretically, The attacker can mint on every block throughout the day.
The issue also exists in `signatureFreeMint` as the client decided to make the signature replayable :
```solidity
        _updateGlobalTimeThreshold();
        nextSignatureMint[signature] = globalTimeThreshold;
```
But This basically makes it replayable without a limit.
