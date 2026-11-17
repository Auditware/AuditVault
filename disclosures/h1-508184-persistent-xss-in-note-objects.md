---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2019-07-19
submitted: 2019-03-12T04:17:55.553Z
bounty_usd: 4500
votes: 139
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "saltyyolk"
source: "https://hackerone.com/reports/508184"
title: "Persistent XSS in Note objects"
---
# Persistent XSS in Note objects

> **Severity:** High | **Bounty:** 4,500 USD | **Votes:** 139 | **Program:** GitLab | **Disclosed:** 2019-07-19

- Report: [https://hackerone.com/reports/508184](https://hackerone.com/reports/508184)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-03-12T04:17:55.553Z

## Timeline

- **Report Filed**
- **2019-03-12** @gitlab-securitybot: Hi @nyangawa,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2019-03-12** @saltyyolk: After some simple inspection, I think this issue affects most of the exportable objects which has any `cache_markdown_field`. For example, `title`, `description` of `Issue` and `title`, `description`, `content` of `Snippet` and so on. However, as the fix of these issues will be the same (probably in `app/models/concerns/cache_markdown_field.rb`?). And to save both your time and mine, I'm not going to submit more reports like this one. :P

Best regards,
Li
- **Report Severity Updated**
- **Report Triaged**
- **Report Triaged**
- **2019-03-13** @gitlab-securitybot: ETA for fix:

Hi @nyangawa,

The GitLab issue created from your report is currently scheduled for 2019-05-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
