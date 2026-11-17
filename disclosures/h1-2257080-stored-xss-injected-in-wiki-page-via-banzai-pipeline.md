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
date: 2024-05-28
submitted: 2023-11-19T11:54:19.399Z
bounty_usd: null
votes: 71
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "yvvdwf"
source: "https://hackerone.com/reports/2257080"
title: "Stored-XSS injected in Wiki page via Banzai pipeline"
---
# Stored-XSS injected in Wiki page via Banzai pipeline

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 71 | **Program:** GitLab | **Disclosed:** 2024-05-28

- Report: [https://hackerone.com/reports/2257080](https://hackerone.com/reports/2257080)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2023-11-19T11:54:19.399Z

## Timeline

- **Report Filed**
- **2023-11-20** @h1_analyst_indy: Hi @yvvdwf,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_indy
- **Report Needs More Info**
- **Report New**
- **2023-11-20** @yvvdwf: >    If I understand this note correctly, attacker needs to create a private issue on https://gitlab.com/gitlab-org/gitlab/-/issues and then replace your issue link with attacker's private issue link in _sidebar.md file. In this case, how the attacker can trigger payload on other user's session since other user may not have access to attacker's private issue? Thanks!

No, it should be inverted. That is: you need to create a new private issue IN ANY project if you (as a VICTIM) CAN access to the private issue above (https://gitlab.com/gitlab-org/gitlab/-/issues/428268)
- **Report Title Updated**
- **Report Severity Updated**
- **Report Pending Program Review**
- **2023-11-21** @yvvdwf: Hi @h1_analyst_indy ,

Thank you for looking into this report.

This XSS can occurs also in issue pages, merged request pages. Furthermore, as being mentioned in https://gitlab-com.gitlab.io/gl-security/appsec/cvss-calculator/ : `XSS with .com CSP bypass`, so I believe that `I:H` and `C:H`

Best regards,
yvvdwf
- **2023-11-21** @h1_analyst_indy: Hi @yvvdwf,

Thanks for your comment! 

Current CVSS is assessed based on PoC in the initial report. Please rest assured that GitLab team may adjust severity after their investigation if they see it is inaccurate. Thanks for your understanding!

Kind regards,
@h1_analyst_indy
- **Report Severity Updated**
- **Report Triaged**
- **2023-12-05** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2024-01-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **2024-01-12** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2024-02-29.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2024-02-08** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2024-03-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2024-03-12** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2024-04-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2024-04-01** @yvvdwf: Hi @ngeorge ,

I see that the issue has been fixed in [16.10.1](https://about.gitlab.com/releases/2024/03/27/security-release-gitlab-16-10-1-released/#stored-xss-injected-in-wiki-page-via-banzai-pipeline). Is there anything before closing this issue?

Best regards,
yvvdwf
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
