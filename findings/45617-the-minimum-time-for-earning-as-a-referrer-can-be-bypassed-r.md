---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/perpetuals

protocol: "[[Filament]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-08-15-Filament.md"
genome:
  - "[[wrong-condition]]"
  - "[[timestamp-dependence]]"
  - "[[fee-theft]]"
---
# The minimum time for earning as a referrer can be bypassed resulting in user claiming earnings before the minimum time.

- id: 45617
- impact: HIGH
- protocol: [[Filament]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-08-15-Filament.md

## Summary


The bug report states that there is an issue with the `Referrals.sol` smart contract, specifically with the `addEarnings` function. This function is used to set earnings for a referrer. However, it does not check if the referrer is valid to receive these earnings. To fix this, the recommendation is to call the `isValidForEarnings` function inside the `addEarnings` function to ensure that only valid referrers receive earnings. This bug has been marked as resolved.

## Details

**Severity**: High	

**Status**: Resolved

**Description**

For a referrer to be valid to earn, a minimum of X days since referring should have passed. This is checked by the `isValidForEarning()` function in the `Referrals.sol` smart contract. The issue is that the function `addEarnings` which is used to set the earnings for a referrer does not check if a referrer is valid to get these earnings.

**Recommendation**:

Call the isValidForEarnings function inside the addEarnings function in order to assert that the referrer is a valid earner.
