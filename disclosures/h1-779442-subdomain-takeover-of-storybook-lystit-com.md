---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - vuln/subdomain-takeover
  - trigger/social-engineering
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2020-01-22
submitted: 2020-01-21T16:51:00.002Z
bounty_usd: 1000
votes: 163
cve: []
program: "[[programs/lyst|Lyst]]"
reporter: "parzel"
source: "https://hackerone.com/reports/779442"
title: "Subdomain takeover of storybook.lystit.com"
---
# Subdomain takeover of storybook.lystit.com

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 163 | **Program:** Lyst | **Disclosed:** 2020-01-22

- Report: [https://hackerone.com/reports/779442](https://hackerone.com/reports/779442)
- CWE: Privilege Escalation
- Submitted: 2020-01-21T16:51:00.002Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Summary:
The subdomain storybook.lystit.com had an CNAME record pointing to an unclaimed S3 bucket. This is a high severity security issue because an attacker can register the bucket on AWS and therefore can serve her own content on the subdomain. This allows for various attacks.

# Description:
The dangling CNAME record of storybook.lystit.com is pointing to ███████ and the bucket which could not be found was: "storybook.lystit.com". I was able to register a S3 bucket with this name in AWS. After enabling static website hosting I was able to takeover the subdomain and serve arbitrary content. I am serving a POC to proof I am controlling the subdomain as well as a simple XSS POC.

# POC
POC: view-source:http://storybook.lystit.com/
Stored XSS: http://storybook.lystit.com/asdjklkas1312das879123.html
{F691531}
{F691530}

# Supporting Material/References:
https://www.hackerone.com/blog/Guide-Subdomain-Takeovers

# Recommendations for fix
Remove the dangling CNAME record from storybook.lystit.com

## Impact

The domain takeover allows various attacks. As the full domain is attacker controlled it can be used to serve XSS attacks, phishing campaigns and might be used to bypass the Same Origin Policy on other lystit.com domains and services.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2020-01-22** @lystmatt: Hi @parzel, thanks so much for the report! We've removed this domain name now, are you able to confirm that this resolves the issue?
- **2020-01-22** @parzel: Hi @lystmatt, thank you so much for the super quick reward! I really appreciate it. I can confirm the issue is resolved and the dangling record is properly removed.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
