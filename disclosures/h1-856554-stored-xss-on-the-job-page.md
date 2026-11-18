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
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2021-01-08
submitted: 2020-04-22T18:25:31.838Z
bounty_usd: 3000
votes: 50
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "mike12"
source: "https://hackerone.com/reports/856554"
title: "Stored XSS on the job page"
---
# Stored XSS on the job page

> **Severity:** High | **Bounty:** 3,000 USD | **Votes:** 50 | **Program:** GitLab | **Disclosed:** 2021-01-08

- Report: [https://hackerone.com/reports/856554](https://hackerone.com/reports/856554)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-04-22T18:25:31.838Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Gitlab!

### Steps to reproduce:
1. Run Gitlab `docker run --detach --hostname gitlab.example.com --publish 443:443 --publish 80:80 --publish 22:22 --name gitlab gitlab/gitlab-ce:latest`
2. Create a new project with README.md
3. Go to Operations->Kubernetes
	1. Click on the "Add Kubernetes cluster" button
	2. Select the "Add existing cluster" tab
	3. Kubernetes cluster name: cluster-example
	4. API URL: https://google.com
	5. Service Token: token-example
	6. Uncheck the "GitLab-managed cluster" checkbox
	7. Click on the "Add Kubernetes cluster" button
4. Add ".gitlab-ci.yml" file to the repository (to the master branch)

    ```
    deploy:
      stage: deploy
      script:
        - echo "Example"
      environment:
        name: production
        url: https://google.com
        kubernetes:
          namespace: <img src=x onerror=alert(1)>
      only:
      - master
    ```
5. Go to CI/CD->Jobs and open the last job
{F799680}
{F799681}

#### Vulnerable code

All vulnerable code is in one file [environments_block.vue](https://gitlab.com/gitlab-org/gitlab/-/blob/c2da59f0376ee8d99ce16100d5c481234bbf9f8a/app/assets/javascripts/jobs/components/environments_block.vue)

1. [Line 125](https://gitlab.com/gitlab-org/gitlab/-/blob/c2da59f0376ee8d99ce16100d5c481234bbf9f8a/app/assets/javascripts/jobs/components/environments_block.vue#L125)
2. [Line 156](https://gitlab.com/gitlab-org/gitlab/-/blob/c2da59f0376ee8d99ce16100d5c481234bbf9f8a/app/assets/javascripts/jobs/components/environments_block.vue#L156)
3. [Line 251](https://gitlab.com/gitlab-org/gitlab/-/blob/c2da59f0376ee8d99ce16100d5c481234bbf9f8a/app/assets/javascripts/jobs/components/environments_block.vue#L251)
4. And other places where `%{kubernetesNamespace}` is used

## Impact

An attacker can:

1. Perform any action within the application that a user can perform
2. Steal sensitive user data
3. Steal user's credentials

## Timeline

- **Report Filed**
- **2020-04-22** @gitlab-securitybot: Hi @mike12,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 14 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **Bounty Awarded**
- **2020-04-23** @mike12: Awesome, thank you!
- **2020-06-04** @gitlab-securitybot: ETA for fix:

Hi @mike12,

The issue you reported is currently scheduled to be fixed by 2020-06-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-06-20** @gitlab-securitybot: ETA for fix:

Hi @mike12,

The issue you reported is currently scheduled to be fixed by 2020-07-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **2020-07-24** @mike12: Awesome, thank you!
- **2020-07-25** @gitlab-securitybot: ETA for fix:

Hi @mike12,

The issue you reported is currently scheduled to be fixed by 2020-08-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
