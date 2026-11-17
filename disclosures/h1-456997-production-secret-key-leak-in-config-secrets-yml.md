---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cleartext-storage-of-sensitive-information
  - env/web
substate: "informative"
weakness: "Cleartext Storage of Sensitive Information"
enriched: true
date: 2019-01-08
submitted: 2018-12-06T17:46:45.164Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/grab|Grab]]"
reporter: "phreak"
source: "https://hackerone.com/reports/456997"
title: "Production secret key leak in config/secrets.yml"
---
# Production secret key leak in config/secrets.yml

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Grab | **Disclosed:** 2019-01-08

- Report: [https://hackerone.com/reports/456997](https://hackerone.com/reports/456997)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2018-12-06T17:46:45.164Z

## Report summary

We have recently received a lot of duplicate reports related to keys specified in the following URL:

`https://github.com/grab/blogs/blob/master/2017-01-29-deep-dive-into-database-timeouts-in-rails/config/secrets.yml`

The given keys are demo boilerplate that has been used to explain *Database Timeouts in Rails* blog post at our Grab Engineering blog and is not used any where in production.

## Timeline

- **Report Filed**
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
