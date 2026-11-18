---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/idor
  - vuln/info-disclosure
  - impact/sensitive-data
  - trigger/unauthenticated
  - trigger/auth-required
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2018-04-15
submitted: 2017-09-01T17:49:07.616Z
bounty_usd: null
votes: 22
cve: []
program: "[[programs/concretecms|Concrete CMS]]"
reporter: "testdefense"
source: "https://hackerone.com/reports/265284"
title: "'cnvID' parameter vulnerable to Insecure Direct Object References"
---
# 'cnvID' parameter vulnerable to Insecure Direct Object References

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 22 | **Program:** Concrete CMS | **Disclosed:** 2018-04-15

- Report: [https://hackerone.com/reports/265284](https://hackerone.com/reports/265284)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2017-09-01T17:49:07.616Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Installation Information
===
IIS 8, PHP 5.5, Concrete5 (5.7.5.7) [Default install]
### Issue POC
An unauthenticated user can enumerate comments from all blog posts by POSTing requests to /index.php/tools/required/conversations/view_ajax with incremental 'cnvID' integers.

1. An example blog with permissions set for READ/WRITE to Administrators only {F217708}
2. A comment entry with sensitive data (this could be PII or any other type of sensitive data posted by users) {F217710}
3. POST request by a malicious user without authentication {F217711}
4. Enumeration of comments via brute of 'cnvID' {F217712}

Remediation
---
Preventing insecure direct object references requires selecting an approach for protecting each user accessible object (e.g., object number, filename):
1. Use per user or session indirect object references. This prevents attackers from directly targeting unauthorized resources. For example, instead of using the resource’s database key, a drop down list of six resources authorized for the current user could use the numbers 1 to 6 to indicate which value the user selected. The application has to map the per-user indirect reference back to the actual database key on the server. OWASP’s ESAPI includes both sequential and random access reference maps that developers can use to eliminate direct object references.
2. Check access. Each use of a direct object reference from an untrusted source must include an access control check to ensure the user is authorized for the requested object.

References
---
[OWASP Top 10 2010-A4-Insecure Direct Object References](https://www.owasp.org/index.php/Top_10_2010-A4-Insecure_Direct_Object_References)
Also, crayons

## Timeline

- **Report Filed**
- **2017-09-01** @testdefense: Confirmed up to version 5.7.5.13
- **Report Triaged**
- **2017-10-02** @testdefense: Thank you for the update
- **2017-10-18** @testdefense: For my reference: Confirmed up to version 5.8.2.1
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
