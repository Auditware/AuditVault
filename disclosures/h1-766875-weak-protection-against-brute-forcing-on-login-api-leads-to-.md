---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-restriction-of-authentication-attempts
  - env/web
substate: "resolved"
weakness: "Improper Restriction of Authentication Attempts"
enriched: true
date: 2022-08-29
submitted: 2020-01-01T20:49:22.244Z
bounty_usd: null
votes: 24
cve: []
program: "[[programs/palo_alto_software|Palo Alto Software]]"
reporter: "zer0code"
source: "https://hackerone.com/reports/766875"
title: "weak protection against brute-forcing on login api leads to account takeover "
---
# weak protection against brute-forcing on login api leads to account takeover 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 24 | **Program:** Palo Alto Software | **Disclosed:** 2022-08-29

- Report: [https://hackerone.com/reports/766875](https://hackerone.com/reports/766875)
- CWE: Improper Restriction of Authentication Attempts
- Submitted: 2020-01-01T20:49:22.244Z

## Timeline

- **Report Filed**
- **2020-01-03** @zer0code: Could you guys please take a look at this report ASAP? Just a gentle reminder. Cheers.
- **Report Triaged**
- **2020-01-03** @zer0code: thanks @staffors for your reply
Yes , IP-based rate limit across usernames is essential to prevent username enumeration for valid users.
If i can suggest one more thing it will be to not separate login failed messages (   Username does not exist" and wrong password ) as that make it easier for that attacker to preform that type of attack , "Wrong username/password" will be fine .
- **Report Triaged**
- **2020-01-09** @kad3nce: @zer0code, we are starting work now to generify the login error message and have also queued up a ticket to implement IP-based rate limiting for failed login attempts in the near future. Thank you kindly for your efforts in identifying and reporting this issue!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
