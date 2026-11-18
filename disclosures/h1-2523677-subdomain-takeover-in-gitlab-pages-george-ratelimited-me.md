---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2024-08-11
submitted: 2024-05-28T21:30:00.118Z
bounty_usd: null
votes: 59
cve: []
program: "[[programs/ratelimited|RATELIMITED]]"
reporter: "fdeleite"
source: "https://hackerone.com/reports/2523677"
title: "Subdomain takeover in GitLab Pages [george.ratelimited.me]"
---
# Subdomain takeover in GitLab Pages [george.ratelimited.me]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 59 | **Program:** RATELIMITED | **Disclosed:** 2024-08-11

- Report: [https://hackerone.com/reports/2523677](https://hackerone.com/reports/2523677)
- CWE: N/A
- Submitted: 2024-05-28T21:30:00.118Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

It's possible to take over subdomains that point to GitLab Pages. While adding a subdomain no verification of domain ownership is required.

## POC Steps 

1. Go to http://george.ratelimited.me/ (tested in Firefox)


{F3307364}

## Impact

Attackers could perform several attacks like:

  -  Cookie Stealing
  - Phishing campaigns.
  -  Bypass Content-Security Policies and CORS.

## Timeline

- **Report Filed**
- **Report Resolved**
- **2024-05-29** @fdeleite: Thanks you!
- **Agreed On Going Public**
- **Report Became Public**
