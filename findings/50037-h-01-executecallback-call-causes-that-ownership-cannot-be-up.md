---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/nft
protocol: "[[NFTMirror]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/NFTMirror-security-review_2024-12-30.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[logic/incorrect-state-transition]]"
  - "[[data-integrity/wrong-state]]"
  - "[[known-pattern]]"
  - "[[cross-chain-message]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-user]]"
---
# [H-01] `executeCallback` call causes that ownership cannot be updated on the base chain

- id: 50037
- impact: HIGH
- protocol: NFTMirror_2024-12-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/NFTMirror-security-review_2024-12-30.md

## Summary


This bug report discusses a problem with the `Beacon.triggerOwnershipUpdate()` function. When this function is called, it is supposed to update the ownership of tokens on the source chain. However, there is an issue where the `shadowAddress` is incorrect, causing the function to fail and the ownership cannot be updated. The recommendation is to add a condition to only execute the `executeCallback` function if the transaction is not on the NFT's native chain.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

When `Beacon.triggerOwnershipUpdate()` is called, the new owners of the tokens are read from the target chain, and `Beacon._updateOwnership()` is executed on the source chain to update the ownership.

When this is executed on the NFT's native chain, `shadowAddress` is the address of the NFT contract, not the NFTShadow contract. As such, when `_shadow.executeCallback(guid)` is called at the end of the function, the transaction will revert, as the NFT contract does not have the `executeCallback` function.

```solidity
564:    function _updateOwnership(bytes calldata _message, bytes32 guid) internal {
565:        (address shadowAddress, address[] memory staleOwners, address[] memory newOwners, uint256[] memory tokenIds) =
566:            abi.decode(_message, (address, address[], address[], uint256[]));
    (...)
575:        INFTShadow _shadow = INFTShadow(shadowAddress);
    (...)
595:        _shadow.executeCallback(guid);
596:    }
```

As a result, the ownership cannot be updated on the native chain.

## Recommendations

```diff
-    _shadow.executeCallback(guid);
+    if (!isNative) _shadow.executeCallback(guid);
```
