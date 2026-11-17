---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/authentication-bypass-using-an-alternate-path-or-channel
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Authentication Bypass Using an Alternate Path or Channel"
enriched: true
date: 2020-10-01
submitted: 2020-07-13T10:47:32.845Z
bounty_usd: 3000
votes: 257
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "cache-money"
source: "https://hackerone.com/reports/922456"
title: "Ability to bypass email verification for OAuth grants results in accounts takeovers on 3rd parties"
---
# Ability to bypass email verification for OAuth grants results in accounts takeovers on 3rd parties

> **Severity:** High | **Bounty:** 3,000 USD | **Votes:** 257 | **Program:** GitLab | **Disclosed:** 2020-10-01

- Report: [https://hackerone.com/reports/922456](https://hackerone.com/reports/922456)
- CWE: Authentication Bypass Using an Alternate Path or Channel
- Submitted: 2020-07-13T10:47:32.845Z

## Timeline

- **Report Filed**
- **2020-07-13** @gitlab-securitybot: Hi @cache-money,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2020-07-21** @gitlab-securitybot: ETA for fix:

Hi @cache-money,

The issue you reported is currently scheduled to be fixed by 2020-08-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **2020-08-07** @cache-money: Confirmed this is fixed. You now get the `Verify the email address in your account profile before you sign in.` error directly from the POST.
- **2020-08-07** @jmatos_bgtvf: Hello @cache-money ,

Thank you for the feedback. We are now awarding the final bounty. Congratulations!

We look forward to your next report!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
