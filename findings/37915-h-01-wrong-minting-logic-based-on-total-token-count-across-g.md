---
tags:
  - lang/solidity
  - sector/nft
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[TraitForge]]"
auditors:
  - "[[inzinko]]"
report: "https://code4rena.com/reports/2024-07-traitforge"
genome:
  - "[[wrong-condition]]"
  - "[[use-reentrancy-guard]]"
  - "[[permanent]]"
  - "[[reentrancy-guard]]"
---
# [H-01] Wrong minting logic based on total token count across generations

- id: 37915
- impact: HIGH
- protocol: [[TraitForge]]
- reporter: inzinko (Code4rena)
- source: https://code4rena.com/reports/2024-07-traitforge

## Summary


The report is about a bug in the `TraitForgeNft` smart contract's `mintWithBudget` function. This function allows users to mint multiple tokens in one transaction if they have enough budget. However, the function incorrectly checks the total number of tokens minted across all generations instead of just the current generation. This can cause the minting process to stop before reaching the maximum number of tokens allowed for the current generation. The recommended solution is to use `generationMintCounts[currentGeneration]` instead of `_tokenIds` to track the number of tokens minted in the current generation. This bug falls under the category of "Invalid Validation" and has been confirmed by the TForge1 team. 

## Details


`TraitForgeNft::mintWithBudget` function is similar to `mintToken`, but allows users to mint multiple tokens in a single transaction if they have a budget exceeding the minting price for one token.
However, `_tokenIds` tracks the total number of tokens ever minted, not just the tokens in the current generation.

### Impact

In the current implementation, `_tokenIds` is used to control the minting process. The check while `(budgetLeft >= mintPrice && _tokenIds < maxTokensPerGen)` ensures that minting will stop when current generation minted tokens reaches `maxTokensPerGen`.
Instead of checking the number of tokens minted in the current generation, the function incorrectly checks the total number of tokens minted **across all generations** (`_tokenIds`).

### Proof of Concept

Here is the current implementation of the `mintWithBudget` function in the smart contract on [line 215](<https://github.com/code-423n4/2024-07-traitforge/blob/main/contracts/TraitForgeNft/TraitForgeNft.sol#L215>):

```javascript
TraitForgeNft.sol
202:   function mintWithBudget(
203:     bytes32[] calldata proof
204:   )
205:     public
206:     payable
207:     whenNotPaused
208:     nonReentrant
209:     onlyWhitelisted(proof, keccak256(abi.encodePacked(msg.sender)))
210:   {
211:     uint256 mintPrice = calculateMintPrice();
212:     uint256 amountMinted = 0;
213:     uint256 budgetLeft = msg.value;
214: 
215:     while (budgetLeft >= mintPrice && _tokenIds < maxTokensPerGen) { // @audit - _tokenIds counts total tokens minted, not just current generation
216:       _mintInternal(msg.sender, mintPrice);
217:       amountMinted++;
218:       budgetLeft -= mintPrice;
219:       mintPrice = calculateMintPrice();
220:     }
221:     if (budgetLeft > 0) {
222:       (bool refundSuccess, ) = msg.sender.call{ value: budgetLeft }('');
223:       require(refundSuccess, 'Refund failed.');
224:     }
225:   }
```

The function will not allow minting if `_tokenIds` is greater than `10,000`, which will happen after the 1st generation is fully minted.

### Recommended Mitigation Steps

Use `generationMintCounts[currentGeneration]` instead of `_tokenIds`:

```diff
- while (budgetLeft >= mintPrice && _tokenIds < maxTokensPerGen) {
+ while (budgetLeft >= mintPrice && generationMintCounts[currentGeneration] <= maxTokensPerGen) {
```

### Assessed type

Invalid Validation

**[TForge1 (TraitForge) confirmed](https://github.com/code-423n4/2024-07-traitforge-findings/issues/231#event-13827166613)**
***
