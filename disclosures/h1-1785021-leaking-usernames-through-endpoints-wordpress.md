---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2024-08-10
submitted: 2022-11-27T09:24:19.959Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "alitoni224"
source: "https://hackerone.com/reports/1785021"
title: "Leaking usernames through endpoints Wordpress"
---
# Leaking usernames through endpoints Wordpress

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 31 | **Program:** MTN Group | **Disclosed:** 2024-08-10

- Report: [https://hackerone.com/reports/1785021](https://hackerone.com/reports/1785021)
- CWE: Information Disclosure
- Submitted: 2022-11-27T09:24:19.959Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi first, some of my usernames have been leaked by endpoints https://alt.mtn.com/wp-json/wp/v2/users

## Steps To Reproduce:
[The steps are as follows]

  1. Open the subdomain https://alt.mtn.com 
  1. Add the path https://alt.mtn.com/wp-json/wp/v2/users/192
  1. [You will notice the user information and you can also reveal many user names by changing it id user As in the pictures ]
{F2050805}
{F2050804}

## Supporting Material/References:
[list any additional material (e.g. screenshots, logs, etc.)]

  #1735586
#356047

## Impact

by API The attacker can find many information and names of active users

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-12-24** @alitoni224: Any updates
- **2023-01-20** @alitoni224: Any updates
- **Report Resolved**
- **2023-01-29** @alitoni224: The problem is still there
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **2024-07-11** @alitoni224: Hello again, I want to add that this subdomain also leaks to WordPress users
https://www.mtn.com/wp-json/wp/v2/users/
- **Report Became Public**
