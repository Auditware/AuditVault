---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
  - vuln/privilege-escalation
  - vuln/misconfiguration
  - trigger/admin-required
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2022-08-25
submitted: 2021-08-10T00:38:52.880Z
bounty_usd: null
votes: 42
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "theranger"
source: "https://hackerone.com/reports/1297480"
title: "Default Login Credentials on https://broadbandmaps.mtn.com.gh/ "
---
# Default Login Credentials on https://broadbandmaps.mtn.com.gh/ 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 42 | **Program:** MTN Group | **Disclosed:** 2022-08-25

- Report: [https://hackerone.com/reports/1297480](https://hackerone.com/reports/1297480)
- CWE: Improper Access Control - Generic
- Submitted: 2021-08-10T00:38:52.880Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hello Team,
I just found out that `broadbandmaps.mtn.com.gh` requires logging in when you visit it, but it turned out that you can actually login as an Admin and do anything on the specific site.
when you visit the mentioned site you will get this   
{F1405776}
it will require to be logged in to perform any action, to bypass this you have to Login with the default credentials `Username`= admin `password`= admin , and for some reasons you can't login with Firefox it only works on Google chrome and  chromium web browser.

## Supporting Material:
-Check this Video >
{F1405806}

## Impact

Access admin Panel due to Default credentials

## Timeline

- **Report Filed**
- **2021-09-15** @theranger: @kendad0122 Any response here?
- **Report Triaged**
- **2021-11-19** @theranger: AYO, The site has been taken down, can you mark this one as Resolved ?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
