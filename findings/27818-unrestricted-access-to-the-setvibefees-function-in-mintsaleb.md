---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Vibe]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Vibe/README.md#1-unrestricted-access-to-the-setvibefees-function-in-mintsalebase"
genome:
  - "[[missing-modifier]]"
  - "[[access-roles]]"
  - "[[permanent]]"
---
# Unrestricted access to the `setVibeFees` function in `MintSaleBase`

- id: 27818
- impact: HIGH
- protocol: [[Vibe]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Vibe/README.md#1-unrestricted-access-to-the-setvibefees-function-in-mintsalebase

## Summary


A vulnerability has been found in the `MintSaleBase` contract, which is part of the VibeXYZ project. The `setVibeFees` function within the contract is protected by the `onlyMasterContractOwner` modifier, which prevents anyone other than the owner of the master contract from calling the function. However, anyone can call this function if the contract is the implementation contract itself, meaning it has no master contract.

This vulnerability allows an exploiter to monitor the deployment transactions of the `MintSaleBase` inheritor contracts and submit their transaction before deployment. As a result, the exploiter can set the `vibeTreasury` field to their address and arbitrarily increase the value of the `feeTake` field. This causes the owner of the `masterContract` to reset the values back and re-establish the `fee` parameters of the affected copy.

To fix this issue, the developers of the VibeXYZ project recommend adding a require statement to the `onlyMasterContractOwner` modifier. This statement would verify if the contract doesn't have a master contract and, in such cases, only the owner of the contract should be allowed to pass this modifier. The proposed statement is available in the link provided in the report.

## Details

##### Description
The `setVibeFees` function within the `MintSaleBase` contract is protected by the `onlyMasterContractOwner` modifier. However, anyone can call this function if the contract is the implementation contract itself, meaning it has no master contract. An exploiter via this vulnerability can monitor the deployment transactions of the `MintSaleBase` inheritor contracts and submit their transaction before deployment, thereby setting the `vibeTreasury` field to their address and arbitrarily increasing the value of the `feeTake` field. Consequently, the owner of the `masterContract` must reset the values back and re-establish the `fee` parameters of the affected copy.

##### Recommendation
We recommend adding the following require statement to the `onlyMasterContractOwner` modifier that verifies if the contract doesn't have a master contract. In such cases, only the owner of the contract should be allowed to pass this modifier. We propose adding the following line here: [https://github.com/vibexyz/vibe-contract/blob/d08057edbaf83b00d94dcaca2a05e3c44a45e4d9/contracts/mint/MintSaleBase.sol#L69]
```solidity
require(msg.sender == owner())
```

***
