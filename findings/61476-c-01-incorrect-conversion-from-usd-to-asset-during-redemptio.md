---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Blueberry]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Blueberry-security-review_2025-04-30.md"
genome:
  - "[[decimal-mismatch]]"
  - "[[fee-theft]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [C-01] Incorrect conversion from USD to asset during redemption

- id: 61476
- impact: HIGH
- protocol: Blueberry_2025-04-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Blueberry]]-security-review_2025-04-30.md

## Summary


The report states that there is a bug in the deposit and redeem functions of the protocol. This bug causes the user to receive more tokens than they originally deposited, leading to value inflation. For example, if the rate is 2 tokens for every 1 USD, and a user deposits 1 token (equivalent to 2 USD), the redeem function will return 4 tokens instead of the expected 1. This can cause severe financial loss for the protocol and can be exploited by users. The recommendation is to replace the multiplication in the redeem function with division to correctly convert from USD back to tokens.

## Details


## Severity

**Impact:** High

**Likelihood:** High

## Description

In the deposit() function, the conversion from asset amount to USD value is performed by multiplying the spot rate:
`        uint256 usdValue = escrow.getRate(details.spotMarket).mulWadDown(amount * scaler);
`
in the redeem() function, the conversion from USD back to asset is incorrectly also performed via multiplication:
`amount = escrow.getRate(details.spotMarket).mulWadDown(usdAmount);
`

This causes the user to receive more tokens than they originally deposited, leading to value inflation. For example, if the rate is 2 * 1e18 (i.e., 1 asset = 2 USD), and a user deposits 1e18 worth of assets (USD value = 2e18), the redeem logic will return:
`amount = 2e18 * 2e18 / 1e18 = 4e18`

This results in a 4x increase in asset amount, instead of the expected 1x. This error can cause severe financial loss to the protocol as users can exploit it to mint more tokens than they deposit.

## Recommendations

Replace the multiplication in the redeem() function with division to correctly convert from USD back to asset:

`amount = usdAmount.divWadDown(escrow.getRate(details.spotMarket));
`
