---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/farm
  - sector/nft
  - sector/nft-marketplace
  - sector/staking-pool
protocol: "[[Foundation]]"
auditors:
  - "[[jmak]]"
report: "https://code4rena.com/reports/2022-02-foundation"
genome:
  - "[[spot-price]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[royalty-edge-cases]]"
---
# [H-02] Creators can steal sale revenue from owners' sales

- id: 42485
- impact: HIGH
- protocol: [[Foundation]]
- reporter: jmak (Code4rena)
- source: https://code4rena.com/reports/2022-02-foundation

## Summary


This bug report highlights a vulnerability in the NFTMarketCreators contract that allows creators to steal the sale price of an NFT minus fees. This can be done by manipulating the royalty information in the Royalty Registry before a sale is completed. The code in the contract allows for this by passing all royalties to the creator if the seller is listed as a royalty recipient. This can result in the seller receiving zero dollars for the sale and potentially owing taxes on the sale price. The report suggests calculating owner/seller revenue separately from royalty revenue as a mitigation step. The Foundation team has confirmed and commented on the issue, stating that they have made changes to prevent this vulnerability from being exploited.

## Details

_Submitted by IllIllI_

[NFTMarketCreators.sol#L158-L160](https://github.com/code-423n4/2022-02-foundation/blob/a03a7e198c1dfffb1021c0e8ec91ba4194b8aa12/contracts/mixins/NFTMarketCreators.sol#L158-L160)<br>
[NFTMarketCreators.sol#L196-L198](https://github.com/code-423n4/2022-02-foundation/blob/a03a7e198c1dfffb1021c0e8ec91ba4194b8aa12/contracts/mixins/NFTMarketCreators.sol#L196-L198)<br>
[NFTMarketCreators.sol#L97-L99](https://github.com/code-423n4/2022-02-foundation/blob/a03a7e198c1dfffb1021c0e8ec91ba4194b8aa12/contracts/mixins/NFTMarketCreators.sol#L97-L99)<br>

According to the [`README.md`](<https://github.com/code-423n4/2022-02-foundation/blob/4d8c8931baffae31c7506872bf1100e1598f2754/README.md?plain=1#L21>):

> All sales in the Foundation market will pay the creator 10% royalties on secondary sales. This is not specific to NFTs minted on Foundation, it should work for any NFT. If royalty information was not defined when the NFT was originally deployed, it may be added using the Royalty Registry which will be respected by our market contract.

Using the Royalty Registry an owner can decide to change the royalty information right before the sale is complete, affecting who gets what.

### Impact

By updating the registry to include the seller as one of the royalty recipients, the creator can steal the sale price minus fees. This is because if code finds that the seller is a royalty recipient the royalties are all passed to the creator regardless of whether the owner is the seller or not.

### Proof of Concept

```solidity
          // 4th priority: getRoyalties override
          if (recipients.length == 0 && nftContract.supportsERC165Interface(type(IGetRoyalties).interfaceId)) {
            try IGetRoyalties(nftContract).getRoyalties{ gas: READ_ONLY_GAS_LIMIT }(tokenId) returns (
              address payable[] memory _recipients,
              uint256[] memory recipientBasisPoints
            ) {
              if (_recipients.length > 0 && _recipients.length == recipientBasisPoints.length) {
                bool hasRecipient;
                for (uint256 i = 0; i < _recipients.length; ++i) {
                  if (_recipients[i] != address(0)) {
                    hasRecipient = true;
                    if (_recipients[i] == seller) {
                      return (_recipients, recipientBasisPoints, true);
```

<https://github.com/code-423n4/2022-02-concur/blob/72b5216bfeaa7c52983060ebfc56e72e0aa8e3b0/contracts/MasterChef.sol#L127-L154>

When `true` is returned as the final return value above, the following code leaves `ownerRev` as zero because `isCreator` is `true`.

```solidity
      uint256 ownerRev
    )
  {
    bool isCreator;
    (creatorRecipients, creatorShares, isCreator) = _getCreatorPaymentInfo(nftContract, tokenId, seller);

    // Calculate the Foundation fee
    uint256 fee;
    if (isCreator && !_nftContractToTokenIdToFirstSaleCompleted[nftContract][tokenId]) {
      fee = PRIMARY_FOUNDATION_FEE_BASIS_POINTS;
    } else {
      fee = SECONDARY_FOUNDATION_FEE_BASIS_POINTS;
    }

    foundationFee = (price * fee) / BASIS_POINTS;

    if (creatorRecipients.length > 0) {
      if (isCreator) {
        // When sold by the creator, all revenue is split if applicable.
        creatorRev = price - foundationFee;
      } else {
        // Rounding favors the owner first, then creator, and foundation last.
        creatorRev = (price * CREATOR_ROYALTY_BASIS_POINTS) / BASIS_POINTS;
        ownerRevTo = seller;
        ownerRev = price - foundationFee - creatorRev;
      }
    } else {
      // No royalty recipients found.
      ownerRevTo = seller;
      ownerRev = price - foundationFee;
    }
  }
```

In addition, if the index of the seller in `_recipients` is greater than `MAX_ROYALTY_RECIPIENTS_INDEX`, then the seller is omitted from the calculation and gets zero (`_sendValueWithFallbackWithdraw()` doesn't complain when it sends zero).

```solidity
        uint256 maxCreatorIndex = creatorRecipients.length - 1;
        if (maxCreatorIndex > MAX_ROYALTY_RECIPIENTS_INDEX) {
          maxCreatorIndex = MAX_ROYALTY_RECIPIENTS_INDEX;
        }
```

<https://github.com/code-423n4/2022-02-foundation/blob/4d8c8931baffae31c7506872bf1100e1598f2754/contracts/mixins/NFTMarketFees.sol#L76-L79>

This issue does a lot of damage because the creator can choose whether and when to apply it on a sale-by-sale basis. Two other similar, but separate, exploits are available for the other blocks in `_getCreatorPaymentInfo()` that return arrays but they either require a malicious NFT implementation or can only specify a static seller for which this will affect things. In all cases, not only may the seller get zero dollars for the sale, but they'll potentially owe a lot of taxes based on the 'sale' price. The attacker may or may not be the creator - creators can be bribed with kickbacks.

### Recommended Mitigation Steps

Always calculate owner/seller revenue separately from royalty revenue.

**[NickCuso (Foundation) confirmed and commented](https://github.com/code-423n4/2022-02-foundation-findings/issues/30#issuecomment-1060623733):**
 > This is a great discovery and a creative way for creators to abuse the system, stealing funds from a secondary sale. Thank you for reporting this.
> 
> It's a difficult one for us to address. We want to ensure that NFTs minted on our platform as a split continue to split revenue from the initial sale. We were using `isCreator` from `_getCreatorPaymentInfo` as our way of determining if all the revenue from a sale should go to the royalty recipients, which is a split contract for the use case we are concerned about here.
> 
> The royalty override makes it easy for a creator to choose to abuse this feature at any time. So that was our primary focus for this fix.
> 
> This is the change we have made in `_getFees`:
> 
> ```solidity
>     bool isCreator = false;
>     // lookup for tokenCreator
>     try ITokenCreator(nftContract).tokenCreator{ gas: READ_ONLY_GAS_LIMIT }(tokenId) returns (
>       address payable _creator
>     ) {
>       isCreator = _creator == seller;
>     } catch // solhint-disable-next-line no-empty-blocks
>     {
>       // Fall through
>     }
> 
>     (creatorRecipients, creatorShares) = _getCreatorPaymentInfo(nftContract, tokenId);
> ```
> 
> Since the royalty override is only considered in `_getCreatorPaymentInfo` we are no longer vulnerable to someone adding logic after the NFT has been released to try and rug pull the current owner(s).
> 
> It is still possible for someone to try and abuse this logic, but to do so they must have built into the NFT contract itself a way to lie about who the `tokenCreator` is before the time of a sale. If we were to detect this happening, we would moderate that collection from the Foundation website. Additionally we will think about a longer term solution here so that this type of attack is strictly not possible with our market contract.



***
