---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2019-04-20
submitted: 2019-03-14T21:23:29.177Z
bounty_usd: 12000
votes: 366
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "jobert"
source: "https://hackerone.com/reports/509924"
title: "JSON serialization of any Project model results in all Runner tokens being exposed through Quick Actions"
---
# JSON serialization of any Project model results in all Runner tokens being exposed through Quick Actions

> **Severity:** Critical | **Bounty:** 12,000 USD | **Votes:** 366 | **Program:** GitLab | **Disclosed:** 2019-04-20

- Report: [https://hackerone.com/reports/509924](https://hackerone.com/reports/509924)
- CWE: Information Disclosure
- Submitted: 2019-03-14T21:23:29.177Z

## Timeline

- **Report Filed**
- **2019-03-14** @gitlab-securitybot: Hi @jobert,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 14 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **2019-03-15** @gitlab-securitybot: ETA for fix:

Hi @jobert,

The GitLab issue created from your report is currently scheduled for 2019-04-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
