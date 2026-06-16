---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/bridge/replay
  - novelty/variant
  - misassumption/bridge-is-secure
  - misassumption/signature-is-unique
  - fix/add-nonce
  - trigger/cross-chain-message
protocol: "[[Tenbin]]"
auditors:
  - "[[R0bert]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Tenbin-Spearbit-Security-Review-January-2026.pdf"
genome:
  - "[[replay]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
  - "[[permit-fork-replay]]"
  - "[[vote-delegation-loop]]"
---
# Redeem nonce mis-tracked enables replay

- id: 64973
- impact: HIGH
- protocol: [[Tenbin]]
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Tenbin-Spearbit-Security-Review-January-2026.pdf

## Summary


This report discusses a high risk security vulnerability found in the `Controller.sol` file, specifically in lines 306-307. The issue is related to the redeem flow, where the nonce is validated but not properly recorded, allowing for a replay attack. This means that a malicious user could repeatedly drain collateral and burn assets from the manager until balances or allowances are exhausted. The recommendation is to consume the nonce against the payer to match the verification key before external calls, or align nonce checks and storage to prevent replay attacks. The issue has been fixed in commit `d04a30df` by changing the redeem function to properly record the nonce.

## Details

## Security Vulnerability Report

## Severity
**High Risk**

## Context
*File:* `Controller.sol`  
*Lines:* 306-307  

## Description
The redeem flow validates `_verifyNonce(order.payer, order.nonce)` but then records usage as `nonces[signer][order.nonce] = true`. When a payer delegates a signer, the signer and payer differ, so the payer's nonce is never consumed. A delegated redeem signature can be replayed endlessly, each time passing nonce checks and executing the transfer and burn. 

### Example:
```solidity
function redeem(Order calldata order, Signature calldata signature) external onlyRole(MINTER_ROLE) {
    (address signer,) = verifyOrder(order, signature); // checks payer nonce
    nonces[signer][order.nonce] = true; // records signer nonce
    IERC20(order.collateral_token).safeTransferFrom(manager, order.recipient, order.collateral_amount);
    AssetToken(asset).burn(order.payer, order.asset_amount);
}
```

## Impact
A malicious relayer or delegated signer can loop the same redeem order to drain collateral from the manager and repeatedly burn the payer's assets until balances or allowances are exhausted.

## Recommendation
Consume the nonce against the payer to match the verification key, mirroring mint, e.g. `nonces[order.payer][order.nonce] = true;` before external calls, or otherwise align nonce checks and storage so a redeem signature cannot be replayed.

## Tenbin
Fixed in commit `d04a30df`.

## Spearbit
Fix verified. That commit changes redeem to mark `nonces[order.payer][order.nonce] = true` in `Controller.sol`, aligning storage with the payer-based nonce check.
