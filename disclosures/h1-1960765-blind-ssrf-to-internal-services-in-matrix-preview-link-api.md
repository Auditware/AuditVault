---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2023-04-26
submitted: 2023-04-24T21:33:47.872Z
bounty_usd: 6000
votes: 344
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "la_revoltage"
source: "https://hackerone.com/reports/1960765"
title: "Blind SSRF to internal services in matrix preview_link API"
---
# Blind SSRF to internal services in matrix preview_link API

> **Severity:** High | **Bounty:** 6,000 USD | **Votes:** 344 | **Program:** Reddit | **Disclosed:** 2023-04-26

- Report: [https://hackerone.com/reports/1960765](https://hackerone.com/reports/1960765)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2023-04-24T21:33:47.872Z

## Report summary

Matrix endpoint at https://matrix.redditspace.com/_matrix/media/r0/preview_url/?url= allowed Partially Blind SSRF which allows attacker to send GET requests and exfiltrate data about internal services

Matrix Chat endpoint at https://matrix.redditspace.com/_matrix/media/r0/preview_url/?url=* allowed partially blind SSRF to internal services. The data that could be exfiltrated was limited only to the service names and their IPs before a fix was implemented. This endpoint should not be able to query internal services, but external IPs, domains and services are fine for this to query.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Reddit' new chat is based on Matrix software which has preview_link functionality which doesn't filter the URL before sending the request

## Impact:
Attacker can enumerate services by grabbing og:title and port scanning, also possible RCE escalation (Asking for permission on this one)

## Steps To Reproduce:


  1. Visit the https://matrix.redditspace.com/_matrix/media/r0/preview_url/?url=*
  2. Replace * with http://██████ to get og:title ███████
  3. Replace * with http://█████████ to get og:title ███████
 4. Replace * with http://██████████to get og:title ██████
 5. Replace * with ████████ to get og:title █████████

Note: If the request is stuck and not responding in 2 seconds reload the page until it does

## Permit for escalation attempt? 
Since the ███ URL is accessible it may be possible to run ███:
GET █████████

There are also possibilities to test ██████, but I thought that it would be incorrect to do such activity without permission and as such report vulnerability in this state. I also therefore request a permission to try to escalate this to Critical

## Impact

Attacker can enumerate services and launch attacks against them

## Timeline

- **Report Filed**
- **Report Triaged**
- **2023-04-24** @les_oeufs: I'm weary about giving you permission to push further if it could negatively affect users, or do worse internally. I know it's blind so it may be hard for you to perform simple recon actions for data. But if you can perform API requests that aren't state altering, and gleam information that help us further identify impact that is okay. Anything around adding/deleting/etc of data should be off limits just in case. 

Oh and I'd advise against brute forcing.
- **2023-04-24** @la_revoltage: Yeah the problem is that this requires █████████, and running it as I understand from what I have gathered about ██████████. Other visible yet blind API requests to other services also alter the system, so I guess I can try to utilise some unknown SSRF Canaries to extract data on other endpoints which won't do any harm to the system.
- **2023-04-24** @la_revoltage: Also, this would require more intense scanning(using the Blind SSRF) of system for me to find more services associated with panels I found earlier.
Would that be okay?
- **2023-04-25** @les_oeufs: We give you permission to go harder and try for RCE escalation or anything that would increase impact and awareness. But do so at your own careful discretion, without impacting user data (if that's even possible).
- **2023-04-25** @les_oeufs: Given the nature of the issue (being blind SSRF), you will probably have to atleast initially continue doing some bruteforcing. You may proceed.
- **2023-04-25** @la_revoltage: Hey @les_oeufs,

Was this fixed this morning? All internal IPS return 422 including those I gave as examples in the original report
- **2023-04-25** @les_oeufs: Hey @revolte, yea sorry about that. Admittedly I didn't expect this to be fixed so fast. I didn't even get a chance to create a dev ticket nor get a response in my original DM to the team asking about this. We will continue rewarding this out as a High. Mainly due to this being blind and no other data exfiltration possible and we are pretty good with not using GET requests for mutations in our internal services that you managed to ping.
- **Bounty Awarded**
- **Bounty Awarded**
- **2023-04-25** @la_revoltage: Wow!
The faster it is fixed — the better it is :)
Thank you very much! Looking forward to working more with Reddit's program!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Title Updated**
