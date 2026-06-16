---
tags:
  - lang/solidity
  - sector/nft
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/pda/reinitialization
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/initialize-proxy
protocol: "[[Vibe]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Vibe/README.md#1-potential-reinitialization-of-the-vibeerc721-contract"
genome:
  - "[[reinitialization]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[initializer-auth]]"
  - "[[pda-derivation]]"
---
# Potential reinitialization of the `VibeERC721` contract

- id: 27819
- impact: HIGH
- protocol: [[Vibe]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Vibe/README.md#1-potential-reinitialization-of-the-vibeerc721-contract

## Summary


A bug has been identified in the `VibeERC721` contract on the Ethereum blockchain. The `baseURI` field can be set to an empty string using the `changeBaseURI` function, which allows anyone to call the `init` function and claim ownership of the contract. To fix this issue, it is recommended to add a check to the `changeBaseURI` function that requires the `baseURI` field to have a length greater than 0.

## Details

##### Description
The `baseURI` field can be set to an empty string using the `changeBaseURI` function https://github.com/vibexyz/vibe-contract/blob/d08057edbaf83b00d94dcaca2a05e3c44a45e4d9/contracts/tokens/VibeERC721.sol#L223. It allows to call the `init` function by anyone and subsequently claim the ownership of the entire `VibeERC721` contract https://github.com/vibexyz/vibe-contract/blob/d08057edbaf83b00d94dcaca2a05e3c44a45e4d9/contracts/tokens/VibeERC721.sol#L79.

##### Recommendation
We recommend adding the following check to the `changeBaseURI` function:
`require(bytes(baseURI)_.length != 0);`

***
