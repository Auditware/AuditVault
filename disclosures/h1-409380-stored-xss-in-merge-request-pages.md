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
date: 2018-12-03
submitted: 2018-09-13T10:56:07.365Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "8ayac"
source: "https://hackerone.com/reports/409380"
title: "Stored XSS in merge request pages"
---
# Stored XSS in merge request pages

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** GitLab | **Disclosed:** 2018-12-03

- Report: [https://hackerone.com/reports/409380](https://hackerone.com/reports/409380)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-09-13T10:56:07.365Z

## Timeline

- **Report Filed**
- **2018-09-13** @jritchey: Hi @8ayac  ,

Thank you for submitting this report. We are currently investigating the issue. Due to our current workload, we will get back within the next week with an update.

Best regards,
James
- **2018-09-14** @jritchey: Hi @8ayac ,

Thank you for submitting this report. I've validated that this is a persistent XSS issue. We are working internally on mitigating the issue at https://gitlab.com/gitlab-org/gitlab-ce/issues/51527.

The issue will be made public 30 days after a patch has been released. We will keep you updated on our progress via HackerOne.

Best regards,
James
- **Report Triaged**
- **2018-11-07** @8ayac: @jritchey,
Fixed it?
- **2018-11-08** @dappelt: Hi @8ayac,

the issue was fixed in GitLab version 11.4.3, 11.3.8, and 11.2.7. Thank you again for the report.

Best regards,
Dennis
- **2018-11-08** @8ayac: @dappelt,
OK, Thanks.

@jritchey,
The issue has already been fixed. Can not you close this report yet?
- **Report Resolved**
- **2018-11-13** @8ayac: Thank you @dappelt for closing this report.
- **2018-11-30** @8ayac: Hi @jritchey,

May I publish this report?

Thanks.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2018-12-11** @8ayac: @jritchey,

By the way, why is this XSS issue not eligible for reward?

Thanks.
- **2018-12-17** @8ayac: Hi @jritchey,
Checked it?
- **2018-12-17** @jritchey: Hi @8ayac ,

We updated our program policy last week and are happy to announce that new reports to our public program are eligible for a bounty. As this report was resolved before the introduction of public bounties, it is not eligible for a bounty.

Feel free to have a look at our updated program policy at https://hackerone.com/gitlab.

Best regards,
James | GitLab Security Team
- **2018-12-18** @8ayac: @jritchey,

OK, I got it.

Thanks.
