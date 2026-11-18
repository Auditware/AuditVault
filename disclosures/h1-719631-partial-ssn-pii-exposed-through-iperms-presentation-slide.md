---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - vuln/info-disclosure
  - impact/sensitive-data
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2019-12-02
submitted: 2019-10-22T03:15:50.117Z
bounty_usd: null
votes: 22
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "try__harder"
source: "https://hackerone.com/reports/719631"
title: "[Partial] SSN & [PII] exposed through iPERMs Presentation Slide."
---
# [Partial] SSN & [PII] exposed through iPERMs Presentation Slide.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 22 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-12-02

- Report: [https://hackerone.com/reports/719631](https://hackerone.com/reports/719631)
- CWE: Information Disclosure
- Submitted: 2019-10-22T03:15:50.117Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello @deptofdefense, when performing reconnaissance, I came across a presentation slide that displayed live data since the data is blocked out & is formatted with `XXX-XX` with the last 4 digits.

The exposed data contains the following: `UPC, Division/Brigade, Rank, Soldier Name, Last 4 digits of SSN, FRR (Financial Record Reviews), PRR (Personal Record Reviews).`

Here are a few exposed users:
████████, XXX-XX-█████████
████████, XXX-XX-█████

The link that is hosting the Presentation Slide: `https://████████/wp-content/uploads/2017/12/Introduction-to-iPERMS-Slides.pptx` & on Slide 25, there is the exposed data.

The remediation/mitigation for this security flaw is the removal of the data/file & I have set the severity to `Critical` as it is exposing sensitive [PII] which could lead to a data breach.

## Impact

The sensitive information can be used to authenticate through various web-portals especially with the last 4 digits & full name with rank.

## Timeline

- **Report Filed**
- **2019-10-22** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2019-10-22** @try__harder: Thank you sir!
- **Report Resolved**
- **Agreed On Going Public**
- **2019-10-25** @agent-r5: For info the PII was fictitious from system owner. Per your request, we will put this report in the queue for disclosure.
- **2019-10-25** @try__harder: Thanks boss :)
- **Agreed On Going Public**
- **Report Became Public**
