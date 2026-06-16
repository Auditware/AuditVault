---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/stable
  - platform/sherlock
protocol: "[[LEND]]"
auditors:
  - 0xbakeng
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[commitment-uniqueness]]"
  - "[[cross-contract-state-consistency]]"
  - "[[logic/missing-check]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[multi-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/protocol-wide]]"
---
# H-20: Multiple Cross-Chain borrows using same collateral

- id: 58389
- impact: HIGH
- protocol: LEND
- reporter: 0xbakeng (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue found by several users in the LayerZero V2 protocol. The problem is that the protocol does not lock the collateral before sending a cross-chain borrow request. This allows users to initiate multiple requests on different chains using the same collateral, resulting in loans exceeding the collateral's capacity and causing significant financial loss to the protocol. The root cause is a missing step in the `CrossChainRouter` code, and there are several internal and external conditions that must be met for the bug to occur. The attack path is explained, and the impact is described as potentially catastrophic. A proof of concept is provided to demonstrate the issue, and a mitigation strategy is suggested to fix the bug. 

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/851 

## Found by 
0xDgiin, 0xEkko, 0xbakeng, 0xgee, 4n0nx, Aenovir, PNS, Tychai0s, dystopia, future, gkrastenov, lazyrams352, patitonar, pv, realsungs, theweb3mechanic, xiaoming90

## Summary
The failure to lock collateral in `borrowCrossChain` before sending cross-chain borrow requests via LayerZero V2 enables users to initiate multiple borrow requests on different chains (e.g., Chain B and Chain C) using the same collateral on Chain A, resulting in loans exceeding the collateral’s capacity and significant protocol loss.

## Root Cause
In `CrossChainRouter.sol` within the `borrowCrossChain` function, the collateral amount is calculated but not locked in `lendStorage` before sending a borrow request via `_lzSend`. The collateral is only registered in `_handleValidBorrowRequest` after receiving confirmation from the destination chain, allowing multiple requests to use the same collateral concurrently.

[CrossChainRouter.borrowCrossChain](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/713372a1ccd8090ead836ca6b1acf92e97de4679/Lend-V2/src/LayerZero/CrossChainRouter.sol#L113-L113)

## Internal Pre-conditions
1. The user needs to have sufficient collateral on Chain A (e.g., $1000 USDC in an lToken pool).
2. The protocol needs to support cross-chain borrowing on at least two destination chains (e.g., Chain B and Chain C).
3. The lToken pools on destination chains need to have sufficient liquidity to process borrow requests.
4. The collateral factor (e.g., 75%) needs to allow significant borrowing relative to the collateral.

## External Pre-conditions
1. The underlying token prices (e.g., USDC) need to remain stable to ensure consistent collateral and borrow valuations.
2. The LayerZero V2 network needs to process messages with minimal delay to allow rapid request submission.

## Attack Path
1. A user with 1000 USDC collateral on Chain A calls `borrowCrossChain` twice in the same block:
   - Request 1: Borrow 750 USDC on Chain B.
   - Request 2: Borrow 750 USDC on Chain C.
2. Both requests use `getHypotheticalAccountLiquidityCollateral`, which reports 1000 USDC collateral, as no borrow is yet registered.
3. Chain B receives the request, verifies `payload.collateral` (1000 USDC) >= 750 USDC, and executes `borrowForCrossChain`, transferring 750 USDC to the user.
4. Chain C does the same, transferring another 750 USDC.
5. Both chains send `ValidBorrowRequest` messages back to Chain A, which registers two borrows totaling 1500 USDC in `_handleValidBorrowRequest`.
6. User does not repay the debt and sacrifices the collateral, leaving with $500 in profit.

## Impact
The protocol suffers a significant financial loss by granting loans exceeding the collateral’s capacity (e.g., $750 loss for 1500 USDC borrowed against 1000 USDC collateral). The issue scales with the number of chains, potentially leading to catastrophic losses (e.g., 7500 USDC for 10 chains).

## PoC
The issue can be demonstrated as follows:
- Deploy Lend-V2 on three chains: Chain A (collateral), Chain B, and Chain C (borrowing). A user supplies 1000 USDC collateral on Chain A in an lToken pool with a 75% collateral factor.
- The user calls `borrowCrossChain` twice in one block:
  - Chain B: 750 USDC borrow.
  - Chain C: 750 USDC borrow.
- `getHypotheticalAccountLiquidityCollateral` returns 1000 USDC collateral for both requests, as no borrow is registered.
- Chain B verifies `payload.collateral` (1000 USDC) >= 750 USDC, executes `borrowForCrossChain`, and transfers 750 USDC.
- Chain C does the same, transferring 750 USDC.
- Chain A receives `ValidBorrowRequest` messages, registering 1500 USDC total borrow.
- For a $10,000 collateral, the loss is $7500 across two chains (75% loss).

## Mitigation
Lock the collateral in `lendStorage` before sending the borrow request in `borrowCrossChain` by tracking pending borrow requests and deducting their collateral impact. Use a nonce-based lock to prevent concurrent requests for the same collateral. 
In `_handleValidBorrowRequest`, clear the pending borrow lock after registering the borrow. Add a check in `borrowCrossChain` to prevent new requests if a pending borrow exists for the same user and collateral.
