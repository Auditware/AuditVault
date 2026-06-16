---
tags:
  - lang/solidity
  - sector/bridge
  - sector/dex
  - platform/quantstamp
  - severity/high
  - novelty/known-pattern
protocol: "[[Boba 1 (Bridges And LP Floating Fee)]]"
auditors:
  - "[[Pavel Shabarkin]]"
report: "https://certificate.quantstamp.com/full/boba-1-bridges-and-lp-floating-fee/1e5a1e09-bde0-417d-83cd-083234b1409c/index.html"
genome:
  - "[[overflow]]"
  - "[[indirect-loss]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Native Tokens From the L1 Liquidity Pools Could Be Drained Depending on the Compiler Version Used

- id: 60700
- impact: HIGH
- protocol: Boba 1 (Bridges and LP floating fee)
- reporter: Pavel Shabarkin (Quantstamp)
- source: https://certificate.quantstamp.com/full/boba-1-bridges-and-lp-floating-fee/1e5a1e09-bde0-417d-83cd-083234b1409c/index.html

## Summary


This bug report discusses a potential issue in the `clientDepositL1Batch()` function of the `L1LiquidityPool` and `L1LiquidityPoolAltL1` contracts. The issue could allow an attacker to drain all native tokens from the liquidity pool contract of layer 1. However, this vulnerability only affects contracts compiled with a `Solidity` version below 0.8.0. The Boba team has confirmed that their current contracts are not vulnerable, but it is recommended to follow the recommendations for using the SafeMath library and modifying the pragma version of the contracts to prevent future vulnerabilities.

## Details

**Update**
The Boba team has confirmed that they lean towards making minimal changes to the contracts since they currently hold funds. Therefore, they have decided not to remove the SafeMath dependency at this moment.

![Image 46: Alert icon](blob:http://localhost/542c9b08ab7b8ff1c3683eefe75dc1a0)

**Update**
The team fixed the issue by ensuring the solidity version is `>=0.8.0` in the commit `c6e85b4`. In such a case, we suggest removing the `SafeMath` dependency as it is no longer necessary to prevent overflow.

**File(s) affected:**`LP/L1LiquidityPool.sol`, `LP/L1LiquidityPoolAltL1.sol`

**Description:** An issue in the function `clientDepositL1Batch()` of both `L1LiquidityPool` and `L1LiquidityPoolAltL1` contracts could let an attacker drain all native tokens from the liquidity pool contract of layer 1. However, only contracts compiled with a `Solidity` compiler version `< 0.8.0` are vulnerable. When the issue was discovered, Quantstamp directly shared their concerns with the Boba team who made sure that none of the contracts deployed on Mainnets were vulnerable. Their answer was: `right now, all deployments are compiled with 0.8.9`. The root cause of that issue is how the library SafeMath is used in the contract, which is described in a dedicated issue later in the contract.

**Exploit Scenario:** If the contract has been compiled in such a case that it is vulnerable to overflows (i.e. compiled with a `Solidity` version `< 0.8.0`):

1.   Attacker calls `clientDepositL1Batch()` with a `msg.value` of `X` and the parameter `_tokens` being a sequence `S` of amounts for the native token, such as `sum of all amounts == X [modulo type(uint256).maxValue]`.
2.   A batch message will be sent to L2 because the `require` statement will be tricked by an overflow provoked at the line `ETHAmount = ETHAmount + token.amount`;
3.   In `L2LiquidityPool.clientPayL2Batch()`, each amount will be treated separately by `_initiateClientPayL2()`. If there are not enough tokens to distribute in the contract, then a reply message will be sent back to the L1 for each amount of `S` (`else` block).
4.   In `L1LiquidityPool.clientPayL1Settlement()`, the function will try to transfer to the attacker each amount of `S` independently, in different transactions.
5.   If an amount in `S` is close to the current balance of the contract `L1LiquidityPool` when the reply is received back on L1, but lower (to be valid), then almost all native tokens owned by the pool could be transferred to the attacker.

**Recommendation:** Consider following the recommendations of the dedicated issue related to SafeMath. Also, consider modifying the pragma version of the contracts.
