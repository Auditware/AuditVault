---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2024-04-23
submitted: 2024-04-17T17:46:50.781Z
bounty_usd: 1000
votes: 65
cve: []
program: "[[programs/mozilla|Mozilla]]"
reporter: "griffinf"
source: "https://hackerone.com/reports/2467999"
title: "Jira Credential Disclosure within Mozilla Slack"
---
# Jira Credential Disclosure within Mozilla Slack

> **Severity:** Critical | **Bounty:** 1,000 USD | **Votes:** 65 | **Program:** Mozilla | **Disclosed:** 2024-04-23

- Report: [https://hackerone.com/reports/2467999](https://hackerone.com/reports/2467999)
- CWE: Information Disclosure
- Submitted: 2024-04-17T17:46:50.781Z

## Report summary

The reporter who is an NDA'd contributor with access to internal Mozilla slack instance found a Jira admin API token hard-coded in a script which was shared in a public slack channel. The API key was revoked and the script was deleted from the public channel.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Changed Scope**
- **Report Resolved**
- **Bounty Awarded**
- **2024-04-22** @griffinf: Mind publicly disclosing this report? Very happy with Mozilla's quick time to fix on this issue.
- **Agreed On Going Public**
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Vulnerability Types Updated**
