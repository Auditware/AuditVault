---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cleartext-storage-of-sensitive-information
  - env/cloud
  - stack/kubernetes
substate: "duplicate"
weakness: "Cleartext Storage of Sensitive Information"
enriched: true
body: true
date: 2020-12-03
submitted: 2020-10-25T17:47:13.351Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/kubernetes|Kubernetes]]"
reporter: "lmhu"
source: "https://hackerone.com/reports/1018413"
title: "Development Application Credentials + Information Exposed"
---
# Development Application Credentials + Information Exposed

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 31 | **Program:** Kubernetes | **Disclosed:** 2020-12-03

- Report: [https://hackerone.com/reports/1018413](https://hackerone.com/reports/1018413)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2020-10-25T17:47:13.351Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Issue Description**
When I browsed through all the JS files on prow.k8s.io I came across a link called **/config** which contains a configuration disclosure for the development files

**URL Vulnerabilities**
https://prow.k8s.io/config

**Proof On Concept**
```javascript
- continuous-integration/travis-ci
kubespray:
required_status_checks:
contexts:
- Kubespray CI Pipeline
required_status_checks:
contexts:
- cla/linuxfoundation

- kubernetes-security
  rerun_auth_configs:
    '*':
      github_team_ids:
      - 2009231
      - 2460384
  spyglass:
    gcs_browser_prefix: https://gcsweb.k8s.io/gcs/
    gcs_browser_prefixes:
      '*': https://gcsweb.k8s.io/gcs/
    lenses:
    - lens:
        name: metadata
      optional_files:
      - ^(?:podinfo|prowjob)\.json$
      remote_config:
        endpoint: http://127.0.0.1:1234/dynamic/metadata
        hide_title: true
        priority: 0
        static_root: ""
        title: Metadata
      required_files:
      - ^(?:started|finished)\.json$
    - lens:
        config:
          highlight_regexes:
          - timed out
          - 'ERROR:'
          - (FAIL|Failure \[)\b
          - panic\b
          - ^E\d{4} \d\d:\d\d:\d\d\.\d\d\d]
          - '^INFO: Analyzed \d+ targets'
        name: buildlog
      remote_config:
        endpoint: http://127.0.0.1:1234/dynamic/buildlog
        hide_title: false
        priority: 10
        static_root: ""
        title: Build Log
      required_files:
      - ^.*build-log\.txt$
```

## Impact

Information Exposed + File Configuration Disclosure

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2020-10-26** @h1_analyst_andrew: Hi @0x4_aulia,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@retina
- **Report Duplicate**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
