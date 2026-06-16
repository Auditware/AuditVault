---
tags:
  - lang/solidity
  - sector/bridge
  - sector/dex
  - sector/wallet
  - platform/spearbit
  - has/github
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Uniswap]]"
auditors:
  - "[[Philogy]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Uniswap-The-Compact-Spearbit-Security-Review-May-2025.pdf"
genome:
  - "[[price-calculation]]"
  - "[[defi/price-manipulation]]"
  - "[[locked-funds]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
---
# MultichainCompact and BatchCompact incompatible with ERC712 due to incorrect hashing

- id: 61281
- impact: HIGH
- protocol: [[Uniswap]]: The Compact
- reporter: Philogy (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Uniswap-The-Compact-Spearbit-Security-Review-May-2025.pdf

## Summary


The report discusses a problem with a code called HashLib.sol. This code is supposed to work with popular wallets like MetaMask, but it has a bug that makes it incompatible with these wallets. The bug is related to how the code handles a specific type of data, and it can cause problems for users trying to sign messages for the contract. This bug has been identified as a high-risk issue, but it has been deemed "Medium" in terms of impact because it does not allow for theft or destruction of user or protocol funds. The report recommends fixing the code or redefining the type of data it uses. The bug has been fixed by Uniswap Labs and verified by Spearbit.

## Details

## Security Assessment Report

## Severity: High Risk

### Context
- **HashLib.sol**: Lines 527-543, 556-584, 591-620

### Description
In order to work with major wallets like MetaMask, the Compact aims to be ERC712 compatible so that users can easily and directly sign messages for the contract. However, due to incorrect handling of `idsAndAmounts: uint256[2][]` across the two types, they are not compatible.

Specifically, in the ERC712 standard, it is specified that to encode arrays for the struct hash:  
The array values are encoded as the `keccak256` hash of the concatenated `encodeData` of their contents (i.e., the encoding of `SomeType[5]` is identical to that of a struct containing five members of type `SomeType`).  
However, in both cases, the Compact simply hashes the flattened array instead of first hashing the inner `uint256[2]` arrays and then hashing the concatenated list of hashes to derive the commitment of `uint256[2][] idsAndAmounts`.

### Impact
While the hashing is incorrect and will not be compatible with major wallets (and therefore will be practically unavailable to most users), it is sound in its current state. It is sound in the sense that for custom wallets/signers, if they do produce a signature following this non-standard hashing scheme, it will not allow for collisions against other message digests, fulfilling the original purposes of the standard. This is why the impact has been deemed "Medium"; it makes major functionality practically inaccessible but does not fundamentally allow for the theft or destruction of user or protocol funds.

### Recommendation
Fix the hashing implementations or redefine the type to just use a flat `uint256[]` array enforcing that the length is a multiple of 2.

### Resolution Status
- **Uniswap Labs**: Fixed in commit `cda33d86`.
- **Spearbit**: Fix verified.
