---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-restriction-of-authentication-attempts
  - env/web
substate: "not-applicable"
weakness: "Improper Restriction of Authentication Attempts"
enriched: true
date: 2025-06-28
submitted: 2025-03-10T21:00:59.857Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/curl|curl]]"
reporter: "irfanmughal1122"
source: "https://hackerone.com/reports/3030158"
title: "Improper Restriction of Authentication Attempts in cURL"
---
# Improper Restriction of Authentication Attempts in cURL

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 7 | **Program:** curl | **Disclosed:** 2025-06-28

- Report: [https://hackerone.com/reports/3030158](https://hackerone.com/reports/3030158)
- CWE: Improper Restriction of Authentication Attempts
- Submitted: 2025-03-10T21:00:59.857Z

## Timeline

- **Report Filed**
- **2025-03-10** @dgustafsson: How is enforcing backoff between failed attempts the responsibility of curl and not the site?
- **2025-03-10** @jimfuller2024: I think the report confuses a few topics and spits out boilerplate which is not germane to curl - but will play along with an easy to follow example - one is free to run curl as a container which means the entire execution of curl and the container is instantiated, does its work and closed down ... there is nothing curl could do to throttle and there are plenty analog scenarios similar to this ... that is why the server does this kinda thing.

This report is not a security issue nor a bug in curl.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
