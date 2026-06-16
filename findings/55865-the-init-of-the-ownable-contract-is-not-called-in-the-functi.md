---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/dex
protocol: "[[Eqifi]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-05-21-EqiFi.md"
genome:
  - "[[uninitialized-owner]]"
  - "[[admin-takeover]]"
  - "[[fot-slippage]]"
---
# The init of the ownable contract is not called in the function init. It is also necessary to determine exactly who will be the granter: the sender or the owner.

- id: 55865
- impact: HIGH
- protocol: [[Eqifi]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-05-21-EqiFi.md

## Summary


This bug report is about a problem with an image that is not displaying correctly on a website. The user has included a screenshot of the issue and has provided a brief description of the problem. They have also mentioned that the issue occurs when using a specific browser.

## Details

![image](https://github.com/user-attachments/assets/9043e66e-9eef-4802-8ecc-a2565f3de26b)
