---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2019-07-17
submitted: 2019-05-22T14:27:06.680Z
bounty_usd: 12000
votes: 542
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "saltyyolk"
source: "https://hackerone.com/reports/587854"
title: "Local files could be overwritten in GitLab, leading to remote command execution"
---
# Local files could be overwritten in GitLab, leading to remote command execution

> **Severity:** Critical | **Bounty:** 12,000 USD | **Votes:** 542 | **Program:** GitLab | **Disclosed:** 2019-07-17

- Report: [https://hackerone.com/reports/587854](https://hackerone.com/reports/587854)
- CWE: Command Injection - Generic
- Submitted: 2019-05-22T14:27:06.680Z

## Timeline

- **Report Filed**
- **2019-05-22** @saltyyolk: Actually, about where the bug lies in, I once had a tiny peek on the changes (added `path` parameter without any guards) in Gitaly. But I didn't find any real use-cases of this new-added parameter in the source code of  `gitlab-org/gitlab-ce`. Therefore I didn't know how or report or describe the potential vulnerability to you. :(

Do you have any ideas on how to handle this kind of circumstances that a potential bug without any known attacking vectors lies in the master branch or some release candidates? It might be useful if we could work together to get ride of these risks before a formal release coming out. Like some random slack channels as an extra communicating channel?
- **2019-05-22** @gitlab-securitybot: Hi @nyangawa,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **2019-05-22** @hackerjuan: > It might be useful if we could work together to get ride of these risks before a formal release coming out. Like some random slack channels as an extra communicating channel?

This is a great idea, we will discuss the possible options internally and inform you when we come up with a decision.
- **Report Resolved**
- **Bounty Awarded**
- **2019-06-04** @saltyyolk: Hi @hackerjuan ,

Thanks a lot for your information. I've verified the patch and I think it works perfectly.

About the blog https://about.gitlab.com/2019/06/03/security-release-gitlab-11-dot-11-dot-1-released/
Would you please help me to make some modifications? Due to the compliance of my company I'd like to make the following change. Like that in some [earlier posts](https://about.gitlab.com/2018/12/06/critical-security-release-gitlab-11-dot-5-dot-3-released/)
```
@nyangawa -> @nyangawa of Chaitin Tech
```

Thank you again for your work and understanding and I'm looking forward to co-operate with you again in the future.
Li
- **2019-06-04** @hackerjuan: We've updated the blog post as requested. Thank you again!
- **2019-06-04** @saltyyolk: Thanks a lot ;)
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
