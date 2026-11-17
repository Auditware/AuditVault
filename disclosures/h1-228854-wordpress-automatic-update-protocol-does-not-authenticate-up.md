---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cryptographic-issues-generic
  - env/network
  - stack/wordpress
substate: "not-applicable"
weakness: "Cryptographic Issues - Generic"
enriched: true
date: 2019-07-22
submitted: 2017-05-16T15:51:39.377Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "paragonie-scott"
source: "https://hackerone.com/reports/228854"
title: "WordPress Automatic Update Protocol Does Not Authenticate Updates Provided by the Server"
---
# WordPress Automatic Update Protocol Does Not Authenticate Updates Provided by the Server

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** WordPress | **Disclosed:** 2019-07-22

- Report: [https://hackerone.com/reports/228854](https://hackerone.com/reports/228854)
- CWE: Cryptographic Issues - Generic
- Submitted: 2017-05-16T15:51:39.377Z

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **Agreed On Going Public**
- **2019-07-22** @paragonie-scott: Now that the issue has been fixed (as of WordPress 5.2), is this still considered **Not Applicable**?
- **2019-07-22** @iandunn: Hi Scott, the reason this was marked as `N/A` wasn't because we thought it was a `wontfix`; it was because it's a public hardening proposal, rather than a private active exploit. 

That's still the situation, so it doesn't seem appropriate to me to change the status here.

The purpose of H1 is to privately disclose active vulnerabilities, and it seems like you intentionally misused it to try and work around a previous decision that you disagreed with.

Our team is very busy, and misusing H1 like this hurts our signal-to-noise ratio, and takes time away from fixing active vulnerabilities.
- **2019-07-22** @paragonie-scott: In that case, please publicly disclose this and I'll continue the discussion in public.
- **Agreed On Going Public**
- **Report Became Public**
