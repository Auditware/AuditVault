---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/open-redirect
  - env/web
substate: "resolved"
weakness: "Open Redirect"
enriched: true
body: true
date: 2019-10-01
submitted: 2019-08-01T21:08:15.035Z
bounty_usd: 750
votes: 67
cve: []
program: "[[programs/gsa_bbp|GSA Bounty]]"
reporter: "manshum12"
source: "https://hackerone.com/reports/665651"
title: "Stealing Users OAuth Tokens through redirect_uri parameter"
---
# Stealing Users OAuth Tokens through redirect_uri parameter

> **Severity:** High | **Bounty:** 750 USD | **Votes:** 67 | **Program:** GSA Bounty | **Disclosed:** 2019-10-01

- Report: [https://hackerone.com/reports/665651](https://hackerone.com/reports/665651)
- CWE: Open Redirect
- Submitted: 2019-08-01T21:08:15.035Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I found that https://login.fr.cloud.gov/oauth/authorize has vulnerability by open redirect on oauth redirect_uri which can lead to users oauth tokens being leaked to any malicious user.

Step : 
1, Clicked on link https://login.fr.cloud.gov/oauth/authorize?client_id=███&response_type=token&redirect_uri=https%3A%2F%2Fevil.com%2Fauth%2Fcallback&state=███

2, Choose any .gov account to login ( Screenshot ) then i believe you will got redirect to evil.com with oauth access token .

## Impact

Attacker can using this bug to stolen victim access token , that means he can takeover victim account .

## Timeline

- **Report Filed**
- **2019-08-02** @h1_analyst_oceana: Hi @tom2314,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@magicmouse
- **Report Needs More Info**
- **Report New**
- **2019-08-26** @coffeecup: Hi @tom2314  - We are looking into this issue still. Thanks for your patience as we dig deeper into this.
- **2019-08-28** @manshum12: @coffercup alright but i submit this report 27 days almost a month ..........
- **2019-08-30** @britta: @tom2314 Yes, thank you for your patience! I'm on the cloud.gov team, and our engineers are looking into it. If you have any additional evidence (such as information about the credentials you obtained), let us know and we can integrate that into our research.
- **2019-09-16** @mxplusb: @manshum12 I am unable to reproduce this. Can you please provide a set of steps required to reproduce?
- **Report Needs More Info**
- **2019-09-18** @mxplusb: I found a way to reproduce this, that behaviour is not present on cloud.gov at the time of this comment.
- **Report Resolved**
- **Bounty Awarded**
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Became Public**
