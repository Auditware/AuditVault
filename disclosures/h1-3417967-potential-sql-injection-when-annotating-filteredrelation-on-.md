---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - stack/python
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2025-12-02
submitted: 2025-11-09T20:26:45.250Z
bounty_usd: null
votes: 52
cve: "CVE-2025-57833", "CVE-2025-59681"
program: "[[programs/django|Django]]"
reporter: "stackered"
source: "https://hackerone.com/reports/3417967"
title: "Potential SQL Injection when annotating FilteredRelation on PostgreSQL"
---
# Potential SQL Injection when annotating FilteredRelation on PostgreSQL

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 52 | **Program:** Django | **Disclosed:** 2025-12-02

- Report: [https://hackerone.com/reports/3417967](https://hackerone.com/reports/3417967)
- CWE: SQL Injection | CVE: CVE-2025-57833, CVE-2025-59681
- Submitted: 2025-11-09T20:26:45.250Z

## Timeline

- **Draft Started**
- **Report Filed**
- **2025-11-10** @jacobtylerwalls: Hi stackered,

Thank you for your report. We will investigate and get back to you soon. In the meantime, please keep this information confidential.

If you haven't already, please review how the Django security team evaluates reports: https://docs.djangoproject.com/en/dev/internals/security/.

Note that it can take several weeks before we have completed our analysis. There is no need to chase the security team unless you discover new, relevant information. All reports aim to be resolved within the industry-standard 90 days.

Best,
Jacob
- **2025-11-18** @jacobtylerwalls: Hello stackered,

Thank you for your report and patience. We have confirmed the vulnerability, which has been assigned CVE-2025-13372.

I have attached our proposed mitigation solution. Could you please test the patch to ensure it reliably fixes the issue?

We plan to mention the discoverer of the vulnerability in a blog post. Is "stackered" okay, or would you prefer to be credited differently?

The Django release with this fix is currently planned for Dec 2. Please keep this private until after the updated versions are published.
{F5022077}
Thank you again!
- **Report Triaged**
- **2025-11-19** @stackered: Hello Jacob,

I have tested the proposed patch and can no longer reproduce the issue.

Stackered is okay for the credit, thanks.

Have a nice day !
- **Report Resolved**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
