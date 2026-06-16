---
tags:
  - lang/solidity
  - sector/dex
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/access-control/missing-modifier
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/admin-is-honest
  - misassumption/external-call-is-safe
  - fix/add-access-control
  - trigger/reentrancy-callback
protocol: "[[Trustswap]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-08-TrustSwap.md"
genome:
  - "[[missing-modifier]]"
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[reentrancy-guard]]"
---
# Reentrancy in main functions.

- id: 57521
- impact: HIGH
- protocol: [[Trustswap]]
- reporter: ZOKYO (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-08-TrustSwap.md

## Summary


The bug report is about a smart contract called LockToken.sol which has four functions that are causing issues. These functions are withdrawTokens(), migrate(), lockNFTs(), and lockTokens(). The problem is that they are making external calls before writing certain state variables, which can lead to unexpected behavior. The recommendation is to use a modifier called nonReentrant() from the OpenZeppelin ReentrancyGuard contract to fix this issue. This issue has been resolved in a re-audit. 

## Details

**Description**

LockToken.sol:

1. withdraw Tokens(). External calls of .safeTransferFrom() on line 345, .transfer() on line 364, .burn() on lines 349 and 367 before writing of the nftMinted[_id] state variable with the false value on lines 350 and 368 respectively.
2. migrate(). External calls of .createAndInitialize PoollfNecessary(), v3Migrator.migrate(), .transfer(), and so on before writing of the state variables with_removeERC20Deposit(), and so on.
3. lockNFTs(). External calls of .safe TransferFrom(), .mintLiquidityLockNFT() before writing of a lot of state variables.
4. lockTokens(). Similarly to the function lockNFTs().

**Recommendation**

Use the nonReentrant() modifier from the OpenZeppelin ReentrancyGuard contract for these functions.

**Re-audit comment**

Resolved
