---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/use-of-hard-coded-credentials
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Use of Hard-coded Credentials"
enriched: true
date: 2022-07-08
submitted: 2022-05-24T23:38:35.714Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/glovo|Glovo]]"
reporter: "mehdisadir"
source: "https://hackerone.com/reports/1580567"
title: "Exposed valid AWS, Mysql, Sendgrid and other secrets"
---
# Exposed valid AWS, Mysql, Sendgrid and other secrets

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 23 | **Program:** Glovo | **Disclosed:** 2022-07-08

- Report: [https://hackerone.com/reports/1580567](https://hackerone.com/reports/1580567)
- CWE: Use of Hard-coded Credentials
- Submitted: 2022-05-24T23:38:35.714Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2022-05-24** @mehdisadir: I can confirm that this is related to Glovo by visiting the website : https://appsmart.ro/ that includes Glovo's logo for companies they worked with.
- **2022-05-25** @madaga: Hi @mehdisadir this is not from Glovo but from one of our third-party, we are analyzing the leaked information to measure the impact.

Best regards.
- **2022-05-25** @madaga: Hi @mehdisadir can you test the access with the leaked credentials?
- **Report Severity Updated**
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **2022-05-26** @madaga: Hi @mehdisadir thanks for validating.

Best regards
- **2022-05-26** @mehdisadir: Hi,

Could we disclose it?

Regards
- **Agreed On Going Public**
- **2022-05-27** @madaga: Hi @mehdisadir yes of course.
- **Agreed On Going Public**
- **Report Became Public**
