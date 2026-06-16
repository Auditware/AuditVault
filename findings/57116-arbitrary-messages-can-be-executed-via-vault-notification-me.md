---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/dex
  - sector/vault
protocol: "[[Swap Coffee]]"
auditors:
  - "[[Bo Henderson]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-swap-coffee-ton-dex-securityreview.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[admin-takeover]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
---
# Arbitrary messages can be executed via vault notiﬁcation messages

- id: 57116
- impact: HIGH
- protocol: [[Swap Coffee]] TON DEX
- reporter: Bo Henderson (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-swap-coffee-ton-dex-securityreview.pdf

## Summary


This bug report discusses a vulnerability in a vault contract that allows malicious messages to be sent to other contracts, bypassing important security checks. This can be exploited to perform operations, such as swaps or liquidity deposits, without actually transferring any tokens to the vault. The report recommends implementing a dedicated notification contract to isolate this functionality and prevent the transmission of arbitrary messages. In the long term, it suggests restricting the transmission of messages to a dedicated contract to prevent similar vulnerabilities. 

## Details

## Vulnerability Report

## Difficulty: Medium

## Type: Data Validation

## Description
The vault contract allows arbitrary messages to be sent to arbitrary recipients through its notification system, which can be exploited to bypass critical security checks. Similar to **TOB-SWAPCOFFEE-1**, the vault sends notification messages that can contain any payload, allowing attackers to craft malicious operations that appear to come from the vault. This vulnerability can be exploited to send malicious messages, such as a swap operation or a liquidity deposit, without transferring any tokens to the vault. 

Typically, the vault verifies that jetton tokens have been received before sending messages to the pools, but this notification mechanism allows these critical security checks to be bypassed entirely.

```solidity
send_cell(
    notification_receiver,
    notification_fwd_gas,
    notification
);
```
*Figure 6.1: The notification message sent from the vault (dex/contracts/vault_jetton.fc#264–268)*

## Exploit Scenario
A malicious user initiates a swap operation with a crafted notification payload. He sets the notification receiver to a pool contract address and the notification payload to a valid `swap_internal` message. When the vault processes this and sends the notification, it effectively issues a swap message to the pool that appears to come from the vault itself. This bypasses all the checks in the vault that typically validate asset transfers, allowing the attacker to perform swaps without transferring any assets to the vault. 

Similar exploits are possible with other operations like `deposit_liquidity` or anywhere notifications are used in the codebase.

## Recommendations
- **Short term:** Implement a dedicated notification contract to dispatch notification messages, thereby isolating this functionality from the vault contract. This architectural enhancement will provide a robust safeguard against transmitting malicious messages from the vaults.
- **Long term:** Ensure that no contract permits the transmission of arbitrary messages to arbitrary receivers, or restrict such transmission to a dedicated contract as delineated in the recommended short-term solution.
