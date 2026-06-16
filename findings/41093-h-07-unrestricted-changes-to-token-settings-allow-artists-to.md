---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - severity/high
  - sector/nft
  - sector/nft-marketplace
protocol: "[[Phi]]"
auditors:
  - "[[pipidu83]]"
report: "https://code4rena.com/reports/2024-08-phi"
genome:
  - "[[missing-owner-check]]"
  - "[[direct-drain]]"
  - "[[royalty-edge-cases]]"
---
# [H-07] Unrestricted changes to token settings allow artists to alter critical features

- id: 41093
- impact: HIGH
- protocol: [[Phi]]
- reporter: pipidu83 (Code4rena)
- source: https://code4rena.com/reports/2024-08-phi

## Summary


This report highlights a bug in the PhiFactory contract that allows artists to make unrestricted changes to important settings of their NFTs, such as transferability, royalty fees, and associated URLs. This can negatively impact users who have already purchased or minted the NFTs. The recommendation is to implement limits on these changes to protect users while still allowing some flexibility for artists. The team has confirmed the issue and plans to remove the affected features and cap royalty rates at around 20%. The judge has ruled this as a high severity issue.

## Details


The [`updateArtSettings`](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/PhiFactory.sol#L215) function in the PhiFactory contract allows artists to modify several key settings of their art at any time. These settings include the `URI` link, royalty fee and `soulBounded` (non-transferable) feature.

```solidity
    function updateArtSettings(
        uint256 artId_,
        string memory url_,
        address receiver_,
        uint256 maxSupply_,
        uint256 mintFee_,
        uint256 startTime_,
        uint256 endTime_,
        bool soulBounded_,
        IPhiNFT1155Ownable.RoyaltyConfiguration memory configuration
    )
        external
        onlyArtCreator(artId_)
    {
        ...
        art.receiver = receiver_;
        art.maxSupply = maxSupply_;
        art.mintFee = mintFee_;
        art.startTime = startTime_;
        art.endTime = endTime_;
        art.soulBounded = soulBounded_;
        art.uri = url_;

        uint256 tokenId = IPhiNFT1155Ownable(art.artAddress).getTokenIdFromFactoryArtId(artId_);
        IPhiNFT1155Ownable(art.artAddress).updateRoyalties(tokenId, configuration);
        emit ArtUpdated(artId_, url_, receiver_, maxSupply_, mintFee_, startTime_, endTime_, soulBounded_);
    }
```

The problem is that there are no restrictions or limitations on how these settings can be changed after the art has been created and minted. This flexibility allows artists to alter critical functionalities in ways that could negatively impact existing holders:

1. **Changing `Soulbound` Status**: Artists can toggle the `soulBounded` status to lock transfers, effectively trapping users who purchased NFTs under the assumption they were transferable.
2. **Modifying Royalties**: Artists can set royalty fees to extremely high values after initial sales, forcing holders to pay unexpected fees upon resale.
3. **Updating URLs**: Artists can change the `linkURI`, potentially misleading users or affecting the NFT’s perceived value by altering the associated content. In the worst case, the URL could be changed to a malicious link, posing security risks to users who interact with it.

These changes can be made at any time, without prior notice to holders, leaving users vulnerable to unfavourable adjustments.

### Impact

Allowing unrestricted changes to critical token settings poses a significant risk to the stability and trustworthiness of the NFTs. Users who have already minted or purchased NFTs could be adversely affected by changes they did not agree to, such as increased fees or transfer restrictions.

### Recommendation

Implement limits on how and when critical settings can be changed, such as capping royalty rates. This would help protect users while maintaining some flexibility for artists.

**[ZaK3939 (Phi) confirmed and commented](https://github.com/code-423n4/2024-08-phi-findings/issues/14#issuecomment-2334534792):**
 > Given the specifications of our NFT, which is relatively inexpensive and doesn't have strict conditions regarding the number of mints, we feel that classifying this as a High severity issue is inappropriate.
> 
> We will implement the fix. Regarding updates, we will remove the `Soulbound` feature and the `URI` update functionality.
> 
> As for royalties, some other platforms allow up to 100% royalties. While we're using EIP-2981, which is not mandatory, we plan to implement a maximum royalty of around 20%.

**[0xDjango (judge) commented](https://github.com/code-423n4/2024-08-phi-findings/issues/14#issuecomment-2338829099):**
 > I am going to rule HIGH on this one. All three conditions outlined by the warden are medium/high, and the accumulation of all three makes this a clear high in my opinion.

***
