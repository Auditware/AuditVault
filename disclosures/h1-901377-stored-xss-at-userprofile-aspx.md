---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - impact/credential-theft
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2020-07-08
submitted: 2020-06-18T04:37:20.849Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "5050thepiguy"
source: "https://hackerone.com/reports/901377"
title: "Stored XSS at ██████userprofile.aspx"
---
# Stored XSS at ██████userprofile.aspx

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-07-08

- Report: [https://hackerone.com/reports/901377](https://hackerone.com/reports/901377)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-06-18T04:37:20.849Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Stored XSS vulnerability exists at ██████████userprofile.aspx under "say something about yourself...". XSS can be used for a variety of attacks. 

## Impact
XSS can be used to steal cookies, password or to run arbitrary code in the victim's browser. 

## Step-by-step Reproduction Instructions

1. Create an account at ███████
2. Go to your profile at ████userprofile.aspx
3. Go to "Say something about yourself..." and enter the XSS payload xxx<svg/onload=alert(document.cookie);>xxx
4. Observe that XSS triggers and reload the page to observe that it is stored XSS.

## Product, Version, and Configuration (If applicable)
███userprofile.aspx#

## Suggested Mitigation/Remediation Actions
Use secure coding techniques such as sanitizing input into form fields so attackers cannot inject scripts to perform XSS attacks. XSS vulnerabilities come from a lack of data escaping. 

##References
https://hackerone.com/reports/858255
https://dzone.com/articles/reflected-xss-explained-how-to-prevent-reflected-x
https://www.imperva.com/learn/application-security/reflected-xss-attacks/
https://www.hacksplaining.com/prevention/xss-reflected

## Impact

XSS can be used to steal cookies, password or to run arbitrary code in the victim's browser.

## Timeline

- **Report Filed**
- **2020-06-18** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2020-06-29** @5050thepiguy: Hi @agent-l8, that's great! I'm glad it worked out. Can we please disclose this? Thanks.
- **Agreed On Going Public**
- **2020-06-29** @agent-l8: Added to the queue
- **2020-06-29** @5050thepiguy: thanks @agent-l8
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
