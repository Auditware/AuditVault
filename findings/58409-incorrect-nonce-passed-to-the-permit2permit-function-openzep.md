---
tags:
  - lang/solidity
  - sector/dex
  - has/github
  - severity/high
protocol: "[[Periphery Changes]]"
auditors:
  - OpenZeppelin
report: "https://blog.openzeppelin.com/periphery-changes-audit"
genome:
  - "[[token-approval-flow]]"
  - "[[cross-protocol]]"
---
# Incorrect Nonce Passed to the Permit2.permit Function

- id: 58409
- impact: HIGH
- protocol: Periphery Changes Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/periphery-changes-audit

## Summary


The `performSwap` function in the `SwapProxy` contract allows for swapping tokens on a specified exchange using different methods. However, there is a bug where the nonce used for the `permit` function is the same for the entire contract, causing issues when trying to use different tokens. This can be fixed by storing and using separate nonces for each token and spender pair in the contract. This bug has been resolved in a recent update.

## Details

The [`performSwap` function](https://github.com/across-protocol/contracts/blob/b84dbfae35030e0f2caa5509b632c10106a32330/contracts/SpokePoolPeriphery.sol#L67) of the `SwapProxy` contract allows for providing tokens for a swap to a specified exchange using several different methods. In particular, it allows for approving tokens for the swap [through the `Permit2` contract](https://github.com/across-protocol/contracts/blob/b84dbfae35030e0f2caa5509b632c10106a32330/contracts/SpokePoolPeriphery.sol#L86-L101). In order to do that, it [approves the given token amount to the `Permit2` contract](https://github.com/across-protocol/contracts/blob/b84dbfae35030e0f2caa5509b632c10106a32330/contracts/SpokePoolPeriphery.sol#L86) and [calls the `permit` function of the `Permit2` contract](https://github.com/across-protocol/contracts/blob/b84dbfae35030e0f2caa5509b632c10106a32330/contracts/SpokePoolPeriphery.sol#L88-L101).

However, the [nonce specified for that call](https://github.com/across-protocol/contracts/blob/b84dbfae35030e0f2caa5509b632c10106a32330/contracts/SpokePoolPeriphery.sol#L95) is global for the entire contract, whereas the `Permit2` contract stores [a separate nonce for each (owner, token, spender) tuple](https://github.com/Uniswap/permit2/blob/cc56ad0f3439c502c246fc5cfcc3db92bb8b7219/src/interfaces/IAllowanceTransfer.sol#L85). As a result, any attempt to use a different (token, spender) pair from the ones used in the first `performSwap` function call will result in the [revert](https://github.com/Uniswap/permit2/blob/cc56ad0f3439c502c246fc5cfcc3db92bb8b7219/src/AllowanceTransfer.sol#L138) due to nonce mismatch.

Consider storing and using separate nonces for each (token, spender) pair in the `SwapProxy` contract.

***Update:** Resolved in [pull request #1013](https://github.com/across-protocol/contracts/pull/1013) at commit [`3cd99c4`](https://github.com/across-protocol/contracts/pull/1013/commits/3cd99c4c9362f743a233c0747bc7829e604edfa8).*
