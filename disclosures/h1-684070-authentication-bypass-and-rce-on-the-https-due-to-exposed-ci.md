---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
  - vuln/code-injection
  - vuln/authentication-bypass
  - vuln/misconfiguration
  - impact/rce
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2021-01-12
submitted: 2019-08-29T01:13:11.963Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/684070"
title: "Authentication bypass and RCE on the https://████ due to exposed Cisco TelePresence SX80 with default credentials"
---
# Authentication bypass and RCE on the https://████ due to exposed Cisco TelePresence SX80 with default credentials

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 30 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-01-12

- Report: [https://hackerone.com/reports/684070](https://hackerone.com/reports/684070)
- CWE: Improper Authentication - Generic
- Submitted: 2019-08-29T01:13:11.963Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Description
Hello. I was able to identify Cisco TelePresence SX80 device located on the https://█████
According to the IP Info: https://ipinfo.io/████████it belongs to ASN with ID 
```
███████
```
so it's likely in scope of the program.
The mentioned instance has default credentials `████`

##POC
https://███████
Login with `█████████`
████
Since we are logged in as ███, we can completely control the device and all connections, and add our startup scripts via https://██████████/web/scripts

##Suggested fix
Change the credentials and likely you will need to reset the device

## Impact

Potential device compromise and code execution. This devices are used mainly for trainings, briefings, and demonstration rooms, as well as auditoriums, so attacker with full control of the device potentially can intercept the data (RCE potential is interesting, but ability to silently compromise the device and use it as backdoor can be much more harmful).

## Timeline

- **Report Filed**
- **2019-08-29** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-08-29** @ag3nt-j1: I've been waiting for a report like this so I could attach this pic.
- **Report Severity Updated**
- **Report Triaged**
- **2019-08-29** @sp1d3rs: Haha cool pic @ag3nt-j1 ! I saved it:)

The most interesting part here, I read the docs about TelePresence SX80 configuration today more carefully, and it by default has blank password at all. So it's likely someone changed/set password to `████` :)
██████
- **2019-10-29** @sp1d3rs: As part of my monthly reports recheck process, it's notification that this report was resolved and credentials changed.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
