---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2017-05-26
submitted: 2017-04-07T02:08:19.154Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "rbcafe"
source: "https://hackerone.com/reports/219197"
title: "[██████████.gnip.com] .htpasswd disclosure"
---
# [██████████.gnip.com] .htpasswd disclosure

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 19 | **Program:** X / xAI | **Disclosed:** 2017-05-26

- Report: [https://hackerone.com/reports/219197](https://hackerone.com/reports/219197)
- CWE: N/A
- Submitted: 2017-04-07T02:08:19.154Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Greetings,

There is a .htpasswd disclosure on your subdomain :

- Go to : http://█████████.gnip.com/.htpasswd
- previewgnip:██████

{F173925}

Fix : 

Protect the htpasswd file

## Timeline

- **Report Filed**
- **2017-04-07** @rbcafe: Greetings,

We also observe from this report that the http://████████.gnip.com/.htaccess is visible :

    AuthUserFile /ebs/sites/gnip-www/current/build/.htpasswd
    AuthType Basic
    AuthName "Confidential Gnip Preview"
    Require valid-user

Best regards
@rbcafe
- **Report Triaged**
- **2017-04-08** @rbcafe: Greetings @andrewsorensen ,

Thanks for the triage status.

Best regards
@rbcafe
- **Report Resolved**
- **2017-04-14** @rbcafe: Greetings,

I confirm this is fixed. 

Best regards
@rbcafe
- **2017-04-17** @rbcafe: Greetings, 

Do you have some information regarding the bounty related to this security report.

Best regards
@rbcafe
- **Bounty Awarded**
- **2017-04-28** @rbcafe: Greetings @twitter ,

Thanks for the reward.

Best regards
@rbcafe
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
