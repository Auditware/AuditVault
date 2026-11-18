---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/reflected-xss
  - env/cloud
  - stack/aws
substate: "informative"
weakness: "Reflected XSS"
enriched: true
body: true
date: 2024-12-24
submitted: 2024-10-17T10:41:51.743Z
bounty_usd: null
votes: 55
cve: "CVE-2022-29548"
program: "[[programs/aws_vdp|AWS VDP]]"
reporter: "perigou"
source: "https://hackerone.com/reports/2787650"
title: "Reflected XSS on Amazon EC2 Instance"
---
# Reflected XSS on Amazon EC2 Instance

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 55 | **Program:** AWS VDP | **Disclosed:** 2024-12-24

- Report: [https://hackerone.com/reports/2787650](https://hackerone.com/reports/2787650)
- CWE: Reflected XSS | CVE: CVE-2022-29548
- Submitted: 2024-10-17T10:41:51.743Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Product: Amazon Elastic Compute Cloud (Amazon EC2)

Vulnerability Type:  Reflected Cross-Site Scripting (XSS)

CVE: CVE-2022-29548
Severity:  Medium

Description:
 A reflected XSS vulnerability was discovered on the Amazon EC2 instance, allowing an attacker to inject malicious JavaScript code, potentially leading to unauthorized access to sensitive data or system compromise.
Proof of Concept:

URL: ███████);alert(document.domain)//

## Impact

## The payload is injected into the errorCode parameter, which is reflected back to the user without proper validation or sanitization. This allows an attacker to execute arbitrary JavaScript code in the context of the vulnerable page

## Timeline

- **Report Filed**
- **2024-10-17** @h1_analyst_everton: Hi ████████,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_everton
- **Report Severity Updated**
- **Report Pending Program Review**
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
