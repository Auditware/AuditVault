---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - stack/python
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2025-11-06
submitted: 2025-09-12T00:19:20.037Z
bounty_usd: null
votes: 77
cve: []
program: "[[programs/django|Django]]"
reporter: "cyberstan"
source: "https://hackerone.com/reports/3335709"
title: "SQL Injection in Django ORM via Unvalidated `_connector` in Q Objects"
---
# SQL Injection in Django ORM via Unvalidated `_connector` in Q Objects

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 77 | **Program:** Django | **Disclosed:** 2025-11-06

- Report: [https://hackerone.com/reports/3335709](https://hackerone.com/reports/3335709)
- CWE: SQL Injection
- Submitted: 2025-09-12T00:19:20.037Z

## Timeline

- **Report Filed**
- **2025-09-17** @jacobtylerwalls: Hello,
Thank you for your report. We will investigate and get back to you soon. In the meantime, please keep this information confidential.
If you haven't already, please review how the Django security team evaluates reports: ​https://docs.djangoproject.com/en/dev/internals/security/.
Note that it can take several weeks before we have completed our analysis. There is no need to chase the security team unless you discover new, relevant information. All reports aim to be resolved within the industry-standard 90 days.
Kind regards, the Django Security Team.
- **Report Triaged**
- **2025-09-30** @jacobtylerwalls: Thanks for this report. The security team is still finalizing its evaluation.
Best,
Jacob
- **2025-10-14** @jacobtylerwalls: Hello cyberstan,

Thank you for your report and patience. We have confirmed the vulnerability and will request a CVE.

I have attached our proposed mitigation solution. Could you please test the patch to ensure it reliably fixes the issue?

We plan to mention the discoverer of the vulnerability in a blog post. Is "cyberstan" okay, or would you prefer to be credited differently?

The Django release with this fix is currently planned for November 5. Please keep this private until after the updated versions are published.

Thank you again!
Django Security Team
- **2025-10-14** @cyberstan: Hi Django  Team,

Thank you for the update and the patches.

I have applied the three patches to a clean checkout of the main branch and can confirm that they successfully prevent the vulnerability and now correctly raises a ValueError and prevents the SQL injection.

Regarding crediting, "cyberstan" is perfectly fine.

Thank you again for the quick and professional handling of this report.

Best regards,
Stan
- **Report Resolved**
- **2025-11-06** @cyberstan: Can we disclose this?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Not Eligible For Bounty**
