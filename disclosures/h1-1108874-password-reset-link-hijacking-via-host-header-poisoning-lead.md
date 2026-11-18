---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2021-04-02
submitted: 2021-02-22T16:48:14.027Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "hemantsolo"
source: "https://hackerone.com/reports/1108874"
title: "Password Reset link hijacking via Host Header Poisoning leads to account takeover"
---
# Password Reset link hijacking via Host Header Poisoning leads to account takeover

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 23 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-04-02

- Report: [https://hackerone.com/reports/1108874](https://hackerone.com/reports/1108874)
- CWE: Privilege Escalation
- Submitted: 2021-02-22T16:48:14.027Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
████████ uses the Host header when sending out password reset links. This allows an attacker to insert a malicious host header, leading to password reset link / token leakage.

## References
http://www.skeletonscribe.net/2013/05/practical-http-host-header-attacks.html
https://hackerone.com/reports/226659

## Impact

The victim will receive the malicious link in their email, and, when clicked, will leak the user's password reset link / token to the attacker, leading to full account takeover.

## System Host(s)
███

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1.) Open up Firefox and Burp Suite.
2.) Visit the forgot password page (http://██████/█████)
3.) Enter the victim's email address and click on SEND RESET LINK.
4.) Intercept the HTTP request in Burp Suite & change the Host Header to your malicious site/server ex. ███.
5.) Forward the request and you'll be redirected to your server.

The victim will then receive a password reset e-mail with your poisoned link.
If the victim clicks the link, the reset token will be leaked and the attacker will be able to find the reset token in the server logs. The attacker can then browse to the reset page with the token and change the password of the victim account!

## Suggested Mitigation/Remediation Actions
Use $_SERVER['SERVER_NAME'] rather than $_SERVER['HTTP_HOST']

## Timeline

- **Report Filed**
- **2021-02-22** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **Comments Closed**
