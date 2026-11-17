---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2026-08-05
submitted: 2026-06-04T18:21:24.144Z
bounty_usd: 12000
votes: 361
cve: []
program: "[[programs/mozilla|Mozilla]]"
reporter: "griffinf"
source: "https://hackerone.com/reports/3782701"
title: "Unauthenticated RCE in Taskcluster web-server via GraphQL filter argument (sift $where)"
---
# Unauthenticated RCE in Taskcluster web-server via GraphQL filter argument (sift $where)

> **Severity:** Critical | **Bounty:** 12,000 USD | **Votes:** 361 | **Program:** Mozilla | **Disclosed:** 2026-08-05

- Report: [https://hackerone.com/reports/3782701](https://hackerone.com/reports/3782701)
- CWE: Code Injection
- Submitted: 2026-06-04T18:21:24.144Z

## Timeline

- **Report Filed**
- **2026-06-04** @hackerone-agent: Hello @griffinf,

Thank you for your submission!

Your report has passed the preliminary review. Please note that this does not confirm validation, the status may change after further review.

Next in the workflow is for our team to validate and reproduce the issue, evaluating its accuracy and security impact. You will be notified when the team has reviewed and made an assessment on your report.

We'll keep you updated as the process moves forward. Have a great day!

Thanks,
hackerone-agent
- **Report Triaged**
- **2026-06-16** @griffinf: This defect was resolved here - https://github.com/taskcluster/taskcluster/pull/8718

CVE was credited here -https://github.com/taskcluster/taskcluster/security/advisories/GHSA-ccv5-c45x-2q38
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
