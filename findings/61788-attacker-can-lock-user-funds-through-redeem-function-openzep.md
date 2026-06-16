---
tags:
  - blockchain/evm
  - blockchain/evm/optimism
  - lang/solidity
  - sector/lending
  - sector/stable
  - platform/openzeppelin
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/locked-funds
  - novelty/known-pattern
protocol: "[[f(x) Protocol]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/fx-v2-audit"
genome:
  - "[[underflow]]"
  - "[[locked-funds]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
---
# Attacker can Lock User Funds through Redeem Function

- id: 61788
- impact: HIGH
- protocol: f(x) v2 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/fx-v2-audit

## Summary


The redeem function in the PoolManager contract allows users to exchange fxUSD for collateral at a cheaper rate. However, there is a bug that can be exploited by attackers to create multiple nodes and lock funds of users. This is due to missing checks and a recursive function that can cause a stack overflow error. The team has since fixed the issue by implementing a minimum raw debt requirement, checking for tick movement, and replacing the recursive function with a non-recursive one. 

## Details

The [redeem function](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/PoolManager.sol#L307-L334) in the `PoolManager` contract of the protocol allows any user to burn `fxUSD` and receive collateral at a cheaper than market rate in return. The purpose of this function is to prevent depegging scenarios of the `fxUSD` stablecoin through a disincentive. During the function call, the `PoolManager` contract calls the [`redeem` function of the `BasePool` contract](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/pool/BasePool.sol#L191-L245) to calculate the collateral to be returned. This function starts liquidating from the top tick until the desired amount of `rawDebts` (fxUSD) is covered via the [`_liquidateTick` function](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/pool/BasePool.sol#L233). During this function call, the top tick is always shifted to a [new parent node](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/pool/TickLogic.sol#L198) and the old node becomes its child node.

It is important to note that there is no [minimum rawDebt](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/pool/BasePool.sol#L191) (fxUSD to be burned) requirement placed in the `redeem` function. This allows an attacker to redeem small amounts of fxUSD and create multiple nodes for a tick without shifting it from the top tick and to push the positions of that tick down into a spiral of 100s to 1000s of child nodes.

Additionally, the [`operate` function](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/pool/BasePool.sol#L73-L188) in the `BasePool` contract always [updates the position](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/pool/BasePool.sol#L102) to the latest parent node from the current child node before any other calculations. Note that the [`_getRootNodeAndCompress` function](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/pool/TickLogic.sol#L65-L85) which gets the root node for a position, is a recursive function which is easily prone to stack overflow error.

An attacker can leverage the above mentioned liquidate tick design, the missing minimum rawDebt check, and the recursion property to execute the following steps:

1. Repeatedly call the `redeem` function with a minimal amount of rawDebt(fxUSD) to burn (For example burning 2 wei around 150 times). This ensures that the [top tick](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/pool/TickLogic.sol#L229-L232) is never updated and 150 child nodes are created.
2. Call the `redeem` function again with a calculated high amount to shift to new top tick to target more positions.
3. Once the targeted tick has become the top tick again, repeat step 1.

Due to this mechanism, whenever the user tries to close or update one of those affected positions using the `operate` function, the `_getRootNodeAndCompress` will fail with stack overflow error as child nodes are above certain limit. This [POC](https://gist.github.com/jainil-oz/557243b7fd29cca6025bcfc85f79f21b) demonstrates the stack overflow behavior by manipulating the top tick and locking the funds of all positions corresponding to that tick. The users won't be able to close or update their positions, they can only be rebalanced or liquidated, thus their funds will get locked.

To address the underlying issue, consider migrating to a non-recursive version of the `_getRootNodeAndCompress` function. To further prevent gas griefing attacks via the `redeem` function, consider implementing additional checks such as a minimum `rawDebt` requirement to ensure that the top tick always moves, which would increase the difficulty for any attacker attempting to target a tick.

***Update:** Resolved in [pull request #22](https://github.com/AladdinDAO/fx-protocol-contracts/pull/22).*

*The team has migrated to an iterative version of the `_getRootNodeAndCompress()` function and added a minimum `rawDebts` requirement for the `redeem`, `rebalance`, and `liquidate` functionalities. An admin function has also been added to compress the node chain in case of any unintended behaviors detected through the off-chain monitoring of the tree structure. The [[f(x) Protocol]] team stated:*

> *We have implemented the following changes in response to the observed edge cases:*
>
> * ***Minimum Raw Debt Threshold Added**: We have introduced a minimum raw debt requirement for `redeem`, `rebalance`, and `liquidate` operations to prevent dust-level abuse and ensure tick movement.*
> * ***Tick Movement Check**: The `redeem` function now reverts in case the tick does not move, guarding against stale state transitions.*
> * ***Path Compression Function**: We have replaced the recursive `getRootNodeAndCompress` function with a non-recursive internal version to avoid stack overflow. A `public` admin version is also available for manually compressing excessively long chains.*
>
> *The above changes improve protocol stability while retaining the ability to monitor and adapt to edge-case scenarios dynamically.*
