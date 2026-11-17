---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-input-validation
  - env/web
substate: "not-applicable"
weakness: "Improper Input Validation"
enriched: true
date: 2025-08-12
submitted: 2025-08-12T08:35:52.026Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/curl|curl]]"
reporter: "spectre-1"
source: "https://hackerone.com/reports/3295656"
title: "Unsafe Global IFS Modification in OS400 Shell Script Enables Command Injection and Parsing Flaws (CWE-78/CWE-20)"
---
# Unsafe Global IFS Modification in OS400 Shell Script Enables Command Injection and Parsing Flaws (CWE-78/CWE-20)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** curl | **Disclosed:** 2025-08-12

- Report: [https://hackerone.com/reports/3295656](https://hackerone.com/reports/3295656)
- CWE: Improper Input Validation
- Submitted: 2025-08-12T08:35:52.026Z

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2025-08-12** @spectre-1: I filled the reports for the following reasons. I felt that it is or was my responsibility to do so as a professional bug bounty hunter. I do apologize if the reports did not meet your requirements. 


1.    Supply Chain Risk: Exposed private keys, credentials, and insecure scripts can be abused for impersonation, data decryption, or injection of malicious code into downstream dependencies and CI/CD pipelines.
2.    High Severity: Security best practices and compliance standards (PCI-DSS, GDPR, etc.) require immediate remediation and documentation of such exposures—even if discovered in tests or documentation.
 3.   User and Ecosystem Protection: ‘Harmless’ examples are often reused in production; unreported secrets may be repurposed, putting users and partners at risk across the software ecosystem.
 4.  Security Hygiene: Leaving sensitive data or insecure examples in a public repo undermines user trust and may mislead contributors, increasing risk of insecure code reuse.
 5.  Actionable, Responsible Disclosure: Only the project can verify whether secrets are in use—responsible, precise reporting allows maintainers to confirm, rotate, or safely ignore as appropriate.
6.    Automated & Auditable Process: Formal bug reports ensure issues are triaged, tracked, and not neglected. They also help satisfy compliance audits and open source project security certifications.
- **Comments Closed**
