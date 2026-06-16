---
tags:
  - lang/solidity
  - sector/nft
  - sector/stable
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/griefing
  - impact/loss-of-funds/direct-drain
  - fix/use-reentrancy-guard
  - novelty/variant
protocol: "[[TraitForge]]"
auditors:
  - "[[AvantGard]]"
report: "https://code4rena.com/reports/2024-07-traitforge"
genome:
  - "[[griefing]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
---
# [H-02] Griefing attack on seller's airdrop benefits

- id: 37916
- impact: HIGH
- protocol: [[TraitForge]]
- reporter: AvantGard (Code4rena)
- source: https://code4rena.com/reports/2024-07-traitforge

## Summary


The report discusses a bug in the TraitForge NFT contract, which allows new owners to burn or "nuke" the token, reducing the initial owner's airdrop benefits. This happens because the entropy value of the token is not transferred to the new owner during transfers or sales, and is only deducted from the initial owner's amount when the token is burned. This can lead to loss of funds for the initial owner. The report suggests introducing a check in the burn function to prevent this from happening. Some members of the team argue that this is not a valid issue, but the judges ultimately decide that it is in scope and should be fixed. 

## Details


<https://github.com/code-423n4/2024-07-traitforge/blob/279b2887e3d38bc219a05d332cbcb0655b2dc644/contracts/TraitForgeNft/TraitForgeNft.sol#L47> 

<https://github.com/code-423n4/2024-07-traitforge/blob/279b2887e3d38bc219a05d332cbcb0655b2dc644/contracts/TraitForgeNft/TraitForgeNft.sol#L148> 

<https://github.com/code-423n4/2024-07-traitforge/blob/279b2887e3d38bc219a05d332cbcb0655b2dc644/contracts/TraitForgeNft/TraitForgeNft.sol#L294> 

<https://github.com/code-423n4/2024-07-traitforge/blob/279b2887e3d38bc219a05d332cbcb0655b2dc644/contracts/TraitForgeNft/TraitForgeNft.sol#L329>

### Impact

TraitForge NFTs can be transferred and sold, but the new owner can burn or most likely nuke the token to reduce the the initial owner's airdrop benefits.

### Proof of Concept

When a user mints or forges a new token, they're set as the token's `initialOwner` and given airdrop benefits equal to the entropy of their newly minted token.

```solidity
  function _mintInternal(address to, uint256 mintPrice) internal {
//...
    initialOwners[newItemId] = to;

    if (!airdropContract.airdropStarted()) {
      airdropContract.addUserAmount(to, entropyValue);
    }
```

```solidity
  function _mintNewEntity(
    address newOwner,
    uint256 entropy,
    uint256 gen
  ) private returns (uint256) {
//...
    initialOwners[newTokenId] = newOwner;
//...
    if (!airdropContract.airdropStarted()) {
      airdropContract.addUserAmount(newOwner, entropy);
    }

    emit NewEntityMinted(newOwner, newTokenId, gen, entropy);
    return newTokenId;
  }
```

When burning, the entropy is then deducted from the `initialOwner`'s amount, but not removed when transfered or when the token is bought, which in another case could allow the owner to earn from minting airdrop and from token sale.

```solidity
  function burn(uint256 tokenId) external whenNotPaused nonReentrant {
//...
    if (!airdropContract.airdropStarted()) {
      uint256 entropy = getTokenEntropy(tokenId);
      airdropContract.subUserAmount(initialOwners[tokenId], entropy);
    }
//...
  }
```

However, a transferred or sold token can still be nuked or burned which directly reduces the initial owner's user amount causing loss of funds to the initial owner. Also by nuking, the nuker doesn't lose as much in the griefing attack compared to burning the token.

```solidity
  function nuke(uint256 tokenId) public whenNotPaused nonReentrant {
//...
    nftContract.burn(tokenId); // Burn the token
//...
  }
```

### Runnable POC

The gist link [here](https://gist.github.com/ZanyBonzy/cea1e654826391ca5fb797184ce6bd27) holds a test case that shows that airdrop amounts are not migrated to new owner during transfers/sales, and that by burning/nuking the token, the seller's airdrop amount can be successfully reduced.

The expected result should look like this:

*Note: to view the provided image, please see the original submission [here](https://github.com/code-423n4/2024-07-traitforge-findings/issues/227).*

### Recommended Mitigation Steps

Recommend introducing a check in the burn function that skips reducing user amount if the caller is the NukeFund contract or not the initial owner.

**[TForge1 (TraitForge) confirmed and commented](https://github.com/code-423n4/2024-07-traitforge-findings/issues/227#issuecomment-2279786163):**
 > Great find. We want to keep only minters/forgers as airdrop receivers, but yes, if they transfer or sell and that next person nukes, the `initialOwner` will lose entropy from their airdrop amount. This will be a real issue.

**[Koolex (judge) increased severity to High](https://github.com/code-423n4/2024-07-traitforge-findings/issues/227#issuecomment-2295295746)**

**[KupiaSec (warden) commented](https://github.com/code-423n4/2024-07-traitforge-findings/issues/227#issuecomment-2304530972):**
 > I think this issue is not valid. 
> 
> The documentation regarding the airdrop states that:
> > In the event that a player 'nukes' an entity, the entropy allocated by that entity is removed.
> 
> This implies that the incentive should be removed when an entity is nuked. Even if the new entity holder performs the nuke, the entropy allocated to that entity should be removed. Since the incentive assigned to that entity does not transfer during ownership changes, the original owner remains responsible for its burning.
> 
> Therefore, I believe this should be considered either a design choice or potentially a user error.

**[dimulski (warden) commented](https://github.com/code-423n4/2024-07-traitforge-findings/issues/227#issuecomment-2305325579):**
 > Hey @Koolex thanks for the swift judging! The Airdrop contract is not within the scope of this audit. The TraitForge contract doesn't inherit it, it just interacts with it in certain conditions - if the airdrop is started. Since all the logic that may cause some potential losses for the initial owner is in the Airdrop.sol contract, this issue is clearly out of scope and thus invalid.

**[ZanyBonzy (warden) commented](https://github.com/code-423n4/2024-07-traitforge-findings/issues/227#issuecomment-2305382574):**
> @KupiaSec - from the [docs](https://docs.google.com/document/d/1pihtkKyyxobFWdaNU4YfAy56Q7WIMbFJjSHUAfRm6BA/edit)
> > Everytime someone mints directly or forges to mint, they are recorded in the AirDrop Contract, alongside the entropy of the entity they minted. If they nuke, that allocation given by the entity is removed. 
> 
> Keyword here is "they" meaning the person doing the minting or the forging. In this case, the nuker is the buyer (or someone that the token is transferred to), someone who didn't do the minting nor the forging, and as a result, their actions shouldn't have to affect the original minter.
>
> @dimulski - I'd suggest reading the issue carefully again. The root cause is in the TraitForge/NukeFund contract, the fix is also in the NukeFund contract. The airdrop points just happen to be rewards being lost which is the impact. 

**[dimulski (warden) commented](https://github.com/code-423n4/2024-07-traitforge-findings/issues/227#issuecomment-2305416053):**
 > There are no points without the Airdrop contract, so what exactly should be fixed if the contract where the point distribution logic and their potential value is determined,  is out of scope? All the interactions with that contract should be considered OOS. This is not a USDC or some other ERC20 contract, the value of these points comes from the Airdrop contract.  Feel free to check the [SC](https://docs.code4rena.com/awarding/judging-criteria/supreme-court-decisions-fall-2023#verdict-fault-in-out-of-scope-library-impact-in-in-scope-contract-to-reward-or-not-to-reward) verdict on this type of situations. 

**[Koolex (judge) commented](https://github.com/code-423n4/2024-07-traitforge-findings/issues/227#issuecomment-2328570069):**
> Given that:
> - The bug is in scope since `mapping(uint256 => address) public initialOwners;` is used to track minters and forgers. Without tracking, no one will get airdrops even if the airdrop contract is ready and implemented.
> - Loss of funds to initial owners.
> 
> I believe the issue stands as is.

***
