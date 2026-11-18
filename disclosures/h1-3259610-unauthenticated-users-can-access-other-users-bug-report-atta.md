---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/idor
  - vuln/broken-access-control
  - vuln/info-disclosure
  - trigger/unauthenticated
  - trigger/auth-required
  - fix/authorization-checks
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2026-01-12
submitted: 2025-07-18T11:01:16.307Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "azraeldeathangel"
source: "https://hackerone.com/reports/3259610"
title: "Unauthenticated Users Can Access Other Users’ Bug Report Attachments via Broken Access Control"
---
# Unauthenticated Users Can Access Other Users’ Bug Report Attachments via Broken Access Control

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/3259610](https://hackerone.com/reports/3259610)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2025-07-18T11:01:16.307Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The `/BugReport/Admin/Attachment/{id}` endpoint exposes attachments linked to private bug reports.
By manipulating the numeric ID in the URL, it’s possible to access attachments belonging to other users, including sensitive bug reports, without proper authorization checks.

This vulnerability works **even when unauthenticated**, meaning anyone who knows or guesses valid IDs can retrieve attachments.
This is a classic **Insecure Direct Object Reference (IDOR)**, where the application fails to enforce access control on a direct object reference (the ID).

## References
- [OWASP Top Ten 2021 – A01:2021 Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- [CWE-639: Authorization Bypass Through User-Controlled Key](https://cwe.mitre.org/data/definitions/639.html)
- [OWASP IDOR Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)

## Impact

This vulnerability allows an attacker to access attachments from private bug reports submitted by other users by simply manipulating the ID parameter in the request. Since the endpoint lacks proper authorization checks and even responds when unauthenticated, sensitive internal information, such as unpatched security issues, confidential business data, or personally identifiable information, could be fully exposed. This significantly increases the risk of targeted attacks, information leaks, and reputational damage to the organization.

## System Host(s)
███████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Log in with any valid user account.
2. Capture the request when viewing a bug report attachment:
```
GET /BugReport/Admin/Attachment/1568600 HTTP/1.1

Host: █████████

Cookie: ████
```


3. Remove the entire `Cookie` header from the above request, so it looks like:
```
GET /BugReport/Admin/Attachment/1568600 HTTP/1.1

Host: █████████
```
4. Send the modified request without any authentication cookies.  
5. Observe that the server responds with the file contents of the bug report attachment.

**Result:** Any unauthenticated user can view attachments of any bug report by enumerating or guessing valid IDs.

## Suggested Mitigation/Remediation Actions
- Implement strict authorization checks on the `/BugReport/Admin/Attachment/{id}` endpoint to verify that the requesting user has permission to access the specified attachment.  
- Ensure that unauthenticated requests cannot retrieve any sensitive resources by enforcing authentication at this endpoint.  
- Use indirect references (e.g., random UUIDs or tokens) instead of sequential numeric IDs to reduce the risk of enumeration.  
- Apply the principle of least privilege: users should only be able to access resources they are explicitly authorized to view.  
- Add proper logging and monitoring for unauthorized access attempts to detect potential exploitation early.  
- Consider rate limiting to prevent mass enumeration of IDs.

## Timeline

- **Report Filed**
- **2025-07-18** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **2025-07-19** @azraeldeathangel: Awesome, thank you!
- **2025-07-22** @azraeldeathangel: Hi,

Recently, I found another issue that I reported under report ID 3254918, which both triagers marked as informative.

I wanted to ask if it would be alright for me to write and publish a public post about this finding, ensuring that I redact any sensitive information or details specific to your environment.

The goal is purely educational, to share details on the vulnerability issue itself and how similar checks could help others.

Please let me know if this is acceptable, or if there are specific restrictions or guidelines I should follow.

Thank you for your time and support.
- **2025-07-22** @agent-z1: Greetings @azraeldeathangel ,

Please refrain from posting anything until I can check with our program leadership concerning the other report.  We should have an answer for your within the next few days and I will tag you in the post here with the program's response.  Thank you!

Regards,
The VDP Team
- **2025-07-22** @azraeldeathangel: Thank you!
- **2025-07-26** @azraeldeathangel: Hi! Any update on this?
- **Report Resolved**
- **2025-07-29** @azraeldeathangel: Good day, the vulnerability has been resolved and patched in both authenticated and unauthenticated contexts.

May I request permission to disclose this publicly on my blog? I will ensure any sensitive details, such as the host and specific implementation data, are properly redacted.

████████
████████
- **2025-07-29** @agent-z1: Greetings @azraeldeathangel ,

You should be able to request disclosure of this report through the Hackerone platform.  This will place the report in our queue for redaction and publication.  Once released through Hackerone we would be happy to have you reference the finding on your blog.

Happy Hunting!

Regards,
The VDP Team
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
