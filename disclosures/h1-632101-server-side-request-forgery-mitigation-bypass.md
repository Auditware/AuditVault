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
date: 2020-04-18
submitted: 2019-06-29T12:45:33.724Z
bounty_usd: null
votes: 350
cve: "CVE-2019-5464"
program: "[[programs/gitlab|GitLab]]"
reporter: "mclaren650sspider"
source: "https://hackerone.com/reports/632101"
title: "Server Side Request Forgery mitigation bypass"
---
# Server Side Request Forgery mitigation bypass

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 350 | **Program:** GitLab | **Disclosed:** 2020-04-18

- Report: [https://hackerone.com/reports/632101](https://hackerone.com/reports/632101)
- CWE: Server-Side Request Forgery (SSRF) | CVE: CVE-2019-5464
- Submitted: 2019-06-29T12:45:33.724Z

## Timeline

- **Report Filed**
- **2019-06-29** @gitlab-securitybot: Hi @mclaren650sspider,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 10 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Severity Updated**
- **Report Triaged**
- **2019-07-03** @gitlab-securitybot: ETA for fix:

Hi @mclaren650sspider,

The GitLab issue created from your report is currently scheduled for 2019-07-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-07-30** @mclaren650sspider: I can see this has been fixed.
- **2019-08-01** @dappelt: Hi @mclaren650sspider,

that is correct. A patch was released in version 12.1.2. We will get back to you soon with a bounty decision.

Best regards,
Dennis
- **2019-08-13** @mclaren650sspider: It has been over 2 weeks since patch was released. Is there ETA for bounty?
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-01-01** @mclaren650sspider: Hello and happy new year!

Could you reconsider the bounty? I can see that there is a report with the exact same impact but much larger bounty ($5000) https://hackerone.com/reports/541169
- **Agreed On Going Public**
- **Report Became Public**
