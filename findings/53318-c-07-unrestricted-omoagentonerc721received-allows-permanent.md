---
tags:
  - lang/solidity
  - sector/nft
  - has/github
  - severity/high
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[dos-resistance]]"
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[locked-funds]]"
  - "[[known-pattern]]"
---
# [C-07] Unrestricted `OmoAgent.onERC721Received()` allows permanent DoS and stuck funds

- id: 53318
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


This bug report discusses a problem with the `OmoAgent.onERC721Received()` function. This function is meant to be triggered when an NFT is transferred to the contract using the `safeTransferFrom()` method, but instead, the `depositPosition()` function incorrectly uses `transferFrom()`. This means that the `onERC721Received()` function is never triggered during legitimate deposits. This bug has a high impact and likelihood, as it can lead to a permanent denial of service (DoS) attack, out-of-gas (OOG) errors, and a breakdown of protocol functionalities. The recommendation is to remove the `depositPosition()` function from `onERC721Received()` and handle the logic separately.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

- The `OmoAgent.onERC721Received()` function is intended to be invoked when an NFT is transferred to the contract using the `safeTransferFrom()` method, however, the `depositPosition()` function incorrectly transfers NFTs using `transferFrom()`, meaning that this hook is never triggered during legitimate deposits:

```javascript
   function onERC721Received(
        address,
        address,
        uint256 tokenId,
        bytes calldata
    ) external returns (bytes4) {
        // if (msg.sender == OmoAgentStorage.data().positionManager) {
        _addPositionId(tokenId);
        // }
        return this.onERC721Received.selector;
    }
```

- **Despite this**, `onERC721Received()` is callable by **any** address, leading to:

1. **Permanent DoS of `depositPosition()`**:

   - any attacker can call `onERC721Received()` with arbitrary token IDs.
   - these token IDs will be added to `ownedPositions` and `_positionIds`.
   - when an agent attempts to deposit a valid position ID, the transaction will revert with `"Position already tracked"`.

2. **Out-of-Gas (OOG) due to storage bloat**:

   - attackers can continuously add token IDs, inflating `_positionIds` and `ownedPositions` mappings.
   - this will cause an **OOG error** when looping over `_positionIds` in `topOffToAgent()` and `getPositionValue()`.

3. **Complete breakdown of protocol functionalities**:
   - **Stuck funds**: agents will be unable to retrieve deposited positions due to `topOffToAgent()` failing.
   - **Vault disruption**: if this dynamic account is registered in `OmoVault`, calls to `OmoVault.getAssets()` will fail, permanently disabling the vault, as there's no functionality to remove malicious or compromised agents from the `OmoVault` contract.

## Recommendation

Remove `depositPosition()` from `OmoAgent.onERC721Received()`, as the logic of adding an NFT position is handled by `depositPosition()` function.
