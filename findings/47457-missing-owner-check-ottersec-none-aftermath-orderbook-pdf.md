---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - vuln/access-control/missing-owner-check
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
  - sector/dex
protocol: "[[Aftermath Orderbook]]"
auditors:
  - "[[Robert Chen]]"
report: "https://aftermath.finance/"
genome:
  - "[[missing-owner-check]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
---
# Missing Owner Check

- id: 47457
- impact: HIGH
- protocol: [[Aftermath Orderbook]]
- reporter: Robert Chen (OtterSec)
- source: https://aftermath.finance/

## Summary


This bug report is about a function called "create_stop_order_ticket" within an account. The function generates a ticket and transfers it to a specified recipient. During the creation process, it designates the user's address to be the address of the caller. However, this can lead to a vulnerability where a malicious actor can create a ticket with another user's account ID and use it to make unauthorized changes to the victim's portfolio. The suggested fix is to modify the function to include the issuer's account ID and implement a verification step to ensure alignment between the account ID in the ticket and the issuer's account ID. The bug has been fixed in a patch.

## Details

## Vulnerability Report: Account Stop Order Ticket Creation

Within the `account`, `create_stop_order_ticket` generates a `StopOrderTicket` and transfers it to a specified recipient. During the creation process, it designates the `user_address` field of the ticket to `tx_context::sender(ctx)`, reflecting the address of the initiating caller. Consequently, it transfers the ticket to a recipient without validating if the caller (`tx_context::sender(ctx)`) is the legitimate owner of the `account_id` within `encrypted_details`.

> _perpetuals/sources/account.move_

```rust
public(friend) fun create_stop_order_ticket<T>(
    account: &Account<T>,
    recipient: address,
    expire_timestamp: u64,
    encrypted_details: vector<u8>,
    ctx: &mut TxContext
) {
    let ticket = StopOrderTicket<T> {
        id: object::new(ctx),
        user_address: tx_context::sender(ctx),
        expire_timestamp,
        encrypted_details
    };
    events::emit_created_stop_order_ticket(
        account.account_id,
        recipient,
        expire_timestamp,
        ticket.encrypted_details
    );
    transfer::transfer(ticket, recipient);
}
```

Thus, a malicious actor may meticulously craft a `StopOrderTicket` with `encrypted_details` containing another user’s `account_id`. Subsequently, the malicious actor invokes `create_stop_order_ticket` to generate the ticket despite not being the rightful owner of the targeted user’s `account_id`. When `clearing_house::place_stop_order` processes this ticket, it may execute orders on behalf of the victim, resulting in unauthorized changes to the victim’s position. This unauthorized activity may result in unintended additions of long and short positions to the victim’s portfolio, affecting the quantities of base and quote assets.

---

© 2024 Otter Audits LLC. All Rights Reserved. 8/21

## Aftermath Audit 04 - Vulnerabilities

### Remediation

Modify `create_stop_order_ticket` to incorporate the issuer’s `account_id` during the creation of the `StopOrderTicket`. Furthermore, in `place_stop_order` within the `clearing_house`, implement a verification step to ensure alignment between the `account_id` in `encrypted_details` and `issuer_account_id` in the `StopOrderTicket`.

### Patch

Fixed in f5c93e0.

© 2024 Otter Audits LLC. All Rights Reserved. 9/21
