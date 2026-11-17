---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - stack/php
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2025-10-24
submitted: 2025-10-22T21:18:20.218Z
bounty_usd: null
votes: 93
cve: "CVE-2025-52664"
program: "[[programs/revive_adserver|Revive Adserver]]"
reporter: "kanon4"
source: "https://hackerone.com/reports/3395221"
title: "Error-Based & Time-Based SQL Injection in 'keyword' Parameter of admin-search.php Allowing Full Database Access in Revive Adserver v6.0.0"
---
# Error-Based & Time-Based SQL Injection in 'keyword' Parameter of admin-search.php Allowing Full Database Access in Revive Adserver v6.0.0

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 93 | **Program:** Revive Adserver | **Disclosed:** 2025-10-24

- Report: [https://hackerone.com/reports/3395221](https://hackerone.com/reports/3395221)
- CWE: SQL Injection | CVE: CVE-2025-52664
- Submitted: 2025-10-22T21:18:20.218Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Cve Id Added**
- **2025-10-23** @kanon4: Hi @mbeccati,

Thank you very much for your prompt response and confirmation of the vulnerability. I appreciate the detailed explanation about the root cause being in the unmaintained PEAR MDB2 package's `matchPattern` functionality.

Thank you very much for your prompt response and confirmation of the vulnerability. I appreciate the detailed explanation about the root cause being in the unmaintained PEAR MDB2 package's matchPattern functionality.

For attribution in the security advisory, I would like to be credited as:

**Mahmoud Khaled Kanon**

GitHub: https://github.com/Kanon4

I'm pleased to have contributed to improving the security of Revive Adserver. Finding vulnerabilities in widely-used open source software is important to me as it helps protect the broader internet ecosystem and the many businesses that rely on these platforms.

Will the CVE-2025-52664 be published on the NIST National Vulnerability Database (`nvd.nist.gov`) as well? I'm interested in tracking its official publication.


Thank you again for the swift and professional handling of this report. I look forward to the release of version 6.0.1 with the security fix.

Best regards,
@kanon4
- **2025-10-23** @mbeccati: Apologies, the previous fix was preventing the vulnerability, but it was generating a broken query. The attached file is now fully tested and working: {F4923816}
- **2025-10-23** @mbeccati: Yes, we will publish a security advisory on the full-disclosure mailing list and request the publication of the CVE at the same time. It will take a few days for it to be picked up by the CVE databases.
- **2025-10-23** @kanon4: Hi @mbeccati,

Thank you for providing the updated patch. I've thoroughly tested the new implementation and can confirm that the SQL injection vulnerability is successfully mitigated while maintaining all search functionality.{F4924886}

The queries are working correctly with no errors, and the input sanitization is properly handling user inputs.

I appreciate your transparency about the initial fix and your detailed information regarding the CVE publication process.

Thank you for your professional handling of this security report.

Best regards,
@kanon4
- **Report Resolved**
- **2025-10-23** @kanon4: Hi @mbeccati,

Thank you for the update. I'm glad the fix has been confirmed and will be included in tomorrow's release. It was a pleasure working with you on this security issue.

Appreciate your professionalism throughout the process.

Best regards,
@kanon4
- **Agreed On Going Public**
- **Manually Disclosed**
