---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "not-applicable"
weakness: "Information Disclosure"
enriched: true
date: 2025-07-07
submitted: 2024-11-20T05:07:36.398Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/curl|curl]]"
reporter: "haithamzakaria"
source: "https://hackerone.com/reports/2853023"
title: "Information Disclosure at : https://curl.se/.mailmap"
---
# Information Disclosure at : https://curl.se/.mailmap

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** curl | **Disclosed:** 2025-07-07

- Report: [https://hackerone.com/reports/2853023](https://hackerone.com/reports/2853023)
- CWE: Information Disclosure
- Submitted: 2024-11-20T05:07:36.398Z

## Timeline

- **Report Filed**
- **2024-11-20** @dfandrich: These addresses are also available in the git repository at https://github.com/curl/curl/blob/master/.mailmap  They are just as public in either of those location as in the git repository commit metadata itself, which is to say, fully public.

Note also that issues with the curl website are out of scope for the bug bounty.
- **2024-11-20** @haithamzakaria: The addresses on the GitHub site have nothing to do with the emails in the report I received.
- **Report Not Applicable**
- **2024-11-20** @dfandrich: Right, I meant to point to those addresses in the same place in the curl-www repo. Also public.
- **Agreed On Going Public**
- **Manually Disclosed**
