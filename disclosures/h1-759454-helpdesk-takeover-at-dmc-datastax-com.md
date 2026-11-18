---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/reliance-on-untrusted-inputs-in-a-security-decision
  - env/web
substate: "resolved"
weakness: "Reliance on Untrusted Inputs in a Security Decision"
enriched: true
body: true
date: 2020-01-15
submitted: 2019-12-16T15:26:15.365Z
bounty_usd: null
votes: 195
cve: []
program: "[[programs/datastax|DataStax]]"
reporter: "matrixsoftsec"
source: "https://hackerone.com/reports/759454"
title: "Helpdesk Takeover at dmc.datastax.com"
---
# Helpdesk Takeover at dmc.datastax.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 195 | **Program:** DataStax | **Disclosed:** 2020-01-15

- Report: [https://hackerone.com/reports/759454](https://hackerone.com/reports/759454)
- CWE: Reliance on Untrusted Inputs in a Security Decision
- Submitted: 2019-12-16T15:26:15.365Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
DNS record [dmc.datastax.com](dmc.datastax.com) is pointing to stale [dmc-support.zendesk.com](dmc-support.zendesk.com) domain on Zendesk which is available for takeover.

DNS Stale Records: {F661014}


## Proof of Concept:
There was no helpdesk configured at this address, which means that the address was available and anyone could claim it. I was able to claim dmc-support.zendesk.com.

On this page, https://dmc.datastax.com/hc/en-us I haven't made the page public, I'm attaching a screenshot of the webpage:
{F661004} 

## Supporting Material/References:
Login page:
{F661021}

## Impact

Subdomain takeover

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
