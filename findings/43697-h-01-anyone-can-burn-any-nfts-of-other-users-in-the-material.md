---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - sector/gaming
  - sector/nft
  - sector/options
protocol: "[[Phimaterial]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Shieldify/2023-07-27-PHIMaterial.md"
genome:
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[account-ownership]]"
---
# [H-01] Anyone Can Burn Any NFTs of Other Users in the `Material`, `UGC` and `Craft` Objects

- id: 43697
- impact: HIGH
- protocol: [[Phimaterial]]
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Shieldify/2023-07-27-PHIMaterial.md

## Summary


This bug report addresses a vulnerability in the `MaterialObject` and `CraftObject` contracts, which allow arbitrary users to destroy NFTs from any account. This can result in the unauthorized loss of digital assets. The report suggests implementing a check in the code to verify that the caller is the rightful owner of the NFT intended for burning. The team has acknowledged and fixed the issue by creating a whitelist functionality for craft logic and restricting the ability to call burn functions. They have also removed the `burnBatchObject` function from several contracts to prevent further issues.

## Details

**Severity**

High Risk

**Description**

The `MaterialObject` and `CraftObject` contracts represent distinct digital assets and the corresponding materials required for their creation, respectively. These assets can take various forms, such as in-game items or characters.

The same principle applies to the `UGCObject` contract, which enables users to generate their unique assets known as User Generated Content (UGC). These UGCObjects serve as materials and catalysts in `CraftLogic` recipes and are integrated into the Phi ecosystem.

The vulnerability permits arbitrary users to destroy NFTs from any account, potentially resulting in the unauthorized loss of these digital assets.

Based on the provided code, it appears that anyone can invoke the `burnObject` and `burnBatchObject` functions while specifying any account address from which to burn NFTs (digital assets). In a secure system, only the account holder should possess the ability to burn their own tokens. This creates a vulnerability whereby malicious users can burn NFTs belonging to other users without their consent.

**Location of Affected Code**

```solidity
// Function to burn an object
function burnObject(address from, uint256 tokenid, uint256 amount) external override {
    super._burn(from, tokenid, amount);
}

// Function to burn a batch of objects
function burnBatchObject(address from, uint256[] memory tokenids, uint256[] memory amounts) external override {
    super._burnBatch(from, tokenids, amounts);
}
```

**Recommendation**

To address this vulnerability, it is crucial to implement a check in the code to verify that the caller is the rightful owner of the NFT intended for burning. This verification ensures that only the NFT holder has the authority to burn their own NFTs, effectively preventing unauthorized users from burning NFTs they do not possess.

- If the function `burnObject` is called only external. Remove the `address from` parameter from `burnObject` function and put `msg.sender` as a parameter of `super._burn` function. The same goes for the `burnBatchObject` function.

`Example:`

```solidity
function burnObject(uint256 tokenid, uint256 amount) external override {
    super._burn(msg.sender, tokenid, amount);
}
```

- If the function `burnObject` is called only from other contracts like function `MaterialObject.burnObject` is called from `CraftLogic/UGCCraftLogic` contract. Add a modifier like `onlyCraftLogic` on `MaterialObject.burnObject` function and then in `CraftLogic/UGCCraftLogic` contracts call `MaterialObject.burnObject` with the parameter `from ` as `msg.sender`. The same goes for the `burnBatchObject` function.

`Example:`

File: `src/object/MaterialObject.sol`

```solidity
function burnObject(address from, uint256 tokenid, uint256 amount) external override onlyCraftLogic {
    super._burn(from, tokenid, amount);
}
```

File: `src/CraftLogic.sol`

```solidity
IMaterialObject(material.tokenAddress).burnObject(_msgSender(), material.tokenid, material.amount);
```

Note:

If you implement our second suggestion, consider calling the `burnBatchObject` function in the `CraftLogic/UGCCraftLogic` contracts as it is currently only called externally because if a modifier is added to call this function only from the `CraftLogic/UGCCraftLogic` contracts there will be no other option to call it.

Or remove `burnBatchObject` function from the three contracts `CraftObject.sol`, `MaterialObject.sol` and `UGCObject.sol`, if you are not going to call this function in `CraftLogic/UGCCraftLogic` contracts.

**Team Response**

Acknowledged and fixed by creating a whitelist functionality for craft logic, restricting calling burn functions and removed `burnBatchObject` function from the three contracts `CraftObject.sol`, `MaterialObject.sol` and `UGCObject.sol`.
