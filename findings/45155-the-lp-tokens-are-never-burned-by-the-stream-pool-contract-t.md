---
tags:
  - lang/tact
  - platform/ton
  - severity/high
  - sector/dex
  - sector/stable
protocol: "[[PixelSwap DEX]]"
auditors:
  - "[[Guillermo Larregay]]"
  - "[[Tarun Bansal]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2024-12-pixelswap-dex-securityreview.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fot-slippage]]"
---

# The LP tokens are never burned by the Stream Pool contract

- id: 45155
- impact: HIGH
- protocol: PixelSwap DEX
- reporter: Guillermo Larregay, Tarun Bansal (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2024-12-pixelswap-dex-securityreview.pdf

## Summary

## Difficulty: Low

## Type: Data Validation

### Target: contracts/jetton/jetton_factory.tact

### Description

The `PixelswapStreamPool` contract sends the `burn` message to the Jetton master contract of the pair's LP token instead of the Jetton wallet owned by itself. This results in the LP tokens never being burned. Users remove their liquidity by transferring their LP tokens to the `PixelswapStreamPool` contract with a payload to send the `RemoveLiquidityJettonNotification` message to the `PixelswapStreamPool` contract. The `RemoveLiquidityJettonNotification` handler function of the Stream Pool contract updates the reserves and LP token supply stored in the `pair_config` map and calls the `self.burn` function. The `burn` function is inherited from the `JettonFactory` trait contract.

The `burn` function of the `JettonFactory` trait sends the `burn` message to the Jetton master contract of the LP token with the `bounce` flag set to `false`. The Jetton master contract reverts the transaction, and the `burn` message is never processed by the Jetton contracts of the LP token.

### Exploit Scenario

Alice adds 1,000,000,000 nanotons TON and 1,000,000,000 nanotons USDC to the pool and mints 1,000,000,000 nanotons LP tokens. After some time, Alice removes her liquidity by transferring her LP tokens to the `PixelswapStreamPool` contract, but the LP tokens are not burned by the Stream Pool contract, and the LP token balance of the Stream Pool contract is increased by 1,000,000,000 nanotons LP tokens.

### Recommendations

- **Short term**: Update the `burn` function of the `JettonFactory` trait contract to send the burn message to the Jetton wallet owned by the Stream Pool contract.
- **Long term**: Check the whole system state after a transaction in a test case to ensure correctness of the test cases.

### Fix Review Status

After conducting a fix review, the team determined that this issue has been resolved.
