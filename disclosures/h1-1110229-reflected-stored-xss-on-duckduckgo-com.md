---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
date: 2021-04-10
submitted: 2021-02-24T15:19:33.483Z
bounty_usd: null
votes: 135
cve: []
program: "[[programs/duckduckgo|DuckDuckGo]]"
reporter: "monke"
source: "https://hackerone.com/reports/1110229"
title: "Reflected/Stored XSS on duckduckgo.com"
---
# Reflected/Stored XSS on duckduckgo.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 135 | **Program:** DuckDuckGo | **Disclosed:** 2021-04-10

- Report: [https://hackerone.com/reports/1110229](https://hackerone.com/reports/1110229)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2021-02-24T15:19:33.483Z

## Report summary

Writeup here: https://monke.ie/duckduckgoxss/

## Timeline

- **Report Filed**
- **Report Triaged**
- **External User Joined**
- **External User Joined**
- **2021-03-09** @monke: Hi, 

It seems that this bug has been fixed - any update on your end?

Cheers, 
PMOC
- **2021-03-11** @h1_analyst_jake: Hi @pmoc,

Despite the behavior is no longer reproducible, the team didn't take any actions as a result of this submission. Apparently, the same behavior was previously reported by another researcher and, likewise, it was no longer reproducible when the team picked up the report. On the other side, I was instead able to verify the issue.

I highlighted what described above internally and I will ping the team once to make sure my comment didn't slip through their queue. I will be back as soon as there's more information to share.

Best,
@lugtag
- **Report Resolved**
- **Swag Awarded**
- **Agreed On Going Public**
- **Report Became Public**
