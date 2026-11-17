---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - stack/ruby
  - stack/gitlab
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2018-04-27
submitted: 2017-12-19T21:08:22.970Z
bounty_usd: 750
votes: 36
cve: "CVE-2017-0916"
program: "[[programs/gitlab|GitLab]]"
reporter: "jobert"
source: "https://hackerone.com/reports/299473"
title: "Evaluating Ruby code by injecting Rescue job on the system_hook_push queue through web hook"
---
# Evaluating Ruby code by injecting Rescue job on the system_hook_push queue through web hook

> **Severity:** High | **Bounty:** 750 USD | **Votes:** 36 | **Program:** GitLab | **Disclosed:** 2018-04-27

- Report: [https://hackerone.com/reports/299473](https://hackerone.com/reports/299473)
- CWE: Server-Side Request Forgery (SSRF) | CVE: CVE-2017-0916
- Submitted: 2017-12-19T21:08:22.970Z

## Timeline

- **Report Filed**
- **2017-12-19** @kathyw: Hi Jobert,

Thank you for highlighting and detailing this command injection vulnerability. We will immediately begin triaging and investigating this finding with our engineering and production teams. Based on current workloads and upcoming holidays, we expect that we will have a further response for you within the next 3-5 business days.

Regards,
GitLab Security Team
- **Report Triaged**
- **Bounty Awarded**
- **2017-12-22** @kathyw: Hi Jobert,

Congratulations! Due to your detailed findings report #299473, we were able to work with our engineering team to report/triage the security vulnerability, and our engineering team is now working on a fix for this vulnerability.

We certainly appreciate your efforts and time, and would like to reward you accordingly, with the $750 award for a high severity vulnerability finding. Thanks again, and we look forward to hearing from you again!

Regards,
GitLab Security Team
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
