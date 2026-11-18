---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2020-12-05
submitted: 2020-10-14T02:33:28.614Z
bounty_usd: null
votes: 52
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "cryptordx"
source: "https://hackerone.com/reports/1007988"
title: "Able to comment/view in others support ticket at https://en.instagram-brand.com/requests/dashboard"
---
# Able to comment/view in others support ticket at https://en.instagram-brand.com/requests/dashboard

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 52 | **Program:** Automattic | **Disclosed:** 2020-12-05

- Report: [https://hackerone.com/reports/1007988](https://hackerone.com/reports/1007988)
- CWE: Information Disclosure
- Submitted: 2020-10-14T02:33:28.614Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
I reported the vulnerability to Facebook, and they have said to report it here for the bounty. 

## Platform(s) Affected:
 https://en.instagram-brand.com/requests/dashboard
## Steps To Reproduce:
1. Create two account User A, User B at https://en.instagram-brand.com/
2. Apply for Instagram brand from https://en.instagram-brand.com/requests/dashboard by User A
3. Login to user B and intercept the request

4.Send a post request with cookie and other header got by intercepting user B in the below endpoint and replace comment 44799 with User A support ticket id 
POST /wp-json/brc/v1/approval-requests/44799/comments HTTP/1.1
text=sure thanks&files=1597287925578-44741-%3Etest.jpg&sizes=4249

## Supporting Material/References:

video POC - https://drive.google.com/file/d/1My6MQuQTmYwCWQw_7uw1veGFkn13WkDP/view?usp=sharing
screenshot of viewing other's messages - https://drive.google.com/file/d/1WnDGPDHGA6pP9RIPBQpEAIXxPTaFJZVX/view?usp=sharing&fbclid=IwAR3k4cEfCcUcfBKhlffQgjDcy4ASRf7V3fsS7FmZcHyyd_HZZfFk1OlDpf8

## Impact

1) can comment in other's support ticket
2) can view other's support ticket comments (Both Instagram as well as user's)

## Timeline

- **Report Filed**
- **2020-10-14** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **2020-10-15** @cryptordx: Sure thanks for the information
- **2020-10-21** @pkevan: hi @ajay_saycure , I've tried to reproduce what you've shared with a test account but have been unsuccessful so far. 

Is there a chance you can submit a more detailed video with burpsuite showing all requests so I can better reproduce. In the video it's not clear how the requests work.

Thanks,
Paul
- **2020-10-22** @cryptordx: Hi pkevan

This issue has already been resolved. Facebook security team reported it to the atomattic and now its resolved. I am here for the bounty
- **2020-10-22** @pkevan: Hi,

Do you have details as to when it was resolved so I can see if this was previously reported?
- **2020-10-22** @cryptordx: Reported - Aug 13, 2020
Triaged - september 2
Fixed - October 14, 2020
- **2020-11-03** @cryptordx: Any update here
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
