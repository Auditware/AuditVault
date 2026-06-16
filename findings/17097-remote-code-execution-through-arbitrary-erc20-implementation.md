---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/nft
  - sector/token
protocol: "[[Origin]]"
auditors:
  - "[[Robert Tonic]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/origin.pdf"
genome:
  - "[[griefing]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
---
# Remote code execution through arbitrary ERC20 implementation

- id: 17097
- impact: HIGH
- protocol: [[Origin Protocol]]
- reporter: Robert Tonic (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/origin.pdf

## Summary


This bug report is about an exploit scenario where a malicious ERC20 implementation can prevent an offer from finalizing. This exploit occurs when a user creates an offer and the address to a deployed implementation of the ERC20 interface is accepted as the _currency parameter. When this offer is accepted, the _currency parameter is stored in the listing struct and used as the method of payment for the offer. If the malicious ERC20 contract reverts on every call to transfer, the offer cannot be finalized. 

To address this issue, it is recommended to implement a method for either a seller or arbitrator to revoke an offer after it has been accepted, without performing calls to the _currency contract. Additionally, it is suggested to prevent arbitrary ERC20 contracts from being used for the currency method by using a whitelist of allowed contract addresses.

## Details

## Type: Timing
**Target:** origin-contracts/contracts/token/OriginToken.sol

---

**Difficulty:** High

## Description
When a user creates an offer, the address to a deployed implementation of the ERC20 interface is accepted as the _currency parameter.

```solidity
function makeOffer (
    uint listingID,
    bytes32 _ipfsHash,      // IPFS hash containing offer data
    uint _finalizes,        // Timestamp an accepted offer will finalize
    address _affiliate,     // Address to send any required commission to
    uint256 _commission,    // Amount of commission to send in Origin Token if offer finalizes
    uint _value,            // Offer amount in ERC20 or Eth
    ERC20 _currency,        // ERC20 token address or 0x0 for Eth
    address _arbitrator     // Escrow arbitrator
) public payable {
    ...
    offers[listingID].push(Offer({
        status: 1,
        buyer: msg.sender,
        finalizes: _finalizes,
        affiliate: _affiliate,
        commission: _commission,
        currency: _currency,
        value: _value,
        arbitrator: _arbitrator,
        refund: 0
    }));
    if (address(_currency) == 0x0) { // Listing is in ETH
        require(msg.value == _value, "ETH value doesn't match offer");
    } else { // Listing is in ERC20
        require(msg.value == 0, "ETH would be lost");
        require(
            _currency.transferFrom(msg.sender, this, _value),
            "transferFrom failed"
        );
    }
    emit OfferCreated(msg.sender, listingID, offers[listingID].length - 1, _ipfsHash);
}
```
**Figure 1:** The public `makeOffer` function, used for creating an offer for a listing. Subsequently, the _currency parameter is stored in the listing struct and used as the method of payment for the offer.

```solidity
function paySeller(uint listingID, uint offerID) private {
    Listing storage listing = listings[listingID];
    Offer storage offer = offers[listingID][offerID];
    uint value = offer.value - offer.refund;
    if (address(offer.currency) == 0x0) {
        require(offer.buyer.send(offer.refund), "ETH refund failed");
        require(listing.seller.send(value), "ETH send failed");
    } else {
        require(
            offer.currency.transfer(offer.buyer, offer.refund),
            "Refund failed"
        );
        require(
            offer.currency.transfer(listing.seller, value),
            "Transfer failed"
        );
    }
}
```
**Figure 2:** The `paySeller` function, used to transfer the ERC20 tokens offered to the seller. A malicious ERC20 implementation could prevent an offer from finalizing, since the logic for finalization relies on a successful transfer call.

## Exploit Scenario
Alice creates a listing on the Marketplace. Bob then submits an offer using a custom `MaliciousERC20` contract. Alice accepts Bob’s offer. Bob does not finalize the offer. Alice waits for the finalization period to expire to finalize the offer. Bob uses the `MaliciousERC20` contract to revert on every call to `transfer`, resulting in an offer that can’t be finalized.

## Recommendation
**Short term:** Implement a method for either a seller or arbitrator to revoke an offer after it has been accepted, without performing calls to the _currency contract.

**Long term:** Prevent arbitrary ERC20 contracts from being used for the currency method. Consider using a whitelist of allowed contract addresses.
