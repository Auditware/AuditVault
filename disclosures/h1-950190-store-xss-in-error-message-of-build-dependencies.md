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
date: 2020-12-01
submitted: 2020-08-03T13:15:27.182Z
bounty_usd: null
votes: 35
cve: "CVE-2020-13340"
program: "[[programs/gitlab|GitLab]]"
reporter: "yvvdwf"
source: "https://hackerone.com/reports/950190"
title: "Store-XSS in error message of build-dependencies "
---
# Store-XSS in error message of build-dependencies 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 35 | **Program:** GitLab | **Disclosed:** 2020-12-01

- Report: [https://hackerone.com/reports/950190](https://hackerone.com/reports/950190)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2020-13340
- Submitted: 2020-08-03T13:15:27.182Z

## Timeline

- **Report Filed**
- **2020-08-03** @gitlab-securitybot: Hi @yvvdwf,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-08-04** @yvvdwf: Hi,

I confirm that I can reproduce on gitlab.com. An example is available here: https://gitlab.com/yvvdwf/ci-dependencies/-/jobs/669728590

To reproduce: please find in attached file the export of an example project, then import it in gitlab.com

Best regards
- **Report Triaged**
- **Bounty Awarded**
- **2020-09-16** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2020-10-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-10-20** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2020-11-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Cve Id Added**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
