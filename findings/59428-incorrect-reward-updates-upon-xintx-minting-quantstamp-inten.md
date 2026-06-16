---
tags:
  - lang/solidity
  - sector/staking
  - platform/quantstamp
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[IntentX]]"
auditors:
  - "[[Mustafa Hasan]]"
report: "https://certificate.quantstamp.com/full/intent-x/a195e62f-30b6-4219-b9e5-42af8a9e2fd5/index.html"
genome:
  - "[[reward-calculation]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
---
# Incorrect Reward Updates upon xINTX Minting

- id: 59428
- impact: HIGH
- protocol: [[IntentX]]
- reporter: Mustafa Hasan (Quantstamp)
- source: https://certificate.quantstamp.com/full/intent-x/a195e62f-30b6-4219-b9e5-42af8a9e2fd5/index.html

## Summary


A recent update to the `StakedINTX.sol` file has been marked as "Fixed" by the client. The issue was addressed in a specific commit, `2a51fba4fcbba13c524b2b9ddbc736c8eadaf9ee`, and the client provided an explanation for the fix. The bug report highlights a problem with the `_stake()` function, where the `_tokenId` variable is not assigned a value before being used in the `_updateReward()` function. This results in `_tokenId` being passed as 0 to the function, which is not the intended behavior. The recommendation is to use `lastTokenId` instead, which would fix the issue.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `2a51fba4fcbba13c524b2b9ddbc736c8eadaf9ee`. The client provided the following explanation:

> Fixed using lastTokenId instead of _tokenId.

**File(s) affected:**`StakedINTX.sol`

**Description:** In the `_stake()` function, `_tokenId` is intended to serve as the unique identifier for the newly minted token. This ID is crucial for tracking and managing individual stakes within the smart contract. However, in the current implementation, `_tokenId` is not assigned any value before it is used in the `_updateReward(_tokenId)` call. This oversight leads to `_tokenId` being passed as 0 to the `_updateReward()` function, which is most likely not the intended behavior.

**Recommendation:** We assume the intended behavior was to pass `lastTokenId` to `_updateReward()`. This would fix the behavior.
