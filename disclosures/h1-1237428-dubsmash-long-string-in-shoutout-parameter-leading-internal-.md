---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2021-12-13
submitted: 2021-06-18T05:37:20.276Z
bounty_usd: null
votes: 33
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "sandeep_rj49"
source: "https://hackerone.com/reports/1237428"
title: "[dubsmash] Long String in 'shoutout' Parameter Leading Internal server Error on Popular hastags , Community and User Profile"
---
# [dubsmash] Long String in 'shoutout' Parameter Leading Internal server Error on Popular hastags , Community and User Profile

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 33 | **Program:** Reddit | **Disclosed:** 2021-12-13

- Report: [https://hackerone.com/reports/1237428](https://hackerone.com/reports/1237428)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2021-06-18T05:37:20.276Z

## Timeline

- **Report Filed**
- **2021-06-21** @sandeep_rj49: Hi @gunther_reddit, 

Please check this on top priority. Attackers can collapse the trending hashtags.
- **Report Title Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2021-06-29** @sandeep_rj49: @gunther_reddit, 

>basically a business logic DoS we did to ourselves 

if you use trending hashtags in your post and any user who wishes to view other videos in that hashtag will experience DOS. This is not limited to ourselves but also impacting other users. Kind of collapsing trending hashtags and communities you can say.
- **2021-08-07** @sandeep_rj49: @gunther_reddit this is fixed. Unable to reproduce it anymore.
- **Report Resolved**
- **Agreed On Going Public**
- **2021-10-19** @sandeep_rj49: @gunther_reddit please update?
- **Agreed On Going Public**
- **Report Became Public**
