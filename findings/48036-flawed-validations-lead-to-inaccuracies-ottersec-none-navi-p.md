---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/lending
  - sector/staking
protocol: "[[Navi]]"
auditors:
  - "[[Ajay Shankar]]"
report: "https://www.naviprotocol.io/"
genome:
  - "[[decimal-mismatch]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
  - "[[move-reward-update-ordering]]"
---
# Flawed Validations Lead To Inaccuracies

- id: 48036
- impact: HIGH
- protocol: [[Navi]]
- reporter: Ajay Shankar (OtterSec)
- source: https://www.naviprotocol.io/

## Summary


There is a bug in the code that validates lending operations. Some functions use scaled balances and unscaled amounts together, which can lead to incorrect results. This bug affects the calculation for deposit, withdrawal, and borrowing. To fix this, the validation functions need to be moved to a different location in the code and adjustments need to be made to use unscaled amounts for comparisons. This has been fixed in the latest versions of the code.

## Details

## Validator Functions and Inaccuracies in Lending Operations

In `validator.move`, a set of functions validate various actions related to lending operations. These functions validate specific conditions before allowing the execution of the corresponding tasks. However, some of these functions use scaled balances (supply and borrow) in conjunction with unscaled amounts, which may lead to inaccuracies. 

## Specific Issues

1. In `validate_deposit`, the calculation for `estimate_supply` combines a scaled supply balance with an unscaled amount to compare against the `supply_cap_ceiling`.
2. In `invalidate_withdraw`, the condition `supply_balance >= borrow_balance + amount` compares two values scaled using different indexes; this may result in the condition failing if the supply index is relatively small compared to the borrowing index.
3. In `validate_borrow`, the calculation for `current_borrow_ratio` involves scaled borrow and supply balances multiplied by different indexes.

## Remediation

Insert the validation functions in `logic.move` and place them after the `update_state` call; this ensures that the indexes become updated before performing calculations, and the supply and borrow balances become unscaled by multiplying them with their respective indexes.

## Patch

Fixed in `e4557a5` and `d8ec7e7` by relocating validation functions to `logic.move` and making adjustments to utilize unscaled amounts for comparisons during checks.
