---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2023-11-21
submitted: 2023-10-17T00:08:29.709Z
bounty_usd: null
votes: 45
cve: "CVE-2023-48239"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "cx75fa"
source: "https://hackerone.com/reports/2212627"
title: "Delete external storage of any user"
---
# Delete external storage of any user

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 45 | **Program:** Nextcloud | **Disclosed:** 2023-11-21

- Report: [https://hackerone.com/reports/2212627](https://hackerone.com/reports/2212627)
- CWE: Improper Access Control - Generic | CVE: CVE-2023-48239
- Submitted: 2023-10-17T00:08:29.709Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

A security vulnerability was uncovered that allowed standard users to remove external storage resources from any user account in the application. This flaw was particularly concerning because it enabled unauthorized users to delete these resources based on a system-generated ID, which automatically incremented, without requiring any special privileges. This issue didn't grant access to the data but allowed for the indiscriminate removal of external storage associated with user accounts, potentially leading to data loss and disruption of service for affected users.

Reproduction Steps:
1.Begin by logging in with a standard user account and establish an external storage connection.
2. Afterward, update the storage configuration. Observe that the following request is generated:
```
PUT /apps/files_external/userstorages/<storage_id> HTTP/1.1
Host: 127.0.0.1:9090
[REDACTED]

{"mountPoint":"simpleuser","backend":"owncloud","authMechanism":"password::logincredentials","backendOptions":{"host":"cq6xxrdnw1941wu9jk4gcyfuglmfa4.oastify.com","root":"","secure":true},"testOnly":true,"id":<storage_id>,"mountOptions":{"enable_sharing":true,"encoding_compatibility":false,"encrypt":true,"filesystem_check_changes":1,"previews":true,"readonly":false}}
```
3.Next, log in to the application with an administrative user account or any other role and establish a storage connection.
4.Observe that each new storage created increments the ID automatically. For instance, it could become 28.
5. Using the standard user role, issue the request once more to modify the ID linked to the administrative storage. Observe that this action leads to the removal of the storage from the administrator's account.

VIDEO POC:
{F2778950}

## Impact

This finding has a huge impact on the application, including data loss, service disruption, unauthorized actions, data privacy concerns, security risks, and potential reputation damage.

## Timeline

- **Report Filed**
- **2023-10-17** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2023-10-17** @cx75fa: Hello team, please add the following users as participants:
@maholli
@bhmth
- **Report Triaged**
- **External User Joined**
- **External User Joined**
- **2023-10-23** @cx75fa: Hi @nickvergessen, when will the new security advisor be released do you have any updates?
- **2023-10-23** @nickvergessen: As usual ~3 weeks after the release.
Release is scheduled for Thursday this week, so SA publishing would be ~16th November
- **2023-10-23** @cx75fa: Is this eligble for a bounty?
- **2023-10-23** @nickvergessen: Will check with the responsible person, but they are unavailable this week
- **Report Resolved**
- **2023-10-26** @maholli: Hello @nickvergessen ,
These are the github usernames:
armendgashx
arjanitisufii
enismaholli
- **Bounty Awarded**
- **Cve Id Added**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
