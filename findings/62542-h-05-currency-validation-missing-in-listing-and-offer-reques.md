---
tags:
  - lang/solidity
  - sector/nft
  - sector/oracle
  - sector/token
  - platform/pashov
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[RipIt]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/RipIt-security-review_2025-04-25.md"
genome:
  - "[[fee-calculation]]"
  - "[[indirect-loss]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[timestamp-dependence]]"
---
# [H-05] Currency validation missing in listing and offer requests

- id: 62542
- impact: HIGH
- protocol: RipIt_2025-04-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[RipIt]]-security-review_2025-04-25.md

## Summary


The Marketplace contract has a bug where the currency specified in `ListingRequest` and `OfferRequest` is not properly validated against the `acceptedCurrency` stored in the contract. This can lead to incorrect charges and make it impossible to retrieve fees. To fix this, validation checks should be implemented to ensure that the currency used in the requests matches the accepted currency before executing any transactions.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

 The `Marketplace` contract defines the currency in both `ListingRequest` and `OfferRequest`:

```solidity
    struct ListingRequest {
        address tokenContractAddress;
        uint256 tokenId;
        uint256 price;
        **address acceptedCurrency;**
        uint256 deadline;
        address owner;
        uint256 chainId;
    }

    struct OfferRequest {
        address tokenContractAddress;
        uint256 tokenId;
        uint256 price;
        **address offerCurrency;**
        uint256 deadline;
        address requester;
        uint256 chainId;
    }
```

However, in the relevant check `isValidListing` and `isValidBid`, there is no validation to ensure that the currency specified in these requests matches the `acceptedCurrency` stored in the contract.

```solidity
    function isValidListing(ListingParams calldata listing) public view returns (bool) {
        if (listing.request.price == 0) revert InvalidPrice();
        if (block.timestamp > listing.request.deadline) revert ListingExpired();
        if (listing.request.chainId != block.chainid) revert InvalidChainId();
        bytes32 listingHash = generateListingSignatureHash(listing.request);
        if (usedListings[listingHash]) revert ListingAlreadyUsed();
        if (!IWhitelistRegistry(whitelistRegistry).isWhitelisted(listing.request.tokenContractAddress)) {
            revert NFTNotWhitelisted();
        }
        if (IERC721(listing.request.tokenContractAddress).ownerOf(listing.request.tokenId) != listing.request.owner) {
            revert NotOwner();
        }

        if (!SignatureChecker.isValidSignatureNow(listing.request.owner, listingHash, listing.sig)) {
            revert InvalidSignature();
        }

        if (msg.sender != listing.receiver && !SignatureChecker.isValidSignatureNow(listing.receiver, listingHash, listing.receiverSig)) {
            revert InvalidSignature();
        }

        return true;
    }
   ....
```
This oversight can lead to significant issues:

- In the `buy` function, the function directly uses `acceptedCurrency` to pay. If the `acceptedCurrency` has changed between the time of signing and execution, it could result in incorrect charges (if the payee happens to have approved enough allowance) or a DOS.

```solidity
            // External calls after state changes
            IERC20(acceptedCurrency).transferFrom(payee, listings[i].request.owner, sellerAmount);
            IERC20(acceptedCurrency).transferFrom(payee, address(this), feeAmount);
```

- More significantly, In the `acceptOffer` function, the function uses `offers[i].request.offerCurrency` to pay. This bypasses the `acceptedCurrency` check, potentially leading to incorrect calculations of `totalPendingFees` and making it impossible to retrieve the actual fee. 

```solidity
            // Update state before external calls
            totalPendingFees += feeAmount;
            // External calls after state changes
            IERC20(offers[i].request.offerCurrency).transferFrom(offers[i].request.requester, offers[i].receiver, sellerAmount);
            IERC20(offers[i].request.offerCurrency).transferFrom(offers[i].request.requester, address(this), feeAmount);
```

- Furthermore, if `acceptedCurrency` is set to zero during an `emergencyShutdown`, transactions of `acceptOffer` could still be completed, undermining the purpose of the emergency shutdown mechanism.

```solidity
    function emergencyShutdown() external {
        require(msg.sender == marketplaceAdmin, "Only marketplaceAdmin can call");
        // First collect any pending fees
        uint256 amount = totalPendingFees;
        if (amount > 0 && acceptedCurrency != address(0)) {
            totalPendingFees = 0;
            IERC20(acceptedCurrency).transfer(feeReceiver, amount);
        }
        // Set currency to address(0) to prevent any new trades
        acceptedCurrency = address(0);
    }
```

## Recommendations

To enhance the integrity of the contract and prevent these issues, implement validation checks to ensure that the currency used in both `ListingRequest` and `OfferRequest` matches the `acceptedCurrency` before executing any transactions.
