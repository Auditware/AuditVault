---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
protocol: "[[Mystic Finance]]"
auditors:
  - Kann
report: "https://github.com/Kann-Audits/Kann-Audits/blob/main/reports/md-format/private-audits-reports/Mystic Finance.md"
genome:
  - "[[fee-accounting]]"
  - "[[reward-accounting]]"
  - "[[arithmetic/underflow]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# [H-01] Incorrect Accounting of currentWithheldETHinInstantWithdrawals

- id: 57713
- impact: HIGH
- protocol: Mystic Finance
- reporter: Kann
- source: https://github.com/Kann-Audits/Kann-Audits/blob/main/reports/md-format/private-audits-reports/Mystic Finance.md

## Summary


The bug report states that there is an issue with the withdraw function when the withdrawal amount is equal to or less than the currentWithheldETH. The code incorrectly adds and subtracts the withdrawal amount, which results in incorrect accounting of the withheld pool. This can potentially lead to over-withdrawals or failed withdrawals in the future. The team has acknowledged and fixed the issue. 

## Details

## Severity

High

## Description

In the withdraw(address recipient) function, when the withdrawal amount is less than
or equal to currentWithheldETH, the function enters the instant withdrawal path. In this case, the
contract does not call plumeStaking.withdraw(), and the funds are expected to be fully covered by the
ETH already held in currentWithheldETH. However, the code still sets withdrawn = amount and then
unconditionally adds this value back to currentWithheldETH. Immediately after, it subtracts amount
from currentWithheldETH, effectively leaving the value of currentWithheldETH unchanged.

```solidity
} else {
fee = amount * INSTANT_REDEMPTION_FEE / RATIO_PRECISION;
withdrawn = amount;
}
uint256 cachedWithheldETH = currentWithheldETH;
currentWithheldETH += withdrawn; // adding the withdraw amount
withHoldEth += fee;
currentWithheldETH -= amount; // deducting the amount
```

This logic is flawed because the ETH used to fulfill the withdrawal is not newly received; it is already
present in currentWithheldETH, and should simply be subtracted, not first added and then subtracted.
The current logic makes it appear as if no ETH was withdrawn, which results in incorrect accounting
of the withheld pool. If multiple such withdrawals occur, the system will consistently over-report the
available withheld ETH, potentially leading to over-withdrawals or failed withdrawals in the future
when actual funds are not available.

## Team Response

Fixed.
