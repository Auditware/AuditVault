---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/nft
protocol: "[[Origin]]"
auditors:
  - "[[Robert Tonic]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/origin.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Marketplace OGN balance is drainable through withdrawListing

- id: 17095
- impact: HIGH
- protocol: [[Origin Protocol]]
- reporter: Robert Tonic (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/origin.pdf

## Summary


This bug report is about a vulnerability in the Marketplace contract found in the origin-contracts/contracts/marketplace/v00/Marketplace.sol file. The Marketplace contract allows users to submit and withdraw listings, along with an initial deposit in OGN. There is no check to see if a listing has already been withdrawn, which allows a deposit manager to withdraw the same listing multiple times, draining the Marketplace's OGN account balance. 

The exploit scenario in the report is as follows: Bob has 20 OGN in his account and the Marketplace contract has 100 OGN associated with it. Bob approves the Marketplace contract to manage 20 of his OGN. He then creates a listing with a deposit of 20 OGN and assigns himself as the deposit manager. Bob then withdraws the same listing 6 times into his account, recovering the initial deposit of 20 OGN and draining the Marketplace's original 100 OGN.

The recommendation is to define a method of flagging a listing as withdrawn and to check that this flag is not set before performing a withdrawal.

## Details

## Timing Vulnerability Report

## Type: Timing
**Target:** origin-contracts/contracts/marketplace/v00/Marketplace.sol

## Difficulty: High
**Type:** Access Controls  
**Target:** origin-contracts/contracts/marketplace/v00/Marketplace.sol

### Description
The Marketplace contract allows for the submission and withdrawal of listings by users. When submitting a listing, an initial deposit may be made in OGN, and a deposit manager address is assigned.

```solidity
function _createListing (
    address _seller,
    bytes32 _ipfsHash,    // IPFS JSON with details, pricing, availability
    uint _deposit,        // Deposit in Origin Token
    address _depositManager    // Address of listing depositManager
) private {
    /* require(_deposit > 0);   // Listings must deposit some amount of Origin Token   */
    require (_depositManager != 0x0, "Must specify depositManager");
    listings.push(Listing ({
        seller: _seller,
        deposit: _deposit,
        depositManager: _depositManager
    }));
    if (_deposit > 0) {
        tokenAddr.transferFrom(_seller, this, _deposit);    // Transfer Origin Token
    }
    emit ListingCreated(_seller, listings.length - 1, _ipfsHash);
}
```

*Figure 1: The internal `_createListing` function, used to create a listing by public methods.*

When a listing is subsequently withdrawn by the listing’s deposit manager, the amount of deposited OGN is transferred from the Marketplace’s account to an account of the deposit manager’s choosing:

```solidity
function withdrawListing(uint listingID, address _target, bytes32 _ipfsHash) public {
    Listing storage listing = listings[listingID];
    require(msg.sender == listing.depositManager, "Must be depositManager");
    require (_target != 0x0, "No target");
    tokenAddr.transfer(_target, listing.deposit);    // Send deposit to target
    emit ListingWithdrawn(_target, listingID, _ipfsHash);
}
```

*Figure 2: The public `withdrawListing` function, used to withdraw a listing.*

Because there is no check on whether a listing has been withdrawn previously, the withdrawal by the deposit manager can be repeated, draining the Marketplace OGN account balance.

### Exploit Scenario
Bob has an account with 20 OGN. The Marketplace contract has 100 OGN associated to its address. Bob approves the Marketplace contract to manage 20 of his account’s OGN. Bob then creates a listing with a deposit of 20 OGN, and assigns himself as the listing deposit manager. Bob subsequently withdraws the same listing 6 times into his account, resulting in Bob recovering the initially deposited 20 OGN and draining the Marketplace contract’s original 100 OGN.

### Recommendation
Define a method of flagging a listing as withdrawn. Check this flag is not set before performing a withdrawal.
