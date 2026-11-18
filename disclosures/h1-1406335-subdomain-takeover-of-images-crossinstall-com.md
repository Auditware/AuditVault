---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
  - vuln/subdomain-takeover
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2022-01-05
submitted: 2021-11-21T03:12:47.609Z
bounty_usd: null
votes: 71
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "ian"
source: "https://hackerone.com/reports/1406335"
title: "Subdomain takeover of images.crossinstall.com"
---
# Subdomain takeover of images.crossinstall.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 71 | **Program:** X / xAI | **Disclosed:** 2022-01-05

- Report: [https://hackerone.com/reports/1406335](https://hackerone.com/reports/1406335)
- CWE: Business Logic Errors
- Submitted: 2021-11-21T03:12:47.609Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
images.crossinstall.com points to an AWS S3 bucket that no longer exists. I was able to take control of this bucket and put my own content onto it. I can now serve content on this domain, obtain a TLS certificate for this domain, etc.

If any customers or servers are pointing to anything within this domain, I could serve them arbitrary/malicious content. I could also use this in case your domain whitelists your own domain for OAuth, or if there are cookies scoped to the entire domain. Usually this can have a high impact.

## PoC
Visit images.crossinstall.com/index.html; an HTML comment with my username is present.

```
% dig images.crossinstall.com +short
assets.crossinstall.com.s3.amazonaws.com.
s3-1-w.amazonaws.com.
s3-w.us-east-1.amazonaws.com.
52.217.103.180

% curl images.crossinstall.com/index.html
<!-- hackerone/ian bugcrowd/iangcarroll -->

% whois crossinstall.com | grep Org
Registrant Organization: Twitter, Inc.
Admin Organization: Twitter, Inc.
Tech Organization: Twitter, Inc.
```

## Impact

Subdomain takeover

## Timeline

- **Report Filed**
- **2021-11-22** @bugtriage-simon: Thank you for your report @ian,

We're looking into this and will keep you updated when we have additional information.

Thank you for thinking of Twitter security.
- **Report Triaged**
- **2021-11-23** @ian: Hi @began, looks like this domain has been deleted now.
- **Report Resolved**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **Report Became Public**
