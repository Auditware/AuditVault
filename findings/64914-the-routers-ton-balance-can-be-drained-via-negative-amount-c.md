---
tags:
  - lang/func
  - sector/dex
  - platform/trailofbits
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[TONCO]]"
auditors:
  - "[[Nicolas Donboly Trail of Bits PUBLIC]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2026-02-tonco-clamm-securityreview.pdf"
genome:
  - "[[underflow]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
  - "[[fot-slippage]]"
  - "[[ton-message-chain-value]]"
---
# The router’s TON balance can be drained via negative amount calculation

- id: 64914
- impact: HIGH
- protocol: [[TONCO]] CLAMM DEX v1.6
- reporter: Nicolas Donboly Trail of Bits PUBLIC (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2026-02-tonco-clamm-securityreview.pdf

## Summary


This report describes a vulnerability in the TON balance of a router that can be exploited by attackers to drain funds. The vulnerability occurs when the router's `payToOperation` function calculates TON amounts to attach to jetton transfer messages. This calculation can result in a negative `tonAmount` value, which can be divided between two transfers. An attacker can exploit this by using the multihop shortcut feature with an invalid operation on one of the transfers, preventing serialization errors and causing the router to spend TON from its own balance. This can be done repeatedly to drain the router's TON balance. The report recommends adding validation to prevent negative `tonAmount` values and enhancing the test suite to include edge cases in TON amount calculations.

## Details

## Vulnerability Report

**Diﬃculty:** Medium  
**Type:** Data Validation  

## Description
The TON balance of the router can be drained if the multihop shortcut path is enabled due to a negative amount computation. The router’s `payToOperation` function calculates TON amounts to attach to jetton transfer messages by subtracting upkeep costs and payload amounts from the incoming message value. This calculation can result in a negative `tonAmount` value, which is then divided between two transfers. Even when `tonAmount` is negative, one of the resulting values (`tonAmount0` or `tonAmount1`) can be positive while the other is negative. An attacker can exploit this by using the multihop shortcut feature with an invalid operation on the transfer that would have a negative TON amount, preventing serialization errors while causing the router to spend TON from its own balance on the positive-amount transfer.

```javascript
// Either one or both amounts must be non-zero
if ((coins.amount0 > 0) & (coins.amount1 > 0)) {
  // Divide remaining ton_amount between two transactions
  var tonAmount: int = (msgValue - (ROUTER_TON_UPKEEP + ROUTER_PAY_TO_GAS)) -
    payloadAmount0 - payloadAmount1;
  tonAmount0 = payloadAmount0 + tonAmount / 2;
  tonAmount1 = payloadAmount1 + tonAmount / 2;
  mode = SEND_MODE_REGULAR;
}
```
*Figure 21.1: TON amount calculation can produce negative values.*  
*(contracts/router_tolk/operations/router_send.tolk#L81–L87)*

An example calculation is presented in Figure 21.2:
- `msgValue = 0`
- `ROUTER_TON_UPKEEP + ROUTER_PAY_TO_GAS = 12,417,000`
- `payloadAmount0 = 200,000,000`
- `payloadAmount1 = 100,000,000`

```
tonAmount = 0 - 12,417,000 - 200,000,000 - 100,000,000
tonAmount = -312,417,000
tonAmount0 = 200,000,000 + (-312,417,000 / 2) = 43,791,500
tonAmount1 = 100,000,000 + (-312,417,000 / 2) = -56,208,500
```
*Figure 21.2: Example tonAmount calculation.*  

Normally, converting a negative value to coins would cause a serialization error. However, if the multihop shortcut is enabled via the `ROUTER_FLAG_MULTIHOP_SHORTCUT` flag and the attacker provides an invalid operation code in the payload for `jetton1`, the `transferNotificationPayloadProcess` function becomes a no-op and returns early without processing the payload (as shown in TOB-TONCO-13). This prevents the negative `tonAmount1` from being serialized, consequently preventing the error. The router then sends a message with a `tonAmount0` value of 43,791,500 using TON from its own balance, allowing the attacker to drain router funds.

```javascript
if (coins.amount1 > 0) {
  if (payToBody.receiver1 == contract.getAddress()) {
    dumpstr("    Shortcut to router with coins 1");
    transferNotificationPayloadProcess(queryId, coins.amount1,
      contract.getAddress(), coins.jetton1Address, payloadCell1, tonAmount1);
    coins.amount1 = 0;
  }
}
```
*Figure 21.3: Multihop shortcut bypasses serialization.*  
*(contracts/router_tolk/operations/router_send.tolk#L114–L119)*  

## Exploit Scenario
Eve initiates a swap operation by sending jettons to the router with a crafted `multihopCell` containing high `payloadAmount0` and `payloadAmount1` values (e.g., 200,000,000 and 100,000,000 nanotons). She sets `receiver1` to the router address to trigger the multihop shortcut and includes an invalid operation code in `payloadCell1`. The router forwards this swap to the pool, which processes it and sends a `ROUTER_OPERATION_PAY_TO` message back to the router with value: 0 and `SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE`, resulting in a very small or zero-value `msgValue`. The router’s `payToOperation` calculates `tonAmount = 0 - 12,417,000 - 200,000,000 - 100,000,000 = -312,417,000`, resulting in a `tonAmount0` value of 43,791,500 (positive) and a `tonAmount1` of -56,208,500 (negative). The multihop shortcut processes `jetton1` by calling `transferNotificationPayloadProcess`, which encounters the invalid operation and returns early without serializing the negative `tonAmount1`. However, the router still sends the `jetton0` transfer with a `tonAmount0` value of 43,791,500 using TON from its own balance. By repeatedly exploiting this vulnerability, or by using a very large value for one of the payload amounts, Eve drains the router’s TON balance.

## Recommendations
- **Short term:** Add validation to ensure that `tonAmount0` and `tonAmount1` are both non-negative before proceeding with message sending. If either value is negative, the code should reject the operation and return an error. This will prevent the router from spending its own TON on behalf of users who have not provided sufficient funds.
- **Long term:** Enhance the test suite to include comprehensive tests for edge cases in TON amount calculations, including scenarios with zero or minimal `msgValue`, high payload amounts, and multihop shortcuts.
