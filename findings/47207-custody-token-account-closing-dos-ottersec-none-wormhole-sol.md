---
tags:
  - lang/solidity
  - platform/ottersec
  - severity/high
  - sector/bridge
protocol: "[[Wormhole]]"
auditors:
  - "[[Ajay Shankar Kunapareddy]]"
report: "https://wormhole.com/"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Custody Token Account Closing DoS

- id: 47207
- impact: HIGH
- protocol: [[Wormhole]] Solana
- reporter: Ajay Shankar Kunapareddy (OtterSec)
- source: https://wormhole.com/

## Summary


The report highlights a potential vulnerability in the settlement instructions for auctions involving the Wormhole CCTP bridge. The code assumes that the total transferable amount equals the order amount retrieved from the fastVAA. However, during the settlement process, it does not verify if this amount actually matches the funds in the prepared_custody_token account. This can lead to a failure in closing the account due to non-zero funds. The recommended solution is to use the actual token balance in the prepared_custody_token account instead of relying solely on the order amount. This issue has been resolved in the patch 307cc28.

## Details

## Vulnerability Report: Wormhole CCTP Bridge

There is a potential vulnerability related to the settlement instructions for auctions involving the Wormhole CCTP bridge. The code assumes the total transferable amount equals `order.amount_in` retrieved from the `fastVAA`. However, during the settlement process, it does not verify if this amount actually matches the funds in the `prepared_custody_token` account.

## Code Reference

```rust
> _ auction/prepare_settlement/cctp.rsrust
fn handle_prepare_order_response_cctp(
    ctx: Context<PrepareOrderResponseCctp>,
    args: CctpMessageArgs,
) -> Result<()> {
    [...]
    let fast_vaa = ctx.accounts.fast_order_path.fast_vaa.load_unchecked();
    let order = LiquidityLayerMessage::try_from(fast_vaa.payload())
        .unwrap()
        .to_fast_market_order_unchecked();
    let amount_in = order.amount_in();
    ctx.accounts
        .prepared_order_response
        .set_inner(PreparedOrderResponse {
            bump: ctx.bumps.prepared_order_response,
            info: PreparedOrderResponseInfo {
                [...]
                amount_in,
                sender: order.sender(),
                redeemer: order.redeemer(),
                init_auction_fee: order.init_auction_fee(),
            },
            to_endpoint: ctx.accounts.fast_order_path.to_endpoint.info,
            redeemer_message: order.message_to_vec(),
        });
    [...]
}
```

Before settling the `PrepareOrderResponse`, if a small amount of tokens is transferred to the `prepared_custody_token` account, when the settlement instruction tries to close the `prepared_custody_token` account via `token::close_account`, it fails with non-zero funds because only the `order.amount_in` is transferred from that account instead of the total balance.

---

© 2024 Otter Audits LLC. All Rights Reserved. 6/20

## Wormhole Solana Audit 04 - Vulnerabilities

### Remediation

Instead of relying solely on `order.amount_in` from the fast VAA, the code should use the actual token balance in the `prepared_custody_token` account before attempting to close it.

### Patch

Resolved in 307cc28.

---

© 2024 Otter Audits LLC. All Rights Reserved. 7/20
