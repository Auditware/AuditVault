---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/nft
protocol: "[[TraitForge]]"
auditors:
  - "[[inzinko]]"
report: "https://code4rena.com/reports/2024-07-traitforge"
genome:
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
---
# [H-06] `mintToken()`, `mintWithBudget()`, and `forge()` in the `TraitForgeNft` contract will fail due to a wrong modifier used in `EntropyGenerator.initializeAlphaIndices()`

- id: 37920
- impact: HIGH
- protocol: [[TraitForge]]
- reporter: inzinko (Code4rena)
- source: https://code4rena.com/reports/2024-07-traitforge

## Summary


The `EntropyGenerator` contract has a bug where the `initializeAlphaIndices()` function uses the wrong protection. This means that the function cannot be called by the intended contract and could cause issues with the system, particularly in scenarios where indices need to be updated. This could lead to a denial-of-service attack on certain functions. To fix this, the `onlyOwner` modifier should be replaced with `onlyAllowedCaller` in the `initializeAlphaIndices()` function. The bug has been confirmed and is related to access control.

## Details


The `EntropyGenerator` contract has an issue where the `initializeAlphaIndices()` function uses the wrong modifier. This function is supposed to be called by the `TraitForgeNft` contract, but it currently uses the `onlyOwner` modifier instead of `onlyAllowedCaller`.

### Impact

The `initializeAlphaIndices()` function will not be callable by the `TraitForgeNft` contract as intended. This could lead to failures in the expected functionality of the system, particularly in scenarios where the indices need to be initialized or updated by the `TraitForgeNft` contract while performing minting or forging. That means this vulnerability will cause DoS on `mintToken()`, `mintWithBudget()` and `forge()`.

### Proof of Concept

The function `initializeAlphaIndices()` is intended to be called by the `TraitForgeNft` contract. However, it is currently protected by the `onlyOwner` modifier. This means only the owner of the `EntropyGenerator` contract can call it, not the `TraitForgeNft` contract. The correct modifier should be `onlyAllowedCaller`, which restricts the function to be called by the address set as the `allowedCaller`.

The vulnerability lies in the following line of `EntropyGenerator` contract:

```solidity
@>  function initializeAlphaIndices() public whenNotPaused onlyOwner {
```

<https://github.com/code-423n4/2024-07-traitforge/blob/279b2887e3d38bc219a05d332cbcb0655b2dc644/contracts/EntropyGenerator/EntropyGenerator.sol#L206>

The above `initializeAlphaIndices()` is called by `TraitForgeNft._incrementGeneration()`:

```solidity
  function _incrementGeneration() private {
    require(
      generationMintCounts[currentGeneration] >= maxTokensPerGen,
      'Generation limit not yet reached'
    );
    currentGeneration++;
    generationMintCounts[currentGeneration] = 0;
    priceIncrement = priceIncrement + priceIncrementByGen;
@>  entropyGenerator.initializeAlphaIndices();
    emit GenerationIncremented(currentGeneration);
  }
```

<https://github.com/code-423n4/2024-07-traitforge/blob/279b2887e3d38bc219a05d332cbcb0655b2dc644/contracts/TraitForgeNft/TraitForgeNft.sol#L353>

Some of the important functions defined in `TraitForgeNft` contract, such as `mintToken()`, `mintWithBudget()` and `forge()`, internally use  `_incrementGeneration()`. Due to this vulnerability, the execution of these mentioned functions will fail.

### Recommended Mitigation Steps

Replace the `onlyOwner` modifier with the `onlyAllowedCaller` modifier in the `initializeAlphaIndices()` function to ensure it can be called by the `TraitForgeNft` contract.

```diff
- function initializeAlphaIndices() public whenNotPaused onlyOwner {
+ function initializeAlphaIndices() public whenNotPaused onlyAllowedCaller {
```

### Assessed type

Access Control

**[TForge1 (TraitForge) confirmed](https://github.com/code-423n4/2024-07-traitforge-findings/issues/213#event-13827212385)**

***
