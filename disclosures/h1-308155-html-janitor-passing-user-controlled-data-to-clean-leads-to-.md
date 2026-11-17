---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-dom
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
date: 2018-02-09
submitted: 2018-01-23T12:34:13.662Z
bounty_usd: null
votes: 5
cve: "CVE-2017-0931"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bayotop"
source: "https://hackerone.com/reports/308155"
title: "[html-janitor] Passing user-controlled data to clean() leads to XSS"
---
# [html-janitor] Passing user-controlled data to clean() leads to XSS

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-09

- Report: [https://hackerone.com/reports/308155](https://hackerone.com/reports/308155)
- CWE: Cross-site Scripting (XSS) - DOM | CVE: CVE-2017-0931
- Submitted: 2018-01-23T12:34:13.662Z

## Timeline

- **Report Filed**
- **Changed Scope**
- **2018-01-23** @lirantal: Hi Martin,

Thanks for another detailed report on the problem and fix.
Even though the actual fix might be in different places, it seems that both this and the other issue (308158) have the same context, vulnerability and impact/end result. Do you agree we can set this one as a duplicate?
- **2018-01-23** @bayotop: Hi, I agree that the impact/end result is the same for anyone using the library. Nonetheless, it's a different vulnerability. This one is a XSS in the library's code. 308158 is a sanitization bypass that allows arbitrary HTML to slip through the cleaning process regardless of the initial settings passed to the `HTMLJanitor()` constructor. 

I tried to keep the issues separate for the sake of transparency, tracking, etc. 

If handling both issues in one report works better for you then that's fine with me.

On the other hand, it would make perfect sense to label this one as a duplicate in case the author decides that untrusted input was never considered.  Updating the documentation accordingly would solve both issues. Maybe we should wait for what they have to say?
- **2018-01-23** @lirantal: Sounds good.
- **Report Triaged**
- **Report Severity Updated**
- **Cve Id Added**
- **Cve Id Added**
- **2018-02-09** @lirantal: I will publicly disclose the vulnerability as we did with the related report #308158.

Thanks again @bayotop for reporting this to the Node.js ecosystem, we appreciate it1
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
