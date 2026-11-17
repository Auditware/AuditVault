---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
date: 2020-11-02
submitted: 2020-07-29T13:31:45.285Z
bounty_usd: 4000
votes: 24
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/946728"
title: "SafeParamsHelper::safe_params is not so safe"
---
# SafeParamsHelper::safe_params is not so safe

> **Severity:** High | **Bounty:** 4,000 USD | **Votes:** 24 | **Program:** GitLab | **Disclosed:** 2020-11-02

- Report: [https://hackerone.com/reports/946728](https://hackerone.com/reports/946728)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2020-07-29T13:31:45.285Z

## Timeline

- **Report Filed**
- **2020-07-29** @gitlab-securitybot: Hi @vakzz,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **Bounty Awarded**
- **2020-08-29** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2020-09-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-09-15** @vakzz: Hi @dcouture,

Sorry I haven't looked into this much more since the initial report. There were no routes that immediately jumped out where this could be used to exfiltrate a token or sensitive information, unless you have found anything internally :)

Cheers,
Will
- **2020-09-29** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2020-10-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
