---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2021-07-13
submitted: 2020-09-09T16:50:39.039Z
bounty_usd: null
votes: 33
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "yvvdwf"
source: "https://hackerone.com/reports/977697"
title: "Stored-XSS in merge requests"
---
# Stored-XSS in merge requests

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 33 | **Program:** GitLab | **Disclosed:** 2021-07-13

- Report: [https://hackerone.com/reports/977697](https://hackerone.com/reports/977697)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-09-09T16:50:39.039Z

## Timeline

- **Report Filed**
- **2020-09-09** @gitlab-securitybot: Hi @yvvdwf,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-09-11** @yvvdwf: With regards to your recent [discussion](https://gitlab.com/gitlab-org/gitlab/-/issues/213273#note_316737057), I would like to discuss also about clearly distinguishing between "Store-XSS which bypasses CSP" with the one that does not. [Github](https://bounty.github.com/index.html#severity-guidelines) classifies the former as `High` while the latter as `Medium`. 

Indeed, the severity of a vulnerability depends also on the way it has been exploited. Stored-XSS-with-CSP-bypass attacks allow attackers to perform any [API requests](https://docs.gitlab.com/ee/api/#session-cookie) on behalf of victims.

For example, if [this page](https://gitlab.com/yvvdwf/store-xss-merge-request/-/merge_requests/4) is viewed by admin, then I will be set to admin since [the following script](https://gitlab.com/yvvdwf/_/-/jobs/733075508/artifacts/file/data/set-admin.js) will be executed automatically without needing any interactions from the admin:

```javascript
var user_id=5212593;
console.log(`Set user ${user_id} to admin`);

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = console.log;
xhttp.open("PUT", `/api/v4/users/${user_id}?admin=true`, true);
xhttp.send();
```

Consequently, when comparing with the report [#493324](https://hackerone.com/reports/493324), the severity would be `Critical`.  Stored-XSS-with-CSP-bypass attacks are even more flexible as being [shown](https://gitlab.com/gitlab-org/gitlab/-/issues/213273#note_316737057): allow attackers to control any information of victims by creating a *back-door* using personal tokens.

A brief opinion about impact of Stored-XSS which bypasses CSP.
Regards,
- **Report Needs More Info**
- **Report New**
- **2020-09-21** @yvvdwf: Hi @vdesousa, are you able to reproduce the XSS ?
- **Bounty Awarded**
- **Report Triaged**
- **Bounty Awarded**
- **2021-03-05** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2021-04-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **External User Joined**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
