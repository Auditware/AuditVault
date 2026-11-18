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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Hey team,
I have discovered a way for any logged in user (attacker) to escalate his privileges to gitlab administrator if the real gitlab administrator impersonates attacker's account.

**Description:**
When the gitlab admin impersonates some user, he gets new `_gitlab_session` cookie and then clicking at `Stop impersonating` he gets his own admin's cookie back. The vulnerability is that the impersonated user (attacker in our case) can see impersonated session at the `Active sessions` so he can switch to it (manually setting it in cookie) and click `Stop impersonating` by himself. This is a way how he can become gitlab administrator.

## Steps To Reproduce:

1. Sign into gitlab app as some user (`attacker`)
1. Go to the active sessions settings tab and revoke all the sessions besides the current active one
1. Sign into gitlab app in other browser as administrator (`admin`)
1. Go to users admin section and impersonate `attacker` user
1. Update the active sessions tab as `attacker` and make sure the second session appeared there (this is the admin logged into your account)
{F420971}
1. Inspect the `Revoke` button and make sure you see the session ID there. Copy it.
████
1. Go to index page of gitlab as `attacker` (http://gitlab.bb/ in my case), I do not know why, but it is important step
1. Clear `attacker` browser's cookie
1. Open the developer console as `attacker` and manually set `_gitlab_session` to the copied one with:

```javascript
document.cookie = "_gitlab_session=█████";
```
9. Refresh the attacker's page and make sure you are now inside the impersonated session
{F420978}
10. Click `Stop impersonating` at the top-right corner as `attacker` and make sure you are now logged in as gitlab admin.
███

## Impact

Every gitlab authenticated user can escalate his privileges to admin ones and give complete access to all gitlab services, projects and abilities. Only he needs to do is ask admin to impersonate his account because of something works bad there.

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
