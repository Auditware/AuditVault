---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-of-cache-containing-sensitive-information
  - env/web
substate: "resolved"
weakness: "Use of Cache Containing Sensitive Information"
enriched: true
date: 2023-04-01
submitted: 2022-09-12T17:16:10.284Z
bounty_usd: null
votes: 160
cve: []
program: "[[programs/expediagroup_bbp|Expedia Group Bug Bounty]]"
reporter: "bombon"
source: "https://hackerone.com/reports/1698316"
title: "Cache Deception Allows Account Takeover"
---
# Cache Deception Allows Account Takeover

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 160 | **Program:** Expedia Group Bug Bounty | **Disclosed:** 2023-04-01

- Report: [https://hackerone.com/reports/1698316](https://hackerone.com/reports/1698316)
- CWE: Use of Cache Containing Sensitive Information
- Submitted: 2022-09-12T17:16:10.284Z

## Report summary

I was able to Takeover Accounts via Cache Deception

This was possible due to:

1. The Session Token was reflected on https://www.abritel.fr/search/keywords:soissons-france-(xss)/minNightlyPrice/{anything} and the server was responding with a 200 Ok (200 Ok responses allows the cache to last a lot longer than any other response)

2. The Caching Server sees https://www.abritel.fr/search/keywords:soissons-france-(xss)/minNightlyPrice/cached.jpeg as a "cacheable" response, due to `jpeg` extension at the end of the URL, the server will save it


Team fixed this by removing the Session Token from all pages, which is what I now recommend for all programs.

[X](https://twitter.com/bxmbn)

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2022-09-13** @bombon: If you will be closing the other report as duplicate, you should at least triage this as Critical.
- **2022-09-13** @bombon: I know the fix they will apply and it will not be enough, as it will need to sanitize the cookie anyways (if the app is behind akamai, The fix is almost the same on any other akamai application)
- **2022-09-13** @bombon: The team has a terrible resolution time

And I will have to send the XSS Report probably the next year.

At least triage the original report as Critical??
- **2022-09-13** @bombon: By the way this also works on


bookabach.co.nz

fewo-direkt.de

	
stayz.com.au

Please reconsider the Severity and #1698328
- **Report Needs More Info**
- **Report New**
- **2022-09-15** @bombon: Download the Video If necessary
- **2022-09-15** @bombon: Since you closed the XSS report as duplicate of this report

Here is a PoC Video to reproduce the Stored XSS, but hope you triage this as Critical as both ways an attacker can perform ATO

{F1928820}
- **2022-09-16** @h1_analyst_decimo: Thanks for reaching out, @bombon.

Neither of these reports can be assessed as "Critical" as both require user interaction. I will forward your video proof-of-concept to the team

Cheers,
@still
- **Report Vulnerability Types Updated**
- **2022-09-16** @bombon: Then reopen the other report?
- **2022-10-03** @bombon: Please let me know if you are having trouble reproducing this report

According to the policy, this should have been triaged already
- **Report Triaged**
- **2022-10-03** @bombon: Hope this qualify for a bonus or Triaged it as Crticial, as this also could lead to STORED XSS and account takeover is imminent
- **Bounty Awarded**
- **2022-10-12** @bombon: Any bonus?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
