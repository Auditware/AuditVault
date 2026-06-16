---
tags:
  - lang/solidity
  - sector/bridge
  - sector/dex
  - sector/nft
  - platform/quantstamp
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
protocol: "[[Boba 1 (Bridges And LP Floating Fee)]]"
auditors:
  - "[[Pavel Shabarkin]]"
report: "https://certificate.quantstamp.com/full/boba-1-bridges-and-lp-floating-fee/1e5a1e09-bde0-417d-83cd-083234b1409c/index.html"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fot-slippage]]"
---
# Unsafe `replyNeeded` Messaging Mechanism

- id: 60698
- impact: HIGH
- protocol: Boba 1 (Bridges and LP floating fee)
- reporter: Pavel Shabarkin (Quantstamp)
- source: https://certificate.quantstamp.com/full/boba-1-bridges-and-lp-floating-fee/1e5a1e09-bde0-417d-83cd-083234b1409c/index.html

## Summary


This report discusses a bug in the codebase of a project that deals with cross-layer message failures. The codebase does not secure the resources required to undo an action, which can result in the compensation message failing. This can lead to the loss of funds for users. The report suggests implementing a retry mechanism or following the steps of two-phase locking to mitigate this issue.

## Details

**Update**
Marked as "Acknowledged" by the client. The client provided the following explanation:

> Since a fix for this change would include some significant change to the already deployed contracts (with funds at stake), we are avoiding adding a fix for this edge case. Moreover, the condition of such a case could be difficult to attain in practice with multiple depositors on the pool and we have protections on the UI in place that prevents users from bridging when the other side of the pool does not have enough funds. We could also make people aware of this certain edge condition and possibility before bridging.

Users should be aware of the following risks if no changes are to apply. Also, we suggest a few possible mitigations from the frontend:

1.   Boba team can rebalance the liquidity and cause issues. The Boba team should consider announcing the rebalance events in advance and warn the users in the frontend before and during the rebalance period.
2.   The users should check how many liquidity providers there are and how many liquidity providers it takes to cause the lock of the fund. The Boba team can also consider providing a simulation of the risk in the frontend to the users.

**File(s) affected:**`LP/L2LiquidityPool.sol`, `LP/L1LiquidityPool.sol`

**Description:** The codebase incorporates the [compensation transaction pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction) in multiple locations to enable the reversal of cross-layer message failures. Specifically, the code verifies whether an action can be executed without errors and utilizes the `replyNeeded` variable to determine whether the contract should transmit a compensation transaction message to the originating layer to undo the effect. However, the code does not secure the resources required to undo the action, which can result in the compensation message failing if the resource has been utilized elsewhere. Furthermore, the message cannot be reattempted for an undo message from L1 to L2, leaving the contract in an anomalous state if it fails.

The risk can be a generalized issue whenever there are multiple actions that can manipulate resources. This is particularly relevant in the case of liquidity pools, where resources can be utilized not only through direct bridging but also through pool rebalancing and liquidity withdrawal. These actions increase the attack surface for liquidity pool contracts, making them more vulnerable to security threats. We analyzed the contracts within this audit's scope:

For the LP contracts:

1.   `L1LiquidityPool.clientPayL1()`: the function can send a `L2LiquidityPool.clientPayL2Settlement` message back to L2 if the L1 liquidity pool lacks enough balance. However, since the process is async, and new transactions can happen on L2, the L2 liquidity pool might become out of balance when it attempts to revert with the L2LiquidityPool clientPayL2Settlement()` function. Once it fails, the user will lose his/her fund and cannot retry the relay message.
2.   `L2LiquidityPool._initiateClientPayL2()`: when the L2 liquidity pool lacks enough balance, it will send the `L1LiquidityPool.clientPayL1Settlement` message back. The risk is lower here as L1 relay messages can be retried until they succeed. So the user can retry later once the liquidity pool is rebalanced.

The design pattern of the ERC721 and ERC1155 bridges is similar, but unlike liquidity pool contracts, the resources (NFT/tokens) can only be transferred by redeeming them from the bridge - there are no other available methods. As a result, the bridge contracts are not susceptible to the aforementioned concern and are considered safe.

**Exploit Scenario:**

1.   Alice calls `L2LiquidityPool.clientDepositL2()`, trying to fast withdraw from L2 to L1. This will relay an `L1LiquidityPool.clientPayL1` message to L1.
2.   At the time the message `L1LiquidityPool.clientPayL1` is relayed, the L1 liquidity pool lacks enough balance to pay. As a result, it tries to relay an `L2LiquidityPool.clientPayL2Settlement` message to L2 as the compensation message.
3.   Somehow, other users calls `L2LiquidityPool.withdrawLiquidity()` to remove their liquidity on the L2 liquidity pool. The L2 balance is no longer enough to run the compensation message `L2LiquidityPool.clientPayL2Settlement`.
4.   When the `L2LiquidityPool.clientPayL2Settlement` message is relayed, it fails due to a lack of balance. However, Alice lost her funds since the L2 relay message could not be retried.

**Recommendation:** One mitigation is to implement a retry mechanism for the L2 contract. For instance, the `L2LiquidityPool` contract can accept the relayed message, and if it fails, it stored the failed message in a mapping and allows the failed message to be retried again until succeeded.

An alternatively solution, which will solve this entirely, is to follow similar steps of [two-phase locking](https://user.it.uu.se/~arnoldp/distrib/TwoPhase.html). The steps for a cross-layer message will be like the following (assuming L2 -> L1):

1.   L2 contract first locks the resource (e.g., fund) necessary to revert later.
2.   The message is relayed from L2 to L1.
3.   If the L1 relayed message can run the action successfully, it should relay a confirmation message back to L2.
4.   Otherwise, the L1 contract should follow the same steps to return the compensation message to L2.
5.   The L2 should remove the locking of the resource if getting a confirmation message or undo/revert if receiving a compensation message.

Similar steps apply for L1 -> L2 messages, though those are less concerning as the compensation message for L1 can be retried.
