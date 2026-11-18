---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - trigger/session-cookie
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2022-05-24
submitted: 2022-04-06T21:18:50.626Z
bounty_usd: 200
votes: 13
cve: []
program: "[[programs/omise|Omise]]"
reporter: "oblivionlight"
source: "https://hackerone.com/reports/1532858"
title: "Cross-site scripting on dashboard2.omise.co"
---
# Cross-site scripting on dashboard2.omise.co

> **Severity:** Critical | **Bounty:** 200 USD | **Votes:** 13 | **Program:** Omise | **Disclosed:** 2022-05-24

- Report: [https://hackerone.com/reports/1532858](https://hackerone.com/reports/1532858)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2022-04-06T21:18:50.626Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Cross-site scripting (XSS) is an attack vector that injects malicious code into a vulnerable web application.
Stored XSS, also known as persistent XSS, is the more damaging of the two. It occurs when a malicious script is injected directly into a vulnerable web application.

Steps To Reproduce:
1. Log in to your account.
2. Visit https://dashboard.omise.co/test/settings 
3. Under Export - Specify the metadata that you want to include in your export option. Enter <script>alert(2)</script> in all four parameters including Charge, Transfer, Refund, Dispute.
4. Click on Update settings.
5. Click on Try our new dashboard, XSS will Trigger or log out and log in again, and XSS will Trigger.

POC:
Attached Video.

## Impact

Code injected into a vulnerable application can exfiltrate data or install malware on the user's machine. Attackers can masquerade as authorized users via session cookies, allowing them to perform any action allowed by the user account.

## Timeline

- **Report Filed**
- **2022-04-07** @swathiramya: Hi,
Thanks for your report.
We are working to verify your findings and will update the report once completed. 
This normally is quite fast, expect an answer latest within a few days.

Thank you for your research!
Omise Security
- **Report Triaged**
- **2022-04-10** @oblivionlight: If you add </script><script>prompt('Hacked_by_Oblivion')</script> payload in Charge parameter, It triggers XSS there as well.
- **Bounty Awarded**
- **Report Resolved**
- **2022-04-25** @oblivionlight: Hi, @hardymansen @swathiramya on retesting I found that the issue has not been resolved as I can still reproduce it.
- **2022-04-25** @hardymansen: Thank you, yes. We have a internal ticket. As they have internal SLA up to 3 months to fix i wanted to give reward before so you don't have to wait. We could keep the ticket open probably. The UI in hackerone is not that good to have too many tickets open. So i can't see anything :)
- **2022-04-25** @oblivionlight: Okay, thanks for the bounty!
- **Agreed On Going Public**
- **2022-05-20** @oblivionlight: As it has been resolved can we disclose it? @hardymansen @swathiramya
- **2022-05-23** @hardymansen: Haha, you know more then me. Let me verify that it is resolved.
- **2022-05-23** @hardymansen: So it seems: "This issue occurred because dashboard v1 executed some JavaScript when loading dashboard v2. This was previously used to authenticate dashboard v2, but was replaced with a different implementation some time ago. I removed the unused code, which should prevent the XSS attack."

I will let Swathi double check then we can disclose.
- **Agreed On Going Public**
- **Report Became Public**
