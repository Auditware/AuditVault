---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2019-10-14
submitted: 2017-06-23T10:58:19.459Z
bounty_usd: null
votes: 27
cve: "CVE-2017-7521", "CVE-2017-7520", "CVE-2017-7508", "CVE-2017-7522"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "guido"
source: "https://hackerone.com/reports/242579"
title: "4 severe remote + several minor OpenVPN vulnerabilities"
---
# 4 severe remote + several minor OpenVPN vulnerabilities

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-10-14

- Report: [https://hackerone.com/reports/242579](https://hackerone.com/reports/242579)
- CWE: N/A | CVE: CVE-2017-7521, CVE-2017-7520, CVE-2017-7508, CVE-2017-7522
- Submitted: 2017-06-23T10:58:19.459Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

CVE-2017-7521 Remote server crashes/double-free/memory leaks in certificate processing
CVE-2017-7520 Remote (including MITM) client crash, data leak
CVE-2017-7508 Remote server crash (forced assertion failure)
CVE-2017-7522 Crash mbed TLS/PolarSSL-based server
(no cve) Remote/mitm Null-pointer dereference in establish_http_proxy_passthru()
(no cve) Stack buffer overflow if long –tls-cipher is given
(no cve) Remote (including MITM) client stack buffer corruption

https://community.openvpn.net/openvpn/wiki/VulnerabilitiesFixedInOpenVPN243
https://guidovranken.wordpress.com/2017/06/21/the-openvpn-post-audit-bug-bonanza/

## Timeline

- **Report Filed**
- **2017-06-24** @guido: Note: OSTIF have decided I will receive a bounty for this (but I don't know how much at this point). If this is not in accordance to your rules, please close this report.
- **2017-07-12** @arice: These are awesome findings.

One of our scoping principles is "[Mind the Gap](https://internetbugbounty.org/charter.html)" (focus our resources on areas without existing bounty coverage). We're coordinating with OpenVPN & OSTIF now to ensure we're not introducing redundant efforts. Stay tuned!
- **2017-08-22** @arice: @guido - Have you had any update from the OSTIF folks? We're still trying to track down the status of the OpenVPN bug bounty.
- **2017-08-22** @guido: Hello Alex

OSTIF has rewarded me and is going to double the reward for finalizing the OpenVPN fuzzers, which I'm currently working on.

So you can close this report. OSTIF told me they prefer not making the details around the rewards public until the final reward (for the fuzzers) has been given to me.
- **Not Eligible For Bounty**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
