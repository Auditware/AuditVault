---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/nft
protocol: "[[Fantium]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Fantium/Fantium/README.md#2-undefined-behavior-for-mint"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Undefined behavior for `mint`

- id: 28050
- impact: HIGH
- protocol: [[Fantium]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Fantium/Fantium/README.md#2-undefined-behavior-for-mint

## Summary


A bug has been reported in `FantiumMinterV1.mint()` which is a function used to mint a token to a given address. This function has a parameter `_to` which is intended to be the address of the owner of the minted token. However, the final mint is done for `msg.sender` instead of `_to`. This means that the owner of the minted token is not the one specified in the parameter but the one who sent the message. As a result, it is recommended to change the function to `fantiumNFTContract.mintTo(_to, thisTokenId);` so that the owner of the minted token is the one specified in the parameter.

## Details

##### Description

In `FantiumMinterV1.mint()`, param `_to` is intended to be `_to Address to be the minted token's owner`. It's wrong because the final mint will be for `msg.sender` (https://github.com/metaxu-art/fantium-smart-contracts/blob/cb2d97bc30c40321991fe5ab8fc798babba1610f/contracts/FantiumMinterV1.sol#L269).

```
## athlete -> 0x90F79bf6EB2c4f870365E785982E1f101E93b906
## fan -> 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
await minterContract.connect(fan).mint(athlete.address, 1, 
{ value: 100000000000000 });
console.log("ownerOf -> ", await nftContract.ownerOf(1000000)); 
## print fan -> 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
```

##### Recommendation

We recommend changing it: `fantiumNFTContract.mintTo(_to, thisTokenId);`
