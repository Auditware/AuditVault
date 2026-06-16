---
tags:
  - lang/solidity
  - platform/consensys
  - has/github
  - severity/high
  - vuln/access-control/missing-modifier
  - impact/mev/frontrun
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
  - sector/zk
protocol: "[[Aligned Layer]]"
auditors:
  - "[[Martin Ortner]]"
report: "https://consensys.net/diligence/audits/2024/08/aligned-layer/"
genome:
  - "[[missing-modifier]]"
  - "[[frontrun]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[batch-item-auth]]"
  - "[[bridge-merkle-proof]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
---
# Public Visibility on checkMerkleRootAndVerifySignatures Allows for DOS Attacks and User Fund Loss ✓ Fixed

- id: 38363
- impact: HIGH
- protocol: [[Aligned Layer]]
- reporter: Martin Ortner (ConsenSys)
- source: https://consensys.net/diligence/audits/2024/08/aligned-layer/

## Summary


The bug report discusses an issue with the `checkMerkleRootAndVerifySignatures()` function in the `BatcherPaymentService` contract. This function is publicly accessible and does not have any restrictions for the user calling it. This means that anyone can call this function and manipulate the contract by validating signatures and deducting funds from user accounts. This can lead to users losing all their funds and legitimate transactions being reverted. The recommendation is to change the function's visibility and add checks for arguments to prevent this issue. This bug has been addressed in a recent update by changing the function name and visibility, and redeploying the contracts.

## Details

#### Resolution



Addressed with [yetanotherco/aligned\_layer\#801](https://github.com/yetanotherco/aligned_layer/pull/801) by changing the function name from `checkMerkleRootAndVerifySignatures` to `_checkMerkleRootAndVerifySignatures` and visibility from `public` to `private`. The function `verifySignatureAndDecreaseBalance` also had its name changed to `_verifySignatureAndDecreaseBalance` to follow style. The client provided the following statement:



> Visibility was changed to private, and private functions were refactored to start with \_ .
> Contracts were also redeployed in anvil.




#### Description


When a new task is created through `BatcherPaymentService`, the `createNewTask()` function is called with appropriate signature arguments to validate user submissions, subtract funds from their accounts, and ultimately create the task via a call to `AlignedLayerServiceManager.createNewTask()`.


However, the signature validation and balance adjustment happens in an intermediate function called `checkMerkleRootAndVerifySignatures()` which takes almost the same parameters:


**contracts/src/core/BatcherPaymentService.sol:L173\-L178**



```
function checkMerkleRootAndVerifySignatures(
    bytes32[] calldata leaves,
    bytes32 batchMerkleRoot,
    SignatureData[] calldata signatures,
    uint256 feePerProof
) public {

```
The issue is that this function is `public` with no modifiers, unlike `createNewTask()` which is both `onlyBatcher` and `whenNotPaused`. There are no further checks for `msg.sender`. As a result, any user can call `checkMerkleRootAndVerifySignatures()` directly with correct signature parameters by frontrunning the `createNewTask()` transaction, and the contract would validate the signatures and subtract user balances.


Two additional outcomes here are that:


* The user nonces are now updated, so those same signatures arguments that were taken can no longer be used, so the proper transaction that got frontran will be reverted in the same part of the code where the nonce got updated:


**contracts/src/core/BatcherPaymentService.sol:L248\-L249**



```
require(user_data.nonce == signatureData.nonce, "Invalid Nonce");
user_data.nonce++;

```
* The `feePerProof` argument is given directly in `checkMerkleRootAndVerifySignatures()`, so a malicious user can simply pick a large number to subtract all funds from user balances. Just as a note \- in `createNewTask()` the `feePerProof` argument is constructed from arguments by an authenticated called which is the batcher, so, while the resulting `feePerProof` could still be unfairly large, this is at least less possible from an authenticated called which has access to other admin\-like functionality on the contract.


The impact of this function’s visibility is that users may lose all their funds, and proper transactions can be reverted.


#### Recommendation


Adjust visibility and other argument checks on the `checkMerkleRootAndVerifySignatures()` function.
