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
  - "[[upgradeable-contract]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
---
# OriginToken contract migration breaks Marketplace o�fer references

- id: 17100
- impact: HIGH
- protocol: [[Origin Protocol]]
- reporter: Robert Tonic (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/origin.pdf

## Summary


This bug report is about the Marketplace contract not updating references to the OriginToken contract address after a migration. As a result, users are unable to interact with the previously deployed OriginToken contract, and the Marketplace listing and offer operations are broken.

The exploit scenario is as follows: Alice creates a listing with a deposit in OriginToken on the Marketplace contract, and Charlie submits an offer for Alice's listing using OriginToken as the currency. The OriginToken contract is subsequently upgraded using the TokenMigration contract, which prevents the listing from completing, thus Charlie's offer funds and Alice's deposit are unrecoverable.

The short-term recommendation is for the Marketplace contract to have a mechanism for updating the contract address being used for listing deposits and offer currency. Validation should occur to ensure offers and listings are completable after this update. The long-term recommendation is to develop and test a migration strategy for both the OriginToken and Marketplace contracts.

## Details

## Data Validation

**Target:** origin-contracts/contracts/marketplace/v00/Marketplace.sol

**Difficulty:** Low

## Description
The OriginToken has a TokenMigration contract which performs a migration of balances from the previous version of the OriginToken to the newly deployed contract. During the migration, users are unable to interact with the previously deployed OriginToken; the contract is in a paused state. While users may resume operations on the newly deployed OriginToken after migration, the Marketplace contract does not update the references to the previously deployed OriginToken address to the newly deployed address, resulting in broken functionality for listings and offers.

After migration, the previous OriginToken contract remains in a paused state. This breaks the Marketplace listing and offer operations since no entity can perform operations involving the previous-paused-OriginToken contract. If the previous contract is subsequently unpaused, the listings and offers can be finalized, but the operations would be performed on the previous OriginToken, which is no longer relevant.

## Exploit Scenario
Alice creates a listing with a deposit in OriginToken on the Marketplace contract. Charlie submits an offer for Alice’s listing using OriginToken as the currency. The OriginToken contract is subsequently upgraded using the TokenMigration contract. The upgrade prevents the listing from completing; thus, Charlie’s offer funds and Alice’s deposit are unrecoverable.

## Recommendation
Short term, the Marketplace contract should have a mechanism for updating the contract address being used for listing deposits and offer currency. Validation should occur to ensure offers and listings are completable after this update.

Long term, develop and test a migration strategy for both the OriginToken and Marketplace contracts.
