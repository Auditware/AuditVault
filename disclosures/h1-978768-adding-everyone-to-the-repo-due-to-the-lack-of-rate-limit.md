---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - stack/gitlab
substate: "not-applicable"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2020-09-14
submitted: 2020-09-10T22:21:21.836Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "sadd_man"
source: "https://hackerone.com/reports/978768"
title: "Adding everyone to the repo due to the lack of rate limit"
---
# Adding everyone to the repo due to the lack of rate limit

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** GitLab | **Disclosed:** 2020-09-14

- Report: [https://hackerone.com/reports/978768](https://hackerone.com/reports/978768)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-09-10T22:21:21.836Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

Since there is no rate limit in the inviting users to the repository section, it is possible to add all users on gitlab to a repository.

### Steps to reproduce

(Step-by-step guide to reproduce the issue, including:)

1. Create a repository
2. go to the project members section
3. choose a random user
4. before clicking the invite button, we need to capture the request with the burp suite..
5. ███████
6. Send it to the Intruder module, specify the █████ field here between 1 and 7006996 and send the request.

### Impact

It is possible to collect all users on Gitlab in a single repository, so users' mailboxes will be filled with notifications.


### Note

Because the rate limit is out of scope, I tested it and I could not stop the python script, and there were users affected.

## Impact

It is possible to collect all users on Gitlab in a single repository, so users' mailboxes will be filled with notifications.

## Timeline

- **Report Title Updated**
- **Report Filed**
- **2020-09-11** @gitlab-securitybot: Hi @sevilboylum,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-09-14** @sadd_man: any progress?
- **Report Not Applicable**
- **Agreed On Going Public**
- **2020-09-14** @sadd_man: It would be better to do the tests in my own environment, sorry for the problem, it will not be repeated.
- **Agreed On Going Public**
- **Report Became Public**
