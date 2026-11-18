---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - vuln/sql-injection
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2022-05-11
submitted: 2021-11-03T07:38:44.479Z
bounty_usd: null
votes: 10
cve: "CVE-2021-43608"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "nickvergessen"
source: "https://hackerone.com/reports/1390331"
title: "SQL injextion via vulnerable doctrine/dbal version"
---
# SQL injextion via vulnerable doctrine/dbal version

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Nextcloud | **Disclosed:** 2022-05-11

- Report: [https://hackerone.com/reports/1390331](https://hackerone.com/reports/1390331)
- CWE: SQL Injection | CVE: CVE-2021-43608
- Submitted: 2021-11-03T07:38:44.479Z

## Report summary

Advisory at https://github.com/nextcloud/security-advisories/security/advisories/GHSA-539w-xvpg-wj29

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
SQL injection via limit parameter on user facing APIs

## Steps To Reproduce:
Run security scanner:

  1. REPORT /remote.php/dav/comments/files/1985
  1. XML input oc:filter-comments.oc:limit#text was set to 1'"
  1. You have an error in your SQL syntax

## Supporting Material/References:
For more details see:
https://github.com/nextcloud-gmbh/h1/issues/197

## Impact

Full flexed SQL injection via user provided input

## Timeline

- **Report Filed**
- **2021-11-03** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Not Eligible For Bounty**
- **Report Triaged**
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
