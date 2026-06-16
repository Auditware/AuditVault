---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/staking
  - sector/staking-pool
protocol: "[[Walrus Contracts]]"
auditors:
  - "[[Nicholas R. Putra]]"
report: "https://www.mystenlabs.com/"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
---
# Inconsistencies Due to Zero Share Amount Value

- id: 53198
- impact: HIGH
- protocol: [[Walrus Contracts]]
- reporter: Nicholas R. Putra (OtterSec)
- source: https://www.mystenlabs.com/

## Summary


The staking_inner::request_withdraw_stake function does not prevent a withdrawal request with a share_amount of zero, which could allow a malicious user to manipulate the staking pool's share-to-asset ratio. Additionally, there is a possibility of a denial-of-service attack when share_amount is zero in the exchange_rate::convert_to_wal_amount function due to division by zero. This affects epoch advancement and stake withdrawals. The issue has been fixed in the latest patch.

## Details

## Withdrawal Request Issue in Staking Pool

`staking_inner::request_withdraw_stake` does not explicitly prevent a withdrawal request with a `share_amount` of zero. This oversight may allow a malicious user to manipulate the staking pool’s share-to-asset ratio by withdrawing a small principal or leaving it.

Furthermore, there is a possibility of a denial-of-service attack when `share_amount` is zero in `exchange_rate::convert_to_wal_amount`, due to division by zero when the function performs a division by `share_amount` to compute the WAL equivalent. Specifically, this affects epoch advancement and stake withdrawals.

> ```rust
> // Source: sources/staking/exchange_rate.move
> public(package) fun convert_to_wal_amount(exchange_rate: &PoolExchangeRate, amount: u64): u64 {
>     match (exchange_rate) {
>         PoolExchangeRate::Flat => amount,
>         PoolExchangeRate::Variable { wal_amount, share_amount } => {
>             let amount = (amount as u128);
>             let res = (amount * *wal_amount) / *share_amount;
>             res as u64
>         },
>     }
> }
> ```

When calculating the pool’s active balance, `wal_balance_at_epoch` calls `convert_to_wal_amount`, affecting epoch advancements if `share_amount` is zero. Similarly, during stake withdrawal, `calculate_rewards` internally calls `convert_to_wal_amount` to compute rewards, causing the withdrawal attempt to fail if `share_amount` is zero.

## Remediation
Ensure that the minimum amount remains in the pool or `StakedWal`.

## Patch
Fixed in commit `cc4aaaa`.
