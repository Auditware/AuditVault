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
date: 2018-07-16
submitted: 2018-05-01T16:49:28.441Z
bounty_usd: null
votes: 8
cve: "CVE-2018-10379"
program: "[[programs/gitlab|GitLab]]"
reporter: "phillycheeze"
source: "https://hackerone.com/reports/346111"
title: "XSS (Persistent) - Selecting role(s) for protected branches"
---
# XSS (Persistent) - Selecting role(s) for protected branches

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** GitLab | **Disclosed:** 2018-07-16

- Report: [https://hackerone.com/reports/346111](https://hackerone.com/reports/346111)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2018-10379
- Submitted: 2018-05-01T16:49:28.441Z

## Timeline

- **Report Filed**
- **2018-05-03** @jritchey: Hi @phillycheeze ,

I've validated that this is a Persistent XSS issue and have categorized it as High severity. We are working internally on resolving the issue at https://gitlab.com/gitlab-org/gitlab-ce/issues/45994. The issue will be made public 30 days after a patch has been released. We will keep you updated on our progress via HackerOne.

Feel free to contact us at anytime if you need an update.

Thank you,
James
- **Report Triaged**
- **2018-05-30** @jritchey: Hi @phillycheeze ,

Thanks again for reporting this issue! The fix was just released at https://about.gitlab.com/2018/05/29/security-release-gitlab-10-dot-8-dot-2-released/.

Best regards,
James
- **Report Resolved**
- **Agreed On Going Public**
- **2018-07-13** @phillycheeze: Pinging again to have the reports disclosed. I'll be writing them up on Medium soon, since they were disclosed on Gitlab over two weeks ago.

Additionally, another report comment mentioned a bounty but I don't see anything listed anywhere. Does Gitlab award bounties?
- **2018-07-16** @jritchey: @phillycheeze ,

I've reached out to member of our team to get you some swag. What's your email so they can send you the code? (I should be able to redact it before making the report public)

Best regards,
James
- **2018-07-16** @phillycheeze: My email is █████████, thanks!
- **Agreed On Going Public**
- **Report Became Public**
