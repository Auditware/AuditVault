---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-exposure-through-sent-data
  - env/web
substate: "not-applicable"
weakness: "Information Exposure Through Sent Data"
enriched: true
date: 2025-07-03
submitted: 2025-01-18T04:07:30.520Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/curl|curl]]"
reporter: "voggerloops"
source: "https://hackerone.com/reports/2946924"
title: "Authorization Header Leak via --location-trusted in Curl"
---
# Authorization Header Leak via --location-trusted in Curl

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** curl | **Disclosed:** 2025-07-03

- Report: [https://hackerone.com/reports/2946924](https://hackerone.com/reports/2946924)
- CWE: Information Exposure Through Sent Data
- Submitted: 2025-01-18T04:07:30.520Z

## Timeline

- **Report Filed**
- **2025-01-18** @jimfuller2024: --location-trusted flag is documented quite clearly (https://curl.se/docs/manpage.html) on this behaviour eg. the 'hint' is the 'trusted' part of "location-trusted" ... unless I am missing something I do not think there is any issue here.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
