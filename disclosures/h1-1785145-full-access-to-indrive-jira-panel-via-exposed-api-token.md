---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2023-06-28
submitted: 2022-11-27T16:29:51.090Z
bounty_usd: null
votes: 125
cve: []
program: "[[programs/indrive|inDrive]]"
reporter: "bogdantc"
source: "https://hackerone.com/reports/1785145"
title: "Full access to InDrive jira panel via exposed API token "
---
# Full access to InDrive jira panel via exposed API token 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 125 | **Program:** inDrive | **Disclosed:** 2023-06-28

- Report: [https://hackerone.com/reports/1785145](https://hackerone.com/reports/1785145)
- CWE: Information Disclosure
- Submitted: 2022-11-27T16:29:51.090Z

## Report summary

The token disclosure vulnerability was discovered, revealing the Jira API token being exposed in the company’s GitHub repository. Wrongdoers with the compromised API token could view the projects, tasks, comments, and other information stored in Jira.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
