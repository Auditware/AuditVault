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
date: 2018-12-03
submitted: 2018-09-13T10:56:07.365Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "8ayac"
source: "https://hackerone.com/reports/409380"
title: "Stored XSS in merge request pages"
---
# Stored XSS in merge request pages

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** GitLab | **Disclosed:** 2018-12-03

- Report: [https://hackerone.com/reports/409380](https://hackerone.com/reports/409380)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-09-13T10:56:07.365Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
I found a Stored XSS in merge request pages. 

**Description:**
The exploit is via the parameter `merge_request[source_branch]` of the request to create a New Merge Request.

## Steps To Reproduce:
1. Sign ikn to GitLab.
2. Click the "[+]" icon.
3. Click "New Project".
4. Fill out "Project name" form with "test-project".
5. Check the radio button of "Public".
6. Check the "Initialize repository with a README".
7. Click "Create project" button.
8. Go to "http(s)://{GitLab host}/{user id}/test-project/branches/new".
9. Fill out each form as follows:
  - Branch name: test-branch
  - Create from: master
10. Click "Create branch" button.
11.  Go to "http://{GitLab host}/{user id}/test-project/merge_requests".
12. Click "Create merge request" button.
13. Click "Submit merge request" button.
14. Intercept the request.
15. Change the `merge_request[source_branch]` parameter's value to `<img/src=x onerror=alert(1)>`
16. Send the request.

Result: poc.png

Note: This behavior can be reproduced on all modern browsers.

## Impact

The security impact is the same as any typical Stored XSS.

Thank you.

## Timeline

- **Report Filed**
- **2018-09-13** @jritchey: Hi @8ayac  ,

Thank you for submitting this report. We are currently investigating the issue. Due to our current workload, we will get back within the next week with an update.

Best regards,
James
- **2018-09-14** @jritchey: Hi @8ayac ,

Thank you for submitting this report. I've validated that this is a persistent XSS issue. We are working internally on mitigating the issue at https://gitlab.com/gitlab-org/gitlab-ce/issues/51527.

The issue will be made public 30 days after a patch has been released. We will keep you updated on our progress via HackerOne.

Best regards,
James
- **Report Triaged**
- **2018-11-07** @8ayac: @jritchey,
Fixed it?
- **2018-11-08** @dappelt: Hi @8ayac,

the issue was fixed in GitLab version 11.4.3, 11.3.8, and 11.2.7. Thank you again for the report.

Best regards,
Dennis
- **2018-11-08** @8ayac: @dappelt,
OK, Thanks.

@jritchey,
The issue has already been fixed. Can not you close this report yet?
- **Report Resolved**
- **2018-11-13** @8ayac: Thank you @dappelt for closing this report.
- **2018-11-30** @8ayac: Hi @jritchey,

May I publish this report?

Thanks.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2018-12-11** @8ayac: @jritchey,

By the way, why is this XSS issue not eligible for reward?

Thanks.
- **2018-12-17** @8ayac: Hi @jritchey,
Checked it?
- **2018-12-17** @jritchey: Hi @8ayac ,

We updated our program policy last week and are happy to announce that new reports to our public program are eligible for a bounty. As this report was resolved before the introduction of public bounties, it is not eligible for a bounty.

Feel free to have a look at our updated program policy at https://hackerone.com/gitlab.

Best regards,
James | GitLab Security Team
- **2018-12-18** @8ayac: @jritchey,

OK, I got it.

Thanks.
