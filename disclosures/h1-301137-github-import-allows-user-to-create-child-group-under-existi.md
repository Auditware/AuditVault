---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/gitlab
  - trigger/low-priv-user
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2018-05-24
submitted: 2017-12-29T01:13:46.612Z
bounty_usd: 750
votes: 14
cve: "CVE-2017-0919"
program: "[[programs/gitlab|GitLab]]"
reporter: "jobert"
source: "https://hackerone.com/reports/301137"
title: "GitHub import allows user to create child group under existing namespace"
---
# GitHub import allows user to create child group under existing namespace

> **Severity:** High | **Bounty:** 750 USD | **Votes:** 14 | **Program:** GitLab | **Disclosed:** 2018-05-24

- Report: [https://hackerone.com/reports/301137](https://hackerone.com/reports/301137)
- CWE: Improper Access Control - Generic | CVE: CVE-2017-0919
- Submitted: 2017-12-29T01:13:46.612Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

When importing a GitHub repository on GitLab, a request is made to `/import/github`. The user is allowed to pass along a target namespace where they want to add the repository. In this process, the code will create the namespace if it doesn't exist already. However, this can be used to create a sub-group of an existing group and give you "owner" level access to the sub-group. This has a couple benefits, including being able to use the plan of the owner group, see who is part of the group (helpful in case the group is private), and, perhaps most importantly, being able to create new projects under a group you're unauthorized to.

To reproduce, make sure there's a GitLab instance that has a group a user is unauthorized to create projects / groups for. Then, sign in to the normal user account and authorize GitLab to view your GitHub projects. Intercept your network traffic, then click the "Import" button. Observe a request similar to the one below being submitted:

**Request**
```
POST /import/github HTTP/1.1
Host: gitlab-instance
...

repo_id=115670444&target_namespace=jobertabma&new_name=test
```

In this request, change the `target_namespace` to `secret-group/test`. This will create a sub-group called `test` to the group `secret-group`.████ To exploit this, an attacker could set a GitLab logo as their group avatar and start spreading gitlab-ce and gitlab-ee projects under the gitlab-org namespace.

**The sub-group as shown on the gitlab-org group page**
{F250077}

**Automatic billing due to the relationship with gitlab-org**
{F250076}

This has been tested against the latest version of GitLab.

## Impact

N/A

## Timeline

- **Report Filed**
- **2017-12-29** @kathyw: Hi Jobert,

Thank you for highlighting and detailing this finding. We will immediately begin triaging and investigating this finding with our engineering and production teams. Based on current workloads and upcoming holidays, we expect that we will have a further response for you within the next 5-7 business days.

Regards,
GitLab Security Team
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **2018-01-08** @kathyw: Hi Jobert,

Congratulations! Due to your detailed findings report #301137, we were able to work with our engineering team to report/triage the security vulnerability, and our engineering team is now working on a fix for this vulnerability.

We certainly appreciate your efforts and time, and would like to reward you accordingly, with the $750 award for a high severity vulnerability finding. Thanks again, and we look forward to hearing from you again!

Regards,
GitLab Security Team
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
