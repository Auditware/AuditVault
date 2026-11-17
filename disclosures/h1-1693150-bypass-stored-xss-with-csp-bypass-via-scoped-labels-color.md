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
date: 2023-02-19
submitted: 2022-09-07T09:13:22.922Z
bounty_usd: null
votes: 96
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "yvvdwf"
source: "https://hackerone.com/reports/1693150"
title: "Bypass: Stored-XSS with CSP-bypass via scoped labels' color"
---
# Bypass: Stored-XSS with CSP-bypass via scoped labels' color

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 96 | **Program:** GitLab | **Disclosed:** 2023-02-19

- Report: [https://hackerone.com/reports/1693150](https://hackerone.com/reports/1693150)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2022-09-07T09:13:22.922Z

## Timeline

- **Report Filed**
- **2022-09-08** @h1_analyst_mario: Hi @yvvdwf,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@tsunayoshi
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Pending Program Review**
- **Report Triaged**
- **2022-09-22** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2022-10-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **2022-10-27** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2022-11-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Title Updated**
- **2022-11-07** @galfaro: Hey @yvvdwf,
It looks like this was fixed recently in 15.5.2. Would you mind retesting for this vulnerability before we close this out?

Best Regards,
GitLab Security Team
- **2022-11-08** @yvvdwf: Hi @galfaro ,

I found that the vulnerability has been fixed. I do not see any thing else to be completed.

Best regards,
- **Report Resolved**
- **Agreed On Going Public**
- **2023-02-14** @yvvdwf: Hi @galfaro ,

Are there something else to be done before being able to disclose this finding?

Best,
- **Agreed On Going Public**
- **Report Became Public**
