---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2020-05-14
submitted: 2020-02-19T16:44:42.418Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "daehee"
source: "https://hackerone.com/reports/799898"
title: "Admin Login Credential Leak for DoD Gitlab EE instance"
---
# Admin Login Credential Leak for DoD Gitlab EE instance

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-14

- Report: [https://hackerone.com/reports/799898](https://hackerone.com/reports/799898)
- CWE: Information Disclosure
- Submitted: 2020-02-19T16:44:42.418Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

A DoD employee/contractor exposed the ███ password in a GitHub repository ([█████████](https://█████)) leading to full ███ access in a DoD DISA-associated private Gitlab EE instance (`███`).

## Description

The IP address `████` recently hosted the subdomain `█████████` (as of 2019-09-23). 

██████

Now `port 80` points to a private Gitlab Enterprise Edition instance. The current hostname is `██████` and the TLS certificate points to `████`.

```
HTTP/1.1 301 Moved Permanently
Server: nginx
Date: Tue, 18 Feb 2020 12:30:01 GMT
Content-Type: text/html
Content-Length: 162
Connection: keep-alive
Location: https://████:443/
```

Going to `https://██████████/explore` shows no projects, groups, or snippets exposed publicly.

However, a Github search for `█████████` as displayed in the TLS certificate leads to a few interesting code commits. This commit  ([████████](https://██████████)) for a project titled "██████ (█████)" contains █████ credentials for a particular Jenkins instance.

```
- name: JENKINS_OC_USER
value: ███████
- name: JENKINS_OC_PASSWD
value: ████████
```

The default Gitlab EE username `████████`  with the password `██████`, as shown in GitHub commit, gains full █████████istrative access.

After confirming valid login, I made no further attempts to escalate privileges on the machine, nor attempted deeper access into the private contents of this Gitlab EE instance. 

## Suggested Mitigation/Remediation Actions

In addition to updating security credentials to this Github commit, you might want to review any other DoD applications that are possibly using the same password.

### Other

In addition to updating ██████ credentials for this Gitlab EE application, you might want to review any other DoD applications that are possibly using the same password.

## Impact

Exploited by a malicious actor, the security impact of this leak could include:

* Leverage valid credential to gain access to other DoD applications
* View sensitive source code in private repositories
* Access potential secret tokens, API keys, passwords contained in source code
* Change user information
* Access other user accounts
* Create new unauthorized repositories
* Host malicious content

## Timeline

- **Report Filed**
- **2020-02-19** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2020-02-20** @daehee: Thanks. I just checked, and confirming that the Github commit, where credential has been leaked, is now private/deleted and cannot be viewed.
- **Report Resolved**
- **2020-02-21** @agent-l8: Also, thanks for following up for us @daehee!
- **Agreed On Going Public**
- **2020-02-24** @agent-r5: We will add it to the queue. Just as a note may be awhile.
- **2020-02-24** @daehee: Ok!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
