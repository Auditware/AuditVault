---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/stable
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[LEND]]"
auditors:
  - Sa1ntRobi
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[token-decimal-normalization]]"
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# H-11: Users will lose funds due to token decimal mismatches across chains

- id: 58380
- impact: HIGH
- protocol: LEND
- reporter: Sa1ntRobi (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with cross-chain token transfers on a lending platform. The problem is caused by a lack of decimal normalization, which results in incorrect amounts being borrowed across chains with different token decimals. This can lead to significant financial losses for users. The bug occurs when a user calls the borrowCrossChain() function with a token that has different decimals on the source and destination chains. The protocol assumes that all tokens have the same decimals, leading to incorrect borrow amounts. The impact of this bug can be either massive overborrowing or tiny underborrowing, both of which can result in significant financial losses for users. The report suggests adding decimal normalization to the affected function as a mitigation strategy.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/665 

## Found by 
Kirkeelee, Sa1ntRobi, anchabadze, heavyw8t, yaioxy, zxriptor

### Summary

The lack of decimal normalization in cross-chain token transfers will cause users to lose significant funds, as borrowers will receive incorrect amounts when borrowing across chains with different token decimals.

### Root Cause

In [CrossChainRouter.sol:_handleBorrowCrossChainRequest()](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/713372a1ccd8090ead836ca6b1acf92e97de4679/Lend-V2/src/LayerZero/CrossChainRouter.sol#L581) and [CoreRouter.sol:borrowForCrossChain()](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/713372a1ccd8090ead836ca6b1acf92e97de4679/Lend-V2/src/LayerZero/CoreRouter.sol#L195C5-L205C6), the protocol assumes tokens have the same decimals across chains, but tokens like USDC have 6 decimals on Ethereum and 18 decimals on Base. The amount is passed directly through LayerZero without adjusting for these decimal differences, leading to incorrect borrow amounts.

### Internal Pre-conditions

1. User needs to call borrowCrossChain() with a token that has different decimals on source and destination chains
2. The token must be whitelisted and supported on both chains
3. User must have sufficient collateral on the source chain

### External Pre-conditions

Token decimals must differ between chains (e.g. USDC with 6 decimals on Ethereum and 18 decimals on Base)

### Attack Path

1. User calls borrowCrossChain() on Chain A to borrow 1000 USDC (6 decimals)
2. LayerZero delivers message to Chain B where USDC has 18 decimals
3. _handleBorrowCrossChainRequest() processes the amount directly
4. CoreRouter.borrowForCrossChain() transfers 1000 USDC (interpreted as 18 decimals)
5. User receives 1000e18 instead of 1000e6 USDC on Chain B

### Impact

The borrower receives 1000e18 instead of 1000e6 tokens, causing either:

- Massive overborrowing if decimals increase across chains
- Tiny underborrowing if decimals decrease across chains In both cases, users suffer significant financial losses.

### PoC

_No response_

### Mitigation

Add decimal normalization in `CrossChainRouter._handleBorrowCrossChainRequest()`
