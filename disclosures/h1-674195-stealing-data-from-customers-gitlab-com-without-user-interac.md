---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
date: 2020-08-26
submitted: 2019-08-15T00:14:09.831Z
bounty_usd: null
votes: 25
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "rpadovani"
source: "https://hackerone.com/reports/674195"
title: "Stealing data from customers.gitlab.com without user interaction"
---
# Stealing data from customers.gitlab.com without user interaction

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 25 | **Program:** GitLab | **Disclosed:** 2020-08-26

- Report: [https://hackerone.com/reports/674195](https://hackerone.com/reports/674195)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2019-08-15T00:14:09.831Z

## Timeline

- **Report Filed**
- **2019-08-15** @gitlab-securitybot: Hi @rpadovani,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 7 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Report Vulnerability Types Updated**
- **2019-08-30** @rpadovani: Hi @jritchey 
thanks so much for your fast fix and the bounty! I confirm I am not able to reproduce the issue anymore.

Just to be sure: have you removed the video from the linked issue on Gitlab? It contains personal data, so I'd prefer it stays private.

Thank you!
Riccardo
- **2019-08-30** @gitlab_cmaxim: Hi @rpadovani,

Yes, the video from linked issue on Gitlab was removed.

Best regards,
Costel
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-08-26** @rpadovani: Hi @dcouture 
thanks for disclosing this! May I ask you to remove the video from the disclosure, please? It contains some private data.

Thanks!
- **2020-08-26** @dcouture: Hi @rpadovani,

Done! Thanks for flagging this.

Best regards,
Dominic
GitLab Security Team
