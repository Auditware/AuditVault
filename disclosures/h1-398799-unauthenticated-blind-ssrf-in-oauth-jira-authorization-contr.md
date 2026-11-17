---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2019-03-14
submitted: 2018-08-24T03:05:22.400Z
bounty_usd: 4000
votes: 238
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "jobert"
source: "https://hackerone.com/reports/398799"
title: "Unauthenticated blind SSRF in OAuth Jira authorization controller"
---
# Unauthenticated blind SSRF in OAuth Jira authorization controller

> **Severity:** High | **Bounty:** 4,000 USD | **Votes:** 238 | **Program:** GitLab | **Disclosed:** 2019-03-14

- Report: [https://hackerone.com/reports/398799](https://hackerone.com/reports/398799)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2018-08-24T03:05:22.400Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-09-04** @jritchey: Hi @jobert ,

Thank you for submitting this report. I've validated that this is an SSRF issue. We are working internally on resolving the issue at https://gitlab.com/gitlab-org/gitlab-ce/issues/50748. We are working to get this patched immediately.

The issue will be made public 30 days after a patch has been released. We will keep you updated on our progress via HackerOne.

Best regards,
James
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
