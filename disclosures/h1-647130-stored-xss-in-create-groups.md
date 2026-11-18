---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
  - vuln/xss-stored
  - vuln/xss
  - impact/credential-theft
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2020-08-26
submitted: 2019-07-17T06:17:40.240Z
bounty_usd: 2500
votes: 89
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "rioncool22"
source: "https://hackerone.com/reports/647130"
title: "Stored XSS in 'Create Groups'"
---
# Stored XSS in "Create Groups"

> **Severity:** High | **Bounty:** 2,500 USD | **Votes:** 89 | **Program:** GitLab | **Disclosed:** 2020-08-26

- Report: [https://hackerone.com/reports/647130](https://hackerone.com/reports/647130)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-07-17T06:17:40.240Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please replace *all* the (parenthesized) sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to triage and respond quickly, so be sure to take your time filling out the report!

### Summary

Stored attacks are those where the injected script is permanently stored on the target servers, such as in a database, in a message forum, visitor log, comment field, etc. The victim then retrieves the malicious script from the server when it requests the stored information. Stored XSS is also sometimes referred to as Persistent or Type-I XSS. 

### Steps to reproduce

1. Login to [Gitlab](https://gitlab.com)
2. Create a new group with xss payload
payload i use = "><img src=x onerror=prompt(123)>
3. Open Group
4. To trigger XSS you can click "NEW PROJECT"
5. XSS Trigger

## Impact

Can steal Cookie, Can run javascript code, etc

## Timeline

- **2019-07-17** @rioncool22: XSS trigger at here
- **Report Filed**
- **2019-07-17** @gitlab-securitybot: Hi @rioncool22,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 10 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **2019-07-17** @rioncool22: Cool, Thanks for triaging @gitlab_cmaxim
- **2019-07-18** @gitlab-securitybot: ETA for fix:

Hi @rioncool22,

The GitLab issue created from your report is currently scheduled for 2019-11-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-07-18** @rioncool22: Hi team, 
Sorry before, I just want to know why this problem is taking too long to fix it ? :D

Thanks,
rioncool22
- **2019-07-19** @rioncool22: Hi team,
Stored XSS also appears at here :D

Thanks
- **2019-07-22** @rioncool22: Hi Team,
any update for this report ? I ask because the xss alert no longer appears,

Thanks,
- **Bounty Awarded**
- **2019-11-05** @rioncool22: Wow, thanks for huge bounty
- **2019-11-08** @rioncool22: Hi Team, 
want to ask, based on the severity, high severity bug will get $3000 - $7000 bounty, why I only got $2500 ? 
Thanks,
- **Report Resolved**
- **2020-02-05** @rioncool22: By the way, thank you so much :D
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
