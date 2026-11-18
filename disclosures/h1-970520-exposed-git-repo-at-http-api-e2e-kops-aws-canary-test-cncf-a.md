---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/cloud
  - stack/kubernetes
  - stack/aws
substate: "duplicate"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2021-01-07
submitted: 2020-08-30T03:34:57.629Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/kubernetes|Kubernetes]]"
reporter: "zevfw5pp"
source: "https://hackerone.com/reports/970520"
title: "exposed Git Repo at http://api.e2e-kops-aws-canary.test-cncf-aws.canary.k8s.io/.git/"
---
# exposed Git Repo at http://api.e2e-kops-aws-canary.test-cncf-aws.canary.k8s.io/.git/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Kubernetes | **Disclosed:** 2021-01-07

- Report: [https://hackerone.com/reports/970520](https://hackerone.com/reports/970520)
- CWE: Information Disclosure
- Submitted: 2020-08-30T03:34:57.629Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Dear Security team,

If this report is out of scope,  please let me know and I will close the report myself

I found a git repository on http://api.e2e-kops-aws-canary.test-cncf-aws.canary.k8s.io/.git/.git. This endpoint allows an attacker to retrieve much of the source code and git history for this service which could potentially reveal sensitive information, it all depends what is stored there.

Example:
http://api.e2e-kops-aws-canary.test-cncf-aws.canary.k8s.io/.git/logs/HEAD
http://api.e2e-kops-aws-canary.test-cncf-aws.canary.k8s.io/.git/config
Mitigation
The restrict access (403 forbidden) are enabled only on /.git and not their subfolders. You just need to add all the git subfolders to the same rule.


Best Regards,
Daniel

## Impact

An attacker can get information just dumping data using  .git repository.

## Timeline

- **Report Filed**
- **Report Duplicate**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
