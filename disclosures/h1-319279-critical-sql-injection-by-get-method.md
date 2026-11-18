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
date: 2018-03-06
submitted: 2018-02-24T01:24:25.947Z
bounty_usd: null
votes: 22
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "securitygab"
source: "https://hackerone.com/reports/319279"
title: "[critical] sql injection by GET method"
---
# [critical] sql injection by GET method

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 22 | **Program:** Khan Academy | **Disclosed:** 2018-03-06

- Report: [https://hackerone.com/reports/319279](https://hackerone.com/reports/319279)
- CWE: SQL Injection
- Submitted: 2018-02-24T01:24:25.947Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hey there, after tampering a bit with the values, since I figured out your backend is not php (most likely django or nodejs), I found an SQL injection .
You can view my steps to reproduce, if you need additional screenshots, please let me know.
Regards Gabriel Kimiaie

## Impact

If I dig deeper, I may be able to read datas from your database, hopefully I won't do it.

The hacker selected the **SQL Injection** weakness. This vulnerability type requires contextual information from the hacker. They provided the following answers:

**Verified**
Yes

**What exploitation technique did you utilize?**
Boolean

**Please describe the results of your verification attempt.**
After submitting a single quote, I got the 500 error. after few steps, I got rid of the 500 error by forging a valid sql query which is as follows:
https://www.khanacademy.org/translations/videos/en'%20or'1'=='1_youtube_stats.csv 
it returns to me all csv since 1 is equal to one
when changing the boolean condition:
https://www.khanacademy.org/translations/videos/en'%20AND'1'=='0_youtube_stats.csv
(and '1'=='0): only the english csvs are shown.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-02-26** @drosile: Thanks, this should now be fixed – can you confirm? Now if you try to do a SQL injection on that route, it won't get recognized and does a redirect to another page, which doesn't end up working because of the strange input.

If you send me your Khan Academy account email or username I'd be happy to give you our [Friendly Hacker](https://www.khanacademy.org/badges/friendly-hacker) badge.
- **2018-02-27** @securitygab: Hello, I confirm the SQL injection isn't exploitable anymore. my username on Khanacademy is mirage355ak, I just created this account and I'm thanksful regarding your proposition. Regards, Gabriel
- **2018-02-27** @benkraftka: Thanks, the badge should be added to your account today!
- **2018-02-27** @securitygab: Thanks ! Shall we close as resolved and disclose ? Many thanks and regards :)
- **2018-02-28** @securitygab: Any update on this ? Kind regards
- **Report Resolved**
- **Agreed On Going Public**
- **2018-02-28** @benkraftka: Actaully, I want to wait on this a few days so I can check if this endpoint is even supposed to be publicly accessible.  Will get back to you as soon as possible!
- **Agreed On Going Public**
- **Report Became Public**
