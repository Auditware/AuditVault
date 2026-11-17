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
date: 2020-11-02
submitted: 2020-04-24T13:57:44.581Z
bounty_usd: 4000
votes: 18
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "ledz1996"
source: "https://hackerone.com/reports/858671"
title: "Insufficient Type Check on GraphQL leading to Maintainer delete repository"
---
# Insufficient Type Check on GraphQL leading to Maintainer delete repository

> **Severity:** High | **Bounty:** 4,000 USD | **Votes:** 18 | **Program:** GitLab | **Disclosed:** 2020-11-02

- Report: [https://hackerone.com/reports/858671](https://hackerone.com/reports/858671)
- CWE: Improper Access Control - Generic
- Submitted: 2020-04-24T13:57:44.581Z

## Timeline

- **Report Filed**
- **2020-04-24** @ledz1996: #### Results of GitLab environment info
`sudo gitlab-rake gitlab:env:info`

```
System information
System:         Ubuntu 16.04
Proxy:          no
Current User:   git
Using RVM:      no
Ruby Version:   2.6.5p114
Gem Version:    2.7.10
Bundler Version:1.17.3
Rake Version:   12.3.3
Redis Version:  5.0.7
Git Version:    2.26.2
Sidekiq Version:5.2.7
Go Version:     unknown

GitLab information
Version:        12.10.0-ee
Revision:       58d798bed62
Directory:      /opt/gitlab/embedded/service/gitlab-rails
DB Adapter:     PostgreSQL
DB Version:     11.7
URL:            http://gitlab.example.vm
HTTP Clone URL: http://gitlab.example.vm/some-group/some-project.git
SSH Clone URL:  git@gitlab.example.vm:some-group/some-project.git
Elasticsearch:  no
Geo:            no
Using LDAP:     no
Using Omniauth: yes
Omniauth Providers: saml

GitLab Shell
Version:        12.2.0
Repository storage paths:
- default:      /var/opt/gitlab/git-data/repositories
GitLab Shell path:              /opt/gitlab/embedded/service/gitlab-shell
Git:            /opt/gitlab/embedded/bin/git
```
- **2020-04-24** @gitlab-securitybot: Hi @ledz1996,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 14 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-04-24** @ledz1996: Also this is not limited to DiffNote. Any Object that has function `repository` I guess DiffNote is a good example
- **Report Needs More Info**
- **Report New**
- **2020-04-24** @ledz1996: But its better to use DiffNote since it will make the Project path exists but 404
- **2020-04-24** @ledz1996: Hi, I create a video with `DiffNote`

Please make sure:
- User A & B is not root account
- User B must create 2 branch to compare and create his own files
- Take a look at the step 6 to guess the ID of the next DiffNote and use it
`gid://gitlab/DiffNote/<id-at-step6-plus-1>`
- Watch this video
- **Report Triaged**
- **Bounty Awarded**
- **2020-05-29** @ledz1996: Hi, It's been a month, i just want if there is any update on this issue.
Thanks
- **2020-05-29** @dcouture: Hi @ledz1996,

Nothing to report, I will ask the engineering team for updates.

Thanks,
Dominic
GitLab Security Team
- **2020-06-05** @gitlab-securitybot: ETA for fix:

Hi @ledz1996,

The issue you reported is currently scheduled to be fixed by 2020-07-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **2020-07-31** @ledz1996: Thank you for the bounty!
- **2020-08-27** @gitlab-securitybot: ETA for fix:

Hi @ledz1996,

The issue you reported is currently scheduled to be fixed by 2020-09-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **2020-09-04** @ledz1996: Hi @dcouture, the fix is sufficient, Thank you so much!
- **Agreed On Going Public**
- **2020-11-02** @ledz1996: Hi @dcouture, Thanks for the notification, been out of "hacking" for too long :D. I'm happy to disclose this!
- **Agreed On Going Public**
- **Report Became Public**
- **2020-11-02** @ledz1996: oh wait, could you please remove the video?
- **2020-11-02** @dcouture: You're welcome to come back to hacking any time ;)

I removed the video and will make sure it's removed from the GitLab issue before making it public.

Thanks!
Dominic
GitLab Security Team
