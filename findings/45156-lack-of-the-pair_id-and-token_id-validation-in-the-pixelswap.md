---
tags:
  - lang/tact
  - sector/account
  - sector/dex
  - sector/stable
  - platform/ton
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[PixelSwap DEX]]"
auditors:
  - "[[Guillermo Larregay]]"
  - "[[Tarun Bansal]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2024-12-pixelswap-dex-securityreview.pdf"
genome:
  - "[[missing-owner-check]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fot-slippage]]"
---

# Lack of the pair_id and token_id validation in the PixelswapStreamPool contract

- id: 45156
- impact: HIGH
- protocol: PixelSwap DEX
- reporter: Guillermo Larregay, Tarun Bansal (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2024-12-pixelswap-dex-securityreview.pdf

## Summary

## Difficulty: High

## Type: Data Validation

## Target: contracts/pixelswap_streampool.tact

### Description
The `PlaceOrder` message receiver function of the `PixelswapStreamPool` contract does not validate that the `pair_id` specified in the message corresponds to the `token_id` values specified in the message. This allows users to provide arbitrary `token_id` values to execute a swap or add liquidity to a pair without transferring the required tokens.

The protocol allows users to transfer their Jettons and execute a protocol action in a single transaction by specifying order parameters in the `forward_payload` field of the transfer message of the Jetton contract. The Jetton contract sends the `OrderJettonNotification` message to the settlement contract, which adds a deposit to the user's funding wallet, executes a swap, or adds liquidity to the specified pair based on the `forward_payload` value specified in the `OrderJettonNotification` message.

However, the `OrderJettonNotification` message receiver cannot verify that the message is sent by the correct Jetton wallet contract and is not sent by a malicious actor; it considers the sender as the `token_id` for the order to be executed. This allows users to add a funding wallet balance for an arbitrary `token_id`, execute a swap without transferring Jettons, and add liquidity to a pool without transferring Jettons by sending the `OrderJettonNotification` message from an arbitrary address.

[Redacted]

As a result, the `PlaceOrder` message receiver function of the `PixelswapStreamPool` contract does not check if the user-provided value of the `pair_id` field corresponds to the `token_id` values provided in the `PlaceOrder` message. This allows attackers to send the `OrderJettonNotification` message from an arbitrary address to steal tokens from the settlement contract.

### Exploit Scenario 1
Eve sends an `OrderJettonNotification` message from her smart wallet to swap USDC for TON from the TON/USDC pool. The order is executed successfully, and Eve gets free TON from the settlement contract.

### Exploit Scenario 2
Eve sends an `OrderJettonNotification` message from her smart wallet to deposit a fake Jetton to her funding wallet. She then sends a `PlaceOrder` message to swap USDC for TON by specifying the fake Jetton as input token `token_id` and TON/USDC pair `pair_id`. The order is executed successfully, and Eve gets free TON from the settlement contract.

### Recommendations
- **Short term:** Validate that the `pair_id` specified in the `PlaceOrder` message corresponds to the provided `token_id` values to ensure correct token transfers before executing an order.
- **Long term:** Validate all user inputs at all of the system's entrypoints to ensure the correctness and security of the system.

### Fix Review Status
After conducting a fix review, the team determined that this issue has been resolved.
