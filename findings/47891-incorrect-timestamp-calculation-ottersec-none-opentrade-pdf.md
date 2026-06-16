---
tags:
  - lang/solidity
  - platform/ottersec
  - severity/high
  - sector/lending
protocol: "[[OpenTrade]]"
auditors:
  - "[[Nicholas R. Putra]]"
report: "https://www.open-trade.io/"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Incorrect Timestamp Calculation

- id: 47891
- impact: HIGH
- protocol: [[OpenTrade]]
- reporter: Nicholas R. Putra (OtterSec)
- source: https://www.open-trade.io/

## Summary


This bug report discusses an issue with the calculateSchedule function in the Loan contract. This function is important for determining timestamps that mark different phases in the loan process. However, there is a vulnerability in the formula used to calculate the earlyRedeemRequestClosingTimestamp, which is the deadline for requesting early redemption of assets from the loan. The issue is caused by a redundant operation that subtracts the transferInWindowDurationDays from itself. To fix this, the formula should be changed to add the transferInWindowDurationDays to the transferOutWindowDurationDays. This bug has been fixed in a recent patch.

## Details

## Vulnerability Report: calculateSchedule in Loan

The function `calculateSchedule` within the Loan contract is crucial for determining and configuring several critical timestamps that delineate different phases within the loan life cycle.

### Affected File
- **Location:** `contracts/Loan.sol`
- **Language:** Solidity

### Function Definition
```solidity
function calculateSchedule() internal {
    [...]
    earlyRedeemRequestClosingTimestamp =
        accrualStartTimestamp +
        (settings.durationDays -
        settings.transferInWindowDurationDays -
        settings.transferInWindowDurationDays) *
        (1 days);
    [...]
}
```

### Description of the Vulnerability
The vulnerability emerges from the calculation of `earlyRedeemRequestClosingTimestamp` within `calculateSchedule`. This timestamp represents the deadline for requesting early redemption of assets from the loan. 

The issue arises from the flawed formula utilized for calculations. Specifically, it subtracts `transferInWindowDurationDays` from itself, as shown in the code snippet above, resulting in a redundant operation and assigning an incorrect value to the timestamp.

### Remediation
Change the formula used for the calculation of `earlyRedeemRequestClosingTimestamp` so that `transferInWindowDurationDays` is added to `transferOutWindowDurationDays`.

Updated function definition:

```solidity
function calculateSchedule() internal {
    [...]
    earlyRedeemRequestClosingTimestamp =
        accrualStartTimestamp +
        (settings.durationDays -
        settings.transferInWindowDurationDays -
        settings.transferOutWindowDurationDays) *
        (1 days);
    [...]
}
```

### Patch
- **Fixed in commit:** 6249748.
