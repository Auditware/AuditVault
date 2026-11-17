---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/use-of-hard-coded-credentials
  - env/web
substate: "resolved"
weakness: "Use of Hard-coded Credentials"
enriched: true
date: 2019-12-30
submitted: 2019-10-17T11:14:33.624Z
bounty_usd: null
votes: 739
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "vinothkumar"
source: "https://hackerone.com/reports/716292"
title: "JumpCloud API Key leaked via Open Github Repository."
---
# JumpCloud API Key leaked via Open Github Repository.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 739 | **Program:** Starbucks | **Disclosed:** 2019-12-30

- Report: [https://hackerone.com/reports/716292](https://hackerone.com/reports/716292)
- CWE: Use of Hard-coded Credentials
- Submitted: 2019-10-17T11:14:33.624Z

## Report summary

vinothkumar discovered a publicly available Github repository containing a Starbucks JumpCloud API Key which provided access to internal system information.

@vinothkumar — thank you for reporting this vulnerability and confirming the resolution.

## Timeline

- **Report Filed**
- **Changed Scope**
- **Report Title Updated**
- **Report Triaged**
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **2019-10-18** @h1_analyst_decimo: Hello, and thank you for your report.

As the Starbucks team is already looking into your finding, I'll remain available for anything else.

Cheers,
@still
- **2019-10-21** @vinothkumar: This issue seems to be fixed. The repo has been removed and the api key has been revoked. (y)
- **2019-10-24** @vinothkumar: @still any update here?
- **2019-10-24** @h1_analyst_decimo: No, @vinothkumar, as you know well you will only receive updates when there will be any to share. If you're not receiving updates it means there are no updates. Thanks
- **2019-10-28** @shadegrown: Hi @vinothkumar,

Just to provide a quick update, we're still following up on this internally to make sure we understand the severity of the issue and that all appropriate remediation steps have been taken. We should be able to resolve this report soon.

Thanks,
@shadegrown
- **Bounty Awarded**
- **Report Resolved**
- **2019-11-04** @vinothkumar: @shadegrown Thanks for the bounty :)
- **Agreed On Going Public**
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Became Public**
