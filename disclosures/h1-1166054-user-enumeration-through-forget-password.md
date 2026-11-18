---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/info-disclosure
  - trigger/password-reset
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2021-05-16
submitted: 2021-04-15T21:54:00.995Z
bounty_usd: null
votes: 66
cve: []
program: "[[programs/upchieve|UPchieve]]"
reporter: "aousho9887"
source: "https://hackerone.com/reports/1166054"
title: "User enumeration through forget password"
---
# User enumeration through forget password

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 66 | **Program:** UPchieve | **Disclosed:** 2021-05-16

- Report: [https://hackerone.com/reports/1166054](https://hackerone.com/reports/1166054)
- CWE: N/A
- Submitted: 2021-04-15T21:54:00.995Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Vulnerability:-
->User enumeration is possible through forgot password feature.
steps to reproduce:-
->Go to the above selected domain and go to forgot password.
->submit random email and then intercept request  by burp suit 
->in response you will get { HTTP/1.1 500 Internal Server Error with {{"err":"No account with that id found."} } 

Remediation:-
->It should display like "if that mail address exists in our system, then we will send password reset link."
I hope that you will consider this issue as you also welcome the reports of best practices.
Thank you

## Impact

Leaking users' emails. / Information Disclosure.

## Timeline

- **2021-04-17** @thedevelopnik: Thank you! This has been triaged into our issue tracker and we will prioritize it for work in our next sprint.
- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
