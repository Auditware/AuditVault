---
tags:
  - lang/solidity
  - platform/zachobront
  - has/github
  - severity/high
  - sector/dex
  - sector/governance
  - sector/launchpad
  - sector/nft
protocol: "[[Sound.Xyz]]"
auditors:
  - "[[Zach Obront]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/ZachObront/2023-03-01-Sound.xyz.md"
genome:
  - "[[fee-calculation]]"
  - "[[reward-theft]]"
  - "[[integer-bounds]]"
  - "[[timestamp-dependence]]"
  - "[[weak-randomness]]"
---
# [H-02] Golden Egg will continue to change throughout SAM

- id: 18724
- impact: HIGH
- protocol: [[Sound.Xyz]]
- reporter: Zach Obront (ZachObront)
- source: https://github.com/solodit/solodit_content/blob/main/reports/ZachObront/2023-03-01-Sound.xyz.md

## Summary


When a fixed price sale ends and a SAM begins, the Golden Egg is supposed to be locked. The Golden Egg is a token that is given to the winner of the sale, and they are paid a percentage of all sales from the bonding curve. The SAM.sol calls `goldenEggFeeRecipient()` which calls `getGoldenEggTokenId(edition)` on the metadata module and `ownerOf(tokenId)` on the token with the returned value. The metadata module used is `OpenGoldenEggMetadata.sol` which had an implementation of `getGoldenEggTokenId()` that calculated the tokenId between 1 and the `editionMaxMintable()`. The `editionMaxMintable()` was set to the total number of tokens that have been minted once the cutoff time is over. The problem was that the `editionMaxMintable()` continued to increment up with each additional SAM mint, changing the Golden Egg calculation and returning a different tokenId.

The recommendation was to capture a snapshot of total tokens minted the first time `samMint()` is called, and use that value for `editionMaxMintable()` going forward. This fix was confirmed in PR #17 and only applies to Editions that use `OpenGoldenEggMetadata.sol` as their metadata module. The Sound.xyz team has confirmed that `GoldenEggMetadata.sol` has been deprecated and this will not pose a risk.

## Details

When a fixed price sale ends and a SAM begins, the Golden Egg is supposed to be locked. The winner of the Golden Egg is confirmed, and this user is paid a percentage of all sales from the bonding curve.

In order to determine who to send these fees to, SAM.sol calls `goldenEggFeeRecipient()`, which:

- calls `getGoldenEggTokenId(edition)` on the metadata module
- calls `ownerOf(tokenId)` on the token with the returned value

For projects that are using a SAM, the metadata module will be `OpenGoldenEggMetadata.sol`, which has the following implementation of `getGoldenEggTokenId()`:

```solidity
function getGoldenEggTokenId(address edition) public view returns (uint256 tokenId) {
uint256 editionMaxMintable = ISoundEditionV1_1(edition).editionMaxMintable();
uint256 mintRandomness = ISoundEditionV1_1(edition).mintRandomness();

// If the `mintRandomness` is zero, it means that it has not been revealed,
// and the `tokenId` should be zero, which is non-existent for our editions,
// which token IDs start from 1.
if (mintRandomness != 0) {
// Calculate number between 1 and `editionMaxMintable`.
// `mintRandomness` is set during `edition.mint()`.
tokenId = (mintRandomness % editionMaxMintable) + 1;
}
}
```

This can be simplified as `(edition.mintRandomness() % edition.editionMaxMintable()) + 1`.

If we look at the implementation of `editionMaxMintable()`, we see:

```solidity
function editionMaxMintable() public view returns (uint32) {
if (block.timestamp < editionCutoffTime) {
return editionMaxMintableUpper;
} else {
return uint32(FixedPointMathLib.clamp(_totalMinted(), editionMaxMintableLower, editionMaxMintableUpper));
}
}
```

This specifies that, once the cutoff time is over, the function returns `_totalMinted()`, clamped by a minimum of `editionMaxMintableLower` and a maximum value of `editionMaxMintableUpper`.

`_totalMinted()` is a function from ERC721AUpgradeable.sol, which simply returns the total number of tokens that have been minted:

```solidity
function _totalMinted() internal view virtual returns (uint256) {
// Counter underflow is impossible as `_currentIndex` does not decrement,
// and it is initialized to `_startTokenId()`.
unchecked {
return ERC721AStorage.layout()._currentIndex - _startTokenId();
}
}
```

This function will continue to increment the total number of tokens minted as the bonding curve is used to mint additional tokens.

As a result, for any sale that goes to SAM before `editionMaxMintableUpper` has been reached, `editionMaxMintable()` will continue to increment up with each additional SAM mint, changing the Golden Egg calculation and returning a different tokenId.

This behavior will continue until `editionMaxMintableUpper` has been reached, at which point the value will be frozen.

**Recommendation**

Capture a snapshot of total tokens minted the first time `samMint()` is called, and use that value for `editionMaxMintable()` going forward.

**Review**

A snapshot was added the first time that `samMint()` is called, which grabs the total minted at that point. That value is used in place of `_totalMinted()` in calculating the `editionMaxMintable()` going forward.

Confirmed in [PR #17](https://github.com/soundxyz/sound-protocol-private/pull/17/).

Note: This fix ONLY solves the problem for Editions that use `OpenGoldenEggMetadata.sol` as their metadata module, not `GoldenEggMetadata.sol`. The Sound.xyz team has confirmed that `GoldenEggMetadata.sol` has been deprecated and this will not pose a risk.
