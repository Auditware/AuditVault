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
