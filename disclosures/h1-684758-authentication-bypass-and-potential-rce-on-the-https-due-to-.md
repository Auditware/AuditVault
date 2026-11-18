---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
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
date: 2024-07-19
submitted: 2019-08-29T22:32:24.468Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/684758"
title: "Authentication bypass and potential RCE on the https://████ due to exposed Cisco TelePresence SX80 with default credentials"
---
# Authentication bypass and potential RCE on the https://████ due to exposed Cisco TelePresence SX80 with default credentials

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-07-19

- Report: [https://hackerone.com/reports/684758](https://hackerone.com/reports/684758)
- CWE: Improper Authentication - Generic
- Submitted: 2019-08-29T22:32:24.468Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Description
Hello. I was able to identify another one Cisco TelePresence SX80 device located on the https://████████ right near the previous device `████` (after #684070 report I decided to check ████* range)
According to the IP Info: https://ipinfo.io/AS257/████0/24 it belongs to ASN with ID 
```
AS257 ███
```

The mentioned instance has same credentials `admin:admin`.
This instance is different and less used, the logs reveals that last time device was used in 2017 year.

##POC
https://████████
Login with `admin:admin`
███████
Since we are logged in as admin, we can completely control the device and all connections, and add our startup scripts via https://███████/web/scripts thus achiecing code execution.

##Suggested fix
Change the credentials and likely you will need to reset the device to factory settings

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
- **2019-08-30** @sp1d3rs: Just found another (third and last) device on the http://██████████████████, but this time default creds didn't work.
It can indicate that this device is safe, however it worth to check it too from "defense in depth" point of view, just in case someone could compromise the device and change the default password (normally it shouldn't be exposed to the internet and should be accessible from local network only), because 2/3 devices found in this range had default creds.
- **Report Severity Updated**
- **Report Triaged**
- **2019-10-29** @sp1d3rs: As part of my monthly reports recheck process, it's notification that this report was resolved and credentials changed.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
