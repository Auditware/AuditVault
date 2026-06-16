---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/token
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[carrotsmuggler]]"
report: "https://code4rena.com/reports/2024-02-tapioca"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# [H-04] Incorrect approval mechanism breaks all Magnetar functionality

- id: 32315
- impact: HIGH
- protocol: [[Tapioca DAO]]
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-02-tapioca

## Summary


The Magnetar contract is responsible for giving approvals to other contracts so they can use tokens held by the Magnetar contract. However, due to a change in the target contracts, the approvals given by Magnetar are incorrect and do not work with the new system. This issue can be seen in multiple instances throughout the codebase. To fix this, the Magnetar contract needs to be updated to give approvals using `permitC` instead of just the token itself or yieldbox. This can be verified by checking the Magnetar contract and the affected target contracts. 

## Details


The Magnetar contract hands out approvals to various contracts so that the target contracts can use any tokens held currently by the Magnetar contract.

The issue is that at some point of time, all the target contracts were refactored to use `permitC` to handle token transfers. However, this change wasn't reflected in the Magnetar contracts. Thus, instead of handing out `permitC` approvals, Magnetar hands out normal ERC20 approvals or yieldbox approvals. This essentially breaks the whole system.

There are numerous instances of this in the codebase. Essentially, almost every approval in the Magnetar contract is incorrect. Below are some examples, however the entire codebase needs to be checked for approvals and corrected.

The `_depositYBLendSGL` function in `MagnetarAssetCommonModule.sol` contract gives approval to the singularity contract via yieldbox. However, if we check the `_addTokens` function in the singularity contract below, we see the token transfers actually take place via `pearlmit`/`permitC`.

```solidity
_setApprovalForYieldBox(singularityAddress, yieldBox_);
```

<https://github.com/Tapioca-DAO/Tapioca-bar/blob/9d76b2fc7e2752ca8a816af2d748a0259af5ea42/contracts/markets/singularity/SGLCommon.sol#L165-L177>

Since the Magnetar contract does not give `permitC` approval to the singularity contract, and instead only gives yieldbox approval, the singularity contract is unable to transfer tokens from the Magnetar contract.

Similarly, in the `_wrapSglReceipt` function, the Magnetar gives approval to the TOFT contract vie ERC20 approval:

```solidity
IERC20(sgl).approve(tReceiptAddress, fraction);
```

But if we check the TOFT contract, we see the tokens are transferred via `permitC` and not with the raw tokens:

<https://github.com/Tapioca-DAO/TapiocaZ/blob/57750b7e997e5a1654651af9b413bbd5ea508f59/contracts/tOFT/BaseTOFT.sol#L73>

Since the Magnetar contract does not hand out the `permitC` approvals, most of the token transfers via Magnetar will fail.

### Proof of Concept

The issue arises due to the target contracts using `permitC`, while Magnetar only giving approvals of the token itself or yieldbox. This can be verified by checking the Magnetar contract and the target contracts, as shown above.

### Recommended Mitigation Steps

Refactor Magnetar to give approvals via `permitC` throughout.

**[cryptotechmaker (Tapioca) confirmed](https://github.com/code-423n4/2024-02-tapioca-findings/issues/125#issuecomment-2011767366)**

***
