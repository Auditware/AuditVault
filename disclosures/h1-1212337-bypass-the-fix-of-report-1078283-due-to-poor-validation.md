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
date: 2021-07-08
submitted: 2021-05-29T02:29:33.525Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "wlucenasec"
source: "https://hackerone.com/reports/1212337"
title: "Bypass the fix of report #1078283 due to poor validation"
---
# Bypass the fix of report #1078283 due to poor validation

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Khan Academy | **Disclosed:** 2021-07-08

- Report: [https://hackerone.com/reports/1212337](https://hackerone.com/reports/1212337)
- CWE: Open Redirect
- Submitted: 2021-05-29T02:29:33.525Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Khan Academy Team,

I was able to bypass the fix you implemented for report #1078283. 

The URL validation you implemented on the endpoint `continue` checks the presence of `khanacademy.org` however it doesn't have any boundary checking to ignore domains starting with `.org`, so if an attacker register a domain starting with `org` like this one `orghacker.com.br` and have a subdomain entry of `khanacademy` the attacker is able to bypass the current implementation and lead the victim to his controlled page.

# Steps to reproduce the issue

* Go to this page https://www.khanacademy.org/signup?isteacher=1&referral=LearnStorm&continue=https://khanacademy.orghacker.com.br
* You'll be redirected to `orghacker.com.br` which is not a domain that Khan Academy owns

## Impact

Bypass of current URL validation. Attacker can send a phishing campaign and redirect the request to a server of his control. An attacker might chain the attack to other types of attack too.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
