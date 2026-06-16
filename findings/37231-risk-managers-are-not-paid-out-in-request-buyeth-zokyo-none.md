---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/oracle
protocol: "[[Trzn Finance]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-12-TRZN Finance.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
---
# Risk Managers Are Not Paid Out In `Request_BuyETH`

- id: 37231
- impact: HIGH
- protocol: [[Trzn Finance]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-12-TRZN Finance.md

## Summary


This bug report describes a problem where the risk managers are not being paid when a user requests to buy ETH using stable tokens through the Request_BuyETH function in VaultETH_V2. The severity of this issue is high and it has been resolved. The recommendation is to add transfers for the risk managers so they receive their payment.

## Details

**Severity** - High

**Status** - Resolved

**Description**

A user can request to buy ETH from the protocol in exchange with the stable tokens using the function Request_BuyETH in VaultETH_V2 . A portion of the ETH that should be sent to the user is reserved for the risk managers which is calculated at L380. 
After calculation of these amount the risk managers are not paid , just the amount to be transferred is calculated and stored into a local storage uint array.

**Recommendation**:

Add the transfers for the risk managers.
