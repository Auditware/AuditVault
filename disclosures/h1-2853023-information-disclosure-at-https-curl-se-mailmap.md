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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
=================
During a security assessment, it was discovered that email addresses were exposed in a publicly accessible location. The data was retrieved using standard tools, such as curl, without requiring authentication or special permissions. This raises a concern regarding the confidentiality of sensitive user information.
## Steps To Reproduce:
==================
 The following email addresses were disclosed:   
at : https://curl.se/.mailmap
1. Andy Alt: arch_stanton5995@protonmail.com
2. Ali Khodkar: 129806877+Alikhodkar@users.noreply.github.com


## Supporting Material/References:
=============
go to : https://curl.se/.mailmap
now add you payload

## Impact

Exposing email addresses can lead to phishing attacks, spam, or social engineering attacks targeting the affected individuals.

If these emails are linked to privileged accounts (e.g., administrative roles or GitHub contributors), this exposure increases the risk of further exploitation, such as impersonation or unauthorized account access.

## Timeline

- **Report Filed**
- **2024-11-20** @dfandrich: These addresses are also available in the git repository at https://github.com/curl/curl/blob/master/.mailmap  They are just as public in either of those location as in the git repository commit metadata itself, which is to say, fully public.

Note also that issues with the curl website are out of scope for the bug bounty.
- **2024-11-20** @haithamzakaria: The addresses on the GitHub site have nothing to do with the emails in the report I received.
- **Report Not Applicable**
- **2024-11-20** @dfandrich: Right, I meant to point to those addresses in the same place in the curl-www repo. Also public.
- **Agreed On Going Public**
- **Manually Disclosed**
