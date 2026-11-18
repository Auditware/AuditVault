---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2019-08-25
submitted: 2019-01-04T17:57:56.717Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "katsuragicsl"
source: "https://hackerone.com/reports/474798"
title: "Subdomain takeover on healthyhackathon.khanacademy.org and hackweek.khanacademy.org"
---
# Subdomain takeover on healthyhackathon.khanacademy.org and hackweek.khanacademy.org

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** Khan Academy | **Disclosed:** 2019-08-25

- Report: [https://hackerone.com/reports/474798](https://hackerone.com/reports/474798)
- CWE: Improper Access Control - Generic
- Submitted: 2019-01-04T17:57:56.717Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Summary :
healthyhackathon.khanacademy.org can be took over, since it points to a bucket in S3 but that bucket does not exists.

I know this domain is used to host information of healthyhackathon which is held by khanacademy, but you will not be able to do this anymore if someone is going to claim that bucket. 

#Reference :
[S3_takeover](https://github.com/EdOverflow/can-i-take-over-xyz/issues/36)

## Impact

Taking control of healthyhackathon.khanacademy.org and spoof khanacademy users that healthyhackathon is reopened/"archived for you to challenge" and collect their information.

## Timeline

- **Report Filed**
- **Report Resolved**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Report Became Public**
