---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/misconfiguration
  - env/web
substate: "resolved"
weakness: "Misconfiguration"
enriched: true
body: true
date: 2021-05-20
submitted: 2021-04-19T06:46:31.444Z
bounty_usd: null
votes: 37
cve: []
program: "[[programs/gsa_vdp|U.S. General Services Administration]]"
reporter: "rptl"
source: "https://hackerone.com/reports/1168104"
title: "Weak password policy leading to exposure of administrator account access"
---
# Weak password policy leading to exposure of administrator account access

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 37 | **Program:** U.S. General Services Administration | **Disclosed:** 2021-05-20

- Report: [https://hackerone.com/reports/1168104](https://hackerone.com/reports/1168104)
- CWE: Misconfiguration
- Submitted: 2021-04-19T06:46:31.444Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,

The login endpoint https://mysmartplans.gsa.gov/Marathon/Default.aspx is having weak password policy.

During the recon, I came across a mysmartplans overview document http://www.accentimaging.com/accent/pdfs/Accent%20MySmartPlans.pdf
. In this document few users are mentioned like - rick, ban, tim etc.I tried to login user password combination of these user-names & rick wass found a valid administrator username & password.

username- rick
password -rick

This user appears to be administrator user.
Hope GSA takes necessary measures to improve user account policies.

PoC

1) Open url https://mysmartplans.gsa.gov/Marathon/Default.aspx
2) Enter username  rick password rick
3) You will be logged into user account with administrative access. You can edit, create, update users.

## Impact

Admin account compromise.

## Timeline

- **Report Filed**
- **2021-04-19** @h1_analyst_robert: Hi @rajeshpatil,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@croissants
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **2021-04-19** @issamy11: @rajeshpatil Thank you for your report. Our team is currently looking into it and we will follow up with any question.
- **2021-04-19** @rptl: Thanks @issamy11, @forest_dweller & @croissants for writing back. The  response time of this program is awesome.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
