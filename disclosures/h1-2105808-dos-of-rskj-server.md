---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2025-06-13
submitted: 2023-08-10T20:59:30.691Z
bounty_usd: 5000
votes: 121
cve: []
program: "[[programs/rootstocklabs|Rootstock Labs]]"
reporter: "spacewasp"
source: "https://hackerone.com/reports/2105808"
title: "DOS of RSKJ server"
---
# DOS of RSKJ server

> **Severity:** High | **Bounty:** 5,000 USD | **Votes:** 121 | **Program:** Rootstock Labs | **Disclosed:** 2025-06-13

- Report: [https://hackerone.com/reports/2105808](https://hackerone.com/reports/2105808)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2023-08-10T20:59:30.691Z

## Timeline

- **Report Filed**
- **2023-08-11** @vrongusername: Hello @spacewasp,

Thank you for your report! We're analysing it internally.
- **2023-08-15** @vrongusername: Hello @spacewasp,

We confirmed the issue and working on the fix.

We also would like to know your opinion on whether restricting `bytesToLength` to return only non-negative values would be a sufficient fix?

Thank you!
- **2023-08-15** @spacewasp: Hello!
Nice to here it (for me as researcher). Yes, it does.
It **might** also be worth to check the size
https://github.com/rsksmart/rskj/blob/master/rskj-core/src/main/java/org/ethereum/util/RLP.java#L490
Because `int length` is only 4 bytes long, no reason to run `for` cycle more then 4 steps
I would create the check condition before it like
```java
if( size > Integer.BYTES )
    throw new Exception(...);
```
if you don't expect trailing `0` before the length like
`"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x12\x23"`
- **2023-09-07** @vrongusername: Hello @spacewasp,

We've released the fix https://github.com/rsksmart/rskj/commit/6965fa60f743d911ee106b542cec80a1417266b1 and will get in touch with you soon.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
