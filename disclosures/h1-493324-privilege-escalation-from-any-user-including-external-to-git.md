---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2020-08-26
submitted: 2019-02-09T14:13:39.950Z
bounty_usd: null
votes: 256
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "skavans"
source: "https://hackerone.com/reports/493324"
title: "Privilege escalation from any user (including external) to gitlab admin when admin impersonates you"
---
# Privilege escalation from any user (including external) to gitlab admin when admin impersonates you

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 256 | **Program:** GitLab | **Disclosed:** 2020-08-26

- Report: [https://hackerone.com/reports/493324](https://hackerone.com/reports/493324)
- CWE: Privilege Escalation
- Submitted: 2019-02-09T14:13:39.950Z

## Report summary

My Telegram channel about being the full-time bug bounty hunter, my tips and tricks:
🇺🇸 [BugBountyPLZen](https://t.me/+mY0ndZYzGbYxYmYy)

Мой Telegram-канал про фуллтайм баг-хантинг, советы и методики:
🇷🇺 [BugBountyPLZ](https://t.me/+WYgyG5n2_kM1Yzdi)

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2019-02-09** @skavans: ** Mitigations **
I think you should either not to show the impersonated sessions inside the active sessions tab or use some ID other than gitlab_session itself in revoking process to not let attacker know this session ID.
- **2019-02-09** @gitlab-securitybot: Hi @skavans,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 14 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2019-02-10** @skavans: The severity is **Critical (9.0)** in fact, right CVSS vector includes:
User Interaction: Required
Attack Complexity: Low

I mischose this components when submitting an issue.
- **Report Triaged**
- **2019-02-22** @gitlab-securitybot: ETA for fix:

Hi @skavans,

The GitLab issue created from your report is currently scheduled for 2019-04-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-02-23** @gitlab-securitybot: ETA for fix:

Hi @skavans,

The GitLab issue created from your report is currently scheduled for 2019-03-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-08-13** @skavans: Can we disclose this?
- **Agreed On Going Public**
- **Report Became Public**
