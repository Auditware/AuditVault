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
date: 2019-12-19
submitted: 2019-07-22T16:00:17.809Z
bounty_usd: 3500
votes: 169
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/653125"
title: "Git flag injection leading to file overwrite and potential remote code execution"
---
# Git flag injection leading to file overwrite and potential remote code execution

> **Severity:** Critical | **Bounty:** 3,500 USD | **Votes:** 169 | **Program:** GitLab | **Disclosed:** 2019-12-19

- Report: [https://hackerone.com/reports/653125](https://hackerone.com/reports/653125)
- CWE: Command Injection - Generic
- Submitted: 2019-07-22T16:00:17.809Z

## Timeline

- **Report Filed**
- **2019-07-22** @gitlab-securitybot: Hi @vakzz,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2019-07-22** @hackerjuan: Thank you for your report @vakzz! We are triaging this as a high severity issue for now. We will escalate if we are able to find a way to turn it into RCE. 

In addition to DoS, this vulnerability would allow an attacker to erase log files and other repositories' data.
- **Report Severity Updated**
- **Report Triaged**
- **2019-07-23** @vakzz: Hi,

Thanks for the quick triage.

A small update, if you run the following call twice then the `rev-list` command doesn't happen the second time allowing for the file to be overwritten with a known sha1 hash:

```
curl 'http://4290d4225642/api/v4/projects/5/repository/commits?ref_name=--output=/var/opt/gitlab/gitlab-pages/admin.secret'

# cat /var/opt/gitlab/gitlab-pages/admin.secret
██████
```

{F535597}

This allows for `gitlab_pages_secret` and `gitlab_shell_secret` to be overwritten with known values.
- **2019-07-23** @hackerjuan: Thank you for de additional details, we have been able to reproduce the behaviour described and we are escalating this issue since it's possible to retrieve 2FA recovery codes of anyone that has registered a SSH key through the internal API.
- **Report Severity Updated**
- **2019-07-25** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The GitLab issue created from your report is currently scheduled for 2019-08-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2019-12-16** @vakzz: Hi @hackerjuan,

Is this ok to be disclosed?

Cheers,
Will
- **Agreed On Going Public**
- **Report Became Public**
