---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/misconfiguration
  - env/web
substate: "not-applicable"
weakness: "Misconfiguration"
enriched: true
body: true
date: 2020-05-07
submitted: 2020-05-06T21:37:56.670Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/btfs|BTFS]]"
reporter: "dagamosst90"
source: "https://hackerone.com/reports/867436"
title: "misconfigured CORS let to HPP and SOP bypass"
---
# misconfigured CORS let to HPP and SOP bypass

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** BTFS | **Disclosed:** 2020-05-07

- Report: [https://hackerone.com/reports/867436](https://hackerone.com/reports/867436)
- CWE: Misconfiguration
- Submitted: 2020-05-06T21:37:56.670Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello team,
I found a bug on your website that let me bypass the SOP policy.
Hope you fix it, everything is in the video


https://www.youtube.com/watch?v=PYsU350S-s4

## Impact

The attacker my direct a victim to a phishing page of www.bitterrent.com/login and he/she will be convince to enter their email and password or even hijack csrf-token and sending him a password or email reset link.
I also found a link that expose the csrf-token on the URL and you should check this link in the black.svg host header URL

## Timeline

- **Report Filed**
- **2020-05-07** @h1_analyst_caesar: Hi @dagamosst90,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@turtle_shell
- **Report Not Applicable**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **2020-05-07** @shenyongri110: @dagamosst90 Thanks for your report! But actually any domain related to *.bittorrent.com is out of our scope, it's not related to BTFS project. Please refer to our scope and asset, let's know if you have further questions.
- **Agreed On Going Public**
- **Report Became Public**
