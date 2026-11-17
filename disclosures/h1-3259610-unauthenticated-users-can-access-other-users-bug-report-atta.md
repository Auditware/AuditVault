---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
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
