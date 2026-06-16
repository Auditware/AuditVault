---
tags:
  - lang/solidity
  - sector/gaming
  - sector/lending
  - sector/nft
  - sector/nft-marketplace
  - sector/stable
  - platform/sigmaprime
  - has/github
  - has/poc
  - severity/high
  - fix/add-access-control
protocol: "[[Satori]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/satori-sports/satori-sports-token-royalties/review.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[add-access-control]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[access-roles]]"
  - "[[royalty-edge-cases]]"
---
# Abritrary Users Can Manipulate Profit Calculations

- id: 19565
- impact: HIGH
- protocol: [[Satori]] Sports
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/satori-sports/satori-sports-token-royalties/review.pdf

## Summary


The Royalties contract is used to track the royalties earned by stakeholders from the sale of an athlete's collectibles. This calculation is based on a set RoyaltiesConfig which requires a set of addresses corresponding to entities that take a share of the NFT sale. It is assumed that only the System Administrator can mint new athlete tokens and complete token purchases, and that royalties are calculated upon successful purchase and notification by Satori. 

However, there are edge cases where arbitrary users can create tokens and manipulate the royalties calculation of all deployments of the Royalties contract. This is because TokenFactory1155.createToken(IRoyalties _royalties) accepts any Royalties contract as an input parameter, and anyone who creates a token has the role type ROYALTIES_ROLE. Additionally, token owners are able to settle payment transactions off-chain and declare the purchase has been completed via the purchaseToken() function. 

A proof of concept was provided to demonstrate how a malicious user could make claims that payments have been settled even when assets have not been successfully purchased and paid for. This would result in an increase in royaltiesOwed.rollupTotal of all related parties in the royalties configuration. 

To prevent this, stricter access control is recommended for the TokenFactory.createToken() function, for example, by using the OwnableUpgradeable library on the factory contract and adding the modifier onlyOwner oncreateToken() . The issue has been fixed on commit 2227525.

## Details

## Description

The Royalties contract tracks royalties earned by stakeholders during the sale of an athlete’s collectibles. This calculation is based on a set `RoyaltiesConfig` which requires a set of addresses corresponding to entities that take a share by percentage (`royaltiesBPS`) of the NFT sale in `Token1155.purchaseToken()` and `TokenCollectibles721.purchaseToken()`. The protocol makes several critical assumptions with regards to access control, some of which can be bypassed to impact profit calculations, as follows:

1. **Satori System Administrator** is the only user who can mint new athlete tokens and complete token purchases. Therefore, the System Administrator is the only user who can directly impact the royalties calculation of an entity.
2. Royalties are calculated upon successful purchase (credit card payments) and notification by Satori (indicated by the `onlyOwner` modifier in the function `purchaseToken()` of `Token1155` and `TokenCollectibles721` contracts).
3. Satori will hold the custody of these tokens and manage the users’ credit card transactions and purchases of these tokens.

These assumptions have several unaccounted edge cases:

- `TokenFactory1155.createToken(IRoyalties _royalties)` accepts any Royalties contract as an input parameter. As the `TokenFactory1155` contract has the permissions needed to execute `_royalties.grantRoyaltiesTo(address(proxy))`, anyone who creates a token has the role type `ROYALTIES_ROLE`. Anyone who holds this role has the ability to impact the profit calculation of all deployments of the Royalties contract. As there is no access control on the `createToken()` function, any arbitrary user is capable of impacting any royalties calculated by the Satori smart contracts.
- Token owners are able to settle payment transactions off-chain and declare the purchase has been completed via the `purchaseToken()` function. Since anyone can create a token, anyone can make claims that payments have been settled. A malicious user could make these claims even when assets have not been successfully purchased and paid for. Satori may act as the custodian for some tokens and manage users' transactions, but this custodianship is not all-encompassing as some tokens can be created without any vetting from Satori.

## Proof of Concept

1. TokenA is created and then minted, with a normal `pricePerToken` that reflects 1 USDC per token by a vetted athlete or their custodian (e.g., Satori may do this on behalf of an athlete). The royalties of TokenA are tracked using `RoyaltiesA`.
2. An attacker (arbitrary user) creates an unvetted and unapproved TokenB through `TokenFactory.createToken()`. This TokenB points back to the royalties contract that tracks royalties for TokenA, namely `RoyaltiesA`. The attacker, who is the owner of TokenB, then mints tokens that have an arbitrarily high value of 1M USDC.
3. The attacker purchases their own token, namely TokenB, by calling `TokenB.purchaseToken()` with `_pendingPayment=false`. Through this transaction, the attacker manipulates the `RoyaltiesA` and increases `royaltiesOwed.rollupTotal` of all related parties in the royalties configuration.

   **Note:** As long as they are part of the entities in the original royalties contract, they will earn a share of this fake sale. This is not a requirement, however; malicious users who are not entities can use the same attack vector just to manipulate profit calculations.

## Recommendations

If arbitrary users are not supposed to impact the royalties calculation of any Royalties contract, they should not be able to create and mint tokens. The testing team recommends providing stricter access control for the `TokenFactory.createToken()`, for example, by using the `OwnableUpgradeable` library on the factory contract and adding the modifier `onlyOwner` on `createToken()`. Likewise, tokens owned by separate users should not impact royalty calculations unexpectedly for another user.

## Resolution

The issue has been fixed on commit `2227525`. The implemented fixes ensure that only the contract owner can call `createToken()`.
