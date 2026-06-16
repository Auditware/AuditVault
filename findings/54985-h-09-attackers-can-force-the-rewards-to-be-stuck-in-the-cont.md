---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - lang/rust
  - sector/dex
  - sector/farm
  - platform/code4rena
protocol: "[[MANTRA]]"
auditors:
  - carrotsmuggler
report: "https://code4rena.com/reports/2024-11-mantra-dex"
genome:
  - "[[dos-resistance]]"
  - "[[dos/frozen-funds]]"
  - "[[dos/permanent]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-09] Attackers can force the rewards to be stuck in the contract with malicious `x/tokenfactory` denoms

- id: 54985
- impact: HIGH
- protocol: MANTRA
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-dex

## Summary


The bug report states that there is a vulnerability in the Mantra DEX contract that allows attackers to prevent the contract from distributing rewards to users. This is done by using the `x/tokenfactory` module to create tokens and then using the `MsgForceTransfer` message to forcefully transfer funds from the contract. This can cause a loss of rewards for users and also prevent the contract owner from closing the malicious farm. To fix this, it is recommended to modify the `close_farms` function to handle errors when refunding rewards to the farm owner. 

## Details



Attackers can fund rewards of LP tokens with tokens created from the `x/tokenfactory` module and abuse the `MsgForceTransfer` message to prevent the contract from successfully distributing rewards. This would also prevent the contract owner from closing the malicious farm. As a result, rewards that are accrued to the users will be stuck in the contract, causing a loss of rewards.

### Proof of Concept

When a user claims pending rewards of their LP tokens, all of their rewards are aggregated together and sent within a `BankMsg::Send` message.

[/contracts/farm-manager/src/farm/commands.rs# L102-L107](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/farm-manager/src/farm/commands.rs# L102-L107)

These rewards can be funded externally via the `FarmAction::Fill` message for a particular LP asset.

One thing to note is that the reward must be a `Coin`, which means it must be a native token recognized by the Cosmos SDK module.

<https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/packages/amm/src/farm_manager.rs# L186-L187>

The Mantra DEX contract will be deployed in the Mantra chain, which is running in parallel as another competition [here](https://code4rena.com/audits/2024-11-mantra-chain). The Mantra chain implements a `x/tokenfactory` module to allow token creators to create native tokens.

<https://github.com/MANTRA-Chain/mantrachain/blob/v1.0.2/x/tokenfactory/keeper/msg_server.go>

One of the features in the `x/tokenfactory` module is that token creators can call the `MsgForceTransfer` to forcefully transfer funds from one account to another account, effectively reducing its balance.

<https://github.com/MANTRA-Chain/mantrachain/blob/v1.0.2/x/tokenfactory/keeper/msg_server.go# L149>

This allows an attacker to perform a denial of service of the rewards pending in the contract by supplying a tokenfactory denom, and then forcefully transfer funds from the contract in order to cause an “insufficient funds” error.

1. The attacker creates an `x/tokenfactory` denom from the Mantra chain.
2. The attacker mints some of the tokens and supplies them to an LP token with `FarmAction::Fill`.
3. The attacker calls `MsgForceTransfer` to transfer all the tokens forcefully from the contract.
4. When users want to claim their rewards, the transaction will fail due to an insufficient funds error. Since all the rewards are aggregated into a single `BankMsg::Send`, other legitimate rewards that are accrued for the user will be stuck and cannot be withdrawn.
5. At this point, the contract owner notices it and sends the `FarmAction::Close` messages to close the farm created by the attacker. However, because the `close_farms` function will automatically refund the unclaimed `farm.farm_asset.amount` to the attacker (see [here](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/farm-manager/src/manager/commands.rs# L212-L220)), the transaction will fail due to an insufficient funds error.

### Recommended mitigation steps

To mitigate this attack, consider modifying the `close_farms` function so the messages are dispatched as `SubMsg::reply_on_error` when refunding the rewards to the farm owner. Within the reply handler, simply return an `Ok(Response::default())` if an error occurred during `BankMsg::Send`. This will prevent the attack because the contract owner will still have the power to close malicious farms even though the attacker reduced the contract’s balance.

<https://docs.rs/cosmwasm-std/latest/cosmwasm_std/struct.SubMsg.html# method.reply_on_error>

**jvr0x (MANTRA) confirmed**

**[3docSec (judge) commented](https://code4rena.com/audits/2024-11-mantra-dex/submissions/F-36?commentParent=e82mWPENTwp):**

> Marking this one as primary, because it highlights the two impacts in this group:
>
> * Malicious pools brick claiming of legitimate pools’ rewards.
> * Malicious pools can’t be closed.
>
> It is, however, recommended to take into consideration also the [S-377](https://code4rena.com/audits/2024-11-mantra-dex/submissions/S-377) mitigation of letting users opt-out from malicious pools without requiring admin intervention

---


