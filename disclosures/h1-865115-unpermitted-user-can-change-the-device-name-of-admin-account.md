---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - trigger/admin-required
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2020-06-16
submitted: 2020-05-03T06:50:04.504Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/helium|Helium]]"
reporter: "error___404"
source: "https://hackerone.com/reports/865115"
title: "unpermitted user can change the device name of admin account"
---
# unpermitted user can change the device name of admin account

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 23 | **Program:** Helium | **Disclosed:** 2020-06-16

- Report: [https://hackerone.com/reports/865115](https://hackerone.com/reports/865115)
- CWE: N/A
- Submitted: 2020-05-03T06:50:04.504Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Invited user with only the read-only permission can change the device name in admin account

1.create two account 'A 'and 'B ' in  console.helium
2.Invited the account 'B' with 'A' by giving the read-only permission
3.In account 'B' trying to delete the organization created by admin account 'A' and intercept the request then you got the organization id in request
4.Then in account 'B' add the device name and click on it and update the name which you want to display in the admin account(victim account)
5.And intercept the request while clicking the update button
6.In the request add the organization id which you got in step 3
7.then forward the request then the device name in admin account will be changed

## Impact

attacker with only the read-only permission can change the device name in the admin account

## Timeline

- **Report Filed**
- **Bounty Awarded**
- **2020-05-12** @error___404: thank you for providing the bounty
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
