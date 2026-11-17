---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/network
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2026-07-29
submitted: 2025-12-20T04:13:20.860Z
bounty_usd: null
votes: 28
cve: "CVE-2024-39713"
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "button142857"
source: "https://hackerone.com/reports/3473145"
title: "Unauthenticated SSRF in Voxtelesys integration ('checkUrlForSsrf' Bypass via DNS rebinding)"
---
# Unauthenticated SSRF in Voxtelesys integration ('checkUrlForSsrf' Bypass via DNS rebinding)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Rocket.Chat | **Disclosed:** 2026-07-29

- Report: [https://hackerone.com/reports/3473145](https://hackerone.com/reports/3473145)
- CWE: Server-Side Request Forgery (SSRF) | CVE: CVE-2024-39713
- Submitted: 2025-12-20T04:13:20.860Z

## Report summary

Rocket.Chat version 7.13.2 contains an SSRF vulnerability caused by a DNS rebinding attack, which allows access to internal hosts and reading of their responses.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2026-02-19** @button142857: Hi Julio

Thank you for the fix.
I'm sorry to add another task to your plate, but would you mind handling the CVE request for this vulnerability?
- **2026-02-27** @button142857: Hi Julio,

I'm just checking in to see if there are any updates regarding the CVE requests.

Also, I had another quick question about the following policy in your guidelines. Am I eligible for this?
>Swag Policy
>We currently give compensation to our researchers by sending them some really cool swags from Rocket.Chat depending on the severity of the vulnerability. Currently we’re only sending swags to High and Critical vulnerabilities.

I understand you must be busy, so please take your time getting back to me.

regards,
- **2026-04-12** @button142857: Hi Julio
Thank you for the fix.
I'm sorry to add another task to your plate, but would you mind handling the CVE request for this vulnerability?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
