---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
date: 2021-05-07
submitted: 2020-12-18T02:32:53.271Z
bounty_usd: null
votes: 60
cve: []
program: "[[programs/gsa_vdp|U.S. General Services Administration]]"
reporter: "skarsom"
source: "https://hackerone.com/reports/1061292"
title: "TAMS registration details API for admins open at https://tamsapi.gsa.gov/user/tams/api/usermgmnt/pendingUserDetails/"
---
# TAMS registration details API for admins open at https://tamsapi.gsa.gov/user/tams/api/usermgmnt/pendingUserDetails/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 60 | **Program:** U.S. General Services Administration | **Disclosed:** 2021-05-07

- Report: [https://hackerone.com/reports/1061292](https://hackerone.com/reports/1061292)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-12-18T02:32:53.271Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2020-12-18** @skarsom: To give a bit of background about why certain IDs don't work:

This endpoint will only show user IDs that finished the registration/approval request process. If you began the process (verified your email) but then you never entered your personal info, it'll return an error on pendingUserDetails.
- **Report Triaged**
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
