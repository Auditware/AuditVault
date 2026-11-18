---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2022-06-07
submitted: 2020-01-03T16:39:54.149Z
bounty_usd: 20000
votes: 133
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "saltyyolk"
source: "https://hackerone.com/reports/767770"
title: "Private objects exposed through project import"
---
# Private objects exposed through project import

> **Severity:** Critical | **Bounty:** 20,000 USD | **Votes:** 133 | **Program:** GitLab | **Disclosed:** 2022-06-07

- Report: [https://hackerone.com/reports/767770](https://hackerone.com/reports/767770)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-01-03T16:39:54.149Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
This is a bypass of https://hackerone.com/reports/743953 , the current fix is blocking all "_ids" attributes. However an attacker could still set attributes like `issue_ids` by indrectly settings the field within the `attributes` field it self:
```
# project.json
    "attributes": {
        "issue_ids": [ 29279725 ],
        "description": "Set from attributes[description]"
    },
```

### Steps to reproduce

1. Import the attached tarball.
2. Check issues tab

The other parts of the report are mostly same as those I mentioned in https://hackerone.com/reports/743953 , I decide to write a new report considering the impact to gitlab.com.

## Impact

With this ability to modify relations between objects, an attacker could end up with accessing random resources of other users by traversing the incremental ID space.

## Timeline

- **Report Filed**
- **2020-01-03** @gitlab-securitybot: Hi @nyangawa,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
