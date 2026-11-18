---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - vuln/cors-misconfig
  - vuln/dos
  - trigger/cors-origin
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Due of closing of report (ID #2102315) I will summarize total reproducible report here

## Summary:
DOS of RSKJ server

## Steps To Reproduce:

  1. download https://github.com/rsksmart/rskj/releases/download/FINGERROOT-5.0.0/rskj-core-5.0.0-FINGERROOT-all.jar
  2. at server side run
```
 java -classpath rskj-core-5.0.0-FINGERROOT-all.jar -Drpc.providers.web.cors=* -Drpc.providers.web.ws.enabled=true co.rsk.Start
```
it opens `UDPv6` port `5050`

  3. at client side install python3 and library `pip install pysha3`, download  {F2591198},  modify `HOST` inside and run it against server.
  4.the `UDPServer` is going to process *only* one UDP packet forever and it prevents to process other packages received from different nodes. In a while (some minutes left) the application crashes.

## Supporting Material/References:
The root cause:
bytesToLength returns -5 and length becomes 0
https://github.com/rsksmart/rskj/blob/master/rskj-core/src/main/java/org/ethereum/util/RLP.java#L432
this is legal
https://github.com/rsksmart/rskj/blob/master/rskj-core/src/main/java/org/ethereum/util/RLP.java#L440
and position is unchangeable
https://github.com/rsksmart/rskj/blob/master/rskj-core/src/main/java/org/ethereum/util/RLP.java#L405
https://github.com/rsksmart/rskj/blob/master/rskj-core/src/main/java/org/ethereum/util/RLP.java#L403

## Impact

Server stops to process the incoming traffic at `UDPv6` port `5050`. In a while the application crashes as Out of memory.
due of everywhere usage of vulnerable function `decode2` there may be affected another entry points of service.

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
