---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2017-07-17
submitted: 2017-02-05T01:16:31.298Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "skansing"
source: "https://hackerone.com/reports/203515"
title: "Wordpress 4.7.2 - Two XSS in Media Upload when file too large."
---
# Wordpress 4.7.2 - Two XSS in Media Upload when file too large.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 23 | **Program:** WordPress | **Disclosed:** 2017-07-17

- Report: [https://hackerone.com/reports/203515](https://hackerone.com/reports/203515)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2017-02-05T01:16:31.298Z

## Timeline

- **Report Filed**
- **2017-02-05** @voldemortensen: Hey @skansing, thanks for another great report. It made this one easy to reproduce. I'll get to work on this one.
- **Report Triaged**
- **2017-02-05** @skansing: Hey @voldemortensen, awesome =)  

Thanks for asserting the bug so quickly and the feedback, made my morning extra great. thx
- **2017-03-27** @adamsilverstein: @skansing Thanks again for the report. 

I have prepared the attached patch to resolve the issue. It uses DOM construction for the `uploadSizeError` error message insertion. After the patch, variable `message` is inserted with jQuery's `.text()` so it is safe regardless of what you pass it as a filename. 

Can you test to verify this resolves the issue for you? 

Thanks. Once we confirm, we'll get this into an upcoming release.

I am also attaching a QUnit test that fails before the patch because the JS in the filename is evaluated. It passes after the patch.
- **2017-03-27** @skansing: Hey, thanks for the update.

I can confirm the fix works and have been unable to trigger the XSS with the patch supplied.
- **2017-05-17** @skansing: Hi this has been released in 4.7.5, lets the report public.
- **Report Resolved**
- **Agreed On Going Public**
- **Bounty Awarded**
- **Report Became Public**
