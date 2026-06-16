---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/token
protocol: "[[Shoyu]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-08-30-Shoyu.md"
genome:
  - "[[init-constraint]]"
  - "[[dos-resistance]]"
  - "[[permanent]]"
---
# Exceeding of gas limit

- id: 56105
- impact: HIGH
- protocol: [[Shoyu]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-08-30-Shoyu.md

## Summary


The report states that deploying TokenFactory currently requires more gas than the maximum allowed on the Ethereum mainnet, causing it to fail. While it may still be possible to deploy on the mainnet, the tester was unable to confirm this. Additionally, the gas limit on the Binance Smart Chain is higher, so deployment may be successful there. The recommendation is to either reduce the gas required for deployment or provide information on which network the contracts can be successfully deployed on. The report concludes that the issue has been fixed and deployment now requires less than 15 million gas.

## Details

**Description**

Deploying TokenFactory requires 17,158,715 gas, since ethereum mainnet gas limit is 15
million it will be reverted. Theoretically it can be executed because when contracts are
deploying blockchain provides a separate block for each contract with their own limits, but I
can’t prove it with tests (it doesn't work), so I can’t guarantee that it will be deployed. Also on
binance smart chain limit is around 80 millions.

**Recommendation**:

Change TokenFactory constructor to be in the 15 million gas range. Or provide information
about on which network contracts will be deployed.

**Re-audit**:

Fixed, now contract deployment is under 15,000,000 gas.
