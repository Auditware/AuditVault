---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/lending
protocol: "[[Axelar]]"
auditors:
  - "[[Robert Chen]]"
report: "https://www.axelar.network/"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Utilization of Incorrect Flow Tracking

- id: 47310
- impact: HIGH
- protocol: Sui Axelar (Gateway V2)
- reporter: Robert Chen (OtterSec)
- source: https://www.axelar.network/

## Summary


This bug report discusses a vulnerability in the function "give_coin" within the "CoinManagement" code. The function is currently using "add_flow_out" to track the outflow of tokens, even in situations where it should account for the inflow of tokens. This is causing incorrect tracking of token flow, especially when receiving tokens through interchain transfers. The suggested solution is to modify the function to use "add_flow_in" instead of "add_flow_out" when receiving tokens. This issue has been resolved in a recent pull request.

## Details

## Vulnerability Report

The vulnerability concerns the incorrect utilization of flow management in `give_coin` within `CoinManagement`. Specifically, the function currently calls `add_flow_out`, which is intended to track the outflow of tokens, even in situations where it should account for the inflow of tokens when receiving transfers.

> _axelar-cgp-sui/move/its/sources/types/coin_management.move rust_

```rust
public(package) fun give_coin<T>(
    self: &mut CoinManagement<T>,
    mut amount: u256,
    clock: &Clock,
    ctx: &mut TxContext,
): Coin<T> {
    amount = amount + self.dust;
    self.dust = amount % self.scaling;
    let sui_amount = (amount / self.scaling as u64);
    self.flow_limit.add_flow_out(sui_amount, clock);
    if (has_capability(self)) {
        self.mint(sui_amount, ctx)
    } else {
        coin::take(self.balance.borrow_mut(), sui_amount, ctx)
    }
}
```

In the current implementation, the function utilizes `self.flow_limit.add_flow_out(sui_amount, clock)` to record the amount of tokens given out. This is inappropriate when the system is receiving tokens through an interchain transfer. Utilizing `add_flow_out` during a reception scenario inaccurately reflects the state of token flow. Instead of tracking tokens that are leaving the system, it should track tokens coming in.

## Remediation

Modify `give_coin` to utilize `add_flow_in` instead of `add_flow_out` when receiving tokens.

## Patch

Resolved in PR #190.

© 2024 Otter Audits LLC. All Rights Reserved. 6/18
