---
tags:
  - platform/quantstamp
  - severity/high
  - sector/dex
protocol: "[[Crouton Finance   StableSwap]]"
auditors:
  - Julio Aguilar
report: "https://certificate.quantstamp.com/full/crouton-finance-stable-swap/14a85512-535f-4145-bbe9-1069ef8ce9a9/index.html"
genome:
  - "[[dos-resistance]]"
  - "[[locked-funds]]"
---
# Missing Error Case in `handle_burn_notification()` May Lead to Locked Funds for Caller and Incorrect Accounting

- id: 58837
- impact: HIGH
- protocol: Crouton Finance - StableSwap
- reporter: Julio Aguilar (Quantstamp)
- source: https://certificate.quantstamp.com/full/crouton-finance-stable-swap/14a85512-535f-4145-bbe9-1069ef8ce9a9/index.html

## Summary


A bug has been reported in the `pool.func` file where if a user provides a non-empty `custom_payload` that is not `op::remove_liquidity_balanced` or `op::remove_liquidity_one_coin`, the expected cases will not execute. This results in no funds being sent to the user but `total_supply` is still reduced, causing accounting inconsistencies. Additionally, there are incorrect computations in `handle_update_reserves()` when calculating individual coin balance values. The recommendation is to change the two if-statements to if-elseif-else and add a throwing else case. The issue has been marked as "Fixed" by the client. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `0e30d970d6f0ed06ed1e2ec95346d150f2e7d62d`.

**File(s) affected:**`pool.func`

**Description:** If the caller provides a non-empty `custom_payload` that is neither `op::remove_liquidity_balanced` nor `op::remove_liquidity_one_coin`, none of the expected cases will execute. As a result, no funds will be sent to the user, yet `total_supply` will still be reduced without deducting any amounts from `balances[]`, leading to accounting inconsistencies.

This issue is further exacerbated by incorrect computations within `handle_update_reserves()` when computing individual coin balance values using the wrongly deducted `total_supply`.

**Recommendation:** We recommend changing the two if-statements into if-elseif-else, with a throwing else case.
