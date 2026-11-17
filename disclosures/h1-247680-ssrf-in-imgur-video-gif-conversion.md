---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2020-08-13
submitted: 2017-07-10T11:16:05.097Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/imgur|Imgur]]"
reporter: "mariuszdeepsec"
source: "https://hackerone.com/reports/247680"
title: "SSRF in imgur video GIF conversion"
---
# SSRF in imgur video GIF conversion

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Imgur | **Disclosed:** 2020-08-13

- Report: [https://hackerone.com/reports/247680](https://hackerone.com/reports/247680)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2017-07-10T11:16:05.097Z

## Timeline

- **Report Filed**
- **2017-07-10** @Imgur: Hello! Thanks for taking the time to make this report to the Imgur security team! We look forward to reviewing and assessing the risk of this vuln. In the meantime, we ask that you sit tight while we get to it - we're a small team and sometimes it takes us a while to verify all reports. Please don't ask for updates as these take time and effort away from the reports we're working through and make our response time slower across the board. Thanks - we'll be in touch soon!
- **2017-07-10** @mariuszdeepsec: I saw the raport here -> https://hackerone.com/reports/115857

but this issue is resolved so assumed as fixed, i found out that it isint so i consider this a a security risk and  a vulnerability. Due to a updated ffmpeg i think there is no more local file read so only SSRF exists.
- **2017-07-17** @mariuszdeepsec: @imgur team, any response ?
- **2017-08-14** @mariuszdeepsec: @imgur any first response to the vulnerability?
- **2017-08-14** @mariuszdeepsec: The vulnerability is still presented
{F212507}
- **Report Triaged**
- **Bounty Awarded**
- **2018-01-19** @mariuszdeepsec: ok, hanks for the bounty !
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
