---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/misconfiguration
  - env/web
substate: "resolved"
weakness: "Misconfiguration"
enriched: true
body: true
date: 2022-10-27
submitted: 2022-09-26T00:49:59.598Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/gymshark|Gymshark]]"
reporter: "a-p0c"
source: "https://hackerone.com/reports/1711890"
title: "Subdomain takeover on 'de-headless.staging.gymshark.com'"
---
# Subdomain takeover on 'de-headless.staging.gymshark.com'

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 31 | **Program:** Gymshark | **Disclosed:** 2022-10-27

- Report: [https://hackerone.com/reports/1711890](https://hackerone.com/reports/1711890)
- CWE: Misconfiguration
- Submitted: 2022-09-26T00:49:59.598Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The Gymshark subdomain https://de-headless.staging.gymshark.com/ was pointing to an unclaimed Shopify site. Because of this an attacker could claim this subdomain, via Shopify, and serve their own content.

This is extremely dangerous as an attacker could serve any malicious content on this domain such as malware, domain defacement, phishing campaigns etc. 

Also, phishing victims wouldn't be able to identify the maliciousness of a potential phishing campaign because it would be from a valid Gymshark subdomain.

**Note:** *I have temporarily claimed this domain for PoC and have password protected the site to reduce unnecessary impact to others. I am happy to remove this protection if you require further takeover evidence*.

## Remediation
- Remove the CNAME record for Shopify on 'de-headless.staging.gymshark.com'.
- I can release 'de-headless.staging.gymshark.com' for reclaim if needed.

## PoC Link
https://de-headless.staging.gymshark.com/

## PoC Evidence
{F1954064}
{F1954066}
{F1954069}
{F1954070}

Thanks, A-p0c

## Impact

If an attacker controlled https://de-headless.staging.gymshark.com/ they could host any malicious content they wanted, such as malware, defacement, a convincing phishing campaign

## Timeline

- **Report Filed**
- **2022-09-26** @h1_analyst_trisha: Hi @a-p0c,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@pink_pen
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Resolved**
- **2022-09-27** @a-p0c: Hi @andrew_squire,

I can confirm this now fixed. 

Thanks
- **Agreed On Going Public**
- **Report Became Public**
