---
tags:
  - lang/solidity
  - sector/dex
  - sector/nft
  - sector/stable
  - sector/staking
  - platform/cantina
  - has/poc
  - severity/high
  - impact/mev/frontrun
protocol: "[[Sweep n Flip]]"
auditors:
  - "[[slowfi]]"
report: "https://cdn.cantina.xyz/reports/cantina_sweepnflip_nft_amm_november2024.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[frontrun]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[vote-delegation-loop]]"
---
# Premature createPair function call will result in the creation of unusable delegation pairs 

- id: 46466
- impact: HIGH
- protocol: [[Sweep n Flip]]
- reporter: slowfi (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_sweepnflip_nft_amm_november2024.pdf

## Summary


The report discusses a bug in the UniswapV2Factory.sol contract, where an attacker can create stale trading pairs by precomputing the wrapper address for a specific ERC721 collection. This can lead to a denial of service for legitimate token pairs and can be disastrous for the protocol. The vulnerability can be exploited by identifying a target NFT collection, precomputing the wrapper address, and front-running the wrapper creation process. The impact of this bug can be reduced by verifying the pair address and merging two function calls into one. The bug has been fixed in the uniswap-v2-nft PR 5 and has been verified by Cantina Managed. The risk level of this bug is medium.

## Details

## UniswapV2Factory Vulnerability Analysis

## Context
**UniswapV2Factory.sol#L40**

## Description
Users use the `createPair` function of `UniswapV2Factory.sol` to create new trading pairs. This function allows the users to create a pair in sweep-n-flip or delegate such creation to external DEXes if the two input tokens are not ERC721 wrappers created using the `createWrapper` function. Hence, the ideal flow is that for any ERC721 collection, the users should call the `createWrapper` function in the `UniswapV2Factory.sol` contract to deploy a wrapper, and later call the `createPair` function for creating trading pairs.

The vulnerability here is that the wrapper address deployed by the `UniswapV2Factory.sol` for any ERC721 collection is predictable and can be precomputed. Thus, an attacker can leverage this to create stale pairs and block them from being traded on the platform.

## Attack Workflow:
- Identify target NFT collection.
- Precompute wrapper address.
- Front-run wrapper creation by calling `createPair`.
- Create a pair on the delegated DEX and mark them as delegated in the factory contract.
- Prevent legitimate use of the pair.

## Impact:
- Denial of service for legitimate token pairs. As there are only a handful of ERC721 tokens, even creating ten transactions for the top 10 NFTs can be disastrous to the protocol.

## Proof of Concept:
The proof of concept below explains how the vulnerability could lead to creating a pair on a delegated DEX (e.g., Sushiswap) instead of the protocol for a valid NFT contract and incorrectly updates the delegates mapping.

```solidity
function computeWrapperAddress(address collection) internal view returns (address) {
    bytes32 salt = keccak256(abi.encodePacked(collection));
    bytes32 bytecodeHash = keccak256(type(WERC721).creationCode);
    return address(uint160(uint(keccak256(abi.encodePacked(
        bytes1(0xff),
        address(factory),
        salt,
        bytecodeHash
    )))));
}

function test_createCompulsoryDelegate() public {
    address precomputedWrapper = computeWrapperAddress(address(apes));
    address pair = factory.createPair(address(usdc), address(precomputedWrapper));
    address realWrapper = factory.createWrapper(address(apes));
    assertEq(factory.delegates(address(usdc), address(precomputedWrapper)), true);
    assertEq(precomputedWrapper, realWrapper);
}
```

## Recommendation:
- The issue can be resolved by verifying if the pair address provided is associated with the bytecode.
- Alternatively, you can merge the two function calls into one. During the `createPair` function, use the `supportsInterface` method to determine the contract type. If it is identified as ERC721, create a wrapper and utilize that for generating pairs.

## Additional Information
**Sweep n' Flip:** Fixed in uniswap-v2-nft PR 5  
**Cantina Managed:** Verified fix.
