---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
  - stack/node
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
date: 2018-02-05
submitted: 2018-01-23T12:47:54.192Z
bounty_usd: null
votes: 11
cve: "CVE-2017-0928"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bayotop"
source: "https://hackerone.com/reports/308158"
title: "[html-janitor] Bypassing sanitization using DOM clobbering"
---
# [html-janitor] Bypassing sanitization using DOM clobbering

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-05

- Report: [https://hackerone.com/reports/308158](https://hackerone.com/reports/308158)
- CWE: Business Logic Errors | CVE: CVE-2017-0928
- Submitted: 2018-01-23T12:47:54.192Z

## Timeline

- **Report Filed**
- **2018-01-23** @lirantal: Hi Martin,

Thanks for reporting this.
I will follow-up on your input about the vulnerability to confirm it and we'll take it from there.
- **Changed Scope**
- **2018-01-23** @lirantal: I looked into it and definitely agree Martin. That poc is indeed valid, and agree with your comment regarding putting some disclaimer even if the author never intended for untrusted input to go in. 

I invited Oliver here, who worked on the repo, and hopefully he will be able to help out.
Will also try to reach out to people at The Guardian organization just-incase.
- **Report Severity Updated**
- **Report Triaged**
- **Cve Id Added**
- **2018-01-30** @lirantal: We didn't receive any feedback for a week now on this report, and also the security issue was already reported publicly in the git repository for several months now without attention.

If by weekend we won't get any response on the report I'll go ahead with a public disclosure of both security issues reported around this package.
- **2018-01-31** @bayotop: Sounds good.
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
