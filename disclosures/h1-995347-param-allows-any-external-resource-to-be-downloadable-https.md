---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2021-03-11
submitted: 2020-10-01T04:20:06.081Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "x3ph_"
source: "https://hackerone.com/reports/995347"
title: "param allows  any external resource to be downloadable | https://████████"
---
# param allows  any external resource to be downloadable | https://████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-03-11

- Report: [https://hackerone.com/reports/995347](https://hackerone.com/reports/995347)
- CWE: Improper Access Control - Generic
- Submitted: 2020-10-01T04:20:06.081Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
The following param allows an attacker to trick people into downloading malicious files, scripts and other payloads.

https://██████████?url=https://<MaliciousURL>

PoC

1. I will show you how the page looks normally without any changes. If you directly access https://███ you will be shown the following page. You can click on 'Click to download' but nothing happens.

█████

2. I replace the download param with the url param and entered my attacking vps server ip address as the URL and execute.

█████

3. On my attacking vps server (The black console) you can see that i have received the request from my personal computers ip address showing that it is 100% possible to perform this attack.

https://██████████?url=https://████/poc

████████

## Impact
If an attacker abuses this vulnerability he/she will be able to compromise accounts, computers and identities of people. Potentially Military staff if the attacker had bad intentions.

## Step-by-step Reproduction Instructions

1. Navigate to https://███████
2. Click on 'Click to download'
3. Replace download with url
4. Type in a url and click download

## Product, Version, and Configuration (If applicable)

## Suggested Mitigation/Remediation Actions
Dev needs to add validation to the url param so that it doesn't allow external resources to be downloadable.

Resources:

The only article i can find pertaining to this type of vulnerability

https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html

## Impact

If an attacker abuses this vulnerability he/she will be able to compromise accounts, computers and identities of people. Potentially Military staff if the attacker had bad intentions.

## Timeline

- **Report Filed**
- **2020-10-01** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Title Updated**
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **2020-10-01** @agent-l8: I misunderstood you, thanks for the information. Was able to validate on ours as well. Thanks!
- **Report Triaged**
- **2020-10-01** @x3ph_: For security reasons i have taken down my http server. Please let me know if you need it back online :)
- **2020-10-01** @agent-l8: no worries, thanks!
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
