---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
  - vuln/xss-reflected
  - vuln/xss
  - impact/credential-theft
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2022-05-08
submitted: 2022-04-24T06:11:22.525Z
bounty_usd: 5000
votes: 166
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "abhiramsita"
source: "https://hackerone.com/reports/1549206"
title: "Reflected xss in https://sh.reddit.com"
---
# Reflected xss in https://sh.reddit.com

> **Severity:** High | **Bounty:** 5,000 USD | **Votes:** 166 | **Program:** Reddit | **Disclosed:** 2022-05-08

- Report: [https://hackerone.com/reports/1549206](https://hackerone.com/reports/1549206)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2022-04-24T06:11:22.525Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Reflected cross-site scripting (or XSS) arises when an application receives data in an HTTP request and includes that data within the immediate response in an unsafe way.

## Impact:
attacker can execute malicious java script and steal cookies 

## Steps To Reproduce:
[add details for how we can reproduce the issue]

Hi team ,

Navigate to below url 
scroll to page end find a option see more
Move mouse over there and observe the execution of javascript 
## Supporting Material/References:
[list any additional material (e.g. screenshots, logs, etc.)]

  * [attachment / reference]

## Impact

attacker can execute malicious java script and steal cookies

## Timeline

- **Report Filed**
- **2022-04-26** @h1_analyst_diego: Hi @abhiramsita,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@spikes
- **Report Needs More Info**
- **Report New**
- **2022-04-27** @les_oeufs: Hey @abhiramsita, I've confirmed this on the Reddit side. Let me discuss this with the rest of the security and dev team and I'll get back to you :)
- **Report Severity Updated**
- **Report Triaged**
- **2022-04-27** @les_oeufs: We have shipped a fix, let me know if this is still possible.
- **Bounty Awarded**
- **2022-05-04** @les_oeufs: @abhiramsita Wanted to check back to see if you've had a chance to retest to confirm our fix. It looks good from my side, but we would love a second pair of eyes from the reporter to see if it can be bypassed in any way. :)
- **2022-05-05** @abhiramsita: Hi reddit,

I have retested this issue and status is fixed :-)

Regards,
Tharun
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
