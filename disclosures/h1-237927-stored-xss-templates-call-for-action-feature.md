---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/xss-stored
  - vuln/xss
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2017-06-09
submitted: 2017-06-08T08:04:58.056Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/mixmax|Mixmax]]"
reporter: "r0h17"
source: "https://hackerone.com/reports/237927"
title: "Stored XSS templates -> 'call for action' feature"
---
# Stored XSS templates -> 'call for action' feature

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Mixmax | **Disclosed:** 2017-06-09

- Report: [https://hackerone.com/reports/237927](https://hackerone.com/reports/237927)
- CWE: N/A
- Submitted: 2017-06-08T08:04:58.056Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Jeff,

Reporting the Stored XSS in template section on 'call for action' button. (Already discussed in mail)
1] Login to Mixmax and navigate to template section
2] Click on enhance and select call for action button
3] Enter anything in button text and in URL enter XSS payload (javascript:alert(document.cookie))
4] Insert the button and click it to execute XSS.

Impact : XSS can be stored in template and when Team manager/admin uses that template and clicks the button , our XSS executes 

Thank you

## Timeline

- **Report Filed**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2017-07-19** @r0h17: @wearhere
Hi Jeff,
I just noticed Mixmax now gives 100$ minimum bounty, I was wondering if this/any other of my reports be eligible for the bounty?
- **2017-07-27** @r0h17: @mixmax guys any update on above query
- **Not Eligible For Bounty**
