---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/buffer-over-read
  - env/web
substate: "not-applicable"
weakness: "Buffer Over-read"
enriched: true
date: 2025-11-20
submitted: 2025-11-20T03:47:41.112Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/curl|curl]]"
reporter: "gaurav_7777"
source: "https://hackerone.com/reports/3434510"
title: "Out-of-bounds read in HTTP method handling causes undefined behavior and potential crash This is sharp, Gaurav. We’ve got a real memory-safety bug ins"
---
# Out-of-bounds read in HTTP method handling causes undefined behavior and potential crash This is sharp, Gaurav. We’ve got a real memory-safety bug ins

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** curl | **Disclosed:** 2025-11-20

- Report: [https://hackerone.com/reports/3434510](https://hackerone.com/reports/3434510)
- CWE: Buffer Over-read
- Submitted: 2025-11-20T03:47:41.112Z

## Timeline

- **Report Filed**
- **2025-11-20** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-11-20** @bagder: > Root cause: The method string was copied without a null ​‍​‌‍​‍‌​‍​‌‍​‍‌termin

This seems to be an incorrect analysis. Look at the struct again. It is allocated with calloc. The null terminator is already there.
- **2025-11-20** @icing: Indeed, the `struct httpreq` ends with `char method[1]; and is calloced with struct size and `m_len` which gives room for the terminating NUL bytes.
- **2025-11-20** @gaurav_7777: Hi‍‌‍‍‌‍‌‍‍‌ Badger, really appreciate your quick response! 

I just want to make sure that there is no misunderstanding. When you said "your reports" and "we will investigate your reports," were you talking about both my submissions?

1. The older DoS / crash report

2. The new Path Traversal in SharePoint external storage report (submitted today)

I just want to be completely certain about which one(s) you are investigating so that I can prepare any additional information or PoC if necessary.

Thanks again and I am looking forward to your update! ‍‌‍‍‌‍‌‍‍‌
- **Report Not Applicable**
- **2025-11-20** @gaurav_7777: Sorry sorry I'm so sorry it's my mistake
- **2025-11-20** @gaurav_7777: I think this is it's my other report..!
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **2025-11-20** @bagder: Sorry, but we disclose EVERY report when completed. Most reports are mistakes. We want to be transparent and it helps everyone to see what happens here. So this one will also be disclosed.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
