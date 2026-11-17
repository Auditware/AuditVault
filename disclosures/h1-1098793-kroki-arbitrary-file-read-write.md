---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2021-05-21
submitted: 2021-02-08T22:24:33.101Z
bounty_usd: 5600
votes: 41
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "ledz1996"
source: "https://hackerone.com/reports/1098793"
title: "Kroki Arbitrary File Read/Write "
---
# Kroki Arbitrary File Read/Write 

> **Severity:** High | **Bounty:** 5,600 USD | **Votes:** 41 | **Program:** GitLab | **Disclosed:** 2021-05-21

- Report: [https://hackerone.com/reports/1098793](https://hackerone.com/reports/1098793)
- CWE: Improper Access Control - Generic
- Submitted: 2021-02-08T22:24:33.101Z

## Timeline

- **Report Filed**
- **2021-02-08** @gitlab-securitybot: Hi @ledz1996,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2021-02-09** @h1_analyst_caesar: Hi @ledz1996,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@turtle_shell
- **Report Needs More Info**
- **Report New**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Report Severity Updated**
- **2021-02-10** @ledz1996: Also i dont think this is limited to kroki, this could also change the number of includes asciidoc leading to potential DoS by this param `max-include-depth`
- **2021-02-11** @gitlab_cmaxim: Thanks for the details. I will add it tot the issue.

Costel
- **Bounty Awarded**
- **2021-02-11** @ledz1996: Hi @gitlab_cmaxim, thank you, sorry if its sensitive, but nomarlly, its 1k$ per high/crit triage, may i ask why this is lower :D, i'm not demanding but just curioslly asking.
- **2021-02-18** @gitlab_cmaxim: Hey @ledz1996, 

Apologise for the delayed response. Just a small update on this report:  We have contacted asciidoctor about this issue and they are working on patch for this. You can find more details here: https://github.com/asciidoctor/asciidoctor/issues/3939.

Regards,
Costel
- **2021-02-23** @gitlab-securitybot: ETA for fix:

Hi @ledz1996,

The issue you reported is currently scheduled to be fixed by 2021-03-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2021-05-21** @ledz1996: Hi @dcouture, been out of context for awhile ;), let disclose this, thank you for the notification.
- **2021-05-21** @ledz1996: Also, thanks for the bounty ~
- **Agreed On Going Public**
- **Report Became Public**
