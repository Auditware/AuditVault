---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2019-08-28
submitted: 2019-08-01T10:49:53.145Z
bounty_usd: null
votes: 311
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "parzel"
source: "https://hackerone.com/reports/665398"
title: "Subdomain takeover of datacafe-cert.starbucks.com"
---
# Subdomain takeover of datacafe-cert.starbucks.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 311 | **Program:** Starbucks | **Disclosed:** 2019-08-28

- Report: [https://hackerone.com/reports/665398](https://hackerone.com/reports/665398)
- CWE: Privilege Escalation
- Submitted: 2019-08-01T10:49:53.145Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
The subdomain datacafe-cert.starbucks.com had an CNAME record pointing to an unclaimed Azure webservice. This is a high severity security issue because an attacker can register the subdomain on Azure and therefore can own the subdomain datacafe-cert.starbucks.com.

**Description:**
The dangling CNAME record of datacafe-cert.starbucks.com is pointing to s00397nasv101-datacafe-cert.azurewebsites.net which was not claimed by you. I registered a service with this name and therefore was able to takeover the subdomain. Every attacker doing this has afterwords full control over the contents served on this subdomain.

**Platform(s) Affected:** 
http://datacafe-cert.starbucks.com/
https://datacafe-cert.starbucks.com/

## Supporting Material/References:
view-source:http://datacafe-cert.starbucks.com/

## How can the system be exploited with this bug?
The full domain can be taken over. Arbitrary content can be served under it.

## How did you come across this bug ?
I noticed the dangling CNAME record of datacafe-cert.starbucks.com.

## Recommendations for fix
1) Remove the dangling CNAME record from datacafe-cert.starbucks.com
2) I release s00397nasv101-datacafe-cert.azurewebsites.net
3) You can reclaim it if you want

## Impact

This issue can be exploited in several ways, for example but not limited to: XSS, Phishing, Session Hijacking due to bypassing of SOP

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **2019-08-01** @parzel: Hi @tealeaf,
thanks for the reward! Sure - I will try answer your questions. I found and exploited the issue today. First I enumerated different subdomains for starbucks.com. Then I checked if these domains have a cname record pointing to azurewebsites.net. For every domain that matched I performed a DNS query for the CNAME record entry. If this returns a NXDOMAIN, the subdomain can usually be taken over and it is possible to register a domain that matches the NXDOMAIN CNAME entry. Does this answer your questions?
- **2019-08-01** @tealeaf: I was hoping you could give me a specific time, so that I can compare it against internal logs. If you don't have that information, no problem.
- **2019-08-01** @parzel: Oh sure. I found the subdomain takeover at 12:01 PM CEST and exploited it maybe half an hour afterwards.
- **2019-08-03** @parzel: I just checked and noticed you removed the dangling cname record. I will release the domain now :-)
- **Report Resolved**
- **2019-08-20** @parzel: Glad I could help you. Can you disclose this?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
