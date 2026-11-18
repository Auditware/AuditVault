---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - vuln/idor
  - vuln/broken-access-control
  - trigger/brute-force
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2022-03-17
submitted: 2022-02-06T18:56:17.683Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/gsa_vdp|U.S. General Services Administration]]"
reporter: "imthatt"
source: "https://hackerone.com/reports/1472721"
title: "IDOR at https://demo.sftool.gov/TwsHome/ScorecardManage/ via scorecard name"
---
# IDOR at https://demo.sftool.gov/TwsHome/ScorecardManage/ via scorecard name

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** U.S. General Services Administration | **Disclosed:** 2022-03-17

- Report: [https://hackerone.com/reports/1472721](https://hackerone.com/reports/1472721)
- CWE: Improper Access Control - Generic
- Submitted: 2022-02-06T18:56:17.683Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Team,

I have found a broken access control vulnerability on https://demo.sftool.gov/ under your /tws directory. 
I made two accounts.
One account i browsed to /tws and created a new scorecard. Here i can submit all information I need. The scorecard name is in the end of the URL https://demo.sftool.gov/TwsHome/ScorecardManage/testdsfdfsf
I logged out this account
I logged into attacker account. I browse to https://demo.sftool.gov/TwsHome/ScorecardManage/testdsfdfsf (the last part is the name of the other accounts score card). I can now view the scorecard and even edit the score card from the attackers account. I can add accounts to read only and edit permissions on the score card and change information as-well as download the score card.

Log back into the victim account and the scorecard information has been changed, downloaded and attacker has assigned permissions.

We can brute force scorecard names but i am not doing this as the above on my accounts already shows the issue.

Many thanks
Holla

## Impact

An attacker can read, edit and download and assign permissions to another users scorecard.

## Timeline

- **Report Filed**
- **2022-02-07** @imthatt: Hi Team,

Please can this be looked at. My signal is pending on this as i have no rep for 90 days, please can whoever takes this report really look into it and see that this is a valid security issue. I would love to report more issues but i cannot until this one is triaged.

Thank you team!
- **2022-02-07** @imthatt: Has anyone seen this?
- **2022-02-08** @imthatt: Hello i see 1st time of contact is 22 hours, its been 3 days, has anyone seen this?

Many thanks
Holla
- **2022-02-08** @h1_analyst_andrew: Hi @hollaatm3,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@retina
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-02-10** @issamy11: @hollaatm3 Thank you very much for your report. The team is currently reviewing the finding and will let you know if there are any updates.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
