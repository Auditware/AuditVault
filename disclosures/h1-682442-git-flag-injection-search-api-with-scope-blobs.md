---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2019-12-15
submitted: 2019-08-26T23:47:50.929Z
bounty_usd: 7000
votes: 130
cve: "CVE-2019-15575"
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/682442"
title: "Git flag injection - Search API with scope 'blobs' "
---
# Git flag injection - Search API with scope 'blobs' 

> **Severity:** High | **Bounty:** 7,000 USD | **Votes:** 130 | **Program:** GitLab | **Disclosed:** 2019-12-15

- Report: [https://hackerone.com/reports/682442](https://hackerone.com/reports/682442)
- CWE: Command Injection - Generic | CVE: CVE-2019-15575
- Submitted: 2019-08-26T23:47:50.929Z

## Timeline

- **Report Filed**
- **2019-08-27** @gitlab-securitybot: Hi @vakzz,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Severity Updated**
- **Report Triaged**
- **2019-09-11** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The GitLab issue created from your report is currently scheduled for 2019-10-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-09-12** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The GitLab issue created from your report is currently scheduled for 2019-09-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-10-03** @vakzz: Hi @hackerjuan,

Just had a quick test of the `blobs` scope with the latest release and can confirm that the issue is fixed.

Cheers,
Will
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
