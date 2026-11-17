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
date: 2020-11-23
submitted: 2018-11-15T05:33:36.293Z
bounty_usd: null
votes: 22
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "chromium1337"
source: "https://hackerone.com/reports/441090"
title: "CRLF injection & SSRF in git:// protocal lead to arbitrary code execution"
---
# CRLF injection & SSRF in git:// protocal lead to arbitrary code execution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 22 | **Program:** GitLab | **Disclosed:** 2020-11-23

- Report: [https://hackerone.com/reports/441090](https://hackerone.com/reports/441090)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2018-11-15T05:33:36.293Z

## Timeline

- **Report Filed**
- **2018-11-15** @gitlab-securitybot: Hi @chromium1337,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 14 business days with an update.

Best regards,
GitLab Security Team
- **Report Triaged**
- **2018-11-16** @dappelt: Hi @chromium1337,

thank you again for your report. I sent you an invitation to our VIP program along with instructions on how to get a reward.

Best regards,
Dennis
- **2018-11-16** @chromium1337: Hi @dappelt, I've followed the instructions to create a reference to this in #442647 . 
Thanks :P
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
