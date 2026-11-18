---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/idor
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2018-09-17
submitted: 2017-11-06T17:42:59.907Z
bounty_usd: null
votes: 34
cve: []
program: "[[programs/bohemia|BOHEMIA INTERACTIVE a.s.]]"
reporter: "meals"
source: "https://hackerone.com/reports/287789"
title: "IDOR to view User Order Information"
---
# IDOR to view User Order Information

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 34 | **Program:** BOHEMIA INTERACTIVE a.s. | **Disclosed:** 2018-09-17

- Report: [https://hackerone.com/reports/287789](https://hackerone.com/reports/287789)
- CWE: N/A
- Submitted: 2017-11-06T17:42:59.907Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please replace *all* the [square] sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to verify and then potentially issue a bounty, so be sure to take your time filling out the report!


**Description:** There is an idor to view other user's order information and determine their IP addresses and other order infromation

## Application & Version:

https://store.bistudio.com/order/1003793?confirmed=true

## Steps To Reproduce:
1. Login to your account
2. Visit the above endpoint
3. You can iterate through the order ID to view other users details.

## Supporting Material/References:

{F237085}
{F237086}

## Timeline

- **Report Filed**
- **Report Triaged**
- **2017-11-07** @meals: Thanks for the quick reply. Yeah I noticed you all are more focused on the game exploits. However, I dont have much experience with that and figured I'd at least order a t-shirt and see if there was anything I could exploit in the ordering process.
- **Bounty Awarded**
- **Report Resolved**
- **2017-11-07** @meals: awesome thanks :)
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
