---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2020-04-13
submitted: 2019-12-18T15:39:15.136Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "its_afolic"
source: "https://hackerone.com/reports/761000"
title: "Account Take over of millions of  MTN users account due to lack of Rate limiting when sending OTP code"
---
# Account Take over of millions of  MTN users account due to lack of Rate limiting when sending OTP code

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** MTN Group | **Disclosed:** 2020-04-13

- Report: [https://hackerone.com/reports/761000](https://hackerone.com/reports/761000)
- CWE: Improper Authentication - Generic
- Submitted: 2019-12-18T15:39:15.136Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I attached a PDF document to this report which explained the vulnerability in full details and I also attached a link to the POC video in the document.

## Impact

Account take over of about any MTN user account.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2019-12-19** @cybersecurity_7ibu8: HI,

Enginners have attend to this can you possibly validate that this is fixed now.
- **2019-12-19** @its_afolic: Confirmed the fix and it seems fixed now, I got a message on my mobile phone after running the brute-force attack notifying me of the brute-force attack and also can't make use of the correct OTP code too. Looks like a perfect fix.

I would love to take pemission to make a write-up about this if it is cool with you?
- **Report Resolved**
- **2019-12-20** @its_afolic: I meant I would love to publicly disclose this bug and would love to make a blog post about this vulnerability if I get the permission from you.
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **2020-03-02** @its_afolic: Sure I will be willing to redact MTN name out of my report and I wouldn't mind sharing a draft of my write up  with you before making it public.
- **2020-03-14** @its_afolic: You said "we are not disclosing issues relating to systems that have pending vulnerabilties on them". But this vulnerability has been fixed already, there is no risk making a write-up about this, since I won't be getting any bounty or reward in any way, I should at least have my bragging right.
- **Agreed On Going Public**
- **Report Became Public**
