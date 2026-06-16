---
tags:
  - lang/solidity
  - sector/staking
  - has/github
  - has/poc
  - severity/high
protocol: "[[Kinetiq]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Kinetiq-security-review_2025-02-26.md"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-08] Exchange rate calculation is incorrect

- id: 58616
- impact: HIGH
- protocol: Kinetiq_2025-02-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Kinetiq-security-review_2025-02-26.md

## Summary


This bug report discusses a problem with a staking system that allows multiple contracts to coexist and share profits and losses through a common contract. The issue lies in the calculation of the exchange rate between two tokens, which is done using local values instead of global ones. This leads to incorrect exchange rates being calculated for each contract, causing discrepancies and potential arbitrage opportunities. The recommended solution is for the global values to be tracked by a separate contract and for the individual contracts to query these values for accurate exchange rate calculations.

## Details


## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The protocol implements a staking system where multiple `StakingManager` contracts can coexist, sharing profits and losses through a common `ValidatorManager`. Each `StakingManager` maintains its own accounting of staked and claimed amounts via `totalStaked` and `totalClaimed` state variables, while sharing rewards and slashing through the `ValidatorManager`.

The critical issue lies in the `getExchangeRatio()` function, which calculates the exchange rate between HYPE and kHYPE tokens. The current implementation uses local accounting values but global PnL figures, leading to incorrect exchange rate calculations across different `StakingManager` instances.

The exchange rate calculation follows this formula:

```solidity
exchangeRate = (totalStaked + totalRewards - totalClaimed - totalSlashing) / kHYPESupply
```

Where:

- `totalStaked` and `totalClaimed` are local to each `StakingManager`
- `totalRewards` and `totalSlashing` are global values from `ValidatorManager`
- `kHYPESupply` is the total supply of kHYPE tokens

This creates a significant discrepancy as each `StakingManager` will calculate different exchange rates based on its local stake/claim values, while sharing the same rewards and slashing. 

### Proof of Concept

1. Two `StakingManager` contracts (SM1 and SM2) are deployed

2. User A stakes 100 HYPE through SM1
    - SM1.totalStaked = 100
    - SM2.totalStaked = 0

3. User B stakes 100 HYPE through SM2
    - SM1.totalStaked = 100
    - SM2.totalStaked = 100

4. `ValidatorManager` records 20 HYPE in rewards

5. Exchange rate calculation:
    - SM1: (100 + 20 - 0 - 0) / 100 = 1.2
    - SM2: (100 + 20 - 0 - 0) / 100 = 1.2

The rates appear equal but are incorrect because each manager only sees half of the total staked amount.

6. Correct rate should be: (200 + 20 - 0 - 0) / 200 = 1.1

The current design creates arbitrage opportunities and incorrect valuation of kHYPE tokens depending on which `StakingManager` users interact with.

## Recommendations

The `ValidatorManager` should track global staking totals, and `StakingManager` instances should query these global values for exchange rate calculations.




