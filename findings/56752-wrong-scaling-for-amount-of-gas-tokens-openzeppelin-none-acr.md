---
tags:
  - lang/solidity
  - sector/bridge
  - sector/stable
  - has/github
  - severity/high
protocol: "[[Across Protocol Diff Audit  Arbitrum CustomGasToken & ExclusivityPeriod]]"
auditors:
  - OpenZeppelin
report: "https://blog.openzeppelin.com/across-protocol-diff-audit"
genome:
  - "[[token-decimal-normalization]]"
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[cross-protocol]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# Wrong Scaling for Amount of Gas Tokens

- id: 56752
- impact: HIGH
- protocol: Across Protocol Diff Audit -Arbitrum CustomGasToken & ExclusivityPeriod
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/across-protocol-diff-audit

## Summary


This bug report discusses an issue with the `Arbitrum_CustomGasToken_Adapter` contract, which is used to handle cases where a custom token is used to charge gas fees on a different blockchain. The problem arises when the custom token has a different number of decimal places than the standard 18 decimals used in Ethereum. This causes the contract to withdraw an incorrect amount of tokens, resulting in overcharging. The solution proposed is to scale the amount returned by the `getL1CallValue` function based on the number of decimals of the custom token, and use this scaled value to withdraw the correct amount from the funder contract. This bug has been resolved in a recent pull request.

## Details

The `Arbitrum_CustomGasToken_Adapter` [contract](https://github.com/across-protocol/contracts/blob/f56146a01ca9c62e6206a2c23c55dbe01a25a912/contracts/chain-adapters/Arbitrum_CustomGasToken_Adapter.sol#L130) is an adapter meant to handle cases where the destination chain uses a custom token to charge gas fees. Such a token might have non-standard decimals so proper scaling must be performed in order to correctly calculate the amounts.

The `_pullCustomGas` [function](https://github.com/across-protocol/contracts/blob/f56146a01ca9c62e6206a2c23c55dbe01a25a912/contracts/chain-adapters/Arbitrum_CustomGasToken_Adapter.sol#L284) of this contract is used both by the [`relayTokens`](https://github.com/across-protocol/contracts/blob/f56146a01ca9c62e6206a2c23c55dbe01a25a912/contracts/chain-adapters/Arbitrum_CustomGasToken_Adapter.sol#L221) and [`relayMessage`](https://github.com/across-protocol/contracts/blob/f56146a01ca9c62e6206a2c23c55dbe01a25a912/contracts/chain-adapters/Arbitrum_CustomGasToken_Adapter.sol#L195) functions to calculate the amount of gas tokens needed to pay for the chosen operation. This function first calculates the amount owed in the `getL1CallValue` [function](https://github.com/across-protocol/contracts/blob/f56146a01ca9c62e6206a2c23c55dbe01a25a912/contracts/chain-adapters/Arbitrum_CustomGasToken_Adapter.sol#L285) and then [withdraws](https://github.com/across-protocol/contracts/blob/f56146a01ca9c62e6206a2c23c55dbe01a25a912/contracts/chain-adapters/Arbitrum_CustomGasToken_Adapter.sol#L286) this amount from the `CUSTOM_GAS_TOKEN_FUNDER` contract (a specialized contract that holds the gas token funds needed).

The `getL1CallValue` function calculates the required amount of gas tokens by using the following formula:

```
 return L2_MAX_SUBMISSION_COST + L2_GAS_PRICE * l2GasLimit

```

In the above formula:

* `L2_MAX_SUBMISSION_COST` is the amount of gas allocated to pay for the base submission fee of the L1->L2 operation. [According](https://github.com/OffchainLabs/nitro-contracts/blob/main/src/bridge/AbsInbox.sol#L236) to the `AbsInbox` Arbitrum contract, this amount must be represented with an 18-decimal scale.
* `L2_GAS_PRICE` is the gas price bid for the immediate L2 execution attempt. According to the same `AbsInbox` contract, the scale should also be 18 decimals.
* `l2GasLimit` is a parameter which is in pure units of gas and depends on which operation (`relayTokens` or `relayMessage`) is being performed.

As one can see, the amount returned by the `getL1CallValue` function is in an 18-decimal scale and is directly used for withdrawing funds from the custom gas token funder. However, this is incorrect since the custom gas token might have a different scale.

For example, if the custom gas token is USDC which has 6 decimals, the amount being charged is off the scale by a factor of `10**(18 - 6)`. The result is that the `Arbitrum_CusstomGasToken_Adapter` logic will withdraw an amount way bigger than what is needed. What is worse is that such an amount is then directly passed to the `createRetryableTicket` [function](https://github.com/across-protocol/contracts/blob/f56146a01ca9c62e6206a2c23c55dbe01a25a912/contracts/chain-adapters/Arbitrum_CustomGasToken_Adapter.sol#L206) of the L1 Arbitrum inbox contract, which is then responsible for [pulling](https://github.com/OffchainLabs/nitro-contracts/blob/main/src/bridge/ERC20Inbox.sol#L139) these tokens out of the calling contract, overcharging the needed amount by many factors.

Consider scaling the amount returned by the `getL1CallValue` function by the amount of decimals of the custom gas token, using the scaled value to withdraw the correct amount from the funder contract, and passing it to the `createRetryableTicket` function.

***Update:** Resolved in [pull request #589](https://github.com/across-protocol/contracts/pull/589). The Risk Labs team stated:*

> *Nice catch.*
