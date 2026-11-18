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
date: 2018-07-16
submitted: 2018-05-01T16:49:28.441Z
bounty_usd: null
votes: 8
cve: "CVE-2018-10379"
program: "[[programs/gitlab|GitLab]]"
reporter: "phillycheeze"
source: "https://hackerone.com/reports/346111"
title: "XSS (Persistent) - Selecting role(s) for protected branches"
---
# XSS (Persistent) - Selecting role(s) for protected branches

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** GitLab | **Disclosed:** 2018-07-16

- Report: [https://hackerone.com/reports/346111](https://hackerone.com/reports/346111)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2018-10379
- Submitted: 2018-05-01T16:49:28.441Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 
When using the dropdown that selects the groups or users that are allowed to push or merge to a protected branch within a project, it is possible to trigger a XSS with a malicious user name string. 

**Description:**
This vulnerability is similar to the recently announced CVE-2018-10379. The username input string where an attacker is able to inject a payload is in the same location, but the XSS that renders is in a different location. Since the remediation needs to be applied at the presentation layer, this is indeed a separate vulnerability and needs to be fixed separately (although Gitlab could start whitelisting characters allowed in usernames, similar to how Gitlab whitelists characters for Group or Project names).

The steps to reproduce are fairly simple but there are some restrictions:
  *  Only members of a project with Master access are able to become victims of the XSS
  *  Only groups/members with a subscription level of Starter or higher are able to perform the XSS, since this requires the ability to restrict merge/push permissions of a branch to a specific user. This is a premium feature only allowed at Starter or higher. (https://gitlab.com/help/user/project/protected_branches#restricting-push-and-merge-access-to-certain-users-starter)

## Steps To Reproduce:
  1. Set your own username as "<img src=x onerror=alert(document.domain)> foo / bar"
  1. Make yourself have at least Master access to a project
  1. In this project, ensure at least one branch is in the project and that branch is a "Protected Branch"
  1. Under Project Settings -> Repository -> Protected Branches, select the dropdown under the "Ability to Merge" section
  1. Notice that the onerror attribute from the username renders.

## Supporting Material/References:
More information can be provided upon request. 

You'll notice the payload above is the same as the payload used in a test file (inside the ce source code repo) for the CVE I attached. I only found this vulnerability since I was testing the previous CVE on our own internal instance of Gitlab, left my username saved as that malicious string, and later found the alert() dialog popup in another area of the site even after patching to 10.7.2.

## Suggested Remediation
I believe this is the offending Line: https://gitlab.com/gitlab-org/gitlab-ee/blob/master/ee/app/assets/javascripts/projects/settings/access_dropdown.js#L461

^There could also be other XSS vulnerabilities in this JS file. Everywhere else in the app uses the underscore method  `_.escape()`to escape user input, but this file doesn't.

## Impact

The security impact is the same as any typical persistent xss.

The hacker selected the **Cross-site Scripting (XSS) - Stored** weakness. This vulnerability type requires contextual information from the hacker. They provided the following answers:

**URL**
https://gitlab.com/group/project/settings/repository

**Verified**
Yes

## Timeline

- **Report Filed**
- **2018-05-03** @jritchey: Hi @phillycheeze ,

I've validated that this is a Persistent XSS issue and have categorized it as High severity. We are working internally on resolving the issue at https://gitlab.com/gitlab-org/gitlab-ce/issues/45994. The issue will be made public 30 days after a patch has been released. We will keep you updated on our progress via HackerOne.

Feel free to contact us at anytime if you need an update.

Thank you,
James
- **Report Triaged**
- **2018-05-30** @jritchey: Hi @phillycheeze ,

Thanks again for reporting this issue! The fix was just released at https://about.gitlab.com/2018/05/29/security-release-gitlab-10-dot-8-dot-2-released/.

Best regards,
James
- **Report Resolved**
- **Agreed On Going Public**
- **2018-07-13** @phillycheeze: Pinging again to have the reports disclosed. I'll be writing them up on Medium soon, since they were disclosed on Gitlab over two weeks ago.

Additionally, another report comment mentioned a bounty but I don't see anything listed anywhere. Does Gitlab award bounties?
- **2018-07-16** @jritchey: @phillycheeze ,

I've reached out to member of our team to get you some swag. What's your email so they can send you the code? (I should be able to redact it before making the report public)

Best regards,
James
- **2018-07-16** @phillycheeze: My email is █████████, thanks!
- **Agreed On Going Public**
- **Report Became Public**
