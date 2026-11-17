---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2023-08-15
submitted: 2023-06-02T14:40:46.930Z
bounty_usd: null
votes: 325
cve: []
program: "[[programs/yelp|Yelp]]"
reporter: "lil_endian"
source: "https://hackerone.com/reports/2010530"
title: "yelp.com XSS ATO (via login keylogger, link Google account)"
---
# yelp.com XSS ATO (via login keylogger, link Google account)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 325 | **Program:** Yelp | **Disclosed:** 2023-08-15

- Report: [https://hackerone.com/reports/2010530](https://hackerone.com/reports/2010530)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2023-06-02T14:40:46.930Z

## Timeline

- **Report Filed**
- **2023-06-02** @Yelp: Hi there!

Thanks for submitting your report to us! Please expect a response within a week.

Best,
The Yelp Security Team
- **Report Triaged**
- **Report Severity Updated**
- **Report Severity Updated**
- **2023-06-02** @calvinli: Hi there @lil_endian,

Thanks for the detailed report and the very interesting bugs!

We've pushed a fix for this issue for now, and will follow up with further improvements in the coming days.

Best,
Yelp Security
- **Bounty Awarded**
- **2023-06-15** @lil_endian: Thank you! It seems you fixed it by removing the possibility of setting the `yelpmainpaastacanary` cookie via the `canary` query parameter. The self-xss is still present, but it's useless if an attacker cannot set a cookie value, so this attack is no longer working.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
